import { useState } from "react";
import XPBar from "./ui/XPBar";

type Category = "All" | "Product & EdTech" | "STEM & AI" | "Software & Mobile";

interface ProjectsProps {
  onUnlockAchievement: (title: string, xp: number) => void;
}

const PROJECTS = [
  {
    title: "AI Class ASEAN",
    category: "STEM & AI" as Category,
    company: "Binar Academy",
    description: "Led the curriculum team for 70+ AI modules used by students, parents, educators, and master trainers across ASEAN. One explanation did not fit all. We tried several.",
    tech: ["70+ AI Modules", "20+ Regional Partners", "ASEAN Reach"],
    xpLabel: "Beneficiaries",
    xpValue: 98,
    xp: "Millions of Learners",
    color: "#0D9488",
    bg: "#CCFBF1",
    imgUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=350&fit=crop&auto=format",
  },
  {
    title: "Sekolah.mu & Karier.mu Platform Delivery",
    category: "Product & EdTech" as Category,
    company: "PT Semesta Integrasi Digital",
    description: "Led Scrum delivery for payment and recruitment modules across Sekolah.mu, Karier.mu, and Talentics. Much of the work happened between the tickets.",
    tech: ["Payment Modules", "Recruitment Modules", "Scrum Delivery", "ISO Compliance"],
    xpLabel: "Scrum Delivery Metric",
    xpValue: 95,
    xp: "Payment & Recruitment",
    color: "#0F172A",
    bg: "#EEE8D5",
    imgUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=350&fit=crop&auto=format",
  },
  {
    title: "Generation Girl STEM LMS & Mentor System",
    category: "STEM & AI" as Category,
    company: "Generation Girl",
    description: "Managed 50+ STEM curricula and trained 200+ mentors. Mentor retention improved by 57% after we changed how mentors were prepared and supported.",
    tech: ["50+ Curriculums", "200+ Mentors", "LMS Architecture", "Data Tools"],
    xpLabel: "Mentor Retention Boost",
    xpValue: 92,
    xp: "+57% Retention",
    color: "#881337",
    bg: "#FFE4E6",
    imgUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=350&fit=crop&auto=format",
  },
  {
    title: "Generation Girl Mentor Community",
    category: "STEM & AI" as Category,
    company: "Generation Girl",
    description: "Manage the mentor pool at Generation Girl: 300+ volunteer mentors teaching across 50+ curriculums, reaching 20,000+ learners. Most of the job is matching the right mentor to the right class, then making sure they want to come back.",
    tech: ["300+ Mentors", "50+ Curriculums", "20,000+ Learners", "Community Ops"],
    xpLabel: "Learners Reached",
    xpValue: 94,
    xp: "20,000+ Learners",
    color: "#0D9488",
    bg: "#CCFBF1",
    imgUrl: `${import.meta.env.BASE_URL}projects/gengirl-mentors.webp`,
  },
  {
    title: "Female Daily Community Android App",
    category: "Software & Mobile" as Category,
    company: "Female Daily",
    description: "Built Android features in Kotlin for Female Daily's community app. Clean Architecture was useful. So was remembering that real people tap buttons in strange orders.",
    tech: ["Kotlin", "Clean Architecture", "Android SDK", "REST APIs"],
    xpLabel: "App Stability",
    xpValue: 90,
    xp: "99.9% Crash Free",
    color: "#B58900",
    bg: "#FEF3C7",
    imgUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=350&fit=crop&auto=format",
  },
  {
    title: "BCA Data Encryption & Biometric Security",
    category: "Software & Mobile" as Category,
    company: "Bank Central Asia (BCA)",
    description: "Worked on data encryption and biometric verification at BCA. Banking software has a useful way of discouraging improvisation.",
    xpLabel: "Security Rating",
    tech: ["Data Encryption", "Biometric Verification", "Banking Security", "Clean Code"],
    xpValue: 96,
    xp: "Banking Grade Shield",
    color: "#0F172A",
    bg: "#E2E8F0",
    imgUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=350&fit=crop&auto=format",
  },
];

const CATEGORIES: Category[] = ["All", "Product & EdTech", "STEM & AI", "Software & Mobile"];

export default function Projects({ onUnlockAchievement }: ProjectsProps) {
  const [active, setActive] = useState<Category>("All");
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

  const filtered = active === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === active);

  const handleCardClick = (project: typeof PROJECTS[0]) => {
    setSelectedProject(project);
    onUnlockAchievement(`Looked closer at ${project.title} (+100 XP)`, 100);
  };

  return (
    <section id="projects" className="py-28 px-4 sm:px-6 lg:px-8 border-t-2 border-slate-900" style={{ backgroundColor: "#EEE8D5" }}>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div
              className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700"
            >
              // projects[].filter(real_impact)
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              A few things <span className="text-brand-tosca underline decoration-amber-400 decoration-4">I've worked on.</span>
            </h2>
            <p className="text-base text-slate-700 font-sans leading-relaxed pt-1 font-semibold italic">
              Six projects I can explain without opening a pitch deck.
            </p>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded text-xs font-mono font-bold border-2 transition-all cyber-button cursor-pointer ${
                  active === cat
                    ? "bg-brand-tosca text-white border-slate-900"
                    : "bg-white text-slate-900 border-slate-900 hover:bg-amber-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <div
              key={project.title}
              onClick={() => handleCardClick(project)}
              className="group cursor-pointer rounded-xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0F172A] hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_#0F172A] transition-all flex flex-col overflow-hidden"
            >
              {/* Thumbnail Container */}
              <div className="relative h-48 overflow-hidden border-b-2 border-slate-900 bg-slate-100">
                <img
                  src={project.imgUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className="absolute top-3 left-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded border border-slate-900 text-white bg-slate-900/90 shadow-xs"
                >
                  {project.category}
                </span>

                <span
                  className="absolute bottom-3 right-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded border border-slate-900 bg-amber-300 text-slate-900"
                >
                  {project.company}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 gap-5">
                <div className="space-y-2">
                  <h3
                    className="text-lg font-bold text-slate-900 leading-snug group-hover:text-brand-tosca transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans pt-1">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded border border-slate-900 bg-slate-100 text-slate-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <XPBar
                    label={project.xpLabel}
                    value={project.xpValue}
                    xp={project.xp}
                    color={project.color}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Inspector Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded-xl border-2 border-slate-900 bg-white p-7 sm:p-8 shadow-2xl space-y-5" style={{ backgroundColor: "#FDF6E3" }}>
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-brand-maroon uppercase">
                    // A CLOSER LOOK
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-3 py-1.5 rounded border border-slate-900 bg-rose-100 text-rose-900 font-mono text-xs font-bold hover:bg-rose-200 cursor-pointer"
                >
                  CLOSE [X]
                </button>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
                {selectedProject.description}
              </p>

              <div className="p-4 rounded-lg border border-slate-900 bg-[#EEE8D5] space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-bold text-slate-800">
                  <span>ORGANIZATION:</span>
                  <span className="text-brand-tosca">{selectedProject.company}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-bold text-slate-800">
                  <span>RESULT:</span>
                  <span className="text-brand-maroon">{selectedProject.xp}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 bg-brand-tosca text-white font-mono text-xs font-bold rounded border-2 border-slate-900 cyber-button cursor-pointer"
                >
                  BACK TO PROJECTS ↵
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
