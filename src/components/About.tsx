import { useState } from "react";
import AchievementBadge from "./ui/AchievementBadge";

interface AboutProps {
  onUnlockAchievement: (title: string, xp: number) => void;
}

const ROLES = [
  {
    icon: "🧭",
    title: "Technical Program Manager",
    company: "PT Semesta Integrasi Digital (2025–Present)",
    tagline: "Steering Scrum product delivery for Sekolah.mu, Karier.mu & Talentics.",
    color: "#0F172A",
    bgColor: "#EEE8D5",
    borderColor: "#0F172A",
    anecdote:
      "Coordinated cross-functional Scrum execution across school solution & HR Tech teams. Balanced backlog prioritization with RAID management, ISO compliance, and security risk mitigation.",
    achievement: "Sekolah.mu & Karier.mu · Agile Delivery · ISO Compliance",
  },
  {
    icon: "🌟",
    title: "Education PM & Advisor",
    company: "Generation Girl (2022–Present)",
    tagline: "Empowering young women in STEM & scaling learning operations.",
    color: "#881337",
    bgColor: "#FFE4E6",
    borderColor: "#881337",
    anecdote:
      "Managed 30+ STEM education projects, trained 100+ mentors, improved mentor retention by 57%, and modernized the LMS platform for 5,000+ active learners.",
    achievement: "30+ STEM Projects · 100+ Mentors · +57% Retention Boost",
  },
  {
    icon: "💡",
    title: "Lead LX Designer",
    company: "Binar Academy (Feb–Jun 2023)",
    tagline: "Designing self-paced AI curriculum for 350,000+ ASEAN learners.",
    color: "#0D9488",
    bgColor: "#CCFBF1",
    borderColor: "#0D9488",
    anecdote:
      "Created 71 self-paced AI learning modules for AI Class ASEAN. Coordinated cross-functional video production & trained 20+ regional implementation partners.",
    achievement: "350,000+ Beneficiaries · 71 AI Modules · ASEAN Reach",
  },
  {
    icon: "📱",
    title: "Android Dev & Software Eng",
    company: "Female Daily & BCA (2020–2023)",
    tagline: "Kotlin Clean Architecture & banking data security encryption.",
    color: "#B58900",
    bgColor: "#FEF3C7",
    borderColor: "#B58900",
    anecdote:
      "Shipped Kotlin mobile features with Clean Architecture at Female Daily, and engineered data encryption layers & biometric auth systems at Bank Central Asia.",
    achievement: "Kotlin Clean Arch · Banking Security · Biometric Verification",
  },
];

const BADGES = [
  { icon: "🎓", label: "Magna Cum Laude (GPA 3.90)" },
  { icon: "🏆", label: "350,000+ ASEAN AI Students" },
  { icon: "📜", label: "Google PM Specialization" },
  { icon: "👩‍💻", label: "UC Irvine Virtual Teacher" },
  { icon: "🚀", label: "30+ STEM Projects" },
  { icon: "🔐", label: "BCA Biometric Security" },
];

export default function About({ onUnlockAchievement }: AboutProps) {
  const [flipped, setFlipped] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setFlipped(flipped === index ? null : index);
    onUnlockAchievement("Career Log Explorer (+100 XP)", 100);
  };

  return (
    <section id="about" className="py-24 px-4 sm:px-6 relative border-t-2 border-slate-900" style={{ backgroundColor: "#FDF6E3" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <div
            className="text-xs font-mono font-bold mb-2 uppercase tracking-wider text-brand-tosca"
          >
            // git log --graph --oneline --decorated
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            From code to strategy: <span className="text-brand-maroon underline decoration-amber-400 decoration-4">The career trajectory</span>
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-700 font-sans leading-relaxed">
            I don't just write code or manage backlogs — I engineer learning ecosystems and deliver high-stakes tech products. Click any card to inspect the commit log.
          </p>
        </div>

        {/* Career Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {ROLES.map((role, i) => (
            <div
              key={role.title}
              className="flip-card min-h-[300px] cursor-pointer"
              onClick={() => handleCardClick(i)}
            >
              <div className={`flip-card-inner w-full h-full${flipped === i ? " is-flipped" : ""}`}>
                {/* Front Side */}
                <div
                  className="flip-card-front w-full h-full rounded-lg p-6 flex flex-col justify-between border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A]"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{role.icon}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-900 bg-amber-300">
                        INSPECT ↵
                      </span>
                    </div>
                    <h3
                      className="text-lg font-bold text-slate-900 leading-snug"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {role.title}
                    </h3>
                    <p className="text-xs font-mono font-semibold text-brand-tosca mt-1">
                      {role.company}
                    </p>
                    <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                      {role.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono font-bold text-slate-500">
                    <span>STATUS: MERGED</span>
                    <span className="text-brand-maroon">Flip card →</span>
                  </div>
                </div>

                {/* Back Side */}
                <div
                  className="flip-card-back rounded-lg p-6 flex flex-col justify-between border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A]"
                  style={{ backgroundColor: role.bgColor }}
                >
                  <div>
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-2 px-2 py-0.5 rounded border border-slate-900 w-max bg-white"
                      style={{ color: role.color }}
                    >
                      Commit Log Detail
                    </span>
                    <p className="text-xs text-slate-900 font-sans leading-relaxed font-medium">
                      "{role.anecdote}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900/20">
                    <p
                      className="text-[11px] font-mono font-bold text-slate-900"
                      style={{ color: role.color }}
                    >
                      ⚡ {role.achievement}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements Unlocked section */}
        <div className="p-6 rounded-lg border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0F172A]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              🏆 ACCREDITATIONS & ACHIEVEMENTS UNLOCKED
            </p>
            <span className="text-xs font-mono font-bold text-brand-tosca">
              +1,200 XP TOTAL
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {BADGES.map((badge) => (
              <AchievementBadge
                key={badge.label}
                icon={badge.icon}
                label={badge.label}
                onClick={() => onUnlockAchievement(`Badge Inspected: ${badge.label}`, 50)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

