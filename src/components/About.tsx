import { useState } from "react";
import AchievementBadge from "./ui/AchievementBadge";

interface AboutProps {
  onUnlockAchievement: (title: string, xp: number) => void;
}

const ROLES = [
  {
    icon: "💻",
    title: "Software Engineer",
    company: "Full-stack today · Android & banking systems before",
    tagline: "I still write production code. These days, I work across the stack.",
    color: "#B58900",
    bgColor: "#FEF3C7",
    borderColor: "#B58900",
    anecdote:
      "My engineering background runs from Kotlin and Clean Architecture at Female Daily to encryption and biometric verification at BCA. Full-stack work keeps the list growing.",
    achievement: "Full-stack · Kotlin · Clean Architecture · Security",
  },
  {
    icon: "🌟",
    title: "Head of Education",
    company: "Generation Girl (2022–Present)",
    tagline: "I lead education strategy, curricula, programs, and mentor development.",
    color: "#881337",
    bgColor: "#FFE4E6",
    borderColor: "#881337",
    anecdote:
      "I have managed more than 50 STEM curricula and trained over 200 mentors. We changed how mentors were prepared and supported; retention rose by 57%.",
    achievement: "50+ STEM Curriculums · 200+ Mentors · +57% Retention",
  },
  {
    icon: "🧭",
    title: "Technical Program Manager",
    company: "PT Semesta Integrasi Digital (2025–Present)",
    tagline: "I led delivery for payment and recruitment modules.",
    color: "#0F172A",
    bgColor: "#EEE8D5",
    borderColor: "#0F172A",
    anecdote:
      "Across Sekolah.mu, Karier.mu, and Talentics, I coordinated the work between engineering, product, and stakeholders. The tickets were usually the easy part.",
    achievement: "Sekolah.mu & Karier.mu · Payment & Recruitment",
  },
  {
    icon: "💡",
    title: "Lead LX Designer",
    company: "Binar Academy (Feb–Jun 2023)",
    tagline: "Seventy-plus AI modules for several very different kinds of learner.",
    color: "#0D9488",
    bgColor: "#CCFBF1",
    borderColor: "#0D9488",
    anecdote:
      "I led the team that made 70+ modules for students, parents, educators, and master trainers across ASEAN. The hard part was rarely the AI. It was finding an example that made sense to the person in front of us.",
    achievement: "Millions of Learners · 70+ Modules · ASEAN Reach",
  },
];

const BADGES = [
  { icon: "🎓", label: "Magna Cum Laude (GPA 3.90)" },
  { icon: "📜", label: "Google PM Specialization" },
  { icon: "🖥️", label: "Full-stack & Android Engineering" },
  { icon: "🧠", label: "UC Irvine Virtual Teacher" },
  { icon: "🚀", label: "Curriculum Design Across ASEAN" },
  { icon: "🔐", label: "BCA Biometric Security" },
];

export default function About({ onUnlockAchievement }: AboutProps) {
  const [flipped, setFlipped] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setFlipped(flipped === index ? null : index);
    onUnlockAchievement("Turned over a career card (+100 XP)", 100);
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
            The tabs kept <span className="text-brand-maroon underline decoration-amber-400 decoration-4">multiplying.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-700 font-sans leading-relaxed pt-1 font-medium">
            My engineering work grew from Android into full-stack development. Alongside it, I lead education at Generation Girl and mentor people in tech.
          </p>
        </div>

        {/* Career Grid */}
        <div data-perch="roles" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div data-perch="badges" className="p-7 sm:p-8 rounded-xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0F172A] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              🏆 QUALIFICATIONS, MILESTONES, OTHER USEFUL EVIDENCE
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
