import { useState } from "react";
import AchievementBadge from "./ui/AchievementBadge";
import XPBar from "./ui/XPBar";

interface MentorshipProps {
  onUnlockAchievement: (title: string, xp: number) => void;
}

const TESTIMONIALS = [
  {
    name: "Generation Girl Mentorship Lead",
    role: "STEM Program Partner",
    quote:
      "Astrid revamped our entire mentor training system and modernized our LMS for 5,000+ learners. Mentor retention shot up by 57% within a single cohort. Her curriculum design is unmatched.",
    rating: 5,
  },
  {
    name: "AI Class ASEAN Participant",
    role: "Regional Learner @ Binar Academy",
    quote:
      "The self-paced AI modules created by Astrid made complex machine learning concepts accessible and exciting. Going from zero AI knowledge to building my first model in 4 weeks was unbelievable.",
    rating: 5,
  },
  {
    name: "EdTech Engineering Lead",
    role: "Collaborator @ Semesta Integrasi Digital",
    quote:
      "Working with Astrid on Sekolah.mu and Karier.mu product delivery made Scrum execution smooth. She manages RAID logs and cross-functional teams with crisp clarity and high energy.",
    rating: 5,
  },
];

const STATS = [
  { value: "350K+", label: "ASEAN AI Learners" },
  { value: "30+", label: "STEM Projects" },
  { value: "100+", label: "Mentors Trained" },
  { value: "+57%", label: "Mentor Retention" },
];

const SKILLS = [
  { label: "Agile Scrum & Product Delivery", value: 98, xp: "4,900 XP" },
  { label: "STEM & AI Curriculum Architecture", value: 96, xp: "4,800 XP" },
  { label: "Mentorship & Educator Leadership", value: 95, xp: "4,750 XP" },
  { label: "Kotlin Clean Architecture & Engineering", value: 90, xp: "4,500 XP" },
];

export default function Mentorship({ onUnlockAchievement }: MentorshipProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    onUnlockAchievement("Testimonial Swiper (+50 XP)", 50);
  };
  const next = () => {
    setCurrent((c) => (c + 1) % TESTIMONIALS.length);
    onUnlockAchievement("Testimonial Swiper (+50 XP)", 50);
  };

  const t = TESTIMONIALS[current];

  return (
    <section id="mentorship" className="py-24 px-4 sm:px-6 border-t-2 border-slate-900" style={{ backgroundColor: "#FDF6E3" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider text-brand-tosca"
            >
              // side_quest: educator_hub()
            </span>
            <AchievementBadge icon="🧭" label="Tech Educator & TPM Mode: ACTIVE" />
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Empowering teams & <span className="text-brand-maroon underline decoration-amber-400 decoration-4">scaling education</span>
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-700 font-sans leading-relaxed">
            Whether designing self-paced AI courses for 350k+ ASEAN beneficiaries or mentoring STEM leaders, I build engaging learning experiences that produce tangible growth.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Stats & Skill Matrix */}
          <div className="flex flex-col gap-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-lg p-5 border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0F172A]"
                >
                  <div
                    className="text-3xl font-bold text-slate-900"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    {value}
                  </div>
                  <div className="mt-1 text-xs font-mono font-semibold text-slate-700 uppercase">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Skill XP Matrix */}
            <div
              className="rounded-lg p-6 border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0F172A] flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3
                  className="text-base font-bold text-slate-900"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Competency XP Matrix
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-900 bg-amber-300">
                  LVL 24 MAX
                </span>
              </div>

              {SKILLS.map((s) => (
                <XPBar key={s.label} label={s.label} value={s.value} xp={s.xp} color="#0D9488" />
              ))}
            </div>

            {/* Quick Action Banner */}
            <div className="p-4 rounded-lg border-2 border-slate-900 bg-amber-200 flex items-center justify-between shadow-[4px_4px_0px_#0F172A]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <div>
                  <p className="text-xs font-bold font-mono text-slate-900">
                    WANT A TECH WORKSHOP OR CURRICULUM COLLAB?
                  </p>
                  <p className="text-[11px] text-slate-700">
                    Open for STEM talks, EdTech strategy & Agile TPM consulting.
                  </p>
                </div>
              </div>
              <button
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-3 py-1.5 rounded border border-slate-900 bg-brand-maroon text-white font-mono text-xs font-bold cyber-button cursor-pointer min-w-max ml-2"
              >
                SEND SIGNAL ↵
              </button>
            </div>
          </div>

          {/* Right Column: Testimonials & Feedback */}
          <div className="flex flex-col gap-6">
            <div
              className="rounded-lg p-6 sm:p-8 border-2 border-slate-900 bg-white shadow-[6px_6px_0px_#0F172A] flex-1 flex flex-col justify-between"
              style={{ backgroundColor: "#EEE8D5" }}
            >
              <div>
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
                  <span className="text-xs font-mono font-bold text-brand-maroon uppercase">
                    // TESTIMONIAL FEEDBACK LOG #{current + 1}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-amber-500 text-sm">★</span>
                    ))}
                  </div>
                </div>

                <p
                  className="text-base sm:text-lg leading-relaxed text-slate-900 font-sans font-medium mb-6"
                >
                  "{t.quote}"
                </p>
              </div>

              <div>
                <div className="pt-4 border-t-2 border-slate-900 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {t.name}
                    </div>
                    <div
                      className="text-xs text-brand-tosca font-mono font-semibold"
                    >
                      {t.role}
                    </div>
                  </div>

                  {/* Swiper Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prev}
                      className="w-8 h-8 rounded border-2 border-slate-900 bg-white flex items-center justify-center font-mono font-bold hover:bg-amber-100 cyber-button cursor-pointer"
                    >
                      ←
                    </button>
                    <span className="text-xs font-mono font-bold text-slate-700 px-1">
                      {current + 1}/{TESTIMONIALS.length}
                    </span>
                    <button
                      onClick={next}
                      className="w-8 h-8 rounded border-2 border-slate-900 bg-white flex items-center justify-center font-mono font-bold hover:bg-amber-100 cyber-button cursor-pointer"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

