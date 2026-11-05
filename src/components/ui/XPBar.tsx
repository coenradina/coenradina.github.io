import { useEffect, useRef, useState } from "react";

const TONES = {
  tosca: { bar: "bg-tosca", text: "text-tosca" },
  maroon: { bar: "bg-maroon", text: "text-maroon" },
  gold: { bar: "bg-gold", text: "text-gold" },
  ink: { bar: "bg-ink", text: "text-ink" },
};

interface XPBarProps {
  label: string;
  value: number; // 0–100
  xp?: string;
  tone?: keyof typeof TONES;
}

export default function XPBar({ label, value, xp, tone = "tosca" }: XPBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="type-eyebrow text-ink"
        >
          {label}
        </span>
        <span className={`type-label ${TONES[tone].text}`}>
          {xp ?? `${value}% MAX`}
        </span>
      </div>
      <div 
        className="h-3 w-full rounded border p-0.5 bg-parchment border-ink"
      >
        <div
          className={`h-full rounded xp-bar-fill xp-stripes transition-all ${TONES[tone].bar}`}
          style={{
            width: triggered ? `${value}%` : "0%",
            transition: triggered ? "width 1.2s cubic-bezier(0.4,0,0.2,1)" : "none",
          }}
        />
      </div>
    </div>
  );
}

