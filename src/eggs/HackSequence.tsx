import { useEffect, useRef, useState } from "react";
import PixelSprite from "./PixelSprite";
import { BUG, BUG_PALETTE } from "./sprites";
import { announceHackPhase, onHackStart, prefersReducedMotion, startHack, type HackPhase } from "./events";

interface Props {
  onUnlockAchievement: (title: string, xp: number) => void;
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

// How long each phase lasts, in ms. Reduced motion gets a shorter, calmer run.
const TIMING = { breach: 2600, patching: 2200 };
const TIMING_CALM = { breach: 1200, patching: 1200 };

const NOISE = [
  "0xDEADBEEF",
  "ERR_COFFEE_NOT_FOUND",
  "rm -rf /curriculum",
  "SEGFAULT @ hero.tsx:178",
  "ACCESS GRANTED?? 🤔",
  "while(true) { panic() }",
  "404: motivation",
  "chmod 777 everything",
  "NaN NaN NaN NaN",
  "sudo make me a sandwich",
];

interface Noise {
  text: string;
  x: number;
  y: number;
}

function randomNoise(): Noise[] {
  return Array.from({ length: 9 }, () => ({
    text: NOISE[Math.floor(Math.random() * NOISE.length)],
    x: 4 + Math.random() * 78,
    y: 8 + Math.random() * 80,
  }));
}

/**
 * The fake breach: the page glitches, a bug takes over the headline, I patch
 * it, and an incident report explains what happened. Only starts when the
 * visitor asks for it (terminal command or Konami code), never on its own.
 */
export default function HackSequence({ onUnlockAchievement }: Props) {
  const [phase, setPhase] = useState<HackPhase>("idle");
  const [via, setVia] = useState<"terminal" | "konami">("terminal");
  const [noise, setNoise] = useState<Noise[]>([]);
  const [bugFrame, setBugFrame] = useState(0);
  const [progress, setProgress] = useState(0);
  const timers = useRef<number[]>([]);
  const calm = useRef(false);
  const startedAt = useRef(0);
  const [resolvedIn, setResolvedIn] = useState(0);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const go = (next: HackPhase) => {
    setPhase(next);
    announceHackPhase(next);
    const root = document.documentElement;
    root.classList.toggle("is-hacked", next === "breach" || next === "patching");
    root.classList.toggle("is-patching", next === "patching");
  };

  const finish = () => {
    clearTimers();
    setResolvedIn((performance.now() - startedAt.current) / 1000);
    go("report");
    onUnlockAchievement("Survived a fake breach (+404 XP)", 404);
  };

  // Start on request
  useEffect(
    () =>
      onHackStart((source) => {
        if (phase !== "idle") return;
        clearTimers();
        calm.current = prefersReducedMotion();
        const t = calm.current ? TIMING_CALM : TIMING;
        setVia(source);
        setNoise(randomNoise());
        setProgress(0);
        startedAt.current = performance.now();
        go("breach");
        timers.current.push(window.setTimeout(() => go("patching"), t.breach));
        timers.current.push(window.setTimeout(finish, t.breach + t.patching));
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase],
  );

  // Konami code anywhere on the page
  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        startHack("konami");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Escape skips straight to the report, or closes it
  useEffect(() => {
    if (phase === "idle") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (phase === "report") go("idle");
      else finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Noise moves a couple of times a second (well under the 3-flashes-a-second
  // limit for photosensitive visitors). Still for reduced motion.
  useEffect(() => {
    if (phase !== "breach" || calm.current) return;
    const id = window.setInterval(() => {
      setNoise(randomNoise());
      setBugFrame((f) => 1 - f);
    }, 450);
    return () => window.clearInterval(id);
  }, [phase]);

  // Patch progress bar
  useEffect(() => {
    if (phase !== "patching") return;
    const total = calm.current ? TIMING_CALM.patching : TIMING.patching;
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      setProgress(Math.min(100, ((performance.now() - start) / total) * 100));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(
    () => () => {
      clearTimers();
      document.documentElement.classList.remove("is-hacked", "is-patching");
    },
    [],
  );

  if (phase === "idle") return null;

  return (
    <>
      {(phase === "breach" || phase === "patching") && (
        <div className="hack-overlay pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
          <div className="hack-scanlines absolute inset-0" />
          {phase === "breach" &&
            noise.map((n, i) => (
              <span
                key={i}
                className="absolute rounded bg-slate-900/85 px-2 py-0.5 font-mono text-[11px] font-bold text-lime-300 sm:text-xs"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                {n.text}
              </span>
            ))}
          {phase === "breach" && (
            <div className="hack-bug absolute left-1/2 top-[38%] -translate-x-1/2">
              <PixelSprite frame={BUG[bugFrame]} palette={BUG_PALETTE} scale={6} />
            </div>
          )}
          <div className="absolute inset-x-0 top-16 flex justify-center sm:top-20">
            <div className="rounded border-2 border-lime-400 bg-slate-900 px-4 py-2 font-mono text-xs font-bold text-lime-300 shadow-[4px_4px_0_#0F172A] sm:text-sm">
              {phase === "breach" ? "⚠ UNAUTHORIZED ACCESS: bug.exe has entered the portfolio" : "✓ RESPONDER ON SITE: patching…"}
            </div>
          </div>
        </div>
      )}

      {phase === "patching" && (
        <div className="card-in fixed bottom-6 right-6 z-[61] flex w-72 items-start gap-3 rounded-lg border-2 border-slate-900 bg-white p-3 shadow-[5px_5px_0_#0F172A]" role="status">
          <img src={`${import.meta.env.BASE_URL}avatar.png`} alt="" className="h-14 w-14 shrink-0 rounded border-2 border-slate-900" />
          <div className="min-w-0 flex-1 space-y-2">
            <p className="font-mono text-xs font-bold text-slate-900">Astrid: Hold on. I've seen this one before.</p>
            <div className="h-3 overflow-hidden rounded border-2 border-slate-900 bg-slate-100">
              <div className="h-full bg-brand-tosca" style={{ width: `${progress}%` }} />
            </div>
            <p className="font-mono text-[10px] text-slate-600">git revert bug.exe · {Math.round(progress)}%</p>
          </div>
        </div>
      )}

      {phase === "report" && <IncidentReport via={via} seconds={resolvedIn} onClose={() => go("idle")} />}

      <span className="sr-only" role="status">
        {phase === "breach" ? "Easter egg: the page is pretending to be hacked." : phase === "patching" ? "Patching." : ""}
      </span>
    </>
  );
}

function IncidentReport({ via, seconds, onClose }: { via: "terminal" | "konami"; seconds: number; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    close.current?.focus();
  }, []);
  const s = (n: number) => `00:${n.toFixed(1).padStart(4, "0")}`;
  const cause = via === "konami" ? "a visitor entered the Konami code" : "a visitor typed `sudo hack` into the terminal";

  return (
    <div className="fixed inset-0 z-[62] flex items-center justify-center bg-slate-900/50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="incident-title" className="card-in w-full max-w-md overflow-hidden rounded-xl border-2 border-slate-900 bg-[#FDF6E3] shadow-[6px_6px_0_#0F172A]">
        <div className="flex items-center justify-between bg-slate-900 px-4 py-2.5">
          <h2 id="incident-title" className="font-mono text-sm font-bold text-lime-300">
            INCIDENT REPORT #001
          </h2>
          <span className="rounded bg-lime-400 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-900">RESOLVED</span>
        </div>
        <div className="space-y-4 p-5 font-mono text-xs text-slate-800 sm:text-sm">
          <p>
            <span className="font-bold text-slate-900">Severity:</span> SEV-4 (cosmetic, mostly emotional)
          </p>
          <div>
            <p className="mb-1.5 font-bold text-slate-900">Timeline</p>
            <ul className="space-y-1">
              <li>
                <span className="text-brand-maroon">{s(0)}</span> Detected: {cause}
              </li>
              <li>
                <span className="text-brand-maroon">{s(0.3)}</span> bug.exe claimed the headline: "I build bugs."
              </li>
              <li>
                <span className="text-brand-maroon">{s(Math.min(seconds, 2.6))}</span> Responder on site: Astrid
              </li>
              <li>
                <span className="text-brand-maroon">{s(seconds)}</span> Patched and verified
              </li>
            </ul>
          </div>
          <p>
            <span className="font-bold text-slate-900">Impact:</span> No data lost. One headline was briefly wrong.
          </p>
          <div>
            <p className="mb-1.5 font-bold text-slate-900">Action items</p>
            <ul className="space-y-1">
              <li>[x] Remove the bug</li>
              <li>[x] Restore "I build apps."</li>
              <li>[ ] Hire the curious visitor who found this</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t-2 border-slate-900/10 px-5 py-4">
          <button
            onClick={() => {
              onClose();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded border-2 border-slate-900 bg-white px-4 py-2 font-mono text-xs font-bold text-slate-900 shadow-[3px_3px_0_#0F172A] hover:bg-amber-100"
          >
            WRITE TO ME ✉
          </button>
          <button ref={close} onClick={onClose} className="rounded border-2 border-slate-900 bg-brand-tosca px-4 py-2 font-mono text-xs font-bold text-white shadow-[3px_3px_0_#0F172A]">
            CLOSE REPORT
          </button>
        </div>
      </div>
    </div>
  );
}
