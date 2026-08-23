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
        <div>
          <p className="text-brand-tosca font-bold">// Welcome to Astrid's Cyber Terminal v2.4 (Solarized Edition)</p>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Type <span className="text-brand-yellow font-semibold">help</span> to see available commands or <span className="text-brand-maroon font-semibold">sudo hire</span> to trigger immediate recruitment protocol.
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
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="text-slate-800 font-bold">AVAILABLE COMMANDS:</p>
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
          <div className="text-xs sm:text-sm leading-relaxed space-y-1">
            <p className="font-bold text-brand-maroon">Maria Astrid Coenradina Saffachrissa</p>
            <p className="text-slate-700">Technical Program Manager & Tech Educator | ex-Software Engineer & Android Dev</p>
            <p className="text-slate-500">// Magna Cum Laude CS Graduate from Bina Nusantara University (GPA 3.90)</p>
            <p className="text-slate-500">// Bridging tech execution, scalable EdTech curricula, and empowerment in STEM.</p>
          </div>
        );
        break;

      case "skills":
        outputNode = (
          <div className="text-xs sm:text-sm space-y-1">
            <p className="text-brand-yellow font-bold">[SKILL MATRIX]</p>
            <p>⚡ <span className="font-bold">Agile & TPM:</span> Scrum Delivery, RAID Management, Stakeholder Alignment, QA, ISO Compliance</p>
            <p>🎓 <span className="font-bold">EdTech & Curriculum:</span> Self-Paced AI Class (350k+ users), GG LMS Modernization, STEM Mentorship</p>
            <p>💻 <span className="font-bold">Engineering:</span> Kotlin, Clean Architecture, Java, Python, Security Encryption & Biometrics</p>
          </div>
        );
        break;

      case "projects":
        outputNode = (
          <div className="text-xs sm:text-sm space-y-1.5">
            <p className="text-brand-tosca font-bold">🚀 FLAGSHIP PROJECTS:</p>
            <p>1. <span className="font-bold text-brand-navy">AI Class ASEAN (@ Binar Academy)</span> - 71 self-paced modules, 350,000+ beneficiaries across ASEAN.</p>
            <p>2. <span className="font-bold text-brand-navy">Sekolah.mu & Karier.mu (@ Semesta Integrasi)</span> - Led Scrum product delivery for school & HR solutions.</p>
            <p>3. <span className="font-bold text-brand-navy">Generation Girl STEM LMS (@ GenGirl)</span> - 30+ STEM projects, 100+ mentors, 57% mentor retention boost.</p>
          </div>
        );
        break;

      case "exp":
        outputNode = (
          <div className="text-xs sm:text-sm space-y-1">
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
          <div className="text-xs sm:text-sm p-3 rounded border border-brand-tosca bg-teal-50 space-y-1">
            <p className="text-brand-tosca font-bold">🎉 RECRUITMENT PROTOCOL INITIATED!</p>
            <p className="text-slate-700">Permission granted. Scrolling down to mission contact terminal...</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-3xl rounded-lg border-2 border-slate-900 overflow-hidden shadow-2xl flex flex-col"
        style={{ backgroundColor: "#FDF6E3", height: "520px" }}
      >
        {/* Terminal Header Bar */}
        <div 
          className="px-4 py-2.5 flex items-center justify-between border-b-2 border-slate-900 select-none"
          style={{ backgroundColor: "#EEE8D5" }}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 inline-block border border-slate-900" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-slate-900" />
            <span className="w-3 h-3 rounded-full bg-teal-600 inline-block border border-slate-900" />
            <span 
              className="ml-3 text-xs font-bold font-mono tracking-tight text-slate-800"
            >
              astrid@solarized-terminal:~
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-slate-900 bg-rose-100 text-rose-800 hover:bg-rose-200 transition-colors"
          >
            [ESC / CLOSE]
          </button>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 p-4 font-mono text-xs sm:text-sm overflow-y-auto space-y-3">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.command && (
                <div className="flex items-center gap-2 text-slate-800">
                  <span className="text-brand-tosca font-bold">astrid@solarized:~$</span>
                  <span className="font-semibold">{item.command}</span>
                </div>
              )}
              <div className="pl-4 border-l-2 border-teal-600/30">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input */}
        <form 
          onSubmit={handleCommand}
          className="px-4 py-3 border-t-2 border-slate-900 flex items-center gap-2 select-none"
          style={{ backgroundColor: "#EEE8D5" }}
        >
          <span className="text-brand-tosca font-mono font-bold text-xs sm:text-sm">astrid@solarized:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type 'help' or 'sudo hire'..."
            className="flex-1 bg-transparent font-mono text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400"
            autoFocus
          />
          <button 
            type="submit"
            className="px-3 py-1 bg-brand-tosca text-white font-mono text-xs font-bold rounded border border-slate-900 hover:bg-teal-700 transition-colors"
          >
            RUN ↵
          </button>
        </form>
      </div>
    </div>
  );
}
