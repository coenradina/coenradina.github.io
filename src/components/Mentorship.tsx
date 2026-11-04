import { useState } from "react";
import AchievementBadge from "./ui/AchievementBadge";

interface MentorshipProps {
  onUnlockAchievement: (title: string, xp: number) => void;
}

const TESTIMONIALS = [
  {
    name: "Audrey Natasha Meyer",
    role: "Head of Marketing @ Generation Girl",
    context: "Worked with Astrid on a different team",
    quote:
      "She's not just an exceptional programmer but also a compassionate educator and a capable project manager.",
    highlights: ["Attention to detail", "Decision-making", "Problem-solving"],
  },
  {
    name: "Dennis Setiawan",
    role: "Lead Software Engineer @ GovTech Procurement",
    context: "Built BCAmobile together at BCA (Astrid on Android, Dennis on iOS)",
    quote:
      "She balances technical implementation with a strong sense of user experience, ensuring the final product is both functional and intuitive.",
    highlights: ["UI/UX sense", "Collaborative", "Solution-oriented"],
  },
  {
    name: "Syaravina Meilita",
    role: "Chief of Staff @ Generation Girl",
    context: "Senior to Astrid at Generation Girl",
    quote:
      "Beyond her role, Astrid consistently goes above and beyond by supporting not only her division but also assisting other teams whenever needed.",
    highlights: ["Agile", "Cross-team support", "Proactive"],
  },
  {
    name: "Dimas Prakoso",
    role: "Senior Mobile App Developer",
    context: "Senior to Astrid on the Android team at Female Daily Network",
    quote:
      "She can clearly express her ideas and creates a positive collaborative atmosphere in the team.",
    highlights: ["Clear communication", "Eager to learn"],
  },
  {
    name: "Azizah Putri Nur Aini",
    role: "UX Researcher @ Sekolah.mu",
    context: "Same team at Sekolah.mu",
    quote:
      "She also has good communication and collaboration skills, even when working remotely.",
    highlights: ["Dedication", "Remote collaboration"],
  },
];

const STATS = [
  { value: "Millions", label: "ASEAN Learners" },
  { value: "50+", label: "STEM Curriculums" },
  { value: "200+", label: "Mentors Trained" },
  { value: "+57%", label: "Mentor Retention" },
];

const SKILLS = [
  {
    icon: "⌨",
    label: "Full-stack & Mobile Engineering",
    detail: "Android in Kotlin at Female Daily and BCA. Full-stack web now.",
  },
  {
    icon: "◆",
    label: "STEM & AI Curriculum Architecture",
    detail: "70+ AI modules for AI Class ASEAN. 50+ curriculums at Generation Girl.",
  },
  {
    icon: "♥",
    label: "Mentorship & Educator Leadership",
    detail: "Runs a pool of 300+ volunteer mentors at Generation Girl.",
  },
  {
    icon: "▶",
    label: "Program & Product Delivery",
    detail: "Scrum delivery for Sekolah.mu, Karier.mu, and Talentics.",
  },
];

export default function Mentorship({ onUnlockAchievement }: MentorshipProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    onUnlockAchievement("Read another testimonial (+50 XP)", 50);
  };
  const next = () => {
    setCurrent((c) => (c + 1) % TESTIMONIALS.length);
    onUnlockAchievement("Read another testimonial (+50 XP)", 50);
  };

  const t = TESTIMONIALS[current];

  return (
    <section id="mentorship" className="py-28 px-4 sm:px-6 lg:px-8 border-t-2 border-slate-900" style={{ backgroundColor: "#EEE8D5" }}>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider text-brand-tosca"
            >
              // side_quest: educator_hub()
            </span>
            <AchievementBadge icon="🧭" label="Tech Mentor Mode: ACTIVE" />
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            I teach by making people <span className="text-brand-maroon underline decoration-amber-400 decoration-4">make things.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-700 font-sans leading-relaxed pt-1 font-medium italic">
            Lectures have their place. Day one is rarely it.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Left Column: Stats & Skill Matrix */}
          <div className="flex flex-col gap-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl p-6 border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0F172A]"
                >
                  <div
                    className="text-3xl sm:text-4xl font-bold text-slate-900 leading-none"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    {value}
                  </div>
                  <div className="mt-2 text-xs font-mono font-bold text-slate-700 uppercase tracking-tight">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Character Intro */}
            <div className="rounded-xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0F172A] overflow-hidden">
              <div className="flex items-center justify-between border-b-2 border-slate-900 px-5 py-3 bg-slate-900">
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                  ▸ Player 1
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-300">
                  Jakarta, ID
                </span>
              </div>

              <div className="p-6 sm:p-7 flex flex-col sm:flex-row gap-6">
                <img
                  src={`${import.meta.env.BASE_URL}avatar.png`}
                  alt="Pixel art portrait of Astrid"
                  className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] self-start"
                />
                <div className="space-y-2">
                  <h3
                    className="text-2xl font-bold text-slate-900 leading-none"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Astrid
                  </h3>
                  <p className="text-xs font-mono font-bold text-brand-tosca uppercase">
                    Class: Engineer / Educator
                  </p>
                  <p className="text-sm text-slate-700 font-sans leading-relaxed">
                    Writes code, designs curriculums, and keeps programs on schedule.
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-7 pb-7 space-y-3">
                <div className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider">
                  Skills
                </div>
                <ul className="space-y-3">
                  {SKILLS.map((s) => (
                    <li key={s.label} className="flex gap-3 items-start">
                      <span className="w-7 h-7 shrink-0 rounded border-2 border-slate-900 bg-amber-300 flex items-center justify-center text-xs font-bold text-slate-900">
                        {s.icon}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-mono font-bold text-slate-900">{s.label}</div>
                        <div className="text-xs text-slate-700 font-sans mt-0.5">{s.detail}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="p-5 rounded-xl border-2 border-slate-900 bg-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[4px_4px_0px_#0F172A]">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">🎓</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold font-mono text-slate-900">
                    PLANNING A WORKSHOP OR CURRICULUM?
                  </p>
                  <p className="text-xs text-slate-800 font-sans mt-0.5">
                    I work on STEM learning, EdTech strategy, and product delivery.
                  </p>
                </div>
              </div>
              <button
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-4 py-2 rounded border-2 border-slate-900 bg-brand-maroon text-white font-mono text-xs font-bold cyber-button cursor-pointer min-w-max self-start sm:self-center"
              >
                TELL ME ABOUT IT ↵
              </button>
            </div>
          </div>

          {/* Right Column: Testimonials & Feedback */}
          <div className="flex flex-col gap-6">
            <div
              className="rounded-xl p-8 sm:p-10 border-2 border-slate-900 bg-white shadow-[6px_6px_0px_#0F172A] flex flex-col justify-between lg:sticky lg:top-24"
              style={{ backgroundColor: "#EEE8D5" }}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                  <span className="text-xs font-mono font-bold text-brand-maroon uppercase">
                    // FROM PEOPLE I HAVE WORKED WITH
                  </span>
                  <a
                    href="https://www.linkedin.com/in/astridcoenrad/details/recommendations/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono font-bold text-slate-700 underline hover:text-brand-tosca"
                  >
                    via LinkedIn ↗
                  </a>
                </div>

                <p
                  className="text-base sm:text-xl leading-relaxed text-slate-900 font-sans font-medium"
                >
                  "{t.quote}"
                </p>

                <div className="flex flex-wrap gap-2">
                  {t.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded border border-slate-900 bg-white text-slate-800"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <div className="pt-5 border-t-2 border-slate-900 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-base text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {t.name}
                    </div>
                    <div
                      className="text-xs text-brand-tosca font-mono font-bold mt-0.5"
                    >
                      {t.role}
                    </div>
                    <div className="text-xs text-slate-600 font-sans mt-1">
                      {t.context}
                    </div>
                  </div>

                  {/* Swiper Controls */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={prev}
                      className="w-9 h-9 rounded border-2 border-slate-900 bg-white flex items-center justify-center font-mono font-bold hover:bg-amber-100 cyber-button cursor-pointer"
                    >
                      ←
                    </button>
                    <span className="text-xs font-mono font-bold text-slate-800 px-1">
                      {current + 1}/{TESTIMONIALS.length}
                    </span>
                    <button
                      onClick={next}
                      className="w-9 h-9 rounded border-2 border-slate-900 bg-white flex items-center justify-center font-mono font-bold hover:bg-amber-100 cyber-button cursor-pointer"
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
