import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const CONTACT_ENDPOINT =
  (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) ||
  "https://us-central1-aastr-portfolio.cloudfunctions.net/contact";

interface ContactProps {
  onUnlockAchievement: (title: string, xp: number) => void;
}

const SOCIAL_LINKS = [
  { label: "GitHub", handle: "@coenradina", icon: "⌥", href: "https://github.com/coenradina" },
  { label: "LinkedIn", handle: "astridcoenrad", icon: "◈", href: "https://www.linkedin.com/in/astridcoenrad" },
  { label: "Portfolio", handle: "aastr.id", icon: "✦", href: "https://aastr.id" },
];

export default function Contact({ onUnlockAchievement }: ContactProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [category, setCategory] = useState("Curriculum or EdTech");
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const [website, setWebsite] = useState("");
  const formStartedAt = useRef(Date.now());
  const turnstileContainer = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  // Turnstile site keys are public browser identifiers. The matching secret
  // lives only in Firebase Secret Manager, used by the contact Cloud Function.
  const turnstileSiteKey =
    (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ||
    "0x4AAAAAAFzVJ9DJLBIBaMwZ";
  const isSent = status === "sent";

  useEffect(() => {
    if (!turnstileSiteKey || isSent || !turnstileContainer.current) return;

    let cancelled = false;

    const renderWidget = () => {
      if (
        cancelled ||
        !window.turnstile ||
        !turnstileContainer.current ||
        turnstileWidgetId.current
      )
        return;

      turnstileWidgetId.current = window.turnstile.render(turnstileContainer.current, {
        sitekey: turnstileSiteKey,
        theme: "light",
        size: "flexible",
        callback: setTurnstileToken,
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-contact-turnstile="true"]',
    );

    if (window.turnstile) {
      renderWidget();
    } else if (existingScript) {
      existingScript.addEventListener("load", renderWidget);
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.contactTurnstile = "true";
      script.addEventListener("load", renderWidget);
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      existingScript?.removeEventListener("load", renderWidget);
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [turnstileSiteKey, isSent]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = "Name required";
    if (!values.email.includes("@")) e.email = "Valid email required";
    if (values.message.trim().length < 8) e.message = "Give me a little more to work with";
    return e;
  };

  const resetTurnstile = () => {
    setTurnstileToken("");
    if (turnstileWidgetId.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetId.current);
    }
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (!turnstileSiteKey || !turnstileToken) {
      setSubmitError("Please complete the anti-spam verification and try again.");
      setStatus("error");
      return;
    }
    setErrors({});
    setSubmitError("");
    setStatus("sending");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
          ...values,
          category,
          website,
          startedAt: formStartedAt.current,
          turnstileToken,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.message || "Your note could not be sent. Please try again.");
      }

      setStatus("sent");
      onUnlockAchievement("Sent the form (+250 XP)", 250);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Your note could not be sent. Please try again.",
      );
      setStatus("error");
      resetTurnstile();
    }
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
    <section id="contact" className="py-28 px-4 sm:px-6 lg:px-8 border-t-2 border-ink bg-cream">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div
            className="type-eyebrow text-maroon"
          >
            // contact
          </div>
          <h2
            className="type-title text-ink"
          >
            Write to me. <span className="text-tosca underline decoration-amber decoration-4">Tell me the odd details.</span>
          </h2>
          <p className="type-lead text-ink-soft pt-1">
            Projects, workshops, curriculum work, interesting problems. I read every message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Mission Form */}
          <div className="lg:col-span-3">
            {status === "sent" ? (
              <div
                className="rounded-lg border-2 border-ink p-8 sm:p-10 flex flex-col items-center justify-center text-center gap-6 min-h-[400px] shadow-pixel-lg bg-cream"
              >
                <div className="text-icon-lg animate-float">🚀</div>
                <div className="space-y-1">
                  <p
                    className="type-heading text-ink"
                  >
                    MESSAGE RECEIVED.
                  </p>
                  <p
                    className="type-label text-tosca"
                  >
                    +250 XP · THE FORM HAS DONE ITS ONE JOB
                  </p>
                </div>
                <p className="type-body text-ink-soft max-w-md">
                  Thanks. I usually reply within a day.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setValues({ name: "", email: "", message: "" });
                    setWebsite("");
                    setSubmitError("");
                    formStartedAt.current = Date.now();
                    resetTurnstile();
                  }}
                  className="mt-2 type-label px-6 py-3 rounded border-2 border-ink bg-amber text-ink cyber-button cursor-pointer"
                >
                  SEND ANOTHER NOTE ↵
                </button>
              </div>
            ) : (
              <form
                data-perch="contact"
                onSubmit={handleSubmit}
                className="rounded-lg border-2 border-ink p-8 sm:p-10 flex flex-col gap-6 shadow-pixel-lg bg-cream"
                noValidate
              >
                <div className="flex items-center justify-between border-b-2 border-ink pb-4">
                  <span className="type-eyebrow text-ink">
                    // THE BASICS
                  </span>
                  <span className="type-micro px-3 py-1 rounded border border-ink bg-amber">
                    +250 XP REWARD
                  </span>
                </div>

                {/* Mission Type Selection */}
                <div className="space-y-2">
                  <label className="type-eyebrow text-ink">
                    WHAT IS THIS ABOUT?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Curriculum or EdTech",
                      "Product delivery",
                      "Workshop or talk",
                      "Mentorship or training",
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-3 rounded type-label border-2 border-ink transition-all text-left cursor-pointer ${category === cat ? "bg-tosca text-white"
                            : "bg-parchment text-ink-soft hover:bg-amber-tint"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name + Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { id: "name", label: "YOUR NAME", type: "text", placeholder: "e.g. Grace Hopper" },
                    { id: "email", label: "YOUR EMAIL", type: "email", placeholder: "grace@example.com" },
                  ].map(({ id, label, type, placeholder }) => (
                    <div key={id} className="space-y-1.5">
                      <label
                        htmlFor={id}
                        className="type-eyebrow text-ink"
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
                        className={`w-full bg-white outline-none type-mono p-3 rounded-lg border-2 text-ink placeholder:text-ink-muted ${errors[id] ? "border-maroon" : focused === id ? "border-tosca" : "border-ink"}`}
                      />
                      {errors[id] && (
                        <span className="type-micro text-maroon block">
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
                    className="type-eyebrow text-ink"
                  >
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={values.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    placeholder="A little context helps. What are you working on?"
                    className={`w-full bg-white outline-none type-mono p-3 rounded-lg border-2 text-ink placeholder:text-ink-muted resize-none ${errors.message ? "border-maroon" : focused === "message" ? "border-tosca" : "border-ink"}`}
                  />
                  {errors.message && (
                    <span className="type-micro text-maroon block">
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Deliberately hidden from people; automated form fillers often populate it. */}
                <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <div ref={turnstileContainer} className="min-h-[65px]" />
                  {!turnstileSiteKey && (
                    <p className="type-micro text-maroon">
                      Anti-spam verification needs to be configured before publishing.
                    </p>
                  )}
                  {status === "error" && submitError && (
                    <p role="alert" className="type-label text-maroon">
                      {submitError}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-4 rounded-lg border-2 border-ink bg-maroon hover:bg-maroon-dark text-white type-label cyber-button cursor-pointer flex items-center justify-center gap-2"
                >
                  {status === "sending" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      SENDING YOUR NOTE…
                    </>
                  ) : (
                    "SEND THE NOTE ↵"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Mission Info Box */}
            <div
              className="rounded-lg border-2 border-ink p-6 sm:p-8 flex flex-col gap-6 shadow-pixel bg-white"
            >
              <div>
                <div
                  className="type-eyebrow text-ink-muted mb-1"
                >
                  LOCATION & TIMEZONE
                </div>
                <div className="flex items-center gap-2 type-button text-ink">
                  <span className="w-2.5 h-2.5 rounded-full bg-tosca animate-pulse" />
                  Jakarta, Indonesia (GMT+7)
                </div>
              </div>

              <div>
                <div
                  className="type-eyebrow text-ink-muted mb-1"
                >
                  REPLY TIME
                </div>
                <div className="type-button text-tosca">
                  Usually within a day
                </div>
              </div>

              <div>
                <div
                  className="type-eyebrow text-ink-muted mb-2"
                >
                  SPECIALIZATION TAGS
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Full-stack Development", "Tech Mentorship", "STEM Curriculum", "Product Delivery"].map((t) => (
                    <span
                      key={t}
                      className="type-micro px-3 py-1 rounded border border-ink bg-amber-tint text-ink"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links Box */}
            <div
              className="rounded-lg border-2 border-ink p-6 sm:p-8 flex flex-col gap-4 shadow-pixel bg-white"
            >
              <div
                className="type-eyebrow text-ink-muted mb-1"
              >
                ELSEWHERE
              </div>
              {SOCIAL_LINKS.map(({ label, handle, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-ink bg-cream hover:bg-amber-tint transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-tosca font-bold">{icon}</span>
                    <span className="type-label text-ink">
                      {label}
                    </span>
                  </div>
                  <span
                    className="type-label text-ink-soft"
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
          className="pt-8 border-t-2 border-ink flex flex-col sm:flex-row items-center justify-between gap-4 type-mono text-ink-soft"
        >
          <span>
            © 2026 Astrid · Built with React and too much teal
          </span>
          <span className="font-bold text-maroon">
            Software Engineer & Tech Mentor
          </span>
        </div>
      </div>
    </section>
  );
}
