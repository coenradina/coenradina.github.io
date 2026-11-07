import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Selected Work", href: "#projects" },
  { label: "Side Projects", href: "#side-projects" },
  { label: "Mentorship", href: "#mentorship" },
  { label: "Contact", href: "#contact" },
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
      className={`fixed top-0 left-0 right-0 z-nav border-b-2 border-ink backdrop-blur-md transition-all duration-200 ${scrolled ? "bg-cream/90" : "bg-cream/80"}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 text-left group cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded border-2 border-ink bg-tosca text-white flex items-center justify-center type-button shadow-pixel-sm">
            AC
          </div>
          <div>
            <span
              className="type-subheading block text-ink group-hover:text-tosca transition-colors"
            >
              Astrid Coenrad
            </span>
            <span
              className="type-eyebrow text-maroon block lg:whitespace-nowrap"
            >
              Software Engineer & Tech Mentor
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
                className={`relative type-label whitespace-nowrap transition-colors duration-150 cursor-pointer ${isActive ? "text-tosca" : "text-ink"}`}
              >
                <span className="text-amber font-bold mr-1">//</span>
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-tosca"
                  />
                )}
              </button>
            );
          })}

          {/* Terminal Launcher button */}
          <button
            onClick={onOpenTerminal}
            className="px-3 py-1.5 rounded border-2 border-ink type-button text-ink bg-amber hover:bg-amber-tint transition-all cyber-button cursor-pointer flex items-center gap-1.5"
          >
            <span>[~] TERMINAL</span>
          </button>

          <button
            onClick={() => handleNav("#contact")}
            className="px-4 py-1.5 rounded border-2 border-ink type-button text-white bg-maroon hover:bg-maroon-dark transition-all cyber-button cursor-pointer"
          >
            WRITE TO ME ✉
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onOpenTerminal}
            className="px-3 py-1 rounded border-2 border-ink type-label text-ink bg-amber"
          >
            [~]
          </button>
          <button
            className="flex flex-col gap-1.5 p-2 rounded border border-ink bg-parchment"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t-2 border-ink px-6 py-4 flex flex-col gap-3 bg-parchment"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-left type-label py-1.5 text-ink flex items-center gap-2"
            >
              <span className="text-tosca">//</span>
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav("#contact")}
            className="mt-2 type-label px-4 py-3 rounded border-2 border-ink text-center text-white bg-maroon"
          >
            WRITE TO ME ✉
          </button>
        </div>
      )}
    </nav>
  );
}
