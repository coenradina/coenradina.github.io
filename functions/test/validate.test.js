import { test } from "node:test";
import assert from "node:assert/strict";
import { clientIp, validateSubmission } from "../validate.js";

const now = 1_800_000_000_000;
const good = () => ({
  name: "Ada",
  email: "ada@example.com",
  message: "Hello there, a proper message.",
  category: "Workshop or talk",
  website: "",
  startedAt: now - 10_000,
  turnstileToken: "tok",
});

test("accepts a normal submission", () => {
  assert.equal(validateSubmission(good(), now).ok, true);
});

test("honeypot returns a silent fake success", () => {
  const r = validateSubmission({ ...good(), website: "spam.example" }, now);
  assert.equal(r.ok, false);
  assert.equal(r.silent, true);
});

test("rejects header injection in name and email", () => {
  assert.equal(validateSubmission({ ...good(), name: "Ada\r\nBcc: x@y.com" }, now).ok, false);
  assert.equal(validateSubmission({ ...good(), email: "a@b.com\nBcc: x@y.com" }, now).ok, false);
  assert.equal(validateSubmission({ ...good(), name: "Ada Bcc" }, now).ok, false);
});

test("rejects unknown categories, extra keys and wrong types", () => {
  assert.equal(validateSubmission({ ...good(), category: "<script>" }, now).ok, false);
  assert.equal(validateSubmission({ ...good(), admin: true }, now).ok, false);
  assert.equal(validateSubmission({ ...good(), name: ["Ada"] }, now).ok, false);
  assert.equal(validateSubmission([good()], now).ok, false);
  assert.equal(validateSubmission(null, now).ok, false);
});

test("rejects forms filled too fast, too old, or from the future", () => {
  assert.equal(validateSubmission({ ...good(), startedAt: now - 500 }, now).ok, false);
  assert.equal(validateSubmission({ ...good(), startedAt: now - 3 * 3600_000 }, now).ok, false);
  assert.equal(validateSubmission({ ...good(), startedAt: now + 1000 }, now).ok, false);
  assert.equal(validateSubmission({ ...good(), startedAt: "123" }, now).ok, false);
});

test("enforces length limits", () => {
  assert.equal(validateSubmission({ ...good(), message: "short" }, now).ok, false);
  assert.equal(validateSubmission({ ...good(), message: "x".repeat(5001) }, now).ok, false);
  assert.equal(validateSubmission({ ...good(), name: "x".repeat(101) }, now).ok, false);
  assert.equal(validateSubmission({ ...good(), turnstileToken: "" }, now).ok, false);
});

test("uses the rightmost forwarded IP so clients can't spoof it", () => {
  assert.equal(clientIp("6.6.6.6, 1.2.3.4", "9.9.9.9"), "1.2.3.4");
  assert.equal(clientIp("", "9.9.9.9"), "9.9.9.9");
});
