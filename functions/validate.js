// Pure request checks for the contact form, kept separate so they can be tested
// without Firebase.

export const ALLOWED_ORIGINS = new Set(["https://aastr.id", "https://www.aastr.id"]);
export const TURNSTILE_HOSTNAMES = new Set(["aastr.id", "www.aastr.id"]);
export const CATEGORIES = new Set([
  "Curriculum or EdTech",
  "Product delivery",
  "Workshop or talk",
  "Mentorship or training",
]);

const MIN_FILL_MS = 2500;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;
// Control characters other than tab, newline and carriage return.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const LINE_BREAKS = /[\r\n\u2028\u2029]/;
// Deliberately strict: one @, no spaces or angle brackets, a dot in the domain.
const EMAIL = /^[^\s@<>()"',;:\\[\]]+@[^\s@<>()"',;:\\[\]]+\.[A-Za-z]{2,63}$/;

const str = (v) => (typeof v === "string" ? v.trim() : null);

/**
 * Returns { ok: true, data } or { ok: false, status, message, silent? }.
 * `silent` means "pretend it worked" (honeypot), so bots learn nothing.
 */
export function validateSubmission(body, now = Date.now()) {
  const bad = { ok: false, status: 422, message: "Please check the form fields and try again." };
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400, message: "Invalid request." };
  }

  const allowedKeys = new Set(["name", "email", "message", "category", "website", "startedAt", "turnstileToken"]);
  if (Object.keys(body).some((k) => !allowedKeys.has(k))) return bad;

  const website = str(body.website ?? "");
  if (website === null) return bad;
  if (website !== "") return { ok: false, status: 202, message: "Thanks, your note has been sent.", silent: true };

  const startedAt = body.startedAt;
  if (!Number.isInteger(startedAt) || startedAt > now || now - startedAt < MIN_FILL_MS || now - startedAt > MAX_FORM_AGE_MS) {
    return { ok: false, status: 400, message: "Please refresh the page and try again." };
  }

  const name = str(body.name);
  const email = str(body.email);
  const message = str(body.message);
  const category = str(body.category);
  const turnstileToken = str(body.turnstileToken);

  if (!name || name.length > 100 || LINE_BREAKS.test(name) || CONTROL_CHARS.test(name)) return bad;
  if (!email || email.length > 254 || !EMAIL.test(email)) return bad;
  if (!message || message.length < 8 || message.length > 5000 || CONTROL_CHARS.test(message)) return bad;
  if (!category || !CATEGORIES.has(category)) return bad;
  if (!turnstileToken || turnstileToken.length > 2048) {
    return { ok: false, status: 403, message: "Anti-spam verification failed. Please try again." };
  }

  return { ok: true, data: { name, email, message, category, turnstileToken } };
}

/**
 * The rightmost X-Forwarded-For entry is the one Google's front end appended,
 * so a client cannot spoof it by sending its own header.
 */
export function clientIp(forwardedFor, fallback) {
  const parts = String(forwardedFor ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.at(-1) || fallback || "unknown";
}
