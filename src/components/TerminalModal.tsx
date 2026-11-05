import { useState, useRef, useEffect } from "react";
import { startHack, summonPet } from "../eggs/events";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockAchievement: (title: string, xp: number) => void;
}

interface CommandLog {
  command: string;
  output: string | React.ReactNode;
}

export default function TerminalModal({ isOpen, onClose, onUnlockAchievement }: TerminalModalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([
    {
      command: "init",
      output: (
        <div className="space-y-1">
          <p className="text-tosca font-bold">// The terminal works. I checked.</p>
          <p className="text-ink-soft mt-1">
            Type <span className="text-amber font-bold">help</span> for the command list. <span className="text-maroon font-bold">sudo hire</span> also does something.
          </p>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let outputNode: React.ReactNode = "";

    switch (cmd) {
      case "help":
        outputNode = (
          <div className="space-y-1.5 type-body">
            <p className="text-ink font-bold">COMMANDS:</p>
            <p><span className="text-tosca font-mono font-bold">whoami</span> - A short introduction</p>
            <p><span className="text-tosca font-mono font-bold">skills</span> - What I work with</p>
            <p><span className="text-tosca font-mono font-bold">projects</span> - Selected projects</p>
            <p><span className="text-tosca font-mono font-bold">exp</span> - Work history</p>
            <p><span className="text-tosca font-mono font-bold">sudo hire</span> - A dramatic shortcut to the contact form</p>
            <p><span className="text-tosca font-mono font-bold">easteregg</span> - Exactly what it sounds like</p>
            <p><span className="text-tosca font-mono font-bold">clear</span> - Clear this window</p>
          </div>
        );
        break;

      case "whoami":
        outputNode = (
          <div className="type-body space-y-1.5">
            <p className="type-subheading text-maroon">Astrid</p>
            <p className="text-ink font-bold">Software engineer and tech mentor.</p>
            <p className="text-ink-soft">
              I code full stack and serve as Head of Education at Generation Girl. Engineering is the foundation; teaching is the part I love sharing.
            </p>
            <p className="text-ink-muted">// Magna Cum Laude CS Graduate from Bina Nusantara University (GPA 3.90)</p>
          </div>
        );
        break;

      case "skills":
        outputNode = (
          <div className="type-body space-y-1.5">
            <p className="text-amber font-bold">[SKILLS]</p>
            <p>💻 <span className="font-bold text-ink">Engineering:</span> Full-stack development, Kotlin, Clean Architecture, Java, Python, encryption, and biometrics</p>
            <p>🎓 <span className="font-bold text-ink">Education:</span> STEM curriculum design, mentor training, learning programs, and technical facilitation</p>
            <p>⚡ <span className="font-bold text-ink">Delivery:</span> Scrum, stakeholder alignment, QA, and ISO compliance</p>
          </div>
        );
        break;

      case "projects":
        outputNode = (
          <div className="type-body space-y-2">
            <p className="text-tosca font-bold">SELECTED PROJECTS:</p>
            <p>1. <span className="font-bold text-ink">AI Class ASEAN (@ Binar Academy)</span> - 70+ modules created for students, parents, educators, and master trainers across ASEAN.</p>
            <p>2. <span className="font-bold text-ink">Sekolah.mu & Karier.mu (@ Semesta Integrasi)</span> - Led Scrum product delivery for payment & recruitment modules.</p>
            <p>3. <span className="font-bold text-ink">Generation Girl STEM LMS (@ GenGirl)</span> - 50+ STEM curriculums, 200+ mentors trained, +57% retention boost.</p>
          </div>
        );
        break;

      case "exp":
        outputNode = (
          <div className="type-body space-y-1.5">
            <p><span className="text-maroon font-bold">2025-Present:</span> Technical Program Manager @ PT Semesta Integrasi Digital</p>
            <p><span className="text-maroon font-bold">2022-Present:</span> Head of Education @ Generation Girl</p>
            <p><span className="text-maroon font-bold">Feb-Jun 2023:</span> Lead Learning Experience Designer @ Binar Academy</p>
            <p><span className="text-maroon font-bold">2022-2023:</span> Android Developer @ Female Daily</p>
            <p><span className="text-maroon font-bold">2020-2022:</span> Software Engineer @ Bank Central Asia (BCA)</p>
          </div>
        );
        break;

      case "sudo hire":
        outputNode = (
          <div className="type-body p-4 rounded border border-tosca bg-tosca-tint space-y-1">
            <p className="text-tosca font-bold">ALL RIGHT. LET'S TALK.</p>
            <p className="text-ink-soft font-medium">Taking you to the contact form. The sudo was unnecessary.</p>
          </div>
        );
        onUnlockAchievement("Used sudo for networking (+500 XP)", 500);
        setTimeout(() => {
          onClose();
          document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
        }, 1200);
        break;

      case "easteregg":
        outputNode = (
          <div className="type-mono space-y-1">
            <p className="text-maroon font-bold">👾 Two secrets live here. I'll give you hints, not answers.</p>
            <p className="text-ink-soft">1. Something about sudo. Not the hiring one.</p>
            <p className="text-ink-soft">2. My portrait in the Mentorship section is clickable.</p>
          </div>
        );
        onUnlockAchievement("Asked nicely for secrets (+250 XP)", 250);
        break;

      case "sudo hack":
      case "hack":
        outputNode = (
          <p className="type-button text-tosca">
            {cmd === "hack" ? "Permission denied. Have you tried sudo?" : "Okay. You asked for it..."}
          </p>
        );
        if (cmd === "sudo hack") {
          setTimeout(() => {
            onClose();
            startHack("terminal");
          }, 700);
        }
        break;

      case "summon astrid":
      case "summon":
        outputNode = <p className="type-button text-tosca">Summoning pixel Astrid. Look down. 👇</p>;
        setTimeout(() => {
          onClose();
          summonPet();
        }, 600);
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      default:
        outputNode = (
          <p className="text-maroon type-mono">
            I don't know "{cmd}". Try <span className="underline font-bold">help</span>.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: input, output: outputNode }]);
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 sm:p-6 bg-ink/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-3xl h-[540px] rounded-lg border-2 border-ink overflow-hidden shadow-pixel-lg flex flex-col bg-cream"
      >
        {/* Terminal Header Bar */}
        <div 
          className="px-4 py-3 flex items-center justify-between border-b-2 border-ink select-none bg-parchment"
        >
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-maroon inline-block border border-ink" />
            <span className="w-3.5 h-3.5 rounded-full bg-amber inline-block border border-ink" />
            <span className="w-3.5 h-3.5 rounded-full bg-tosca inline-block border border-ink" />
            <span 
              className="ml-3 type-button text-ink-soft"
            >
              astrid@solarized-terminal:~
            </span>
          </div>

          <button
            onClick={onClose}
            className="type-label px-3 py-1 rounded border border-ink bg-maroon-tint text-maroon hover:bg-maroon-tint cursor-pointer"
          >
            [ESC / CLOSE]
          </button>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 p-6 type-mono overflow-y-auto space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              {item.command && (
                <div className="flex items-center gap-2 text-ink">
                  <span className="text-tosca font-bold">astrid@solarized:~$</span>
                  <span className="font-bold">{item.command}</span>
                </div>
              )}
              <div className="pl-4 border-l-2 border-tosca/40">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input */}
        <form 
          onSubmit={handleCommand}
          className="px-4 py-4 border-t-2 border-ink flex items-center gap-3 select-none bg-parchment"
        >
          <span className="text-tosca type-button">astrid@solarized:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type 'help' or 'sudo hire'..."
            className="flex-1 bg-transparent type-mono text-ink outline-none placeholder:text-ink-muted font-medium"
            autoFocus
          />
          <button 
            type="submit"
            className="px-4 py-1.5 bg-tosca text-white type-label rounded border-2 border-ink hover:bg-tosca-dark cyber-button cursor-pointer"
          >
            RUN ↵
          </button>
        </form>
      </div>
    </div>
  );
}
