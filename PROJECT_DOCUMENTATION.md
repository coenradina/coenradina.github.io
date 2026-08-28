# Astrid Coenrad Interactive Portfolio

## Overview

This project is a responsive, single-page personal portfolio for Astrid Coenrad. It presents her work across technical program management, EdTech, STEM curriculum design, mentorship, and software engineering.

The experience is styled as a solarized, cyber-retro developer interface. Normal portfolio content is combined with game-like interactions such as XP rewards, achievement notifications, animated competency bars, inspectable cards, and an interactive terminal.

The application is a frontend-only React site. It does not currently use a backend, database, authentication system, content management system, or analytics service.

## Primary audience and goals

The site is aimed at potential employers, collaborators, education partners, and workshop or mentorship clients. It is designed to:

- Introduce Astrid as a software engineer and tech mentor who is also Head of Education at Generation Girl.
- Summarize her career history and qualifications.
- Highlight measurable outcomes from selected projects.
- Demonstrate mentorship and curriculum-development impact.
- Encourage visitors to make contact.
- Make the portfolio memorable through playful technical interactions.

## User experience

The page contains five scrollable sections in this order:

1. **Hero** — introduction, interactive code-profile tabs, headline metrics, and primary calls to action.
2. **About** — career history represented as flip cards, followed by achievement badges.
3. **Projects & Impact** — filterable project cards, animated impact bars, and project detail dialogs.
4. **Mentorship** — education statistics, a competency matrix, and manually navigated testimonials.
5. **Contact** — mission-category selection, a validated contact form, profile links, and footer information.

A fixed navigation bar follows the visitor through the page. The active navigation item changes as each section enters the viewport. On smaller screens, the links are placed in a collapsible menu.

## Main features

### Scroll-aware navigation

`App.tsx` observes all main page sections with the browser's `IntersectionObserver`. When at least 30% of a section is visible, that section becomes active in the navigation bar.

Navigation buttons use smooth scrolling rather than routes. The application therefore has one page and no client-side router.

### Gamification and achievements

Most meaningful interactions call a shared achievement handler in `App.tsx`. The handler:

- Adds the awarded amount to an in-memory XP value.
- Displays an achievement toast in the lower-right corner.
- Hides the toast after 3.5 seconds.

XP can be earned by running hero code, flipping career cards, inspecting badges and projects, changing testimonials, submitting the contact form, and using secret terminal commands.

Important current behavior:

- XP is not persisted across reloads.
- The total XP value is not rendered anywhere in the interface.
- Repeating an interaction can award XP repeatedly; achievements are not deduplicated.

### Interactive hero code editor

The hero contains four selectable code-style profile tabs:

- `AstridProfile.ts`
- `AI_Class_ASEAN.kt`
- `GenerationGirl.py`
- `SemestaIntegrasi.go`

Each tab presents a different part of Astrid's profile in a language-themed code sample. The **Execute Code** button simulates compilation for 900 milliseconds, then displays a success message and awards 150 XP. No code is actually compiled or executed.

The section also displays four headline metrics and buttons that scroll to the projects or contact sections.

### Career flip cards

The About section presents four roles:

- Technical Program Manager at PT Semesta Integrasi Digital.
- Education PM and Advisor at Generation Girl.
- Lead Learning Experience Designer at Binar Academy.
- Android Developer and Software Engineer at Female Daily and BCA.

Clicking a card flips it to reveal a longer description and an outcome summary. Only one clicked card is stored as explicitly flipped at a time, although desktop hover styling can also flip a card.

Achievement badges below the career cards summarize qualifications and milestones. Clicking a badge awards XP and shows a toast.

### Project filtering and inspection

The Projects section contains five hard-coded case-study summaries in three categories:

- Product & EdTech
- STEM & AI
- Software & Mobile

Visitors can filter the grid or show all projects. Each card includes a remote Unsplash image, organization, summary, tags, and an animated impact metric.

Clicking a project awards 100 XP and opens a detail dialog. The dialog currently repeats the card's description, organization, and primary metric; it does not provide a full case study or external project link.

### Animated XP bars

The reusable `XPBar` component uses `IntersectionObserver`. Its fill animates from zero to the configured percentage when it first becomes visible. It is used for both project impact metrics and the mentorship competency matrix.

These bars are presentation components. Their values are hard-coded portfolio content and are not calculated from the visitor's accumulated XP.

### Mentorship and testimonials

The Mentorship section shows:

- Four education-impact statistics.
- Four competency bars.
- A workshop/collaboration call to action.
- Three five-star testimonial summaries.

Testimonials are advanced manually with previous and next buttons. Each navigation action awards 50 XP. The testimonials do not auto-play and are not loaded from an external source.

### Interactive terminal

The terminal can be opened from the navigation bar or the hero achievement badge. It keeps command history in component memory and supports these case-insensitive commands:

| Command | Result |
| --- | --- |
| `help` | Lists available commands. |
| `whoami` | Shows Astrid's summary profile and education. |
| `skills` | Shows Agile, EdTech, curriculum, and engineering competencies. |
| `projects` | Summarizes three flagship projects. |
| `exp` | Lists the career timeline. |
| `sudo hire` | Awards 500 XP, closes the terminal after 1.2 seconds, and scrolls to Contact. |
| `easteregg` | Shows a hidden quote and awards 250 XP. |
| `clear` | Clears terminal history. |

Unknown commands produce an error message. The close button dismisses the modal, but the Escape key is not currently wired to close it.

### Contact experience

The contact form lets visitors choose one of four mission categories and enter a name, email address, and message.

Client-side validation requires:

- A non-empty name.
- An email value containing `@`.
- A message containing at least eight non-whitespace characters.

After validation, the UI shows a sending state for 1.2 seconds, then displays a success screen and awards 250 XP.

**The form does not send or store the submission.** The selected category and field values are only local React state. A form service, API endpoint, or email integration is required before this can function as a real contact channel.

The sidebar includes Jakarta timezone information and external links to GitHub/portfolio and LinkedIn.

## Application architecture

```text
src/main.tsx
└── App.tsx
    ├── Navbar.tsx
    ├── Hero.tsx
    │   └── ui/AchievementBadge.tsx
    ├── About.tsx
    │   └── ui/AchievementBadge.tsx
    ├── Projects.tsx
    │   └── ui/XPBar.tsx
    ├── Mentorship.tsx
    │   ├── ui/AchievementBadge.tsx
    │   └── ui/XPBar.tsx
    ├── Contact.tsx
    └── TerminalModal.tsx
```

### State ownership

`App.tsx` owns cross-section UI state:

- Active section.
- Terminal open/closed state.
- Accumulated user XP.
- Current achievement toast.

Each section owns its interaction-specific state:

- `Navbar`: scroll appearance and mobile-menu visibility.
- `Hero`: selected code tab, simulated execution state, and output.
- `About`: selected flipped card.
- `Projects`: selected filter and inspected project.
- `Mentorship`: current testimonial index.
- `Contact`: form values, category, validation errors, focus state, and submission status.
- `TerminalModal`: current input and command history.

There is no global state library. Parent-to-child props and local React state are sufficient for the current application size.

## Technology stack

- React 19
- TypeScript 5.7 in strict mode
- Vite 8
- Tailwind CSS 4 through the Vite plugin
- Native browser APIs, including `IntersectionObserver`, timers, and smooth scrolling
- Figma Make build and preview plugins
- Google Fonts: Space Grotesk, JetBrains Mono, VT323, and Silkscreen

The production bundle is static and can be hosted on any platform capable of serving a Vite build.

## Styling and visual system

Global styling is defined in `src/index.css`. The visual system combines:

- A warm Solarized Light background.
- Navy borders and hard offset shadows.
- Teal, maroon, and amber accents.
- Space Grotesk for primary text.
- JetBrains Mono for technical labels and controls.
- VT323 and Silkscreen for selected retro details.
- Grid, scanline, hover-lift, flip-card, toast, floating, and progress animations.

Most layout and responsive behavior is expressed directly in JSX with Tailwind utilities. Custom CSS handles theme tokens, global defaults, scrollbar styling, reusable animation classes, and 3D card transforms.

The major responsive transitions occur around Tailwind's `sm`, `md`, and `lg` breakpoints. Content stacks into a single column on narrow screens, while navigation becomes a mobile menu.

## Figma Make and build behavior

The Vite configuration includes Figma Make plugins for:

- Applying `.figma/make/site.json` metadata to the HTML shell.
- Preview error-overlay replay.
- React refresh fallback handling.
- Make Kit story discovery.

The app uses `FIGMA_PUBLIC_URL` as the build base when that environment variable is provided. The development and preview server use the `PORT` environment variable, defaulting to `8443`.

The site configuration currently:

- Supplies the portfolio description.
- Disables search-engine indexing through both robots metadata and `robots.txt`.
- Leaves accessibility bypass links disabled.
- Does not override reduced-motion preferences.

## Local development

Install dependencies if they are not already present:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Format the codebase:

```bash
npm run format
```

In the Figma Make environment, the development server is normally already running, so file changes should appear in the preview automatically.

## Content and data management

All portfolio content is embedded directly in component files:

- Career roles and achievements: `src/components/About.tsx`
- Projects and metrics: `src/components/Projects.tsx`
- Testimonials, statistics, and skills: `src/components/Mentorship.tsx`
- Hero profile tabs and headline metrics: `src/components/Hero.tsx`
- Contact links and specialization tags: `src/components/Contact.tsx`
- Terminal profile text and commands: `src/components/TerminalModal.tsx`

Because some facts appear in multiple components, updating a role, date, statistic, or project may require changing it in several places. A shared content module or CMS would reduce duplication.

## External dependencies at runtime

Although the application itself is static, some visual assets depend on third-party network access:

- Fonts load from Google Fonts.
- Project images load from Unsplash URLs.
- Social/profile links navigate to external sites.

If those services are unavailable or blocked, the site remains structurally usable but may show fallback fonts or missing project images.

## Current limitations and production considerations

- The contact form is a simulation and does not transmit data.
- Accumulated XP is unused visually and resets after a page reload.
- Achievements can be earned repeatedly without limits.
- Portfolio content is duplicated across components and must be updated manually.
- Project images and fonts rely on remote services.
- Project dialogs and the terminal do not implement full focus trapping or comprehensive keyboard behavior.
- The terminal does not close when Escape is pressed despite the button label.
- Modal background scrolling is not explicitly locked.
- Several clickable card-like elements are `div` elements rather than semantic buttons.
- The selected contact category is not included in any outgoing payload because no submission integration exists.
- Email validation only checks for the presence of `@`.
- There is no automated test suite.
- There is no error monitoring or analytics integration.
- Search indexing is intentionally disabled.

## Suggested next improvements

1. Connect the contact form to a real endpoint and handle success and failure responses.
2. Extract repeated career, project, metric, and profile content into typed data modules.
3. Display accumulated XP, persist it if desired, and prevent accidental repeated awards.
4. Improve modal accessibility with dialog semantics, focus trapping, Escape handling, and scroll locking.
5. Replace clickable non-button elements with keyboard-accessible controls.
6. Add reduced-motion styling for visitors who prefer less animation.
7. Host project images and fonts locally if runtime independence is important.
8. Add component and interaction tests for filtering, form validation, terminal commands, dialogs, and section navigation.
9. Enable search indexing and add complete title, social-image, favicon, and metadata settings when the portfolio is ready to publish.
