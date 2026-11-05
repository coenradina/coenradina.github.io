import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSystemPrompt, sanitiseModelOutput, validateAnalyzeRequest } from "../analyze.js";

const good = () => ({ prompt: "Sebagai copywriter, buatkan 3 headline.", framework: "ROSES", lang: "id" });

test("accepts a normal request", () => {
  assert.equal(validateAnalyzeRequest(good()).ok, true);
});

test("rejects unknown fields, frameworks and languages", () => {
  assert.equal(validateAnalyzeRequest({ ...good(), model: "llama-3.3-70b" }).ok, false);
  assert.equal(validateAnalyzeRequest({ ...good(), framework: "__proto__" }).ok, false);
  assert.equal(validateAnalyzeRequest({ ...good(), framework: "toString" }).ok, false);
  assert.equal(validateAnalyzeRequest({ ...good(), lang: "fr" }).ok, false);
});

test("rejects empty, oversized and control-character prompts", () => {
  assert.equal(validateAnalyzeRequest({ ...good(), prompt: "   " }).ok, false);
  assert.equal(validateAnalyzeRequest({ ...good(), prompt: "a".repeat(4001) }).ok, false);
  assert.equal(validateAnalyzeRequest({ ...good(), prompt: "hi\u0000there" }).ok, false);
  assert.equal(validateAnalyzeRequest(null).ok, false);
  assert.equal(validateAnalyzeRequest([]).ok, false);
});

test("system prompt lists the framework's components", () => {
  const p = buildSystemPrompt("SIP", "en");
  for (const c of ["Siapa saya", "Ingin apa", "Penyajiannya"]) assert.ok(p.includes(`"${c}"`));
});

test("sanitises model output to expected fields and clamped scores", () => {
  const out = sanitiseModelOutput(
    {
      component_scores: { Peran: { score: 9, feedback: "ok", extra: 1 }, Rogue: { score: 2 } },
      overall_feedback: 42,
      injected: "<script>",
    },
    "PESAN",
  );
  assert.deepEqual(Object.keys(out), ["component_scores", "overall_feedback"]);
  assert.deepEqual(Object.keys(out.component_scores), ["Peran", "Esensi", "Situasi", "Aturan", "Nuansa"]);
  assert.equal(out.component_scores.Peran.score, 2);
  assert.equal(out.component_scores.Esensi.score, 0);
  assert.equal(out.overall_feedback, "");
});
