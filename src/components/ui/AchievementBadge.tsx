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
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded border type-label transition-all duration-200 hover:scale-105 select-none cursor-pointer ${unlocked ? "border-tosca bg-parchment text-ink shadow-pixel-sm" : "border-parchment bg-parchment text-ink-muted opacity-60"
      }`}
    >
      <span className="type-body">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

