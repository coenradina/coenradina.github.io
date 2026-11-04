import { createHash } from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import nodemailer from "nodemailer";
import { ALLOWED_ORIGINS, TURNSTILE_HOSTNAMES, clientIp, validateSubmission } from "./validate.js";

initializeApp();
const db = getFirestore();

const TURNSTILE_SECRET = defineSecret("TURNSTILE_SECRET");
const SMTP_PASSWORD = defineSecret("SMTP_PASSWORD");
// Salt for hashing IPs, so stored rate-limit keys can't be reversed to addresses.
const IP_HASH_SALT = defineSecret("IP_HASH_SALT");
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
