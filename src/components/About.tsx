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
    text: "text-gold",
    surface: "bg-amber-tint",
    anecdote:
      "My engineering background runs from Kotlin and Clean Architecture at Female Daily to encryption and biometric verification at BCA. Full-stack work keeps the list growing.",
    achievement: "Full-stack · Kotlin · Clean Architecture · Security",
  },
  {
    icon: "🌟",
    title: "Head of Education",
    company: "Generation Girl (2022–Present)",
    tagline: "I lead education strategy, curricula, programs, and mentor development.",
    text: "text-maroon",
    surface: "bg-maroon-tint",
    anecdote:
      "I have managed more than 50 STEM curricula and trained over 200 mentors. We changed how mentors were prepared and supported; retention rose by 57%.",
    achievement: "50+ STEM Curriculums · 200+ Mentors · +57% Retention",
  },
  {
    icon: "🧭",
    title: "Technical Program Manager",
    company: "PT Semesta Integrasi Digital (2025–Present)",
    tagline: "I led delivery for payment and recruitment modules.",
    text: "text-ink",
    surface: "bg-parchment",
    anecdote:
      "Across Sekolah.mu, Karier.mu, and Talentics, I coordinated the work between engineering, product, and stakeholders. The tickets were usually the easy part.",
    achievement: "Sekolah.mu & Karier.mu · Payment & Recruitment",
  },
  {
    icon: "💡",
    title: "Lead LX Designer",
    company: "Binar Academy (Feb–Jun 2023)",
    tagline: "Seventy-plus AI modules for several very different kinds of learner.",
    text: "text-tosca",
    surface: "bg-tosca-tint",
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
    <section id="about" className="py-28 px-4 sm:px-6 lg:px-8 relative border-t-2 border-ink bg-cream">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-3 max-w-3xl">
          <div
            className="type-eyebrow text-tosca"
          >
            // git log --graph --oneline
          </div>
          <h2
            className="type-title text-ink"
          >
            The tabs kept <span className="text-maroon underline decoration-amber decoration-4">multiplying.</span>
          </h2>
          <p className="type-lead text-ink-soft pt-1">
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
                  className="flip-card-front w-full h-full rounded-lg p-8 flex flex-col justify-between border-2 border-ink shadow-pixel bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-icon-lg">{role.icon}</span>
                      <span className="type-micro px-2 py-1 rounded border border-ink bg-amber">
                        INSPECT ↵
                      </span>
                    </div>
                    <h3
                      className="type-subheading text-ink"
                    >
                      {role.title}
                    </h3>
                    <p className="type-label text-tosca mt-1.5">
                      {role.company}
                    </p>
                    <p className="mt-3 type-body text-ink-muted">
                      {role.tagline}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-parchment flex items-center justify-between type-micro text-ink-muted">
                    <span>MERGED</span>
                    <span className="text-maroon">Flip card →</span>
                  </div>
                </div>

                {/* Back Side */}
                <div
                  className={`flip-card-back rounded-lg p-8 flex flex-col justify-between border-2 border-ink shadow-pixel ${role.surface}`}
                >
                  <div>
                    <span
                      className={`type-eyebrow block mb-3 px-2 py-1 rounded border border-ink w-max bg-white ${role.text}`}
                    >
                      Commit Log Detail
                    </span>
                    <p className="type-body text-ink font-medium">
                      "{role.anecdote}"
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-ink/20">
                    <p
                      className={`type-label ${role.text}`}
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
        <div data-perch="badges" className="p-8 rounded-lg border-2 border-ink bg-white shadow-pixel space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="type-eyebrow text-ink">
              🏆 QUALIFICATIONS, MILESTONES, OTHER USEFUL EVIDENCE
            </p>
            <span className="type-label text-tosca">
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
