import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import PixelSprite from "./PixelSprite";
import { ASTRID, ASTRID_PALETTE } from "./sprites";
import { GENERAL_FACTS, PERCH_FACTS } from "./perchFacts";
import { onSummonPet, prefersReducedMotion } from "./events";

const STORAGE_KEY = "aastr.pet";
const SPEED = 40; // px per second while walking
const GRAVITY = 2200; // px per second squared
const CROUCH_MS = 110; // wind-up before a jump
const LAND_MS = 170; // knees stay bent this long after landing
const BOUNCE_SPEED = 1100; // landing faster than this bounces once
const MAX_THROW = 1800; // px per second
const NAV_HEIGHT = 80; // keep clear of the sticky navbar
const CHAT_GAP_MS = 6000; // at least this long between unprompted remarks
// Squash and stretch spring. Underdamped, so a hard landing wobbles a little.
const SPRING_K = 320;
const SPRING_DAMP = 16;

type Mode = "walk" | "idle" | "sit" | "wave" | "held" | "crouch" | "air" | "land";

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
  const [pos, setPos] = useState({ x: -100, y: -100, sx: 1, sy: 1, tilt: 0 });
  const [tip, setTip] = useState<string | null>(null);

  const small = typeof window !== "undefined" && window.innerWidth < 640;
  const scale = small ? 2 : 3;
  const w = 12 * scale;
  const h = 18 * scale;

  // Positions are in page coordinates (screen + scroll), so scrolling
  // mid-jump doesn't bend her path.
  const s = useRef({
    mode: "air" as Mode,
    x: 120,
    y: -60,
    vx: 0,
    vy: 0,
    thrown: false, // a throw slows down in the air; a planned jump doesn't
    bounced: false,
    dir: 1 as 1 | -1,
    until: 0,
    perch: null as HTMLElement | null,
    localX: 0, // x along the current perch
    jump: null as { vx: number; vy: number } | null, // launch velocity, set during the crouch
    sq: 1, // squash: below 1 is flatter, above 1 is taller
    sqv: 0,
    tilt: 0, // degrees
  });
  const samples = useRef<{ t: number; x: number; y: number }[]>([]);
  const said = useRef<Record<string, number>>({}); // next fact index per perch
  const lastChat = useRef(0);
  const drag = useRef<{ dx: number; dy: number; moved: boolean } | null>(null);
  const calm = useRef(prefersReducedMotion());

  useEffect(
    () =>
      onSummonPet(() => {
        setOn(true);
        saveOn(true);
        Object.assign(s.current, {
          mode: "air",
          x: Math.min(140, window.innerWidth - w - 8),
          y: window.scrollY - h,
          vx: 0,
          vy: 0,
          thrown: false,
          bounced: false,
          perch: null,
          jump: null,
        });
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
    /** Page y of her top edge when standing on the bottom of the viewport. */
    const floorY = () => window.scrollY + window.innerHeight - h - 6;

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
    /** Page position of her top-left corner when standing at localX on a perch. */
    const standAt = (perch: HTMLElement | null, localX: number) => {
      if (!perch) return { x: localX, y: floorY() };
      const r = perch.getBoundingClientRect();
      return { x: r.left + localX, y: r.top + window.scrollY - h + 2 };
    };
    const maxLocal = (perch: HTMLElement | null) => (perch ? perch.getBoundingClientRect().width - w : window.innerWidth - w - 4);

    const land = (perch: HTMLElement | null, localX: number, impact: number, now: number) => {
      const st = s.current;
      const changed = perch !== st.perch;
      st.perch = perch;
      st.localX = Math.max(0, Math.min(maxLocal(perch), localX));
      st.vx = 0;
      st.vy = 0;
      st.jump = null;
      // Squash in proportion to how hard she came down
      st.sq = 1 - Math.min(0.32, impact / 3200);
      st.sqv = 0;
      st.mode = calm.current ? "idle" : "land";
      st.until = now + (calm.current ? 1200 : LAND_MS);
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

    /**
     * Crouches, then jumps so the arc lands on `to`. The launch speed comes
     * from the apex height, and the flight time from the rise and the drop,
     * so long or high jumps take longer, the way a real jump does.
     */
    const jumpTo = (to: HTMLElement | null, now: number) => {
      const st = s.current;
      const from = standAt(st.perch, st.localX);
      const toLocalX = to ? Math.max(0, Math.min(maxLocal(to), from.x - to.getBoundingClientRect().left)) : from.x;
      if (calm.current) return land(to, toLocalX, 0, now);
      const target = standAt(to, toLocalX);
      const dx = target.x - from.x;
      const apex = Math.min(from.y, target.y) - Math.min(110, 36 + Math.abs(dx) * 0.12);
      const vy = -Math.sqrt(2 * GRAVITY * (from.y - apex));
      const time = -vy / GRAVITY + Math.sqrt((2 * (target.y - apex)) / GRAVITY);
      Object.assign(st, { x: from.x, y: from.y, mode: "crouch", until: now + CROUCH_MS, jump: { vx: dx / time, vy }, thrown: false, bounced: false });
      if (dx) st.dir = dx > 0 ? 1 : -1;
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

    /** One physics step while airborne. Lands on the first perch top she falls through. */
    const fly = (dt: number, now: number) => {
      const st = s.current;
      const prevBottom = st.y + h;
      st.vy += GRAVITY * dt;
      if (st.thrown) st.vx *= Math.exp(-1.2 * dt); // air drag on throws
      st.x += st.vx * dt;
      st.y += st.vy * dt;
      // Bounce off the sides of the window
      const maxX = window.innerWidth - w - 4;
      if (st.x < 4 || st.x > maxX) {
        st.x = Math.max(4, Math.min(maxX, st.x));
        st.vx *= -0.45;
        st.dir = st.vx > 0 ? 1 : -1;
      }
      // Bonk on the top of the window instead of flying out of view
      const top = window.scrollY + 4;
      if (st.y < top && st.vy < 0) {
        st.y = top;
        st.vy *= -0.3;
        st.sq = 0.85;
      }
      if (st.vy <= 0) return;
      const feet = st.x + w / 2;
      const bottom = st.y + h;
      const hit = perches().find((el) => {
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY;
        return feet > r.left && feet < r.right && prevBottom <= top + 2 && bottom >= top && r.top - h > NAV_HEIGHT;
      });
      const floor = floorY();
      if (!hit && st.y < floor) return;
      const impact = st.vy;
      if (impact > BOUNCE_SPEED && !st.bounced && !calm.current) {
        // One small bounce, then she sticks the landing
        st.bounced = true;
        st.vy = -impact * 0.26;
        st.vx *= 0.6;
        st.y = hit ? hit.getBoundingClientRect().top + window.scrollY - h : floor;
        st.sq = 0.7;
        st.sqv = 0;
        return;
      }
      if (hit) land(hit, st.x - hit.getBoundingClientRect().left, impact, now);
      else land(null, st.x, impact, now);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const st = s.current;

      if (st.mode === "air") {
        fly(dt, now);
      } else if (st.mode === "crouch") {
        // Wind up, then push off
        const p = standAt(st.perch, st.localX);
        st.x = p.x;
        st.y = p.y;
        st.sq += (0.8 - st.sq) * Math.min(1, dt * 30);
        if (now >= st.until && st.jump) {
          Object.assign(st, { mode: "air", vx: st.jump.vx, vy: st.jump.vy, jump: null, perch: null, sq: 1.18, sqv: 0 });
        }
      } else if (st.mode !== "held") {
        // Standing on a perch or the floor. Jump if the perch scrolled away,
        // or if a perch is in view while she's on the floor.
        if (st.mode !== "land") {
          if (st.perch && !usable(st.perch)) jumpTo(bestPerch(), now);
          else if (!st.perch) {
            const next = bestPerch();
            if (next) jumpTo(next, now);
          }
        }
        if (st.mode === "walk") {
          st.localX += st.dir * SPEED * dt;
          const max = maxLocal(st.perch);
          if (st.localX <= 0 || st.localX >= max) st.dir = st.localX <= 0 ? 1 : -1;
          st.localX = Math.max(0, Math.min(max, st.localX));
        }
        // jumpTo() may have switched her to a crouch above
        const crouching = (st.mode as Mode) === "crouch";
        if (now > st.until && !crouching) choose(now);
        if (!crouching) {
          const p = standAt(st.perch, st.localX);
          st.x = p.x;
          st.y = p.y;
        }
      }

      // Squash spring, plus a stretch with vertical speed while flying
      if (st.mode !== "crouch") {
        st.sqv += (-SPRING_K * (st.sq - 1) - SPRING_DAMP * st.sqv) * dt;
        st.sq += st.sqv * dt;
      }
      const stretch = st.mode === "air" ? Math.min(0.1, Math.abs(st.vy) / 14000) : 0;
      const sy = st.sq + stretch;
      const sx = 1 + (1 - sy) * 0.7;
      // Lean into the direction of travel
      const lean = st.mode === "air" || st.mode === "held" ? Math.max(-14, Math.min(14, st.vx / 45)) : 0;
      st.tilt += (lean - st.tilt) * Math.min(1, dt * 10);

      setPos({ x: st.x, y: st.y - window.scrollY, sx, sy, tilt: st.tilt });
      setFacing(st.dir);
      if (st.mode === "air") setFrame(st.vy < 0 ? "jump" : "fall");
      else if (st.mode === "crouch" || st.mode === "land") setFrame("crouch");
      else if (st.mode === "held") setFrame("dangle");
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
      else if (m === "idle") setFrame(step % 12 === 0 ? "blink" : "stand");
      // Airborne, crouching and held frames are set by the physics loop
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
    if (st.mode === "idle" || st.mode === "walk" || st.mode === "sit") {
      st.mode = "wave";
      st.until = performance.now() + 1600;
    }
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y, moved: false };
    samples.current = [{ t: performance.now(), x: e.clientX, y: e.clientY }];
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const nx = e.clientX - d.dx;
    const ny = e.clientY - d.dy;
    if (!d.moved && Math.hypot(nx - pos.x, ny - pos.y) < 6) return;
    d.moved = true;
    const now = performance.now();
    // Keep the last 100ms of pointer movement to work out the throw
    samples.current = [...samples.current.filter((p) => now - p.t < 100), { t: now, x: e.clientX, y: e.clientY }];
    const first = samples.current[0];
    const span = Math.max(0.016, (now - first.t) / 1000);
    Object.assign(s.current, {
      mode: "held",
      x: nx,
      y: ny + window.scrollY,
      vx: (e.clientX - first.x) / span,
      vy: (e.clientY - first.y) / span,
      perch: null,
      jump: null,
    });
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.moved) {
      const st = s.current;
      // A pointer that stopped before letting go drops her instead of throwing
      const recent = samples.current.filter((p) => performance.now() - p.t < 60).length > 1;
      const clamp = (v: number) => Math.max(-MAX_THROW, Math.min(MAX_THROW, recent ? v : 0));
      Object.assign(st, { mode: "air", vx: clamp(st.vx), vy: clamp(st.vy), thrown: true, bounced: false });
      setTip(Math.hypot(st.vx, st.vy) > 700 ? "Wheee!" : "Oh!");
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
      <div className="origin-bottom" style={{ transform: `rotate(${pos.tilt}deg) scale(${pos.sx}, ${pos.sy})` }}>
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
      </div>
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
