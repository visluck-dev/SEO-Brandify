# Design System: VisLuck — UK career-tech platform

**Site:** visluck.com · **Audience:** UK job-seekers (experienced professionals, international job-seekers, graduates, career movers) · **Job of the design:** feel like a premium, trustworthy career-tech product — not a generic recruitment agency template.

| Dial | Level | Rationale |
|------|-------|-----------|
| Creativity | `6` | Confident and modern, but trust and clarity beat expressiveness |
| Density | `5` | Balanced marketing sections; the dashboard component sits at `7` |
| Variance | `6` | Split hero, asymmetric grids, alternating rhythm — never chaotic |
| Motion | `4` | Subtle, purposeful, transform/opacity only; calm on every page |

---

## 1. Visual Theme & Atmosphere
Predominantly white and light. Deep navy carries authority (headings, primary buttons, the footer and one closing CTA band); a single calm teal accent signals progress, action and "live" product moments. The feeling is a well-organised professional workspace: generous whitespace, hairline borders, soft tinted shadows, rounded product-like cards, and one strongly product-flavoured artefact — the candidate dashboard — that makes the promise ("complete visibility") tangible. Nothing is dark-mode, nothing glows, nothing shouts.

## 2. Color Palette & Roles
### Neutrals & ink
- **Paper** (#FFFFFF) — page background, cards
- **Mist** (#F6F8FB) — alternating section background, input backgrounds
- **Fog** (#EEF2F6) — subtle fills, neutral pills, table header
- **Hairline** (#E3E8EF) — 1px borders and dividers
- **Hairline Strong** (#CBD5E1) — hover borders, focus containers
- **Ink** (#0B1F3A, navy-900) — headings, primary buttons, footer, CTA band. Never pure black
- **Ink Deep** (#081426, navy-950) — footer gradient bottom, dashboard chrome text
- **Navy 800 / 700** (#112A4E / #1B3A6B) — hover state of primary buttons, secondary navy surfaces
- **Navy Tint 100 / 50** (#DCE4F0 / #EEF2F8) — soft navy backgrounds in the dashboard and eyebrows on navy
- **Body** (#3B4A5E) — paragraph text (9:1 on white)
- **Muted** (#64748B) — captions, metadata, table secondary text (4.8:1 on white)

### Accent (one only)
- **Teal 700** (#0F7274) — teal *text*, teal button fills, links, active nav (5.7:1 on white)
- **Teal 600** (#14898B) — icons, large text, focus rings, gradients (≥ 3:1: large text / UI only)
- **Teal 500** (#14A3A5) — decorative gradients, the "live" pulse dot
- **Teal 100 / 50** (#CCEDEE / #E8F6F6) — pill backgrounds, hero glow, icon tiles

### Status (dashboard only, as 10 % tint + 700 text)
- **Progressing** (#0E8A5F on #E6F4EE) — shortlisted, interview confirmed
- **Waiting** (#B45309 on #FDF1E3) — pending response, follow-up due
- **Scheduled** (#1D4ED8 on #E8EEFC) — interview booked
- **Neutral** (#64748B on #EEF2F6) — applied / no change

### Banned
Purple/neon gradients · pure black · glows · saturated reds outside error text · dark full-page sections beyond the one CTA band and the footer.

## 3. Typography Rules
- **Family:** `Manrope Variable` (self-hosted latin + latin-ext subsets in `client/public/fonts`, preloaded) for everything. Body is exposed as `--font-body` so it can be swapped independently later. No serif anywhere. Numerals in the dashboard use `font-variant-numeric: tabular-nums`.
- **Display (h1):** `clamp(2.5rem, 2rem + 2.6vw, 4.25rem)`, weight 800, tracking −0.03em, leading 1.05. Hierarchy comes from weight and colour (Ink vs Body), never from screaming size.
- **h2:** `clamp(1.875rem, 1.5rem + 1.6vw, 2.75rem)`, weight 800, tracking −0.025em, leading 1.1
- **h3:** 1.375rem / 1.3, weight 700, tracking −0.01em
- **Lead:** 1.125–1.25rem / 1.6, colour Body
- **Body:** 1rem / 1.65, colour Body, max 65ch
- **Small / meta:** 0.875rem / 1.45, colour Muted
- **Eyebrow:** 0.75rem, weight 700, uppercase, tracking 0.12em, Teal 700 (on navy: Teal 100)

## 4. Component Stylings
* **Buttons:** radius 0.75rem, height 2.75rem (md) / 3rem (lg) / 3.5rem (xl hero). `primary` = Ink fill, white text, hover Navy 800, active `translateY(1px)`. `accent` = Teal 700 fill. `outline` = 1px Hairline Strong, Ink text, hover Mist. `ghost` = transparent, hover Mist. `link` = Teal 700 underline offset 4px. Focus: 2px Teal 600 ring, 2px offset. No glows.
* **Cards:** Paper fill, 1px Hairline, radius 1rem (cards) / 1.5rem (panels), shadow `card` (`0 1px 2px rgb(11 31 58 / .04), 0 10px 30px -12px rgb(11 31 58 / .10)`); hover shadow `hover` + Hairline Strong border, 150ms. Used only when elevation communicates hierarchy — dense lists use `border-t` dividers on Mist instead.
* **Icon tiles:** 2.75rem square, radius 0.75rem, Teal 50 fill, Teal 700 icon (lucide, 1.5px stroke, 20px).
* **Pills / badges:** radius full, 0.75rem text, weight 600, tint background + 700 text (see status).
* **Inputs:** label above (0.875rem, weight 600, Ink), input 2.75rem high, Mist fill, 1px Hairline, radius 0.75rem, focus Paper fill + Teal ring; helper text Muted; error text `#B91C1C` below with the field outlined red. No floating labels.
* **Dashboard (product artefact):** Paper panel, radius 1.5rem, 1px Hairline, shadow `dashboard` (`0 30px 80px -30px rgb(11 31 58 / .35)`); window chrome bar on Mist; KPI tiles with tabular numerals and a small delta; a table with Fog header and hairline rows; status pills; a pulsing Teal 500 "live" dot is the one perpetual micro-interaction; the "Interview scheduled" card is static.
* **Loading / empty:** skeleton blocks matching layout; never spinners (the site is static, so these rarely appear).

## 5. Layout Principles
- Container `max-width: 1200px`, gutters `1rem` (mobile) / `1.5rem` (tablet) / `2rem` (desktop). CSS Grid for structure.
- Section rhythm `clamp(3.5rem, 8vw, 7rem)` vertical; sections alternate Paper / Mist; exactly one navy band (final CTA) plus the navy footer.
- **Hero:** split layout — copy left (≈ 45 %), dashboard right (≈ 55 %), single primary CTA, three proof chips beneath. No centred hero.
- **Feature sections:** never "3 equal cards". Services use a 2 + 4 asymmetric bento (two featured, four compact); How-it-works is a vertical timeline with a sticky heading column; Why VisLuck is a divider-based 2-column list; audiences are a 4-up on desktop that collapses 2 → 1.
- **Workspace (`/demo`, `/app`, `/ops`):** its own shell, not the marketing chrome — Mist page background, white sidebar (16rem, ≥ lg) with a hairline right border, white top bar (3.5rem), content `max-width: 1200px`; phones get a bottom tab bar (four daily screens + More). Panels are white, radius 1rem, hairline border, `card` shadow. Density here is `7`: tables use a Fog header and hairline rows, KPI tiles use tabular numerals. Every empty state is a dashed Mist panel that names the next event and its date.
- Full-height never uses `h-screen`; `min-h-[100dvh]` only if needed.
- Mobile-first: every multi-column layout collapses to one column below 768px; no horizontal scroll at 375px; body text ≥ 1rem; touch targets ≥ 44px.

## 6. Motion & Interaction
- Only `transform` and `opacity` (+ colour for state). Never layout properties. Never `transition: all`.
- Hover: 150ms; colour changes 200ms; reveals 250–300ms; easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- **No animation on first paint above the fold** (LCP + the ui-animation rule). Below the fold, only staggered lists and grids (services, steps, why, audiences, metrics) use a single fade + 8px rise, once, 40ms stagger, ≤ 300ms total; text blocks and the product dashboard never scroll-reveal.
- **Hero:** copy rises in a 90ms stagger, the dashboard settles in after it, then the dashboard plays a four-scene story (Apply → Shortlist → Interview → Follow-up, 4.5s each, looping): rows slide in, KPIs count up, status pills swap, a notification card narrates. Visitors can drive it with the scene tabs (which stops autoplay); hover/focus, off-screen and hidden tabs pause it. Everything else renders static on mount; the live dot is the one perpetual loop.
- Accordion uses Radix height variables at 200ms; sheet (mobile nav) slides 300ms open / 200ms close with the drawer curve `cubic-bezier(0.32, 0.72, 0, 1)`.
- `prefers-reduced-motion: reduce` → all of the above become instant; the pulse stops.

## 7. Anti-Patterns (Banned)
No emojis (use lucide icons; check marks are icons) · no stock photography of "smiling recruiters" · no fabricated metrics, testimonials or client logos (sections stay hidden behind flags until real) · no "500+ clients" until substantiated · no pricing anywhere · no dark full-page sections · no glows, no purple, no gradient text · no "Scroll to explore", chevrons or bouncing arrows · no generic names in sample data ("Acme", "John Doe") — the dashboard uses plausible fictional UK companies and roles and is captioned *"Illustrative dashboard — sample data"* · no AI copy clichés ("Elevate", "Seamless", "Unleash") — copy is the client brief, verbatim, UK spelling.
