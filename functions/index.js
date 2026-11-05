import { createHash } from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import nodemailer from "nodemailer";
import { ALLOWED_ORIGINS, TURNSTILE_HOSTNAMES, clientIp, validateSubmission } from "./validate.js";
import { ANALYZE_ORIGINS, buildSystemPrompt, sanitiseModelOutput, validateAnalyzeRequest } from "./analyze.js";

initializeApp();
const db = getFirestore();

const TURNSTILE_SECRET = defineSecret("TURNSTILE_SECRET");
const SMTP_PASSWORD = defineSecret("SMTP_PASSWORD");
// Salt for hashing IPs, so stored rate-limit keys can't be reversed to addresses.
const IP_HASH_SALT = defineSecret("IP_HASH_SALT");
const GROQ_API_KEY = defineSecret("GROQ_API_KEY");
const SMTP_USER = "hello@aastr.id";
const RECIPIENT = "hello@aastr.id";

const PER_IP_LIMIT = 5; // submissions per IP per hour
const PER_IP_WINDOW_MS = 60 * 60 * 1000;
const GLOBAL_DAILY_LIMIT = 50; // hard cap on emails per day, whatever the source
const MAX_BODY_BYTES = 20_000;

function send(res, status, message, ok = false) {
  res.status(status).json({ ok, message });
}

function setSecurityHeaders(res) {
  res.set("Cache-Control", "no-store");
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "no-referrer");
  res.set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
}

async function verifyTurnstile(token, ip) {
  const body = new URLSearchParams({ secret: TURNSTILE_SECRET.value(), response: token, remoteip: ip });
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
    signal: AbortSignal.timeout(8000),
  });
  const result = await r.json().catch(() => null);
  return Boolean(result?.success === true && TURNSTILE_HOSTNAMES.has(String(result.hostname ?? "")));
}

/** Per-IP limit, checked before Turnstile. Throws { status, message } when hit. */
async function enforceIpLimit(ipHash, now) {
  const ref = db.collection("rateLimits").doc(ipHash);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const recent = (snap.get("attempts") ?? []).filter((t) => typeof t === "number" && t > now - PER_IP_WINDOW_MS);
    if (recent.length >= PER_IP_LIMIT) {
      throw { status: 429, message: "Too many attempts. Please try again later." };
    }
    // `expiresAt` lets a Firestore TTL policy delete stale rate-limit docs.
    tx.set(ref, { attempts: [...recent, now], expiresAt: Timestamp.fromMillis(now + PER_IP_WINDOW_MS) });
  });
}

/**
 * Daily cap on delivered messages. Counted only after Turnstile passes, so
 * requests with fake tokens can't use it up and lock real visitors out.
 */
async function enforceDailyCap(now) {
  const ref = db.collection("rateLimits").doc(`day-${new Date(now).toISOString().slice(0, 10)}`);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if ((snap.get("count") ?? 0) >= GLOBAL_DAILY_LIMIT) {
      throw { status: 429, message: "The form is busy today. Please email hello@aastr.id directly." };
    }
    tx.set(ref, { count: FieldValue.increment(1), expiresAt: Timestamp.fromMillis(now + 2 * 86_400_000) }, { merge: true });
  });
}

function limitResponse(res, err) {
  if (err?.status) {
    if (err.status === 429) res.set("Retry-After", "3600");
    return send(res, err.status, err.message);
  }
  logger.error("Rate limit check failed", err);
  return send(res, 503, "The contact form is temporarily unavailable.");
}

export const contact = onRequest(
  {
    region: "us-central1",
    secrets: [TURNSTILE_SECRET, SMTP_PASSWORD, IP_HASH_SALT],
    // Caps on how far a flood can scale, and therefore on cost.
    maxInstances: 2,
    concurrency: 20,
    memory: "256MiB",
    timeoutSeconds: 20,
    invoker: "public",
    cors: false, // CORS is handled by hand below so non-allowed origins get nothing.
  },
  async (req, res) => {
    setSecurityHeaders(res);
    const origin = req.get("origin") ?? "";
    if (!ALLOWED_ORIGINS.has(origin)) return send(res, 403, "Request rejected.");

    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      return res.status(204).end();
    }
    if (req.method !== "POST") {
      res.set("Allow", "POST, OPTIONS");
      return send(res, 405, "Method not allowed.");
    }
    if (!req.is("application/json")) return send(res, 415, "Unsupported request format.");
    if ((req.rawBody?.length ?? 0) > MAX_BODY_BYTES) return send(res, 413, "Request is too large.");

    const now = Date.now();
    const check = validateSubmission(req.body, now);
    if (!check.ok) return send(res, check.status, check.message, Boolean(check.silent));
    const { name, email, message, category, turnstileToken } = check.data;

    const ip = clientIp(req.get("x-forwarded-for"), req.ip);
    const ipHash = createHash("sha256").update(IP_HASH_SALT.value() + ip).digest("hex");

    try {
      await enforceIpLimit(ipHash, now);
    } catch (err) {
      return limitResponse(res, err);
    }

    let human = false;
    try {
      human = await verifyTurnstile(turnstileToken, ip);
    } catch (err) {
      logger.error("Turnstile verification errored", err);
    }
    if (!human) return send(res, 403, "Anti-spam verification failed. Please try again.");

    try {
      await enforceDailyCap(now);
    } catch (err) {
      return limitResponse(res, err);
    }

    // Save first, so a message survives even if the email fails.
    const docRef = await db.collection("messages").add({
      name,
      email,
      category,
      message,
      ipHash,
      userAgent: String(req.get("user-agent") ?? "").slice(0, 300),
      createdAt: FieldValue.serverTimestamp(),
      emailed: false,
    });

    try {
      const transport = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD.value() },
      });
      await transport.sendMail({
        from: { name: "aastr.id contact form", address: SMTP_USER },
        to: RECIPIENT,
        replyTo: { name, address: email },
        subject: `Portfolio contact: ${category}`,
        text: `New portfolio contact\n\nName: ${name}\nEmail: ${email}\nCategory: ${category}\n\nMessage:\n${message}\n`,
        headers: { "X-Auto-Response-Suppress": "All" },
      });
      await docRef.update({ emailed: true });
    } catch (err) {
      // The message is already stored; tell the sender it went through.
      logger.error("Email delivery failed; message kept in Firestore", { id: docRef.id, err: String(err) });
    }

    return send(res, 202, "Thanks, your note has been sent.", true);
  },
);

// ---------------------------------------------------------------------------
// Prompt Analyzer proxy (https://aastr.id/prompt-analyzer/)
//
// Holds the Groq key server-side. Before this, the key was built into the
// public JS bundle, so anyone could copy it.
// ---------------------------------------------------------------------------

const ANALYZE_PER_IP_DAILY = 3; // matches the limit the UI tells visitors about
const ANALYZE_GLOBAL_DAILY = 300; // hard cap on Groq calls per day
const ANALYZE_MAX_BODY_BYTES = 16_000;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// llama-3.1-8b-instant was shut down for non-enterprise accounts on 2026-08-16.
const GROQ_MODEL = "openai/gpt-oss-20b";

/** Counts one use against a daily bucket. Returns uses left, or throws { status, message, code }. */
async function takeDailyQuota(docId, limit, code, message) {
  const ref = db.collection("analyzeLimits").doc(docId);
  return db.runTransaction(async (tx) => {
    const used = (await tx.get(ref)).get("count") ?? 0;
    if (used >= limit) throw { status: 429, message, code };
    tx.set(ref, { count: used + 1, expiresAt: Timestamp.fromMillis(Date.now() + 2 * 86_400_000) });
    return limit - used - 1;
  });
}

export const analyzePrompt = onRequest(
  {
    region: "us-central1",
    secrets: [GROQ_API_KEY, IP_HASH_SALT],
    maxInstances: 2,
    concurrency: 20,
    memory: "256MiB",
    timeoutSeconds: 30,
    invoker: "public",
    cors: false,
  },
  async (req, res) => {
    setSecurityHeaders(res);
    const origin = req.get("origin") ?? "";
    if (!ANALYZE_ORIGINS.has(origin)) return send(res, 403, "Request rejected.");

    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      return res.status(204).end();
    }
    if (req.method !== "POST") {
      res.set("Allow", "POST, OPTIONS");
      return send(res, 405, "Method not allowed.");
    }
    if (!req.is("application/json")) return send(res, 415, "Unsupported request format.");
    if ((req.rawBody?.length ?? 0) > ANALYZE_MAX_BODY_BYTES) return send(res, 413, "Request is too large.");

    const check = validateAnalyzeRequest(req.body);
    if (!check.ok) return send(res, check.status, check.message);
    const { prompt, framework, lang } = check.data;

    const ip = clientIp(req.get("x-forwarded-for"), req.ip);
    const ipHash = createHash("sha256").update(IP_HASH_SALT.value() + ip).digest("hex");
    const day = new Date().toISOString().slice(0, 10);

    let remaining;
    try {
      remaining = await takeDailyQuota(`ip-${ipHash}-${day}`, ANALYZE_PER_IP_DAILY, "daily_limit", "Daily limit reached.");
      await takeDailyQuota(`day-${day}`, ANALYZE_GLOBAL_DAILY, "busy", "Service is busy today.");
    } catch (err) {
      if (err?.status === 429) {
        res.set("Retry-After", "3600");
        return res.status(429).json({ ok: false, code: err.code, message: err.message, remaining: 0 });
      }
      logger.error("Analyze quota check failed", err);
      return send(res, 503, "Service temporarily unavailable.");
    }

    let groq;
    try {
      groq = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY.value()}` },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.3,
          // gpt-oss is a reasoning model: reasoning tokens count toward this cap.
          reasoning_effort: "low",
          max_tokens: 2048,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: buildSystemPrompt(framework, lang) },
            { role: "user", content: `Prompt yang perlu dianalisis:\n\n${prompt}` },
          ],
        }),
        signal: AbortSignal.timeout(20_000),
      });
    } catch (err) {
      logger.error("Groq request failed", { err: String(err) });
      return send(res, 502, "AI service unreachable.");
    }

    if (!groq.ok) {
      // Log status only. Never log the prompt: it is the visitor's data.
      logger.warn("Groq returned an error", { status: groq.status });
      return send(res, groq.status === 429 ? 503 : 502, "AI service error.");
    }

    try {
      const data = await groq.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      return res.status(200).json({ ok: true, remaining, result: sanitiseModelOutput(parsed, framework) });
    } catch {
      return send(res, 502, "AI returned an unreadable answer.");
    }
  },
);
