# Design system

aastr.id and Kotakata share one set of design tokens. The tokens live in
`src/styles/tokens.css`, and both repos keep an identical copy of that file.
`scripts/check-design.mjs` (also identical in both repos) runs before every
build and fails it when code reaches past the tokens.

```bash
pnpm lint:design          # check only
pnpm lint:design --list   # also count how often each type role is used
```

To change a value, edit `tokens.css`, copy the file and the check script to
the other repo, and run the check in both.

## Colour

Tailwind's default palette is switched off. `bg-slate-900` or `text-rose-700`
generate nothing, and the check reports them.

| Token | Hex | Use for |
| --- | --- | --- |
| `cream` | `#fdf6e3` | Page background |
| `parchment` | `#eee8d5` | Panels, inputs, secondary surfaces, hairlines on white |
| `white` | `#ffffff` | Cards |
| `ink` | `#0f172a` | Body text, every border, pixel shadows, dark surfaces |
| `ink-soft` | `#334155` | Secondary text |
| `ink-muted` | `#475569` | Captions, meta, placeholders |
| `tosca` | `#0d9488` | Primary accent, links, success |
| `tosca-dark` | `#0f766e` | Hover on tosca |
| `tosca-light` | `#2dd4bf` | Tosca on ink surfaces |
| `tosca-tint` | `#ccfbf1` | Tosca background tint |
| `maroon` | `#881337` | Main call to action, errors |
| `maroon-dark` | `#6b0f1a` | Hover on maroon |
| `maroon-tint` | `#ffe4e6` | Maroon background tint |
| `amber` | `#e5a93c` | Highlights, badges, warnings |
| `amber-tint` | `#fef3c7` | Amber background tint, hover on amber |
| `gold` | `#b58900` | Amber as text on light surfaces |

Rules:

- Opacity modifiers go in steps of 10: `bg-ink/60`, `border-ink/20`.
- A hover state uses the `-dark` token for tosca and maroon and `amber-tint`
  for amber. It never repeats the base colour.
- No hex, `rgb()` or `hsl()` in components or CSS outside `tokens.css`. Effect
  colours (grid lines, scanlines, glitch) are `--fx-*` variables in
  `tokens.css`. Pixel-art palettes are the one exception and are listed in
  `scripts/design-allow.json`.
- Canvas and game code (Kotakata's Phaser scenes and Blockly theme) reads
  colours from the CSS variables through `src/theme.ts`. It does not copy hex
  values.

## Type

Three families, three weights.

| Family | Class | Use for |
| --- | --- | --- |
| Space Grotesk | `font-sans` | Headings and reading text |
| JetBrains Mono | `font-mono` | UI: buttons, labels, tags, code |
| VT323 | `font-pixel` | Retro numbers and game text |

Weights are `font-normal` (400), `font-medium` (500) and `font-bold` (700).
`font-semibold` and the rest do not exist.

Raw size classes (`text-xs` to `text-9xl`, `text-[11px]`) are switched off.
Every piece of text takes one role, and the role sets family, size, weight,
line height and letter spacing together:

| Role | Family | Size (base / sm and up) | Use for |
| --- | --- | --- | --- |
| `type-display` | sans 700 | 36 / 48, 60 at md, 72 at lg | The hero name. One per page. |
| `type-title` | sans 700 | 36 / 48 | Section titles (h2) |
| `type-heading` | sans 700 | 20 / 24 | Card and modal titles (h3) |
| `type-subheading` | sans 700 | 18 | Small titles inside a card (h4) |
| `type-lead` | sans 500 | 16 / 18 | The intro paragraph under a title |
| `type-body` | sans 400 | 14 | Reading text |
| `type-caption` | sans 400 | 12 | Fine print |
| `type-button` | mono 700 | 12, no wrap | Buttons and nav actions |
| `type-label` | mono 700 | 12 | Tags, meta lines, form labels, small UI text |
| `type-eyebrow` | mono 700 | 11, uppercase | Kickers above titles, badges |
| `type-micro` | mono 700 | 11 | Counters, tiny annotations |
| `type-mono` | mono 400 | 12 / 14 | Code, terminal output, mono paragraphs |
| `type-pixel-sm` | pixel | 20 | Small game text |
| `type-pixel` | pixel | 24 | Scores and stats |
| `type-pixel-lg` | pixel | 36 | Big game numbers |

Rules:

- Do not add `leading-*` or `tracking-*`. The role sets them. `leading-none`
  is allowed for icons.
- `font-bold` or `font-medium` on top of a role is for emphasis inside
  running text only.
- Emoji and icon glyphs use `text-icon` (24px) or `text-icon-lg` (36px).
- A role that grows at `sm` grows on its own. Do not add `sm:text-*`.

## Spacing

Padding, margin, gap and space classes use this scale only (Tailwind units,
1 = 4px):

`0, px, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32`

`0.5` and `1.5` are for tight chips and badges. In practice:

| Where | Value |
| --- | --- |
| Inside a chip or tag | `px-2 py-0.5` to `px-3 py-1` |
| Inside a button | `px-4 py-2` (small `px-3 py-1.5`) |
| Inside a card | `p-6`, or `p-8` for a feature card |
| Between items in a card | `gap-3` or `gap-4` |
| Between cards | `gap-6` |
| Section padding | `py-28` |

Arbitrary values (`p-[13px]`) are not allowed. Arbitrary values are only for
layout sizes and positions: width, height, min and max sizes, insets,
translates, grid tracks and aspect ratios.

## Shape and depth

- Radius: `rounded` (4px) for controls and chips, `rounded-lg` (8px) for cards
  and panels, `rounded-full` for dots and pills.
- Borders: `border-2 border-ink` outlines every card and control. `border`
  (1px) is for dividers and chips.
- Shadows are hard pixel offsets in ink, never blurred: `shadow-pixel-sm` (2px)
  for chips and small controls, `shadow-pixel` (4px) for cards and buttons,
  `shadow-pixel-lg` (6px) for modals and feature cards.

## Layers

Numeric `z-*` classes are not allowed. Pick a layer:

| Layer | z-index | Use for |
| --- | --- | --- |
| `z-raised` | 10 | Lifting an element above its siblings |
| `z-float` | 30 | Sticky controls, the pixel pet |
| `z-nav` | 40 | The top navigation |
| `z-overlay` | 80 | Hints and popovers above third-party widgets |
| `z-toast` | 90 | Toasts |
| `z-modal` | 100 | Dialogs |
| `z-takeover` | 110 | Full-screen easter eggs |

## Inline styles

`style={{}}` is for values computed at runtime: a position, a width from
progress, a transform. Colour, font, spacing, shadow and z-index always come
from classes, and the check rejects them in `style`.
