import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects & Impact", href: "#projects" },
  { label: "Mentorship", href: "#mentorship" },
  { label: "Contact Mission", href: "#contact" },
];

interface NavbarProps {
  activeSection: string;
  onOpenTerminal: () => void;
}

export default function Navbar({ activeSection, onOpenTerminal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-200"
      style={{
        backgroundColor: scrolled ? "#FDF6E3F2" : "#FDF6E3DD",
        backdropFilter: "blur(10px)",
        borderBottom: "2px solid #0F172A",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 text-left group cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded border-2 border-slate-900 bg-brand-tosca text-white flex items-center justify-center font-mono font-bold text-sm shadow-[2px_2px_0px_#0F172A]">
            AC
          </div>
          <div>
            <span
              className="text-base font-bold tracking-tight block text-slate-900 leading-tight group-hover:text-brand-tosca transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Astrid Coenrad
            </span>
            <span
              className="text-[10px] font-mono font-bold text-brand-maroon uppercase tracking-wider block"
            >
              Lv.24 TPM & Educator
            </span>
          </div>
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="relative text-xs font-mono font-semibold transition-colors duration-150 cursor-pointer"
                style={{
                  color: isActive ? "#0D9488" : "#0F172A",
                }}
              >
                <span className="text-brand-yellow font-bold mr-1">//</span>
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: "#0D9488" }}
                  />
                )}
              </button>
            );
          })}

          {/* Terminal Launcher button */}
          <button
            onClick={onOpenTerminal}
            className="px-3 py-1.5 rounded border-2 border-slate-900 font-mono text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-all cyber-button cursor-pointer flex items-center gap-1.5"
          >
            <span>[~] TERMINAL</span>
          </button>

          <button
            onClick={() => handleNav("#contact")}
            className="px-4 py-1.5 rounded border-2 border-slate-900 font-mono text-xs font-bold text-white bg-brand-maroon hover:bg-rose-900 transition-all cyber-button cursor-pointer"
          >
            SUDO HIRE ↵
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onOpenTerminal}
            className="px-2.5 py-1 rounded border-2 border-slate-900 font-mono text-xs font-bold text-slate-900 bg-amber-400"
          >
            [~]
          </button>
          <button
            className="flex flex-col gap-1.5 p-2 rounded border border-slate-900 bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block h-0.5 w-5 bg-slate-900" />
            <span className="block h-0.5 w-5 bg-slate-900" />
            <span className="block h-0.5 w-5 bg-slate-900" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t-2 border-slate-900 px-6 py-4 flex flex-col gap-3"
          style={{ backgroundColor: "#EEE8D5" }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-left font-mono text-xs font-bold py-1.5 text-slate-900 flex items-center gap-2"
            >
              <span className="text-brand-tosca">//</span>
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav("#contact")}
            className="mt-2 text-xs font-mono font-bold px-4 py-2.5 rounded border-2 border-slate-900 text-center text-white bg-brand-maroon"
          >
            SUDO HIRE ↵
          </button>
        </div>
      )}
    </nav>
  );
}

