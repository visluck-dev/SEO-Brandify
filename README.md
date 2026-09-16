# VisLuck website

Marketing site for [visluck.com](https://visluck.com) — personalised UK job-search support. Static React app deployed to GitHub Pages from `main`.

## Stack

React 18 · Vite 5 · TypeScript · Tailwind CSS 3 · shadcn/ui (Radix) · wouter · framer-motion · react-hook-form + zod · EmailJS

## Getting started

Requires Node 22+ (CI builds on Node 24).

```bash
npm ci
npm run dev       # http://localhost:5173
npm run build     # static output in dist/
npm run preview   # serve the production build
npm run check     # TypeScript
```

## Where things live

| Path | What |
|---|---|
| `DESIGN.md` | Design system: colours, type, spacing, motion, banned patterns |
| `client/src/constants/` | **All copy and data** (nav, hero, services, steps, FAQs, dashboard sample data, legal drafts, SEO titles) |
| `client/src/components/sections/` | Page sections composed by `client/src/pages/*` |
| `client/src/components/dashboard/` | The illustrative candidate dashboard (sample data only) |
| `client/src/components/forms/` | Consultation form (schema, fields, success state) |
| `client/public/` | Favicons, `og-image.png`, `robots.txt`, `sitemap.xml`, `CNAME` |
| `scripts/og/` | HTML templates used to render the PNG assets with headless Edge/Chrome |

## Content switches

- `constants/testimonials.ts` → `SHOW_TESTIMONIALS` (hidden until real, attributable quotes exist)
- `constants/metrics.ts` → `SHOW_METRICS` + values (hidden until real operational numbers are supplied)
- `constants/legal-docs-a.ts` → `LEGAL_DRAFT_NOTICE` (remove once policies are approved)
- `.env` → `VITE_CV_UPLOAD_MODE=file|link` (see `EMAILJS_SETUP.md`)

## Regenerating image assets

```bash
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --screenshot=client/public/og-image.png file:///%CD%/scripts/og/og-image.html
```

Same pattern for `apple-touch-icon.png` (180×180, `touch-icon.html`) and `favicon.png` (64×64, `favicon.html`).

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes `dist/` to GitHub Pages (custom domain via `client/public/CNAME`). `index.html` is copied to `404.html` so client-side routes resolve.
