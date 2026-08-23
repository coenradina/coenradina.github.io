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
    tagline: "Led Scrum product delivery for payment & recruitment modules.",
    color: "#0F172A",
    bgColor: "#EEE8D5",
    borderColor: "#0F172A",
    anecdote:
      "Coordinated Scrum execution for payment & recruitment modules across Sekolah.mu, Karier.mu & Talentics platforms while keeping stakeholders aligned.",
    achievement: "Sekolah.mu & Karier.mu · Payment & Recruitment Scrum",
  },
  {
    icon: "🌟",
    title: "Education PM & Advisor",
    company: "Generation Girl (2022–Present)",
    tagline: "Managed 50+ STEM curriculums & trained 200+ mentors.",
    color: "#881337",
    bgColor: "#FFE4E6",
    borderColor: "#881337",
    anecdote:
      "Managed 50+ STEM curriculums across programs, trained 200+ mentors, and improved mentor retention by 57% through empathetic program leadership.",
    achievement: "50+ STEM Curriculums · 200+ Mentors · +57% Retention",
  },
  {
    icon: "💡",
    title: "Lead LX Designer",
    company: "Binar Academy (Feb–Jun 2023)",
    tagline: "Leading curriculum team to create 70+ modules for millions across ASEAN.",
    color: "#0D9488",
    bgColor: "#CCFBF1",
    borderColor: "#0D9488",
    anecdote:
      "Led curriculum team to deliver 70+ modules for students, parents, educators, and master trainers for millions of learners across ASEAN.",
    achievement: "Millions of Learners · 70+ Modules · ASEAN Reach",
  },
  {
    icon: "📱",
    title: "Android Dev & Software Eng",
    company: "Female Daily & BCA (2020–2023)",
    tagline: "Kotlin Clean Architecture & banking data security.",
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
  { icon: "🏆", label: "Millions of ASEAN Learners" },
  { icon: "📜", label: "Google PM Specialization" },
  { icon: "👩‍💻", label: "200+ Mentors Trained" },
  { icon: "🚀", label: "50+ STEM Curriculums" },
  { icon: "🔐", label: "BCA Biometric Security" },
];

export default function About({ onUnlockAchievement }: AboutProps) {
  const [flipped, setFlipped] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setFlipped(flipped === index ? null : index);
    onUnlockAchievement("Career Log Explorer (+100 XP)", 100);
  };

  return (
    <section id="about" className="py-28 px-4 sm:px-6 lg:px-8 relative border-t-2 border-slate-900" style={{ backgroundColor: "#FDF6E3" }}>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-3 max-w-3xl">
          <div
            className="text-xs font-mono font-bold uppercase tracking-wider text-brand-tosca"
          >
            // git log --graph --oneline
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            From Android code to <span className="text-brand-maroon underline decoration-amber-400 decoration-4">program strategy</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-700 font-sans leading-relaxed pt-1 font-medium">
            Shifted from moving between Activity and Fragment to making STEM curriculums more accessible.
          </p>
        </div>

        {/* Career Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLES.map((role, i) => (
            <div
              key={role.title}
              className="flip-card min-h-[320px] cursor-pointer"
              onClick={() => handleCardClick(i)}
            >
              <div className={`flip-card-inner w-full h-full${flipped === i ? " is-flipped" : ""}`}>
                {/* Front Side */}
                <div
                  className="flip-card-front w-full h-full rounded-xl p-7 flex flex-col justify-between border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A]"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl sm:text-4xl">{role.icon}</span>
                      <span className="text-[11px] font-mono font-bold px-2 py-1 rounded border border-slate-900 bg-amber-300">
                        INSPECT ↵
                      </span>
                    </div>
                    <h3
                      className="text-lg font-bold text-slate-900 leading-snug"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {role.title}
                    </h3>
                    <p className="text-xs font-mono font-bold text-brand-tosca mt-1.5">
                      {role.company}
                    </p>
                    <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                      {role.tagline}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono font-bold text-slate-600">
                    <span>MERGED</span>
                    <span className="text-brand-maroon">Flip card →</span>
                  </div>
                </div>

                {/* Back Side */}
                <div
                  className="flip-card-back rounded-xl p-7 flex flex-col justify-between border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A]"
                  style={{ backgroundColor: role.bgColor }}
                >
                  <div>
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-3 px-2 py-1 rounded border border-slate-900 w-max bg-white"
                      style={{ color: role.color }}
                    >
                      Commit Log Detail
                    </span>
                    <p className="text-xs sm:text-sm text-slate-900 font-sans leading-relaxed font-medium">
                      "{role.anecdote}"
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-900/20">
                    <p
                      className="text-xs font-mono font-bold text-slate-900"
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
        <div className="p-7 sm:p-8 rounded-xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0F172A] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              🏆 ACCREDITATIONS & ACHIEVEMENTS UNLOCKED
            </p>
            <span className="text-xs font-mono font-bold text-brand-tosca">
              +1,200 XP TOTAL
            </span>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
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



