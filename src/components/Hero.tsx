import { useEffect, useState } from "react";
import AchievementBadge from "./ui/AchievementBadge";
import { onHackPhase } from "../eggs/events";

interface HeroProps {
  onUnlockAchievement: (title: string, xp: number) => void;
  onOpenTerminal: () => void;
}

const TABS = [
  {
    id: "AstridProfile.ts",
    lang: "TypeScript",
    dot: "text-tosca",
    code: `// Astrid: Software Engineer & Tech Mentor

export const Profile = {
  name: "Astrid",
  currentWork: [
    "full-stack software engineering",
    "Head of Education at Generation Girl"
  ],
  education: "Bina Nusantara University (CS Honors, Magna Cum Laude, GPA 3.90)",
  specializations: [
    "Google Project Management Specialization",
    "UC Irvine Virtual Teacher Specialization"
  ],
  stillCodes: true,
};`,
  },
  {
    id: "AI_Class_ASEAN.kt",
    lang: "Kotlin",
    dot: "text-maroon",
    code: `// Binar Academy: AI Class ASEAN Initiative
// Lead Learning Experience Designer

fun deployASEANCurriculum() {
  // leading curriculum team to create 70+ modules 
  // for students, parents, educators and master trainers 
  // for millions of learners across ASEAN
}`,
  },
  {
    id: "GenerationGirl.py",
    lang: "Python",
    dot: "text-gold",
    code: `# Generation Girl STEM Empowerment
# Head of Education

class GenGirlImpact:
    def __init__(self):
        # improving mentor retention by 57%
        # trained 200+ mentors
        # managed 50+ curriculums across programs
        pass`,
  },
  {
    id: "SemestaIntegrasi.go",
    lang: "Go",
    dot: "text-ink",
    code: `// PT Semesta Integrasi Digital
// Technical Program Manager

package semestaintegrasi

func DeliverPlatforms() {
    // led scrum delivery for payment & recruitment module
    // Sekolah.mu, Karier.mu & Talentics
}`,
  },
];

const BUILD_WORDS = ["apps.", "curriculums."];
const HACKED_WORDS = ["bugs."];

function Typewriter({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [length, setLength] = useState(words[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 3000);
      return () => clearInterval(id);
    }
    const word = words[wordIndex];
    let delay = deleting ? 45 : 95;
    if (!deleting && length === word.length) delay = 1800;
    if (deleting && length === 0) delay = 350;

    const id = setTimeout(() => {
      if (!deleting && length === word.length) {
        setDeleting(true);
      } else if (deleting && length === 0) {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      } else {
        setLength((n) => n + (deleting ? -1 : 1));
      }
    }, delay);
    return () => clearTimeout(id);
  }, [words, wordIndex, length, deleting]);

  const word = words[wordIndex];
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shown = reduced ? word : word.slice(0, length);

  return (
    <span className="whitespace-nowrap">
      <span className="sr-only">{words.join(" ")}</span>
      <span aria-hidden="true" className={wordIndex % 2 === 0 ? "text-tosca" : "text-maroon"}>
        {shown}
      </span>
      <span aria-hidden="true" className="cursor-blink inline-block w-[0.08em] h-[0.9em] ml-1 align-baseline bg-ink" />
    </span>
  );
}

export default function Hero({ onUnlockAchievement, onOpenTerminal }: HeroProps) {
  const [activeTab, setActiveTab] = useState(0);
  // During the fake breach, the headline briefly claims I build bugs.
  const [hacked, setHacked] = useState(false);
  useEffect(() => onHackPhase((phase) => setHacked(phase === "breach")), []);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<string | null>(null);

  const handleRunCode = () => {
    setIsExecuting(true);
    setExecutionLog("Running it. This button is mostly decorative, by the way.");
    setTimeout(() => {
      setExecutionLog(
        `[OK] It works. A suspiciously rare and pleasant result.`
      );
      setIsExecuting(false);
      onUnlockAchievement("Pressed the tempting button (+150 XP)", 150);
    }, 900);
  };

  const handleScrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const currentTab = TABS[activeTab];

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center solarized-grid overflow-hidden bg-cream"
    >
      {/* Subtle ambient accent glow */}
      <div 
        className="absolute top-24 right-12 w-80 h-80 rounded-full pointer-events-none opacity-15 blur-3xl bg-tosca"
      />
      <div 
        className="absolute bottom-12 left-12 w-96 h-96 rounded-full pointer-events-none opacity-10 blur-3xl bg-amber"
      />

      <div className="relative z-raised max-w-5xl mx-auto w-full space-y-10">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded border-2 border-ink bg-amber type-label text-ink shadow-pixel-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-tosca animate-pulse" />
            CURRENTLY: FULL-STACK + GENERATION GIRL
          </div>

          <AchievementBadge
            icon="⚡"
            label="I hid a terminal in here [~]"
            onClick={onOpenTerminal}
          />
        </div>

        {/* Main Headline & Intro */}
        <div className="space-y-4 max-w-4xl">
          <h1
            className="type-display text-ink"
          >
            I build <Typewriter key={hacked ? "hacked" : "normal"} words={hacked ? HACKED_WORDS : BUILD_WORDS} />
          </h1>
          <p className="max-w-2xl type-lead text-ink-soft pt-1">
            <strong className="text-ink underline decoration-amber decoration-4">Astrid</strong> here. TLDR; i code and teach. if you ever need a software engineer, tech mentor or program manager (or all three), you are in the right place.
          </p>
        </div>

        {/* Solarized Code Editor Box */}
        <div data-perch="hero" 
          className="rounded-lg border-2 border-ink shadow-pixel-lg overflow-hidden bg-parchment"
        >
          {/* Editor Tabs Bar */}
          <div 
            className="flex items-center justify-between border-b-2 border-ink px-4 py-3 overflow-x-auto bg-cream"
          >
            <div className="flex items-center gap-2 min-w-max">
              {TABS.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(idx);
                    setExecutionLog(null);
                  }}
                  className={`px-4 py-1.5 rounded-t type-label transition-all border border-b-0 cursor-pointer ${activeTab === idx ? "bg-parchment text-ink border-ink -mb-3 pb-3 z-raised shadow-pixel-sm"
                      : "bg-parchment/80 text-ink-soft border-transparent hover:bg-parchment"
                  }`}
                >
                  <span className={`mr-2 ${tab.dot}`}>●</span>
                  {tab.id}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 type-micro text-ink-muted ml-4">
              <span>SOLARIZED LIGHT v2.4</span>
            </div>
          </div>

          {/* Code Window */}
          <div className="p-6 type-mono overflow-x-auto text-ink bg-parchment">
            <pre className="whitespace-pre">
              <code>{currentTab.code}</code>
            </pre>
          </div>

          {/* Interactive Console Footer Bar */}
          <div 
            className="px-4 py-3 border-t-2 border-ink flex flex-wrap items-center justify-between gap-3 type-mono bg-cream"
          >
            <div className="flex items-center gap-2 text-ink-soft">
              <span className="text-tosca font-bold">➜</span>
              <span className="font-bold">{executionLog || `Selected: ${currentTab.id} [${currentTab.lang}]`}</span>
            </div>

            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="px-4 py-2 rounded border-2 border-ink bg-tosca hover:bg-tosca-dark text-white font-mono font-bold cyber-button cursor-pointer flex items-center gap-2"
            >
              {isExecuting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>RUNNING...</span>
                </>
              ) : (
                <>
                  <span>▶ EXECUTE CODE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CTA & Metrics Section */}
        <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-8">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleScrollTo("#projects")}
              className="px-6 py-4 rounded border-2 border-ink bg-maroon hover:bg-maroon-dark text-white type-label cyber-button cursor-pointer"
            >
              SEE THE WORK ➔
            </button>
            <button
              onClick={() => handleScrollTo("#contact")}
              className="px-6 py-4 rounded border-2 border-ink bg-white hover:bg-amber-tint text-ink type-label cyber-button cursor-pointer"
            >
              WRITE TO ME ✉
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Engineering", val: "Full-stack" },
              { label: "Education Home", val: "GenGirl" },
              { label: "Based In", val: "Jakarta" },
              { label: "Binus CS GPA", val: "3.90" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border-2 border-ink bg-white text-center shadow-pixel-sm"
              >
                <div 
                  className="type-pixel text-ink"
                >
                  {item.val}
                </div>
                <div className="type-eyebrow text-ink-muted mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
