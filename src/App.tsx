import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import PersonalProjects from "./components/PersonalProjects";
import Mentorship from "./components/Mentorship";
import Contact from "./components/Contact";
import TerminalModal from "./components/TerminalModal";
import HackSequence from "./eggs/HackSequence";
import PixelPet from "./eggs/PixelPet";

const SECTIONS = ["hero", "about", "projects", "side-projects", "mentorship", "contact"];

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [userXP, setUserXP] = useState(14850);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleUnlockAchievement = (title: string, xp: number) => {
    setUserXP((prev) => prev + xp);
    setToastMessage(`+ ${title}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen relative font-sans text-ink bg-cream">
      {/* Toast Notification Bar */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-toast animate-fade-up">
          <div className="px-4 py-3 rounded-lg border-2 border-ink bg-amber text-ink type-label shadow-pixel flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-tosca animate-ping" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Global Navbar */}
      <Navbar
        activeSection={activeSection}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      {/* Sections */}
      <main>
        <Hero
          onUnlockAchievement={handleUnlockAchievement}
          onOpenTerminal={() => setIsTerminalOpen(true)}
        />
        <About onUnlockAchievement={handleUnlockAchievement} />
        <Projects onUnlockAchievement={handleUnlockAchievement} />
        <PersonalProjects onUnlockAchievement={handleUnlockAchievement} />
        <Mentorship onUnlockAchievement={handleUnlockAchievement} />
        <Contact onUnlockAchievement={handleUnlockAchievement} />
      </main>

      {/* Interactive CLI Terminal Modal */}
      <HackSequence onUnlockAchievement={handleUnlockAchievement} />
      <PixelPet />

      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onUnlockAchievement={handleUnlockAchievement}
      />
    </div>
  );
}
