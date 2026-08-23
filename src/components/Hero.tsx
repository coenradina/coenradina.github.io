import { useState } from "react";
import AchievementBadge from "./ui/AchievementBadge";

interface HeroProps {
  onUnlockAchievement: (title: string, xp: number) => void;
  onOpenTerminal: () => void;
}

const TABS = [
  {
    id: "AstridProfile.ts",
    lang: "TypeScript",
    color: "#0D9488",
    code: `// Maria Astrid Coenradina Saffachrissa
// Technical Program Manager & Tech Educator

export const Astrid: DeveloperProfile = {
  education: {
    university: "Bina Nusantara University",
    degree: "Bachelor of Computer Science (Honors)",
    honors: "Magna Cum Laude (GPA 3.90 / 4.00)",
  },
  specializations: [
    "Project Management Specialization (Google)",
    "Virtual Teacher Specialization (UC Irvine)"
  ],
  status: "Available for High-Impact TPM & EdTech Missions",
  coffeeToCodeRatio: 0.98,
};`,
  },
  {
    id: "AI_Class_ASEAN.kt",
    lang: "Kotlin",
    color: "#881337",
    code: `// Binar Academy — AI Class ASEAN Initiative
// Lead Learning Experience Designer

fun deployASEANCurriculum(): ImpactMetrics {
  val modules = generateModules(count = 71)
  val partners = trainImplementationPartners(count = 20)
  
  return ImpactMetrics(
    beneficiariesReached = 350_000,
    completionRateBoost = "High Engagement",
    region = "ASEAN"
  )
}`,
  },
  {
    id: "GenerationGirl.py",
    lang: "Python",
    color: "#B58900",
    code: `# Generation Girl STEM Empowerment
# Education Project Manager & Curriculum Advisor

class GenGirlImpact:
    def __init__(self):
        self.projects_managed = 30
        self.mentor_pool = 100
        self.learners_in_lms = 5000

    def calculate_retention_boost(self):
        mentor_retention += 0.57 # 57% increase!
        satisfaction_score += 0.30 # 30% increase
        return "STEM Ecosystem Flourishing ✨"`,
  },
  {
    id: "SemestaIntegrasi.go",
    lang: "Go",
    color: "#0F172A",
    code: `// PT Semesta Integrasi Digital
// Technical Program Manager

package semestaintegrasi

import "fmt"

func DeliverSchoolAndHRTechSolutions() {
    platforms := []string{"Sekolah.mu", "Karier.mu", "Talentics"}
    
    fmt.Println("Coordinating Scrum delivery, ISO compliance & RAID management...")
    // Seamless cross-functional execution!
}`,
  },
];

export default function Hero({ onUnlockAchievement, onOpenTerminal }: HeroProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<string | null>(null);

  const handleRunCode = () => {
    setIsExecuting(true);
    setExecutionLog("Compiling solarized code module...");
    setTimeout(() => {
      setExecutionLog(
        `[SUCCESS] 0 errors, 0 warnings. Result: "350k+ ASEAN beneficiaries & 30+ STEM projects active!"`
      );
      setIsExecuting(false);
      onUnlockAchievement("Code Execution Master (+150 XP)", 150);
    }, 900);
  };

  const handleScrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const currentTab = TABS[activeTab];

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 flex flex-col justify-center solarized-grid overflow-hidden"
      style={{ backgroundColor: "#FDF6E3" }}
    >
      {/* Background cyber accent shapes */}
      <div 
        className="absolute top-20 right-10 w-72 h-72 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ backgroundColor: "#0D9488" }}
      />
      <div 
        className="absolute bottom-10 left-10 w-80 h-80 rounded-full pointer-events-none opacity-15 blur-3xl"
        style={{ backgroundColor: "#E5A93C" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border-2 border-slate-900 bg-amber-300 font-mono text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0F172A]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            STATUS: ACTIVE & BUILDING IN EDTECH / TPM
          </div>

          <AchievementBadge
            icon="⚡"
            label="Click for Interactive CLI [~]"
            onClick={onOpenTerminal}
          />
        </div>

        {/* Main Headline */}
        <div className="mb-8">
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Witty execution.
            <br />
            <span className="text-brand-tosca">Tech leadership.</span>{" "}
            <span className="text-brand-maroon">Impactful learning.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-700 font-sans leading-relaxed">
            Hi, I'm <strong className="text-slate-900 underline decoration-amber-400 decoration-4">Maria Astrid Coenradina</strong>. 
            Technical Program Manager & Tech Educator blending Kotlin/Clean Architecture engineering precision with scalable STEM & AI curriculum design.
          </p>
        </div>

        {/* Solarized Light Code Editor Window */}
        <div 
          className="rounded-lg border-2 border-slate-900 shadow-[6px_6px_0px_#0F172A] overflow-hidden mb-10"
          style={{ backgroundColor: "#EEE8D5" }}
        >
          {/* Editor Header / Tabs */}
          <div 
            className="flex items-center justify-between border-b-2 border-slate-900 px-3 py-2 overflow-x-auto"
            style={{ backgroundColor: "#FDF6E3" }}
          >
            <div className="flex items-center gap-1.5 min-w-max">
              {TABS.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(idx);
                    setExecutionLog(null);
                  }}
                  className={`px-3 py-1.5 rounded-t text-xs font-mono font-bold transition-all border border-b-0 cursor-pointer ${
                    activeTab === idx
                      ? "bg-[#EEE8D5] text-slate-900 border-slate-900 -mb-2.5 pb-2.5 z-10"
                      : "bg-slate-200/70 text-slate-600 border-transparent hover:bg-slate-200"
                  }`}
                >
                  <span className="mr-1.5" style={{ color: tab.color }}>●</span>
                  {tab.id}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-600 font-bold ml-4">
              <span>SOLARIZED LIGHT v2.4</span>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-4 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-900" style={{ backgroundColor: "#EEE8D5" }}>
            <pre className="whitespace-pre">
              <code>{currentTab.code}</code>
            </pre>
          </div>

          {/* Interactive Run Console Bar */}
          <div 
            className="px-4 py-2.5 border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
            style={{ backgroundColor: "#FDF6E3" }}
          >
            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-brand-tosca font-bold">➜</span>
              <span>{executionLog || `Selected: ${currentTab.id} [${currentTab.lang}]`}</span>
            </div>

            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="px-3.5 py-1.5 rounded border-2 border-slate-900 bg-teal-600 hover:bg-teal-700 text-white font-mono font-bold cyber-button cursor-pointer flex items-center gap-1.5"
            >
              {isExecuting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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

        {/* CTA & Stats Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleScrollTo("#projects")}
              className="px-6 py-3 rounded border-2 border-slate-900 bg-brand-maroon hover:bg-rose-900 text-white font-mono text-xs font-bold cyber-button cursor-pointer"
            >
              VIEW PROJECTS & IMPACT ➔
            </button>
            <button
              onClick={() => handleScrollTo("#contact")}
              className="px-6 py-3 rounded border-2 border-slate-900 bg-white hover:bg-amber-100 text-slate-900 font-mono text-xs font-bold cyber-button cursor-pointer"
            >
              INITIATE CONTACT ✉
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "ASEAN Learners", val: "350K+" },
              { label: "STEM Projects", val: "30+" },
              { label: "Mentors Trained", val: "100+" },
              { label: "Binus CS GPA", val: "3.90" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded border-2 border-slate-900 bg-white text-center shadow-[2px_2px_0px_#0F172A]"
              >
                <div 
                  className="text-lg sm:text-xl font-bold text-slate-900 leading-none"
                  style={{ fontFamily: "'VT323', monospace" }}
                >
                  {item.val}
                </div>
                <div className="text-[10px] font-mono font-semibold text-slate-600 mt-1 uppercase">
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

