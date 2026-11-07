export default function NotFound() {
  const base = import.meta.env.BASE_URL;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 font-sans text-ink bg-cream">
      <div className="w-full max-w-xl rounded-lg border-2 border-ink p-8 sm:p-10 shadow-pixel-lg bg-parchment space-y-6">
        <div className="type-eyebrow text-maroon">// 404</div>
        <h1 className="type-title text-ink">
          This page <span className="text-tosca underline decoration-amber decoration-4">doesn't exist.</span>
        </h1>
        <p className="type-body text-ink-soft">
          The link may be old, or the address has a typo. Everything that does exist is on the homepage.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <a
            href={base}
            className="px-6 py-4 rounded border-2 border-ink bg-maroon hover:bg-maroon-dark text-white type-label cyber-button"
          >
            BACK TO THE HOMEPAGE ↵
          </a>
          <a
            href={`${base}#contact`}
            className="px-6 py-4 rounded border-2 border-ink bg-white hover:bg-amber-tint text-ink type-label cyber-button"
          >
            WRITE TO ME ✉
          </a>
        </div>
      </div>
    </main>
  );
}
