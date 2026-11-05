interface PersonalProjectsProps {
  onUnlockAchievement: (title: string, xp: number) => void;
}

const BASE = import.meta.env.BASE_URL;

const PERSONAL_PROJECTS = [
  {
    title: "Kotakata",
    kind: "Learning Game",
    tagline: "stack blocks, train an AI",
    description: "A pixel-art block-coding game for learning machine learning terms, in Indonesian and English. Snap blocks together to collect data, train a small robot and test it, then watch its \"brain\" learn on a live plot. Each term gets explained the moment you run into it, and pop quizzes earn stars on your term cards.",
    tech: ["React", "TypeScript", "Blockly", "Phaser", "ML Literacy"],
    liveUrl: "https://aastr.id/kotakata/",
    repoUrl: "https://github.com/coenradina/kotakata",
    imgUrl: `${BASE}projects/kotakata.png`,
    featured: true,
  },
  {
    title: "ccode",
    kind: "Dev Tool",
    tagline: "no dress code, just code code",
    description: "A lightweight code editor that runs in the browser and can be embedded in other pages. Pick a language, write some code, press Run, read the output.",
    tech: ["Next.js 14", "TypeScript", "Ace Editor", "Radix UI"],
    liveUrl: "https://coenradina.github.io/ccode/",
    repoUrl: null,
    imgUrl: `${BASE}projects/ccode.png`,
  },
  {
    title: "openwhen4",
    kind: "Web App",
    tagline: "letters for later",
    description: "Open-when letters for friends. Write a letter for someone to open later, then show, hide, or edit it after it's sent. Friends, best friends, and partners each get their own icon, and becoming partners needs both people to agree.",
    tech: ["React", "TypeScript", "Firebase Auth", "Firestore"],
    liveUrl: "https://openwhen4.web.app",
    repoUrl: null,
    imgUrl: `${BASE}projects/openwhen.png`,
  },
  {
    title: "Pilah Sampah",
    kind: "Learning Game",
    tagline: "train an AI to sort trash",
    description: "A game in Bahasa Indonesia that shows kids how machine learning works. Label waste as organic, plastic, or metal, train the robot on your labels, then test whether it learned anything.",
    tech: ["React", "TypeScript", "Vite", "AI Literacy"],
    liveUrl: "https://coenradina.github.io/pilah-sampah/",
    repoUrl: "https://github.com/coenradina/pilah-sampah",
    imgUrl: `${BASE}projects/pilah-sampah.png`,
  },
  {
    title: "Prompt Analyzer",
    kind: "AI Tool",
    tagline: "is this prompt any good?",
    description: "Checks the quality of an AI prompt. Pick a formula (ROSES, PESAN, or SIP), write your prompt, and get feedback on what's missing. SIP has three parts and is where beginners start.",
    tech: ["JavaScript", "Vite", "Prompt Design", "ID / EN"],
    liveUrl: "https://coenradina.github.io/prompt-analyzer/",
    repoUrl: "https://github.com/coenradina/prompt-analyzer",
    imgUrl: `${BASE}projects/prompt-analyzer.png`,
  },
];

export default function PersonalProjects({ onUnlockAchievement }: PersonalProjectsProps) {
  const handleOpen = (title: string) => {
    onUnlockAchievement(`Tried ${title} (+100 XP)`, 100);
  };

  return (
    <section id="side-projects" className="py-28 px-4 sm:px-6 lg:px-8 border-t-2 border-ink bg-cream">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="type-eyebrow text-ink-soft">
            // side_projects.filter(built_for_fun)
          </div>
          <h2
            className="type-title text-ink"
          >
            Things I build <span className="text-maroon underline decoration-amber decoration-4">after hours.</span>
          </h2>
          <p className="type-subheading text-ink-soft pt-1 italic">
            Five personal projects. All of them are live, so you can click around.
          </p>
        </div>

        {/* Projects Grid */}
        <div data-perch="side" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PERSONAL_PROJECTS.map((project) => (
            <div
              key={project.title}
              className={`${"featured" in project ? "md:col-span-2" : ""} group rounded-lg border-2 border-ink bg-white shadow-pixel hover:translate-y-[-4px] hover:shadow-pixel-lg transition-all flex flex-col overflow-hidden`}
            >
              {/* Thumbnail */}
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleOpen(project.title)}
                className={`relative block ${"featured" in project ? "h-56 md:h-80" : "h-56"} overflow-hidden border-b-2 border-ink bg-parchment`}
              >
                <img
                  src={project.imgUrl}
                  alt={`Screenshot of ${project.title}`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 type-micro px-3 py-1 rounded border border-ink text-white bg-ink/90 shadow-pixel-sm">
                  {project.kind}
                </span>
                <span className="absolute bottom-3 right-3 type-micro px-3 py-1 rounded border border-ink bg-amber text-ink">
                  {project.tagline}
                </span>
              </a>

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

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleOpen(project.title)}
                      className="px-4 py-2 rounded border-2 border-ink bg-tosca hover:bg-tosca-dark text-white type-label cyber-button"
                    >
                      OPEN LIVE ↗
                    </a>
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded border-2 border-ink bg-white hover:bg-amber-tint text-ink type-label cyber-button"
                      >
                        SOURCE {"</>"}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
