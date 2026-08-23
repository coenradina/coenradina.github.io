interface AchievementBadgeProps {
  icon: string;
  label: string;
  unlocked?: boolean;
  onClick?: () => void;
}

export default function AchievementBadge({ icon, label, unlocked = true, onClick }: AchievementBadgeProps) {
  return (
    <div
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold transition-all duration-200 hover:scale-105 select-none cursor-pointer"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        borderColor: unlocked ? "#0D9488" : "#CBD5E1",
        color: unlocked ? "#0F172A" : "#64748B",
        backgroundColor: unlocked ? "#EEE8D5" : "#F1F5F9",
        boxShadow: unlocked ? "2px 2px 0px #0F172A" : "none",
        opacity: unlocked ? 1 : 0.6,
      }}
    >
      <span className="text-sm">{icon}</span>
      <span className="tracking-tight">{label}</span>
    </div>
  );
}

