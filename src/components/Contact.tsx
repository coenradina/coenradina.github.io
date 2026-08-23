import { useState } from "react";

type Status = "idle" | "sending" | "sent";

interface ContactProps {
  onUnlockAchievement: (title: string, xp: number) => void;
}

const SOCIAL_LINKS = [
  { label: "GitHub", handle: "@coenradina", icon: "⌥", href: "https://coenradina.github.io" },
  { label: "LinkedIn", handle: "astridcoenrad", icon: "◈", href: "https://www.linkedin.com/in/astridcoenrad" },
  { label: "Portfolio", handle: "coenradina.github.io", icon: "✦", href: "https://coenradina.github.io" },
];

export default function Contact({ onUnlockAchievement }: ContactProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [focused, setFocused] = useState<string | null>(null);
  const [category, setCategory] = useState("EdTech & AI Curriculum");
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = "Name required";
    if (!values.email.includes("@")) e.email = "Valid email required";
    if (values.message.trim().length < 8) e.message = "Tell me a bit more about your mission";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      onUnlockAchievement("Mission Signal Transmitted (+250 XP)", 250);
    }, 1200);
  };

  const handleChange = (field: string, val: string) => {
    setValues((v) => ({ ...v, [field]: val }));
    if (errors[field])
      setErrors((e) => {
        const n = { ...e };
        delete n[field];
        return n;
      });
  };

  return (
    <section id="contact" className="py-28 px-4 sm:px-6 lg:px-8 border-t-2 border-slate-900" style={{ backgroundColor: "#EEE8D5" }}>
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div
            className="text-xs font-mono font-bold uppercase tracking-wider text-brand-maroon"
          >
            // initiate_contact_signal()
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Ready to build <span className="text-brand-tosca underline decoration-amber-400 decoration-4">high-impact EdTech?</span>
          </h2>
          <p className="text-base text-slate-700 font-sans leading-relaxed pt-1">
            Got a project, STEM workshop inquiry, or Agile TPM mission? Transmit your signal below. I read every message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Mission Form */}
          <div className="lg:col-span-3">
            {status === "sent" ? (
              <div
                className="rounded-xl border-2 border-slate-900 p-8 sm:p-10 flex flex-col items-center justify-center text-center gap-5 min-h-[400px] shadow-[6px_6px_0px_#0F172A]"
                style={{ backgroundColor: "#FDF6E3" }}
              >
                <div className="text-5xl sm:text-6xl animate-float">🚀</div>
                <div className="space-y-1">
                  <p
                    className="text-2xl sm:text-3xl font-bold text-slate-900"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    SIGNAL DELIVERED!
                  </p>
                  <p
                    className="text-xs font-mono font-bold text-brand-tosca"
                  >
                    +250 XP EARNED · ACHIEVEMENT UNLOCKED: MISSION SIGNAL TRANSMITTED
                  </p>
                </div>
                <p className="text-sm text-slate-700 max-w-md leading-relaxed">
                  Thanks for reaching out! I'll review your mission coordinates and respond within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setValues({ name: "", email: "", message: "" });
                  }}
                  className="mt-2 text-xs font-mono font-bold px-5 py-2.5 rounded border-2 border-slate-900 bg-amber-300 text-slate-900 cyber-button cursor-pointer"
                >
                  TRANSMIT ANOTHER SIGNAL ↵
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-xl border-2 border-slate-900 p-7 sm:p-9 flex flex-col gap-6 shadow-[6px_6px_0px_#0F172A]"
                style={{ backgroundColor: "#FDF6E3" }}
                noValidate
              >
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                  <span className="text-xs font-mono font-bold text-slate-900 uppercase">
                    // MISSION PARAMETERS
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded border border-slate-900 bg-amber-300">
                    +250 XP REWARD
                  </span>
                </div>

                {/* Mission Type Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-900 uppercase">
                    MISSION CATEGORY
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      "EdTech & AI Curriculum",
                      "Agile TPM & Scrum",
                      "STEM Workshop & Talk",
                      "Mentorship & Training",
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3.5 py-2.5 rounded text-xs font-mono font-bold border-2 border-slate-900 transition-all text-left cursor-pointer ${
                          category === cat
                            ? "bg-brand-tosca text-white"
                            : "bg-slate-100 text-slate-800 hover:bg-amber-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name + Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { id: "name", label: "YOUR NAME", type: "text", placeholder: "e.g. Grace Hopper" },
                    { id: "email", label: "YOUR EMAIL", type: "email", placeholder: "grace@example.com" },
                  ].map(({ id, label, type, placeholder }) => (
                    <div key={id} className="space-y-1.5">
                      <label
                        htmlFor={id}
                        className="text-xs font-mono font-bold text-slate-900 uppercase"
                      >
                        {label}
                      </label>
                      <input
                        id={id}
                        type={type}
                        value={values[id as keyof typeof values]}
                        onChange={(e) => handleChange(id, e.target.value)}
                        onFocus={() => setFocused(id)}
                        onBlur={() => setFocused(null)}
                        placeholder={placeholder}
                        className="w-full bg-white outline-none text-xs sm:text-sm font-mono p-3 rounded-lg border-2 border-slate-900 text-slate-900 placeholder:text-slate-400"
                        style={{
                          borderColor: errors[id] ? "#881337" : focused === id ? "#0D9488" : "#0F172A",
                        }}
                      />
                      {errors[id] && (
                        <span className="text-[11px] font-mono font-bold text-rose-700 block">
                          {errors[id]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Message Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="message"
                    className="text-xs font-mono font-bold text-slate-900 uppercase"
                  >
                    SIGNAL BRIEF / MESSAGE
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={values.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    placeholder="Describe your project, timeline, or education mission..."
                    className="w-full bg-white outline-none text-xs sm:text-sm font-mono p-3 rounded-lg border-2 border-slate-900 text-slate-900 placeholder:text-slate-400 resize-none leading-relaxed"
                    style={{
                      borderColor: errors.message ? "#881337" : focused === "message" ? "#0D9488" : "#0F172A",
                    }}
                  />
                  {errors.message && (
                    <span className="text-[11px] font-mono font-bold text-rose-700 block">
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-3.5 rounded-lg border-2 border-slate-900 bg-brand-maroon hover:bg-rose-900 text-white font-mono text-xs font-bold cyber-button cursor-pointer flex items-center justify-center gap-2"
                >
                  {status === "sending" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      TRANSMITTING SIGNAL…
                    </>
                  ) : (
                    "TRANSMIT MISSION SIGNAL ↵"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Mission Info Box */}
            <div
              className="rounded-xl border-2 border-slate-900 p-6 sm:p-7 flex flex-col gap-5 shadow-[4px_4px_0px_#0F172A] bg-white"
            >
              <div>
                <div
                  className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-1 tracking-wider"
                >
                  LOCATION & TIMEZONE
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-slate-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  Jakarta, Indonesia (GMT+7)
                </div>
              </div>

              <div>
                <div
                  className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-1 tracking-wider"
                >
                  RESPONSE PROTOCOL
                </div>
                <div className="text-xs sm:text-sm font-mono font-bold text-brand-tosca">
                  Usually within 24 hours
                </div>
              </div>

              <div>
                <div
                  className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-2 tracking-wider"
                >
                  SPECIALIZATION TAGS
                </div>
                <div className="flex flex-wrap gap-2">
                  {["TPM Delivery", "AI Class ASEAN", "STEM Strategy", "Kotlin Clean Arch"].map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono font-bold px-2.5 py-1 rounded border border-slate-900 bg-amber-200 text-slate-900"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links Box */}
            <div
              className="rounded-xl border-2 border-slate-900 p-6 sm:p-7 flex flex-col gap-3.5 shadow-[4px_4px_0px_#0F172A] bg-white"
            >
              <div
                className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-1 tracking-wider"
              >
                DIRECT CHANNELS & PORTFOLIO
              </div>
              {SOCIAL_LINKS.map(({ label, handle, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-900 bg-slate-50 hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-brand-tosca font-bold">{icon}</span>
                    <span className="text-xs font-bold font-mono text-slate-900">
                      {label}
                    </span>
                  </div>
                  <span
                    className="text-xs font-mono font-bold text-slate-700"
                  >
                    {handle}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Cyber Footer Bar */}
        <div
          className="pt-8 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-700"
        >
          <span>
            © 2026 Astrid · Powered by Solarized Cyber-Retro Engine
          </span>
          <span className="font-bold text-brand-maroon">
            Lv.24 TPM, Tech Educator & Software Engineer
          </span>
        </div>
      </div>
    </section>
  );
}



