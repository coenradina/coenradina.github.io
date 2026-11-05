import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import PixelSprite from "./PixelSprite";
import { ASTRID, ASTRID_PALETTE } from "./sprites";
import { onSummonPet, prefersReducedMotion } from "./events";

const STORAGE_KEY = "aastr.pet";
const TIPS = [
  "Psst. Type sudo hack in the terminal. I dare you.",
  "Try picking me up. I don't mind.",
  "Kotakata teaches ML terms with blocks. Go train a robot!",
  "There's a hidden terminal. Look for the [~] button.",
  "Hiring? The contact form is at the bottom. 👇",
  "I code and teach. Usually not at the same time.",
  "300+ volunteer mentors at Generation Girl. Hi, mentors!",
  "The arrow keys know a secret. ↑↑↓↓←→←→ B A",
];

type Mode = "walk" | "idle" | "sit" | "wave" | "held" | "fall";

const SCALE_DESKTOP = 3;
const SCALE_MOBILE = 2;
const SPEED = 42; // px per second
const GRAVITY = 2400; // px per second squared

function loadOn() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function saveOn(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* not critical */
  }
}

/**
 * Pixel Astrid wanders along the bottom of the window. Summoned by clicking
 * the portrait on the character card; stays until dismissed.
 */
export default function PixelPet() {
  const [on, setOn] = useState(loadOn);
  const [mode, setMode] = useState<Mode>("idle");
  const [frame, setFrame] = useState<keyof typeof ASTRID>("stand");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [pos, setPos] = useState({ x: 24, y: 0 });
  const [tip, setTip] = useState<string | null>(null);
  const tipIndex = useRef(0);
  const state = useRef({ x: 24, y: 0, vy: 0, dir: 1 as 1 | -1, mode: "idle" as Mode, until: 0 });
  const drag = useRef<{ dx: number; dy: number; moved: boolean } | null>(null);
  const calm = useRef(prefersReducedMotion());
  const scale = typeof window !== "undefined" && window.innerWidth < 640 ? SCALE_MOBILE : SCALE_DESKTOP;
  const w = 15 * scale;
  const h = 18 * scale;

  useEffect(
    () =>
      onSummonPet(() => {
        setOn(true);
        saveOn(true);
        // Drop in from above, near the left
        state.current = { ...state.current, x: Math.min(120, window.innerWidth - w - 8), y: -h, vy: 0, mode: "fall" };
        setMode("fall");
      }),
    [w, h],
  );

  // Main loop: walking, falling, and picking what to do next.
  useEffect(() => {
    if (!on) return;
    let last = performance.now();
    let raf = 0;
    const floor = () => window.innerHeight - h - 6;

    const choose = (now: number) => {
      const s = state.current;
      if (calm.current) {
        s.mode = "idle";
        s.until = now + 4000;
        return;
      }
      const roll = Math.random();
      if (roll < 0.55) {
        s.mode = "walk";
        s.dir = Math.random() < 0.5 ? -1 : 1;
        s.until = now + 2500 + Math.random() * 4000;
      } else if (roll < 0.85) {
        s.mode = "idle";
        s.until = now + 1500 + Math.random() * 2500;
      } else {
        s.mode = "sit";
        s.until = now + 3000 + Math.random() * 3000;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = state.current;
      const maxX = window.innerWidth - w - 4;

      if (s.mode === "fall") {
        s.vy += GRAVITY * dt;
        s.y += s.vy * dt;
        if (s.y >= floor()) {
          s.y = floor();
          s.vy = 0;
          s.mode = "idle";
          s.until = now + 900;
        }
      } else if (s.mode !== "held") {
        s.y = floor();
        if (s.mode === "walk") {
          s.x += s.dir * SPEED * dt;
          if (s.x <= 4 || s.x >= maxX) s.dir = s.x <= 4 ? 1 : -1;
        }
        if (now > s.until && s.mode !== "wave") choose(now);
        if (s.mode === "wave" && now > s.until) choose(now);
      }
      s.x = Math.max(4, Math.min(maxX, s.x));

      setPos({ x: s.x, y: s.y });
      setMode(s.mode);
      setFacing(s.dir);
      raf = requestAnimationFrame(tick);
    };
    state.current.y = state.current.mode === "fall" ? state.current.y : floor();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, w, h]);

  // Animation frames: two-step walk, blink now and then
  useEffect(() => {
    if (!on) return;
    let step = 0;
    const id = window.setInterval(() => {
      step++;
      const m = state.current.mode;
      if (m === "walk") setFrame(step % 2 ? "walkA" : "walkB");
      else if (m === "sit") setFrame("sit");
      else if (m === "wave") setFrame(step % 2 ? "wave" : "stand");
      else if (m === "fall" || m === "held") setFrame("walkA");
      else setFrame(step % 12 === 0 ? "blink" : "stand");
    }, 220);
    return () => window.clearInterval(id);
  }, [on]);

  // Hide the tip after a while
  useEffect(() => {
    if (!tip) return;
    const id = window.setTimeout(() => setTip(null), 4200);
    return () => window.clearTimeout(id);
  }, [tip]);

  const sayNext = () => {
    setTip(TIPS[tipIndex.current % TIPS.length]);
    tipIndex.current++;
    const s = state.current;
    s.mode = "wave";
    s.until = performance.now() + 1600;
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { dx: e.clientX - state.current.x, dy: e.clientY - state.current.y, moved: false };
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const nx = e.clientX - d.dx;
    const ny = e.clientY - d.dy;
    if (!d.moved && Math.hypot(nx - state.current.x, ny - state.current.y) < 6) return;
    d.moved = true;
    state.current.mode = "held";
    state.current.x = nx;
    state.current.y = ny;
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.moved) {
      state.current.mode = "fall";
      state.current.vy = 0;
      setTip("Wheee!");
    } else {
      sayNext();
    }
  };

  const dismiss = () => {
    setOn(false);
    saveOn(false);
    setTip(null);
  };

  if (!on) return null;

  return (
    <div className="pixel-pet fixed left-0 top-0 z-[55] select-none" style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
      {tip && (
        <div className="card-in absolute bottom-full left-1/2 mb-2 w-56 -translate-x-1/2 rounded-lg border-2 border-slate-900 bg-white px-3 py-2 font-mono text-[11px] font-bold leading-snug text-slate-900 shadow-[3px_3px_0_#0F172A]" role="status">
          {tip}
          <span aria-hidden="true" className="absolute -bottom-[7px] left-1/2 -ml-1.5 h-3 w-3 rotate-45 border-b-2 border-r-2 border-slate-900 bg-white" />
        </div>
      )}
      <button
        type="button"
        aria-label="Pixel Astrid. Click for a tip, or drag to pick her up."
        className={`block cursor-grab touch-none active:cursor-grabbing ${mode === "fall" ? "" : "pet-land"}`}
        style={{ width: w, height: h }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), sayNext())}
      >
        <PixelSprite frame={ASTRID[frame]} palette={ASTRID_PALETTE} scale={scale} flip={facing === -1} />
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Send pixel Astrid away"
        className="pet-close absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-900 bg-white font-mono text-[10px] font-bold leading-none text-slate-900"
      >
        ×
      </button>
    </div>
  );
}
