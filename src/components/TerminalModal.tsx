import { useState, useRef, useEffect } from "react";

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
          <p className="text-brand-tosca font-bold">// Welcome to Astrid's Cyber Terminal v2.4 (Solarized Light Edition)</p>
          <p className="text-slate-700 mt-1">
            Type <span className="text-brand-yellow font-bold">help</span> for commands, or <span className="text-brand-maroon font-bold">sudo hire</span> for instant recruitment protocol.
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
          <div className="space-y-1.5 text-xs sm:text-sm">
            <p className="text-slate-900 font-bold">AVAILABLE COMMANDS:</p>
            <p><span className="text-brand-tosca font-mono font-bold">whoami</span> - Display Astrid's core profile & bio</p>
            <p><span className="text-brand-tosca font-mono font-bold">skills</span> - List technical, Agile & curriculum competencies</p>
            <p><span className="text-brand-tosca font-mono font-bold">projects</span> - View flagship achievements (AI Class ASEAN, GG LMS)</p>
            <p><span className="text-brand-tosca font-mono font-bold">exp</span> - Inspect career trajectory (PT Semesta, GenGirl, Binar, BCA)</p>
            <p><span className="text-brand-tosca font-mono font-bold">sudo hire</span> - Trigger instant recruitment mission sequence</p>
            <p><span className="text-brand-tosca font-mono font-bold">easteregg</span> - Secret command for curious developers</p>
            <p><span className="text-brand-tosca font-mono font-bold">clear</span> - Wipe terminal output buffer</p>
          </div>
        );
        break;

      case "whoami":
        outputNode = (
          <div className="text-xs sm:text-sm leading-relaxed space-y-1.5">
            <p className="font-bold text-brand-maroon text-base">Astrid</p>
            <p className="text-slate-900 font-semibold">Tech educator, TPM & Software Engineer.</p>
            <p className="text-slate-700">
              I still code, just now I can also teach people to code (or solve your code if you're too busy).
            </p>
            <p className="text-slate-500">// Magna Cum Laude CS Graduate from Bina Nusantara University (GPA 3.90)</p>
          </div>
        );
        break;

      case "skills":
        outputNode = (
          <div className="text-xs sm:text-sm space-y-1.5 leading-relaxed">
            <p className="text-brand-yellow font-bold">[SKILL MATRIX]</p>
            <p>⚡ <span className="font-bold text-slate-900">Agile & TPM:</span> Scrum Delivery (Payment & Recruitment), Stakeholder Alignment, QA, ISO Compliance</p>
            <p>🎓 <span className="font-bold text-slate-900">EdTech & Curriculum:</span> 70+ AI Class Modules (Millions across ASEAN), 50+ STEM Curriculums, 200+ Mentors Trained</p>
            <p>💻 <span className="font-bold text-slate-900">Engineering:</span> Kotlin, Clean Architecture, Java, Python, Security Encryption & Biometrics</p>
          </div>
        );
        break;

      case "projects":
        outputNode = (
          <div className="text-xs sm:text-sm space-y-2 leading-relaxed">
            <p className="text-brand-tosca font-bold">🚀 FLAGSHIP PROJECTS (kinda proud tbh):</p>
            <p>1. <span className="font-bold text-slate-900">AI Class ASEAN (@ Binar Academy)</span> - 70+ modules created for students, parents, educators, and master trainers across ASEAN.</p>
            <p>2. <span className="font-bold text-slate-900">Sekolah.mu & Karier.mu (@ Semesta Integrasi)</span> - Led Scrum product delivery for payment & recruitment modules.</p>
            <p>3. <span className="font-bold text-slate-900">Generation Girl STEM LMS (@ GenGirl)</span> - 50+ STEM curriculums, 200+ mentors trained, +57% retention boost.</p>
          </div>
        );
        break;

      case "exp":
        outputNode = (
          <div className="text-xs sm:text-sm space-y-1.5 leading-relaxed">
            <p><span className="text-brand-maroon font-bold">2025-Present:</span> Technical Program Manager @ PT Semesta Integrasi Digital</p>
            <p><span className="text-brand-maroon font-bold">2023-Present:</span> Education Project Manager @ Generation Girl</p>
            <p><span className="text-brand-maroon font-bold">Feb-Jun 2023:</span> Lead Learning Experience Designer @ Binar Academy</p>
            <p><span className="text-brand-maroon font-bold">2022-2023:</span> Android Developer @ Female Daily</p>
            <p><span className="text-brand-maroon font-bold">2020-2022:</span> Software Engineer @ Bank Central Asia (BCA)</p>
          </div>
        );
        break;

      case "sudo hire":
        outputNode = (
          <div className="text-xs sm:text-sm p-3.5 rounded border border-brand-tosca bg-teal-50 space-y-1">
            <p className="text-brand-tosca font-bold">🎉 RECRUITMENT PROTOCOL INITIATED!</p>
            <p className="text-slate-800 font-medium">Permission granted. Scrolling down to mission contact terminal...</p>
          </div>
        );
        onUnlockAchievement("Cyber Terminal Hacking Master", 500);
        setTimeout(() => {
          onClose();
          document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
        }, 1200);
        break;

      case "easteregg":
        outputNode = (
          <div className="text-xs sm:text-sm text-brand-maroon font-mono font-bold">
            👾 "Compilers don't judge, but students notice when coffee runs out." — Astrid
          </div>
        );
        onUnlockAchievement("Discovered the Secret Coffee Loop", 250);
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      default:
        outputNode = (
          <p className="text-brand-maroon font-mono text-xs sm:text-sm">
            Command not recognized: "{cmd}". Type <span className="underline font-bold">help</span> for available commands.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: input, output: outputNode }]);
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-3xl rounded-xl border-2 border-slate-900 overflow-hidden shadow-2xl flex flex-col"
        style={{ backgroundColor: "#FDF6E3", height: "540px" }}
      >
        {/* Terminal Header Bar */}
        <div 
          className="px-4 py-3 flex items-center justify-between border-b-2 border-slate-900 select-none"
          style={{ backgroundColor: "#EEE8D5" }}
        >
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-600 inline-block border border-slate-900" />
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block border border-slate-900" />
            <span className="w-3.5 h-3.5 rounded-full bg-teal-600 inline-block border border-slate-900" />
            <span 
              className="ml-3 text-xs sm:text-sm font-bold font-mono tracking-tight text-slate-800"
            >
              astrid@solarized-terminal:~
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-mono font-bold px-2.5 py-1 rounded border border-slate-900 bg-rose-100 text-rose-900 hover:bg-rose-200 cursor-pointer"
          >
            [ESC / CLOSE]
          </button>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 p-5 font-mono text-xs sm:text-sm overflow-y-auto space-y-4 leading-relaxed">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              {item.command && (
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="text-brand-tosca font-bold">astrid@solarized:~$</span>
                  <span className="font-bold">{item.command}</span>
                </div>
              )}
              <div className="pl-4 border-l-2 border-teal-600/40">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input */}
        <form 
          onSubmit={handleCommand}
          className="px-4 py-3.5 border-t-2 border-slate-900 flex items-center gap-2.5 select-none"
          style={{ backgroundColor: "#EEE8D5" }}
        >
          <span className="text-brand-tosca font-mono font-bold text-xs sm:text-sm">astrid@solarized:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type 'help' or 'sudo hire'..."
            className="flex-1 bg-transparent font-mono text-xs sm:text-sm text-slate-900 font-medium outline-none placeholder:text-slate-500"
            autoFocus
          />
          <button 
            type="submit"
            className="px-4 py-1.5 bg-brand-tosca text-white font-mono text-xs font-bold rounded border-2 border-slate-900 hover:bg-teal-700 cyber-button cursor-pointer"
          >
            RUN ↵
          </button>
        </form>
      </div>
    </div>
  );
}

