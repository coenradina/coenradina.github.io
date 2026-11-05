#!/usr/bin/env node
// Fails when code reaches past the design tokens in src/styles/tokens.css.
// The rules are written up in DESIGN.md. Shared by aastr.id and Kotakata:
// keep both copies identical; repo-specific exceptions go in
// scripts/design-allow.json.
//
//   node scripts/check-design.mjs          check src/
//   node scripts/check-design.mjs --list   also print every role in use

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, extname } from 'node:path'

const ROOT = process.cwd()
const allowFile = join(ROOT, 'scripts/design-allow.json')
const ALLOW = existsSync(allowFile) ? JSON.parse(readFileSync(allowFile, 'utf8')) : {}
// Files that may hold raw colour values (token sheets, pixel-art palettes)
const COLOUR_FILES = new Set(['src/styles/tokens.css', ...(ALLOW.colourFiles ?? [])])

const tokens = readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8')
const COLOURS = new Set([...tokens.matchAll(/--color-([a-z-]+):/g)].map((m) => m[1]))
const ROLES = new Set([...tokens.matchAll(/@utility (type-[a-z-]+)/g)].map((m) => m[1]))
const LAYERS = new Set([...tokens.matchAll(/@utility (z-[a-z-]+)/g)].map((m) => m[1]))

const SPACING = new Set(['0', 'px', '0.5', '1', '1.5', '2', '3', '4', '6', '8', '10', '12', '16', '20', '24', '28', '32'])
const OPACITY = new Set(['10', '20', '30', '40', '50', '60', '70', '80', '90'])
// Arbitrary values are only for layout: sizes, positions and grid tracks.
const ARBITRARY_OK = /^-?(w|h|size|min-w|min-h|max-w|max-h|top|left|right|bottom|inset|inset-x|inset-y|translate-x|translate-y|grid-cols|grid-rows|col-span|row-span|aspect|basis|bg-size|origin)-\[/

const COLOUR_PREFIX = /^(bg|text|border|border-[trblxy]|ring|ring-offset|outline|fill|stroke|from|via|to|decoration|divide|placeholder|accent|caret|shadow)-(.+)$/

function checkClass(raw) {
  const cls = raw.replace(/^!/, '').split(':').pop().replace(/!$/, '')
  if (!cls || !/^-?[a-z]/.test(cls)) return null
  if (/\[/.test(cls) && !ARBITRARY_OK.test(cls)) return 'arbitrary value; use a token'

  // Typography
  if (/^text-(xs|sm|base|lg|[2-9]?xl)$/.test(cls)) return 'raw text size; use a type-* role'
  if (/^type-/.test(cls) && !ROLES.has(cls)) return 'unknown type role'
  if (/^font-(thin|extralight|light|semibold|extrabold|black)$/.test(cls)) return 'weight outside normal/medium/bold'
  if (/^font-(serif|display|arcade)$/.test(cls)) return 'font family outside sans/mono/pixel'
  if (/^leading-/.test(cls) && cls !== 'leading-none') return 'line height comes from the type role'
  if (/^tracking-/.test(cls)) return 'letter spacing comes from the type role'

  // Colour
  const c = cls.match(COLOUR_PREFIX)
  if (c) {
    const [name, alpha] = c[2].split('/')
    const isColour = COLOURS.has(name) || /^(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|brand|solarized)(-|$)/.test(name)
    if (isColour) {
      if (!COLOURS.has(name)) return 'colour outside the palette'
      if (alpha && !OPACITY.has(alpha)) return 'opacity outside steps of 10'
    }
  }

  // Spacing
  const s = cls.match(/^-?(p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|space-x|space-y)-(.+)$/)
  if (s && s[2] !== 'auto' && !SPACING.has(s[2])) return `spacing off the scale (${[...SPACING].join(', ')})`

  // Shape and depth
  if (/^rounded(-[trblse]{1,2})?-(xs|sm|md|xl|2xl|3xl)$/.test(cls)) return 'radius outside rounded / rounded-lg / rounded-full'
  if (/^shadow(-(xs|sm|md|lg|xl|2xl|inner))?$/.test(cls)) return 'soft shadow; use shadow-pixel-sm / shadow-pixel / shadow-pixel-lg'
  if (/^border(-[trblxy])?-(4|8)$/.test(cls)) return 'border width outside 1px / 2px'
  if (/^-?z-\d+$/.test(cls) && cls !== 'z-0') return `numeric z-index; use a layer (${[...LAYERS].join(', ')})`
  return null
}

const problems = []
const rolesUsed = new Map()
const add = (file, line, msg) => problems.push(`${file}:${line}  ${msg}`)
const lineOf = (text, index) => text.slice(0, index).split('\n').length

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
}

for (const path of walk(join(ROOT, 'src'))) {
  const file = relative(ROOT, path)
  const ext = extname(path)
  if (/\.test\.|\.d\.ts$/.test(file)) continue
  const text = readFileSync(path, 'utf8')

  if (!COLOUR_FILES.has(file)) {
    for (const m of text.matchAll(ext === '.css' ? /(?<![\w&])#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g : /(?<![\w&])#[0-9a-fA-F]{6}\b|["'`]#[0-9a-fA-F]{3}["'`]|\b0x[0-9a-fA-F]{6}\b|\brgba?\(|\bhsla?\(/g)) {
      // CSS id selectors and URL fragments are not colours
      if (ext === '.css' && /^#[a-z]/i.test(m[0]) && !/^#[0-9a-f]{3,6}$/i.test(m[0])) continue
      add(file, lineOf(text, m.index), `raw colour ${m[0]}; use a token from tokens.css`)
    }
  }
  if (ext === '.css') {
    for (const m of text.matchAll(/font-family:\s*([^;]+);/g)) if (!m[1].startsWith('var(')) add(file, lineOf(text, m.index), `font-family ${m[1].trim()}; use var(--font-*)`)
    continue
  }
  if (ext !== '.ts' && ext !== '.tsx') continue

  for (const m of text.matchAll(/style=\{\{([^}]*)\}\}/gs)) {
    const bad = m[1].match(/\b(color|background(Color)?|fontFamily|fontSize|fontWeight|lineHeight|letterSpacing|margin\w*|padding\w*|borderColor|boxShadow|zIndex)\s*:/)
    if (bad) add(file, lineOf(text, m.index), `inline style ${bad[1]}; use a class`)
  }
  // Class names can live in any string, so check every string literal.
  for (const m of text.matchAll(/`((?:\\.|[^\\`])*)`|"((?:\\.|[^\\"\n])*)"|'((?:\\.|[^\\'\n])*)'/g)) {
    const body = (m[1] ?? m[2] ?? m[3]).replace(/\$\{[^}]*\}/g, ' ')
    for (const raw of body.split(/\s+/)) {
      if (!/^[!a-z0-9:-]*-?[a-z][\w.\-/[\]#%(),:!]*$/.test(raw)) continue
      const why = checkClass(raw)
      if (why) add(file, lineOf(text, m.index), `${raw}: ${why}`)
      const role = raw.split(':').pop()
      if (ROLES.has(role)) rolesUsed.set(role, (rolesUsed.get(role) ?? 0) + 1)
    }
  }
}

if (process.argv.includes('--list')) {
  console.log('Type roles in use:')
  for (const r of ROLES) console.log(`  ${r.padEnd(18)} ${rolesUsed.get(r) ?? 0}`)
}
if (problems.length) {
  console.error(`Design check: ${problems.length} problem(s). See DESIGN.md.\n`)
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log('Design check passed.')
