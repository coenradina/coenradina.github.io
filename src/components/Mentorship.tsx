import { useState } from "react";
import AchievementBadge from "./ui/AchievementBadge";
import { summonPet } from "../eggs/events";

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
    <section id="mentorship" className="py-28 px-4 sm:px-6 lg:px-8 border-t-2 border-ink bg-parchment">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="type-eyebrow text-tosca"
            >
              // side_quest: educator_hub()
            </span>
            <AchievementBadge icon="🧭" label="Tech Mentor Mode: ACTIVE" />
          </div>
          <h2
            className="type-title text-ink"
          >
            I teach by making people <span className="text-maroon underline decoration-amber decoration-4">make things.</span>
          </h2>
          <p className="type-lead text-ink-soft pt-1 italic">
            Lectures have their place. Day one is rarely it.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Left Column: Stats & Skill Matrix */}
          <div className="flex flex-col gap-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-lg p-6 border-2 border-ink bg-white shadow-pixel"
                >
                  <div
                    className="type-pixel-lg text-ink"
                  >
                    {value}
                  </div>
                  <div className="mt-2 type-eyebrow text-ink-soft">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Character Intro */}
            <div data-perch="character" className="rounded-lg border-2 border-ink bg-white shadow-pixel overflow-hidden">
              <div className="flex items-center justify-between border-b-2 border-ink px-6 py-3 bg-ink">
                <span className="type-eyebrow text-amber">
                  ▸ Player 1
                </span>
                <span className="type-micro text-parchment">
                  Jakarta, ID
                </span>
              </div>

              <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                <button
                  type="button"
                  onClick={() => {
                    summonPet();
                    onUnlockAchievement("Summoned pixel Astrid (+150 XP)", 150);
                  }}
                  title="Psst. Click me."
                  aria-label="Summon pixel Astrid onto the page"
                  className="shrink-0 self-start cursor-pointer rounded-lg transition-transform hover:-rotate-3 hover:scale-105"
                >
                  <img
                  src={`${import.meta.env.BASE_URL}avatar.png`}
                  alt="Pixel art portrait of Astrid"
                  className="block w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-lg border-2 border-ink shadow-pixel-sm self-start"
                />
                </button>
                <div className="space-y-2">
                  <h3
                    className="type-heading text-ink"
                  >
                    Astrid
                  </h3>
                  <p className="type-eyebrow text-tosca">
                    Class: Engineer / Educator
                  </p>
                  <p className="type-body text-ink-soft">
                    Writes code, designs curriculums, and keeps programs on schedule.
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-8 space-y-3">
                <div className="type-eyebrow text-ink-muted">
                  Skills
                </div>
                <ul className="space-y-3">
                  {SKILLS.map((s) => (
                    <li key={s.label} className="flex gap-3 items-start">
                      <span className="w-7 h-7 shrink-0 rounded border-2 border-ink bg-amber flex items-center justify-center type-label text-ink">
                        {s.icon}
                      </span>
                      <div>
                        <div className="type-button text-ink">{s.label}</div>
                        <div className="type-caption text-ink-soft mt-0.5">{s.detail}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="p-6 rounded-lg border-2 border-ink bg-amber-tint flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-pixel">
              <div className="flex items-center gap-4">
                <span className="text-icon-lg">🎓</span>
                <div>
                  <p className="type-button text-ink">
                    PLANNING A WORKSHOP OR CURRICULUM?
                  </p>
                  <p className="type-caption text-ink-soft mt-0.5">
                    I work on STEM learning, EdTech strategy, and product delivery.
                  </p>
                </div>
              </div>
              <button
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-4 py-2 rounded border-2 border-ink bg-maroon text-white type-label cyber-button cursor-pointer min-w-max self-start sm:self-center"
              >
                TELL ME ABOUT IT ↵
              </button>
            </div>
          </div>

          {/* Right Column: Testimonials & Feedback */}
          <div className="flex flex-col gap-6">
            <div data-perch="quotes"
              className="rounded-lg p-8 sm:p-10 border-2 border-ink shadow-pixel-lg flex flex-col justify-between lg:sticky lg:top-24 bg-parchment"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b-2 border-ink pb-4">
                  <span className="type-eyebrow text-maroon">
                    // FROM PEOPLE I HAVE WORKED WITH
                  </span>
                  <a
                    href="https://www.linkedin.com/in/astridcoenrad/details/recommendations/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-micro text-ink-soft underline hover:text-tosca"
                  >
                    via LinkedIn ↗
                  </a>
                </div>

                <p
                  className="type-lead text-ink"
                >
                  "{t.quote}"
                </p>

                <div className="flex flex-wrap gap-2">
                  {t.highlights.map((h) => (
                    <span
                      key={h}
                      className="type-micro px-3 py-0.5 rounded border border-ink bg-white text-ink-soft"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <div className="pt-6 border-t-2 border-ink flex items-center justify-between gap-4">
                  <div>
                    <div className="type-subheading text-ink">
                      {t.name}
                    </div>
                    <div
                      className="type-label text-tosca mt-0.5"
                    >
                      {t.role}
                    </div>
                    <div className="type-caption text-ink-muted mt-1">
                      {t.context}
                    </div>
                  </div>

                  {/* Swiper Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={prev}
                      className="w-9 h-9 rounded border-2 border-ink bg-white flex items-center justify-center font-mono font-bold hover:bg-amber-tint cyber-button cursor-pointer"
                    >
                      ←
                    </button>
                    <span className="type-label text-ink-soft px-1">
                      {current + 1}/{TESTIMONIALS.length}
                    </span>
                    <button
                      onClick={next}
                      className="w-9 h-9 rounded border-2 border-ink bg-white flex items-center justify-center font-mono font-bold hover:bg-amber-tint cyber-button cursor-pointer"
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
