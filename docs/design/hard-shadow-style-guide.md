# Hard-Shadow Design Style Guide

A portable, color-agnostic design system extracted from the StudyApp UI.
The defining feature is the **hard offset shadow**: a solid, un-blurred
`box-shadow` that makes every surface look like a physical card resting on
the page. Swap the color tokens for your own palette — the structure,
shadows, and motion rules are what carry the style.

---

## 1. Design Principles

- **Flat but physical.** No gradients-as-decoration, no blur, no glassmorphism.
  Depth comes only from hard offset shadows, as if cards were paper cutouts.
- **Sharp everything.** `border-radius: 0` on cards, buttons, pills, menus.
  The style breaks if you round corners — keep them square.
- **One ink color does the heavy lifting.** Shadows, borders, primary buttons,
  and headings all use the same near-black "ink" token, which unifies the page.
- **Restraint in motion.** Small translate-based hovers (1–2px), short
  durations (~0.18s), simple easing. No bounces, no scaling.
- **Warm, tinted neutrals.** Backgrounds are not pure white/gray; they are a
  softly tinted "paper" tone with translucent surface layers on top.

---

## 2. Color Tokens (replace values with your palette)

Define these as CSS custom properties on `:root`. The exact hues are yours to
choose — the *relationships* between them are what matter.

```css
:root {
  color-scheme: light;

  /* Base */
  --ink:        <near-black>;          /* text, borders, shadows, primary buttons */
  --ink-soft:   <dark neutral>;        /* secondary text, ~70-80% perceived strength */

  --paper:      <tinted off-white>;    /* page/menu background tone */
  --paper-strong: <saturated accent>;  /* highlight chips, text-on-ink accents */

  /* Surfaces (translucent so the page background shows through) */
  --surface:        <paper @ ~90% alpha>;   /* generic panel */
  --surface-card:   <accent @ ~85% alpha>;  /* interactive cards */
  --surface-section:<paper @ ~60% alpha>;   /* content sections */

  /* Lines */
  --border:      <ink @ ~8% alpha>;    /* hairline borders */
  --border-hard: 2px solid var(--ink); /* emphasized borders (menus, stat cards) */

  /* Semantic (only where needed, e.g. correct/incorrect states) */
  --positive: <green>;  /* used at ~16-18% alpha for fills, ~40-60% for borders */
  --negative: <red>;
}
```

**Rules of thumb**
- `--ink` should be almost black but not pure `#000` (e.g. a very dark warm/cool neutral).
- Surfaces are *translucent* versions of paper/accent so the background gradient
  subtly shows through — this keeps the flat style from feeling sterile.
- Semantic colors are the only "loud" hues; everything else stays in the
  ink/paper family.

---

## 3. The Shadow System (the signature feature)

One shadow style, used everywhere, always in solid full-opacity ink:

```css
/* Desktop */
box-shadow: 7px 7px 0 var(--ink);

/* Mobile (<= 720px) — smaller offset, same character */
box-shadow: 5px 5px 0 var(--ink);

/* Dropdowns / floating menus — slightly tighter */
box-shadow: 5px 5px 0 var(--ink);
```

**Hard rules**
- **Zero blur, zero spread.** `Xpx Ypx 0` — never add a blur radius. The crisp
  edge *is* the style.
- **Full opacity.** The shadow is `var(--ink)` at 100%, not a soft rgba tint.
- **Equal X and Y offsets** (light source at top-left, shadow falls
  bottom-right). Keep the offset direction consistent across the entire site.
- **One scale step down on mobile** (7px → 5px) so cards don't feel cramped.
- Elements that should feel *flat* (text chips, section headings, pills) get
  `box-shadow: none` — don't shadow everything; contrast between shadowed
  cards and flat elements creates the hierarchy.

**Optional pressed state** (nice for buttons in a portfolio): on `:active`,
translate the element toward the shadow and shrink the offset, so it looks
physically pressed:

```css
.button:active {
  transform: translate(3px, 3px);
  box-shadow: 4px 4px 0 var(--ink);
}
```

---

## 4. Surfaces & Borders

| Element            | Background                  | Border                        | Shadow        |
|--------------------|-----------------------------|-------------------------------|---------------|
| Interactive card   | `--surface-card` (~85% α)   | none                          | 7px hard      |
| Content section    | `--surface-section` (~60% α)| 1px `--border` hairline       | 7px hard      |
| Stat / metric card | accent, slight vertical grad| `2px solid var(--ink)`        | 7px hard      |
| Dropdown menu      | `--paper` (opaque)          | `2px solid var(--ink)`        | 5px hard      |
| Chip / heading tag | `--paper-strong` (opaque)   | none                          | none          |
| Answer option row  | near-white (~86% α)         | 1px `--border` hairline       | none          |

- Hairline borders are ink at ~8% alpha — barely visible, just enough to
  define an edge where the shadow alone isn't enough.
- The "hard border" (`2px solid var(--ink)`) is reserved for elements that
  float above the page (menus) or need extra weight (stat cards).

---

## 5. Page Background

A warm layered background instead of a flat fill:

```css
body {
  background:
    radial-gradient(circle at top left,  <accent @ ~60% alpha>, transparent 30%),
    radial-gradient(circle at top right, <ink @ ~5% alpha>,     transparent 26%),
    linear-gradient(180deg, <paper-light> 0%, <paper-mid> 50%, <paper-deep> 100%);
}
```

- Two faint radial washes in the top corners + a gentle top-to-bottom vertical
  gradient in the paper family.
- Because cards are translucent, this background glows through them slightly.

---

## 6. Typography

- **Stack:** a geometric-humanist sans, e.g.
  `'Avenir Next', 'Segoe UI Variable', 'Segoe UI', sans-serif` — or any
  modern sans you prefer for the portfolio.
- **Display headings:** `clamp(1.85rem, 3.5vw, 3rem)`, `line-height: 1`,
  tight tracking (`letter-spacing: -0.03em`), constrained measure (`max-width: 16ch`).
- **Section headings as chips:** `h2` inside a section is an inline-block with
  an opaque accent background and padding (`0.45rem 0.8rem`) — a highlighted
  label rather than plain text.
- **Labels / legends:** small (0.8–0.875rem), `font-weight: 600–650`,
  `text-transform: uppercase`, `letter-spacing: 0.05–0.06em`.
- **Body:** 0.9–1rem, `line-height: 1.5–1.6`, in `--ink-soft`.
- Weights skew heavy: 600–700 for anything interactive or labeling; the odd
  650 in-between weight works well with variable fonts.

---

## 7. Interaction & Motion

```css
transition: transform 0.18s ease, background-color 0.18s ease;
```

- **Hover on cards:** `transform: translateY(-2px)` + background nudged a few
  percent more opaque. The shadow does NOT move — the card lifts away from it,
  which sells the physicality.
- **Hover on buttons:** `translateY(-1px)` + slightly lighter/darker fill.
- **Focus:** visible but quiet — `outline: 2px solid <ink @ 20% alpha>` with
  `outline-offset: 2px`, or a `0 0 0 3px <ink @ 14% alpha>` ring via box-shadow
  for composite controls. Never remove focus styles without a replacement.
- **Entry animation:** simple opacity fade-in, ~0.28s ease-in-out. Nothing
  slides or bounces.
- **Muted-to-full icon buttons:** idle at `opacity: 0.45–0.55`, full opacity
  on hover/expanded, transitioning opacity only.

---

## 8. Buttons

```css
.button {
  border: 0;
  border-radius: 0;
  padding: 11px 16px;
  font-weight: 650;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.18s ease, background-color 0.18s ease;
}

.button--primary   { background: var(--ink); color: var(--paper-strong); }
.button--secondary { background: <accent @ ~75% alpha>; color: var(--ink); }
```

- Primary = ink fill with accent-colored text (inverted).
- Secondary = translucent accent fill with ink text.
- Hover: `translateY(-1px)` and a small fill change; add the pressed state
  from §3 if the button carries a hard shadow.

---

## 9. Layout

- **Shell:** `width: min(100%, 1320px)` centered; content pages
  `min(100%, 1200px)`.
- **Card grids:** `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
  with `gap: 20px`; stat rows use `minmax(140px, 1fr)` with `gap: 16px`.
- **Card padding:** ~18px 20px desktop, ~14px mobile.
- **Spacing rhythm:** multiples of 4 (4/6/8/12/16/20/24/28).
- **Safe areas:** pad the bottom with
  `max(48px, calc(24px + env(safe-area-inset-bottom, 0px)))`.
- Breakpoints at 720px and 480px; at 720px, drop shadows from 7px → 5px and
  stack horizontal cards vertically.

---

## 10. Do / Don't

**Do**
- Use one shadow recipe everywhere it appears.
- Let some elements stay flat — contrast creates hierarchy.
- Keep corners square, borders thin, and ink consistent.
- Use translucent surfaces over a softly gradient background.

**Don't**
- Add blur or lower the shadow's opacity ("soft" hard shadows read as a mistake).
- Mix shadow directions or offsets arbitrarily.
- Round corners on some components but not others.
- Introduce extra hues beyond ink, paper, one accent, and semantic green/red.

---

## Quick-Start Snippet

Minimal starter for a new project:

```css
:root {
  --ink: #111;                /* your near-black */
  --paper: #f7f4ee;           /* your tinted off-white */
  --accent: #d9c2a0;          /* your accent — change freely */
  --shadow: 7px 7px 0 var(--ink);
  --shadow-sm: 5px 5px 0 var(--ink);
}

.card {
  background: color-mix(in srgb, var(--accent) 85%, transparent);
  border-radius: 0;
  padding: 18px 20px;
  box-shadow: var(--shadow);
  transition: transform 0.18s ease, background-color 0.18s ease;
}

.card:hover { transform: translateY(-2px); }

@media (max-width: 720px) {
  .card { box-shadow: var(--shadow-sm); }
}
```
