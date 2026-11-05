import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import PixelSprite from "./PixelSprite";
import { ASTRID, ASTRID_PALETTE } from "./sprites";
import { GENERAL_FACTS, PERCH_FACTS } from "./perchFacts";
import { onSummonPet, prefersReducedMotion } from "./events";

const STORAGE_KEY = "aastr.pet";
const SPEED = 40; // px per second while walking
const GRAVITY = 2400; // px per second squared
const HOP_MS = 600;
const NAV_HEIGHT = 80; // keep clear of the sticky navbar
const CHAT_GAP_MS = 6000; // at least this long between unprompted remarks

type Mode = "walk" | "idle" | "sit" | "wave" | "held" | "fall" | "hop";

interface Hop {
  from: { x: number; y: number };
  toPerch: HTMLElement | null;
  toLocalX: number;
  start: number;
}

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
 * Pixel Astrid stands on top of whatever part of the page is in view,
 * walks along it, hops to the next one as you scroll, and says a line about
 * where she is. Summoned from the portrait; stays until sent away.
 */
export default function PixelPet() {
  const [on, setOn] = useState(loadOn);
  const [frame, setFrame] = useState<keyof typeof ASTRID>("stand");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [tip, setTip] = useState<string | null>(null);

  const small = typeof window !== "undefined" && window.innerWidth < 640;
  const scale = small ? 2 : 3;
  const w = 12 * scale;
  const h = 18 * scale;

  const s = useRef({
    mode: "fall" as Mode,
    x: 120, // screen x while falling/held/on the floor
    y: -60,
    vy: 0,
    dir: 1 as 1 | -1,
    until: 0,
    perch: null as HTMLElement | null,
    localX: 0, // x along the current perch
    hop: null as Hop | null,
  });
  const said = useRef<Record<string, number>>({}); // next fact index per perch
  const lastChat = useRef(0);
  const drag = useRef<{ dx: number; dy: number; moved: boolean } | null>(null);
  const calm = useRef(prefersReducedMotion());

  useEffect(
    () =>
      onSummonPet(() => {
        setOn(true);
        saveOn(true);
        Object.assign(s.current, { mode: "fall", x: Math.min(140, window.innerWidth - w - 8), y: -h, vy: 0, perch: null, hop: null });
      }),
    [w, h],
  );

  /** Says the next line for a perch (or a general one). */
  const say = (perch: HTMLElement | null) => {
    const key = perch?.dataset.perch ?? "";
    const lines = PERCH_FACTS[key] ?? GENERAL_FACTS;
    const i = said.current[key] ?? 0;
    said.current[key] = i + 1;
    setTip(lines[i % lines.length]);
    lastChat.current = performance.now();
  };

  // Main loop
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    let last = performance.now();
    const floorY = () => window.innerHeight - h - 6;

    const perches = () => [...document.querySelectorAll<HTMLElement>("[data-perch]")];
    /** A perch is usable when its top edge is comfortably on screen and wide enough. */
    const usable = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top - h > NAV_HEIGHT && r.top < window.innerHeight - 20 && r.width > w + 24;
    };
    /** The usable perch closest to the middle of the screen. */
    const bestPerch = () => {
      const mid = window.innerHeight * 0.55;
      let best: HTMLElement | null = null;
      let dist = Infinity;
      for (const el of perches()) {
        if (!usable(el)) continue;
        const d = Math.abs(el.getBoundingClientRect().top - mid);
        if (d < dist) {
          dist = d;
          best = el;
        }
      }
      return best;
    };
    const screenOf = (perch: HTMLElement | null, localX: number) => {
      if (!perch) return { x: localX, y: floorY() };
      const r = perch.getBoundingClientRect();
      return { x: r.left + localX, y: r.top - h + 2 };
    };
    const maxLocal = (perch: HTMLElement | null) => (perch ? perch.getBoundingClientRect().width - w : window.innerWidth - w - 4);

    const land = (perch: HTMLElement | null, localX: number, now: number) => {
      const st = s.current;
      const changed = perch !== st.perch;
      st.perch = perch;
      st.localX = Math.max(0, Math.min(maxLocal(perch), localX));
      st.mode = "idle";
      st.until = now + 1200;
      if (!changed) return;
      // A remark about the old spot shouldn't follow her to the new one.
      setTip(null);
      // Say something about the new spot, but not every time she moves.
      if (perch && now - lastChat.current > CHAT_GAP_MS) {
        window.setTimeout(() => {
          if (s.current.perch === perch) say(perch);
        }, 350);
      }
    };

    const startHop = (to: HTMLElement | null, now: number) => {
      const st = s.current;
      const from = st.mode === "fall" || st.mode === "held" ? { x: st.x, y: st.y } : screenOf(st.perch, st.localX);
      const here = from.x;
      const toLocalX = to ? here - to.getBoundingClientRect().left : here;
      if (calm.current) return land(to, toLocalX, now);
      st.hop = { from, toPerch: to, toLocalX, start: now };
      st.mode = "hop";
    };

    const choose = (now: number) => {
      const st = s.current;
      if (calm.current) {
        st.mode = "idle";
        st.until = now + 5000;
        return;
      }
      const roll = Math.random();
      if (roll < 0.55) {
        st.mode = "walk";
        st.dir = Math.random() < 0.5 ? -1 : 1;
        st.until = now + 2000 + Math.random() * 3500;
      } else if (roll < 0.85) {
        st.mode = "idle";
        st.until = now + 1500 + Math.random() * 2500;
      } else {
        st.mode = "sit";
        st.until = now + 3000 + Math.random() * 3000;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const st = s.current;
      let screen = { x: st.x, y: st.y };

      if (st.mode === "held") {
        screen = { x: st.x, y: st.y };
      } else if (st.mode === "fall") {
        const prevBottom = st.y + h;
        st.vy += GRAVITY * dt;
        st.y += st.vy * dt;
        const feet = st.x + w / 2;
        // Land on the first perch whose top edge she falls through
        const hit = perches().find((el) => {
          const r = el.getBoundingClientRect();
          return feet > r.left && feet < r.right && prevBottom <= r.top + 2 && st.y + h >= r.top && r.top - h > NAV_HEIGHT;
        });
        if (hit) land(hit, st.x - hit.getBoundingClientRect().left, now);
        else if (st.y >= floorY()) land(null, st.x, now);
        screen = { x: st.x, y: st.y };
      } else if (st.mode === "hop" && st.hop) {
        const hop = st.hop;
        const t = Math.min(1, (now - hop.start) / HOP_MS);
        const target = screenOf(hop.toPerch, hop.toLocalX);
        const arc = Math.sin(Math.PI * t) * 70;
        screen = { x: hop.from.x + (target.x - hop.from.x) * t, y: hop.from.y + (target.y - hop.from.y) * t - arc };
        // If the page scrolled her target away mid-hop, aim for one still in view.
        if (hop.toPerch && !usable(hop.toPerch)) {
          const next = bestPerch();
          st.hop = { from: screen, toPerch: next, toLocalX: next ? screen.x - next.getBoundingClientRect().left : screen.x, start: now };
        }
        if (t >= 1) {
          st.hop = null;
          land(hop.toPerch, hop.toLocalX, now);
        }
      } else {
        // Standing on a perch (or the floor). Hop if the perch scrolled away,
        // or if a better one is in view while she's on the floor.
        if (st.perch && !usable(st.perch)) startHop(bestPerch(), now);
        else if (!st.perch) {
          const next = bestPerch();
          if (next) startHop(next, now);
        }
        if (st.mode === "walk") {
          st.localX += st.dir * SPEED * dt;
          const max = maxLocal(st.perch);
          if (st.localX <= 0 || st.localX >= max) st.dir = st.localX <= 0 ? 1 : -1;
          st.localX = Math.max(0, Math.min(max, st.localX));
        }
        if (now > st.until && st.mode !== "hop") choose(now);
        if (st.mode !== "hop") screen = screenOf(st.perch, st.localX);
        st.x = screen.x;
        st.y = screen.y;
      }

      setPos(screen);
      setFacing(st.dir);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // say() only reads refs and stable setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, w, h]);

  // Animation frames
  useEffect(() => {
    if (!on) return;
    let step = 0;
    const id = window.setInterval(() => {
      step++;
      const m = s.current.mode;
      if (m === "walk") setFrame(step % 2 ? "walkA" : "walkB");
      else if (m === "sit") setFrame("sit");
      else if (m === "wave") setFrame(step % 2 ? "wave" : "stand");
      else if (m === "fall" || m === "held" || m === "hop") setFrame("walkA");
      else setFrame(step % 12 === 0 ? "blink" : "stand");
    }, 220);
    return () => window.clearInterval(id);
  }, [on]);

  useEffect(() => {
    if (!tip) return;
    const id = window.setTimeout(() => setTip(null), 4500);
    return () => window.clearTimeout(id);
  }, [tip]);

  const wave = () => {
    say(s.current.perch);
    const st = s.current;
    if (st.mode !== "hop" && st.mode !== "fall") {
      st.mode = "wave";
      st.until = performance.now() + 1600;
    }
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y, moved: false };
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const nx = e.clientX - d.dx;
    const ny = e.clientY - d.dy;
    if (!d.moved && Math.hypot(nx - pos.x, ny - pos.y) < 6) return;
    d.moved = true;
    Object.assign(s.current, { mode: "held", x: nx, y: ny, perch: null, hop: null });
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.moved) {
      Object.assign(s.current, { mode: "fall", vy: 0 });
      setTip("Wheee!");
    } else {
      wave();
    }
  };

  const dismiss = () => {
    setOn(false);
    saveOn(false);
    setTip(null);
  };

  if (!on) return null;

  return (
    <div
      className="pixel-pet fixed left-0 top-0 z-float select-none"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      {tip && (
        <div
          className="card-in absolute bottom-full mb-2 w-56 rounded-lg border-2 border-ink bg-white px-3 py-2 type-micro text-ink shadow-pixel-sm"
          style={pos.x > window.innerWidth - 240 ? { right: 0 } : { left: 0 }}
          role="status"
        >
          {tip}
        </div>
      )}
      <button
        type="button"
        aria-label="Pixel Astrid. Click for a fact about this part of the page, or drag to move her."
        className="block cursor-grab touch-none active:cursor-grabbing"
        style={{ width: w, height: h }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            wave();
          }
        }}
      >
        <PixelSprite frame={ASTRID[frame]} palette={ASTRID_PALETTE} scale={scale} flip={facing === -1} />
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Send pixel Astrid away"
        className="pet-close absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-white type-micro text-ink"
      >
        ×
      </button>
    </div>
  );
}
