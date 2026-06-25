# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing homepage for [citydeskmarketing.com](https://citydeskmarketing.com). Astro static site deployed to Cloudflare Pages, domain managed in Cloudflare.

**GitHub:** https://github.com/gmasters-ai/city-desk-marketing

## Commands

```bash
npm run dev      # dev server at http://localhost:4321
npm run build    # build to dist/
npm run preview  # preview the dist/ build
```

## Design Source

Design files in `CityDesk Marketing Landing Page/`:
- `CityDesk Design System.dc.html` — tokens, palette, typography, component specs
- `CityDesk Marketing Home.dc.html` — full page layout with interactive logic
- `ASTRO-HANDOFF.md` — implementation spec; the authoritative reference for copy, spacing, and design rules

## Architecture

**Static Astro site** (`output: 'static'`). No framework islands — the two interactive bits (à la carte calculator, FAQ accordion) use plain inline `<script>` and native `<details>` elements respectively.

```
src/
  pages/index.astro       ← single page, imports all section components
  layouts/Base.astro      ← <html>, <head>, JSON-LD, OG meta
  styles/tokens.css       ← CSS custom properties (colors, fonts, layout vars) + Google Fonts import
  components/             ← one .astro file per section
  data/                   ← packages.ts · cities.ts · directory.ts (single source of truth for all pricing/cities)
public/
  robots.txt · favicon.svg
wrangler.toml             ← Cloudflare Pages config (pages_build_output_dir = ./dist)
```

**Section order** (matches `index.astro`): DatelineBar → SiteHeader → Hero → NetworkStrip → HowItWorks → Packages → Cities → Directory → Testimonials → Faq → FooterCta → SiteFooter.

## Design system rules

- **No gradients, no emoji.** Border separators are `1px solid var(--ink)` full-bleed.
- **Corner radius:** 2px everywhere (`var(--radius)`). Never exceed 3px.
- **Kickers:** `var(--f-mono)`, 12px, `letter-spacing: 0.22em`, uppercase, `color: var(--red)`.
- **Headlines:** `var(--f-display)` (Libre Caslon Display), weight 400, `line-height ~1.05`.
- **Responsive breakpoint:** 960px — all multi-col grids collapse to 1 col; header nav becomes hamburger.
- **Testimonials** section carries a "Placeholder" badge; replace copy and remove badge when real quotes exist.

## Deployment (Cloudflare Pages)

Build command: `npm run build` · Output dir: `dist` · Node version: 18+

Connect the GitHub repo in Cloudflare Pages dashboard and point `citydeskmarketing.com` DNS to the Pages deployment.
