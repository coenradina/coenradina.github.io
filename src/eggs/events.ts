// Tiny signals so the terminal, the portrait and the hero can trigger the
// easter eggs without passing props through the whole app.

export type HackPhase = "idle" | "breach" | "patching" | "report";

const HACK = "aastr:hack";
const HACK_PHASE = "aastr:hack-phase";
const PET = "aastr:pet";

/** Starts the fake-breach sequence. `via` ends up in the incident report. */
export function startHack(via: "terminal" | "konami") {
  window.dispatchEvent(new CustomEvent(HACK, { detail: via }));
}

export function onHackStart(fn: (via: "terminal" | "konami") => void) {
  const handler = (e: Event) => fn((e as CustomEvent).detail);
  window.addEventListener(HACK, handler);
  return () => window.removeEventListener(HACK, handler);
}

export function announceHackPhase(phase: HackPhase) {
  window.dispatchEvent(new CustomEvent(HACK_PHASE, { detail: phase }));
}

export function onHackPhase(fn: (phase: HackPhase) => void) {
  const handler = (e: Event) => fn((e as CustomEvent).detail);
  window.addEventListener(HACK_PHASE, handler);
  return () => window.removeEventListener(HACK_PHASE, handler);
}

/** Brings pixel Astrid onto the page. */
export function summonPet() {
  window.dispatchEvent(new CustomEvent(PET));
}

export function onSummonPet(fn: () => void) {
  window.addEventListener(PET, fn);
  return () => window.removeEventListener(PET, fn);
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
