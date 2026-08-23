# Personal Portfolio — Design Plan

## Context

The project is a blank Vite + React + Tailwind CSS v4 scaffold. The goal is to build a complete personal portfolio website for a software engineer / head of education / tech mentor. The aesthetic must be clean and professional but with personality and gamification — XP bars, achievement badges, level indicators — all woven into the design naturally rather than feeling tacked on.

---

## Aesthetic Stance

**Swiss grid + Gamified terminal.** Strict typographic grid, lots of breathing room, but undercut with gamified data-layer elements (XP progress, level counters, achievement badges rendered in mono type). The wit lives in the details, not the structure.

**Typography:**
- Display: `Fraunces` (personality-rich variable serif for hero headings and section titles)
- Body: `DM Sans` (clean, readable, modern sans)
- Mono: `JetBrains Mono` (XP labels, level badges, code snippets, data readouts)

**Color tokens:**
- `--background`: `#F4F3EF` (warm neutral ground)
- `--foreground`: `#0C0C14` (near-black)
- `--card`: `#FFFFFF`
- `--card-foreground`: `#0C0C14`
- `--primary`: `#4338CA` (deep indigo)
- `--primary-foreground`: `#FFFFFF`
- `--secondary`: `#EEF2FF` (indigo tint)
- `--secondary-foreground`: `#312E81`
- `--muted`: `#E8E6E0`
- `--muted-foreground`: `#6B6B78`
- `--accent`: `#10B981` (emerald — gamification color for XP / progress)
- `--accent-foreground`: `#FFFFFF`
- `--border`: `#D9D6CE`
- `--ring`: `#4338CA`
- `--radius`: `0.5rem`

Hero section uses an inverted dark ground (`#0C0C14`) — white text, indigo CTA — for the two-tone split canvas effect.

---

## Project Structure

The project is a fresh scaffold with no existing components. Files to create:

```
src/
  index.css               — font @imports + CSS custom properties + Tailwind
  App.tsx                 — shell that composes all sections
  components/
    Navbar.tsx            — sticky top nav with scroll-aware highlight
    Hero.tsx              — full-viewport dark hero with animated intro
    About.tsx             — card grid with flip/reveal witty anecdotes
    Projects.tsx          — project gallery with XP progress bars + hover reveals
    Mentorship.tsx        — testimonial layout with interactive engagement
    Contact.tsx           — minimal form with micro-interaction feedback
    ui/
      XPBar.tsx           — reusable animated XP progress bar
      AchievementBadge.tsx — gamified badge chip
```

---

## Implementation Plan

### 1. `src/index.css`
- Add Google Fonts `@import` at the top (must be first):
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
  @import 'tailwindcss';
  ```
- Define `@theme` block with all CSS custom properties (color tokens above)
- Set `font-family` default to `DM Sans`; apply `Fraunces` via utility class; `JetBrains Mono` for mono spans
- Hide scrollbars globally; add smooth scroll behavior

### 2. `src/App.tsx`
- Compose `<Navbar>`, `<Hero>`, `<About>`, `<Projects>`, `<Mentorship>`, `<Contact>` in order
- Manage `activeSection` state via `IntersectionObserver` for navbar highlight
- Pass `onNavigate` callback to Navbar for smooth anchor scrolling

### 3. `src/components/Navbar.tsx`
- Fixed top bar, `bg-background/90 backdrop-blur`
- Left: name/logo in Fraunces; right: nav links (About, Projects, Mentorship, Contact)
- Active section link gets `text-primary` + a small underline indicator
- Mobile: hamburger-style collapse (single row, smaller font)

### 4. `src/components/Hero.tsx`
- Full-viewport, dark ground (`bg-[#0C0C14]`)
- Animated reveal: name types in with a CSS keyframe; subtitle fades up on delay
- Gamified identity tag: `JetBrains Mono` pill showing `> Lv.12 Software Engineer`
- Two CTAs: "View Projects" (indigo filled) + "Let's Talk" (ghost white border)
- Subtle particle or grid-dot SVG background pattern (CSS-drawn, no library)
- Scroll chevron bouncing at bottom

### 5. `src/components/About.tsx`
- Section title in Fraunces; warm background ground
- Three cards: Software Engineer · Head of Education · Tech Mentor
- Each card has a front face (role + icon + tagline) and flips on hover/click to reveal a witty anecdote (CSS `transform-style: preserve-3d` flip)
- Below the cards: a row of `<AchievementBadge>` items ("500+ Students Taught", "12 OSS Projects", "3 Talks Given", etc.)

### 6. `src/components/Projects.tsx`
- Section title + filter chips (All / Web / Tools / Education)
- 2×3 grid of project cards (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- Each card:
  - Thumbnail area with color/gradient (or Unsplash image)
  - Project name + 1-line description visible by default
  - On hover: overlay slides up revealing tech stack tags + "Case Study →" link
  - Bottom: `<XPBar>` showing project completion/complexity (label: "XP Earned: 4200")
- Working filter state in React

### 7. `src/components/Mentorship.tsx`
- Left column: mentorship stats in large mono type (e.g., `500+` students, `3yr` tenure)
- Right column: 2–3 rotating testimonial cards (cycle with prev/next arrows or auto-play)
- "Side Quest" achievement badge at section top
- CTA button: "Book a Session →" with a subtle pulse animation

### 8. `src/components/Contact.tsx`
- Minimal form: Name, Email, Message fields + Send button
- Fields animate a colored bottom-border on focus (indigo)
- Send button: on click shows a brief "Sending…" spinner, then "Message sent! +50 XP 🎮" confirmation in mono type
- Managed with local React state (no external library)

### 9. `src/components/ui/XPBar.tsx`
- Props: `label`, `value` (0–100), `color` (default accent/emerald)
- Animated width fill on mount using CSS `transition` with a short delay
- Shows `label + value + "XP"` in JetBrains Mono

### 10. `src/components/ui/AchievementBadge.tsx`
- Props: `icon`, `label`
- Small pill chip, indigo outline, mono font
- Subtle scale-up on hover

---

## Fonts (Google Fonts — Vite path)

Three `@import` statements at the top of `src/index.css` before `@import 'tailwindcss'`:
- Fraunces (variable, ital + wght axes)
- DM Sans (300–600)
- JetBrains Mono (400–600)

No `fonts-wiring` skill needed — all three are public Google Fonts.

---

## Animations & Gamification Details

| Element | Animation |
|---|---|
| Hero name | Typewriter CSS keyframe (`steps()`) |
| Hero subtitle | Fade + slide up (0.3s delay) |
| Scroll chevron | Bounce loop |
| About cards | 3D CSS flip on hover (180deg Y-axis) |
| XP bars | Width transition 0→value on mount (IntersectionObserver trigger) |
| Project hover overlay | Slide-up translate + opacity |
| Mentorship testimonials | Cross-fade on next/prev |
| Contact form | Focus border animation; submit "confetti-text" state |

---

## Responsive Breakpoints

- `< 768px`: single column everywhere; hamburger nav; hero copy scales down
- `768px–1024px`: 2-col projects grid; stacked mentorship
- `> 1024px`: 3-col projects; side-by-side mentorship

---

## Verification

1. `figma logs` — confirm no runtime errors in the preview panel
2. Manually scroll through all sections in the preview
3. Test card flip interactions, project filter chips, testimonial cycling, and contact form submit state
4. Confirm XP bars animate on scroll-into-view
5. Resize preview to confirm responsive layouts at ~768px and ~375px
