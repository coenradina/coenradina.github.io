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
    tone: "tosca" as const,
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
    tone: "ink" as const,
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
    tone: "maroon" as const,
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
    tone: "tosca" as const,
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
    tone: "gold" as const,
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
    tone: "ink" as const,
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
    <section id="projects" className="py-28 px-4 sm:px-6 lg:px-8 border-t-2 border-ink bg-parchment">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div
              className="type-eyebrow text-ink-soft"
            >
              // projects[].filter(real_impact)
            </div>
            <h2
              className="type-title text-ink"
            >
              A few things <span className="text-tosca underline decoration-amber decoration-4">I've worked on.</span>
            </h2>
            <p className="type-subheading text-ink-soft pt-1 italic">
              Six projects I can explain without opening a pitch deck.
            </p>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded type-label border-2 transition-all cyber-button cursor-pointer ${active === cat ? "bg-tosca text-white border-ink"
                    : "bg-white text-ink border-ink hover:bg-amber-tint"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div data-perch="work" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <div
              key={project.title}
              onClick={() => handleCardClick(project)}
              className="group cursor-pointer rounded-lg border-2 border-ink bg-white shadow-pixel hover:translate-y-[-4px] hover:shadow-pixel-lg transition-all flex flex-col overflow-hidden"
            >
              {/* Thumbnail Container */}
              <div className="relative h-48 overflow-hidden border-b-2 border-ink bg-parchment">
                <img
                  src={project.imgUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className="absolute top-3 left-3 type-micro px-3 py-1 rounded border border-ink text-white bg-ink/90 shadow-pixel-sm"
                >
                  {project.category}
                </span>

                <span
                  className="absolute bottom-3 right-3 type-micro px-3 py-1 rounded border border-ink bg-amber text-ink"
                >
                  {project.company}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 gap-6">
                <div className="space-y-2">
                  <h3
                    className="type-subheading text-ink group-hover:text-tosca transition-colors"
                  >
                    {project.title}
                  </h3>
                  <p className="type-body text-ink-soft pt-1">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="type-micro px-3 py-0.5 rounded border border-ink bg-parchment text-ink-soft"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <XPBar
                    label={project.xpLabel}
                    value={project.xpValue}
                    xp={project.xp}
                    tone={project.tone}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Inspector Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded-lg border-2 border-ink p-8 shadow-pixel-lg space-y-6 bg-cream">
              <div className="flex items-center justify-between border-b-2 border-ink pb-4">
                <div>
                  <span className="type-eyebrow text-maroon">
                    // A CLOSER LOOK
                  </span>
                  <h3 className="type-heading text-ink mt-0.5">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-3 py-1.5 rounded border border-ink bg-maroon-tint text-maroon type-label hover:bg-maroon-tint cursor-pointer"
                >
                  CLOSE [X]
                </button>
              </div>

              <p className="type-body text-ink-soft">
                {selectedProject.description}
              </p>

              <div className="p-4 rounded-lg border border-ink bg-parchment space-y-3">
                <div className="flex items-center justify-between type-button text-ink-soft">
                  <span>ORGANIZATION:</span>
                  <span className="text-tosca">{selectedProject.company}</span>
                </div>
                <div className="flex items-center justify-between type-button text-ink-soft">
                  <span>RESULT:</span>
                  <span className="text-maroon">{selectedProject.xp}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-3 bg-tosca text-white type-label rounded border-2 border-ink cyber-button cursor-pointer"
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
