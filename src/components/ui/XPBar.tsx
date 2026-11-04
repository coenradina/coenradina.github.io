import { useEffect, useRef, useState } from "react";

interface XPBarProps {
  label: string;
  value: number; // 0–100
  xp?: string;
  color?: string;
}

export default function XPBar({ label, value, xp, color = "#0D9488" }: XPBarProps) {
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
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "#0F172A" }}
        >
          {label}
        </span>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: "'VT323', monospace", color, fontSize: "16px" }}
        >
          {xp ?? `${value}% MAX`}
        </span>
      </div>
      <div 
        className="h-3 w-full rounded border p-0.5" 
        style={{ backgroundColor: "#EEE8D5", borderColor: "#0F172A" }}
      >
        <div
          className="h-full rounded-xs xp-bar-fill transition-all"
          style={{
            backgroundColor: color,
            width: triggered ? `${value}%` : "0%",
            transition: triggered ? "width 1.2s cubic-bezier(0.4,0,0.2,1)" : "none",
            backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)",
            backgroundSize: "16px 16px",
          }}
        />
      </div>
    </div>
  );
}

