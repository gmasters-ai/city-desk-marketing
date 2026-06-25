# CityDesk Marketing — Astro Build Handoff

Build the marketing/sales site for **citydeskmarketing.com** in Astro, matching the design in `CityDesk Marketing Home.dc.html` and the system in `CityDesk Design System.dc.html`.

> The `.dc.html` files are the visual source of truth. They use inline styles for streaming preview; in Astro, port them to real CSS (global tokens + scoped component styles). Pixel values, colors, copy, and section order should match.

---

## 1. Stack & setup

```bash
npm create astro@latest citydeskmarketing -- --template minimal --typescript strict
cd citydeskmarketing
npx astro add sitemap
```

- **Astro** (static output, `output: 'static'`) — this is a marketing site; render everything at build time.
- No UI framework needed. Plain `.astro` components. Add an island only if the à la carte calculator (below) needs interactivity — a tiny inline `<script>` is enough; don't pull in React for it.
- Deploy target: any static host (Netlify / Vercel / Cloudflare Pages). Keep it framework-agnostic.

### Fonts
Self-host via [Fontsource] or use Google Fonts `<link>`. Families + weights:
- **Libre Caslon Display** — 400 (masthead, display headlines, prices, numerals)
- **Newsreader** — 400/500/600 + 400 italic, optical sizing (section heads, lede, editorial body)
- **Hanken Grotesk** — 400/500/600/700/800 (nav, buttons, UI, body)
- **IBM Plex Mono** — 400/500/600 (kickers, datelines, prices, domains, labels)

```
https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Hanken+Grotesk:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap
```

---

## 2. Design tokens (`src/styles/tokens.css`)

```css
:root {
  /* Color */
  --paper:      #F5F1E8;  /* page background (newsprint) */
  --paper-card: #FCFAF4;  /* cards on paper */
  --paper-alt:  #EFE9DB;  /* alternating section bg */
  --rule:       #DED7C7;  /* hairline rules inside cards */
  --ink:        #1B1815;  /* primary text, dark sections, borders */
  --ink-soft:   #4A443C;  /* body copy */
  --ink-mute:   #6B6457;  /* captions, mono labels */
  --red:        #C2402E;  /* press red — primary accent / CTAs / links */
  --red-dark:   #9E3122;  /* red hover */
  --navy:       #1C2B3A;  /* directory section */
  --navy-card:  #243748;
  --gold:       #E0A23C;  /* featured / "more soon" accents */
  --live:       #1B8A4B;  /* "Live" status dot */

  /* Type */
  --f-display: "Libre Caslon Display", serif;
  --f-serif:   "Newsreader", Georgia, serif;
  --f-sans:    "Hanken Grotesk", system-ui, sans-serif;
  --f-mono:    "IBM Plex Mono", ui-monospace, monospace;

  /* Layout */
  --maxw: 1200px;
  --pad: 32px;
  --radius: 2px;        /* newspaper = near-sharp corners; never go above 3px */
}

* { box-sizing: border-box; }
html, body { margin: 0; }
body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--f-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
::selection { background: var(--red); color: #fff; }
```

### System rules (keep it editorial, not SaaS-generic)
- **Section dividers:** every major section is separated by a `1px solid var(--ink)` top/bottom border, full bleed. This "ruled" look is core to the brand.
- **Containers:** `max-width: var(--maxw); margin-inline: auto; padding-inline: var(--pad)`.
- **Section vertical padding:** ~80px top & bottom (`76–80px`).
- **Kickers:** mono, 12px, `letter-spacing: 0.22em`, uppercase, `color: var(--red)`. Often prefixed with a 28px red rule.
- **Headlines:** `--f-display`, weight 400, tight `line-height: ~1.05`, `letter-spacing: -0.01em`.
- **Lede / supporting copy:** `--f-serif` (Newsreader), 17–20px.
- **Body / UI:** `--f-sans` 14.5–17px.
- **Corners:** 2px radius everywhere. No big rounded cards, no soft shadows except the two intentional deep "lift" shadows (hero clipping, Authority card).
- **No gradients. No emoji.** Status uses a `●` glyph + color.

---

## 3. Page structure (`src/pages/index.astro`)

Compose from components in this order (all exist in the homepage DC):

1. `DatelineBar` — ink strip: live date · tagline · "● 5 City Papers Live" (gold dot). Mono 11px.
2. `SiteHeader` — sticky, `rgba(245,241,232,.92)` + `backdrop-filter: blur(8px)`, bottom `1px solid ink`. Logo left, nav center, "Sign in" + red "Create free account" right.
3. `Hero` — 2-col grid (`1.08fr / 0.92fr`). Left: kicker, display H1 ("Authority backlinks, published as real local news."), Newsreader lede, two CTAs, mono microcopy. Right: **newspaper clipping mock** (see §5).
4. `NetworkStrip` — ink band: "Published across the network" + 5 city wordmarks (Libre Caslon) + gold "+ more soon".
5. `HowItWorks` — 4 steps, each with a `border-top: 2px solid ink`, big red Caslon numeral (01–04), Newsreader h3, body.
6. `Packages` (id="packages", bg `--paper-alt`) — 4 bundle cards + à la carte calculator. **Data-driven (see §4).** Authority card is the dark "Most popular" variant.
7. `Cities` (id="cities") — 3-col grid: 5 live city cards + 1 ink "More cities, every month" card. Data-driven from the cities list.
8. `Directory` (id="directory", bg `--navy`) — secondary product. Left intro, right two tier cards: Standard $89/yr, Featured $149/yr (gold-bordered, "Featured" tag). Featured copy must mention the **sidebar banner on article pages**.
9. `Testimonials` — 3 quote figures, `border-top: 2px solid ink`. **Currently placeholder copy** — wire to a CMS/collection later; keep the "Placeholder" tag until real quotes exist.
10. `Faq` (id="faq", bg `--paper-alt`, max-width 860px) — accordion (see §4).
11. `FooterCta` — full-bleed red band, Caslon H2 "Open your free desk today.", two CTAs.
12. `SiteFooter` — ink, 4-col (brand blurb / Product / Company / Get started) + bottom bar (© + Privacy/Terms).

---

## 4. Content as data (don't hardcode in markup)

Put product data in `src/data/` so pricing/cities are editable in one place. Use Astro Content Collections or plain TS modules.

```ts
// src/data/packages.ts
export const PER_ARTICLE = 12;
export const bundles = [
  { id: 'starter',   name: 'Starter',   articles: 25,  cadence: '2× / week', duration: '~3 months',  perArticle: 12, total: 300,  popular: false },
  { id: 'growth',    name: 'Growth',    articles: 50,  cadence: '2× / week', duration: '~6 months',  perArticle: 11, total: 550,  popular: false },
  { id: 'authority', name: 'Authority', articles: 100, cadence: '2× / week', duration: '~12 months', perArticle: 10, total: 1000, popular: true  },
  { id: 'agency',    name: 'Agency',    articles: 250, cadence: '3× / week', duration: '~12 months', perArticle: 9,  total: 2250, popular: false },
];

// src/data/directory.ts
export const directoryTiers = [
  { id: 'standard', name: 'Standard listing', price: 89,  per: 'year', features: ['Profile in the network directory', 'Indexed, permanent listing', 'Name, contact, category & link'] },
  { id: 'featured', name: 'Featured listing', price: 149, per: 'year', featured: true,
    features: ['Everything in Standard', 'Sidebar banner on article pages', 'Sitewide exposure across the paper'] },
];

// src/data/cities.ts  — single source of truth; new markets just append here
export const cities = [
  { name: 'CityDesk Austin',       domain: 'citydeskaustin.com',       status: 'live' },
  { name: 'CityDesk Denver',       domain: 'citydeskdenver.com',       status: 'live' },
  { name: 'CityDesk Houston',      domain: 'citydeskhouston.com',      status: 'live' },
  { name: 'CityDesk Indianapolis', domain: 'citydeskindianapolis.com', status: 'live' },
  { name: 'CityDesk Orlando',      domain: 'citydeskorlando.com',      status: 'live' },
];
```

`Packages.astro` and `Cities.astro` map over these arrays. Adding a city or changing a price is a one-line data edit.

### Two bits of interactivity (vanilla JS islands — no framework)

**À la carte calculator** (in Packages): a `<input type="range" min="1" max="500">` bound to a total = `qty × 12`, formatted `$X,XXX`. Inline `<script>`:
```html
<script>
  const r = document.getElementById('alc-range');
  const total = document.getElementById('alc-total');
  const label = document.getElementById('alc-label');
  const fmt = n => '$' + n.toLocaleString('en-US');
  function sync(){ const q=+r.value; total.textContent=fmt(q*12); label.textContent=q+(q===1?' article':' articles'); }
  r.addEventListener('input', sync); sync();
</script>
```
Style the range thumb red (22px circle, 3px paper border) — see the DC's `<style>` block for the exact `::-webkit-slider-thumb` / `::-moz-range-thumb` rules.

**FAQ accordion:** native `<details>`/`<summary>` is the no-JS-needed choice. Style `summary` (Newsreader 20px, red `+` that becomes `–` via `details[open] summary .sign`), hide the default marker (`summary::-webkit-details-marker { display:none }`). FAQ content is in §6.

---

## 5. The hero clipping mock (signature element — get this right)

A faux newspaper article card that visually proves "real local news." Structure:
- Offset ink "shadow card" behind (`position:absolute; inset:18px -10px -16px 26px; background:var(--ink)`), then the white card on top with `box-shadow: 0 18px 40px -22px rgba(0,0,0,.45)`.
- Card: `var(--paper-card)`, `1px solid var(--ink)`.
- Top row: "CityDesk Austin" (Caslon 18px) + section label (mono) with a `2px solid ink` bottom rule.
- Mono byline, Newsreader headline, two Newsreader paragraphs.
- One **anchor link** styled red, weight 600, `border-bottom: 2px solid #E7B7AC` — this is "the client's link."
- An ink tag pill below: gold `⬥` + mono "Your client's contextual link".

---

## 6. Copy (final — use verbatim)

**Hero:** kicker `HYPERLOCAL LINK BUILDING FOR AGENCIES` · H1 "Authority backlinks, published as real local news." · lede "CityDesk places your clients inside genuine hyperlocal newspapers — contextual, indexed, and permanent. Buy in bulk, scale across markets, and run every client from one desk." · CTAs "Create a free account" / "See backlink packages" · micro "No card to start · 5 city papers live · New markets every month".

**How it works:** 01 Open your free desk — "Create an account in seconds and add a white-labeled workspace for each client you manage." / 02 Choose volume — "Pick a bundle or order any number of articles à la carte. Set your target URL and anchor." / 03 We write & publish — "Our local desks produce a genuine, on-topic article with your contextual link — on a real city paper." / 04 Indexed & permanent — "Live links land in your dashboard with URLs and dates. They stay published — no rentals, no expiry."

**Packages heading:** "Buy by the bundle. The more you run, the less you pay per article." · sub "Base rate $12 / article · every bundle is published on a steady cadence so links land naturally."

**À la carte:** "Need a custom volume? Order any number of articles." · note "Flat $12 / article · bundles bring it as low as $9".

**Cities heading:** "Five city papers live today. New markets every month." · sub "Every CityDesk paper runs real hyperlocal coverage across seven sections — the kind of site readers and search engines both trust." · the ink card: "More cities, every month." / "Need a specific market for a client? Ask us — we prioritize by demand."

**Directory:** "The CityDesk Business Directory." · "List a business across the network for a permanent, indexed directory profile. A simple add-on for clients who want a steady local presence beyond articles." · "Billed annually, per business. Add or remove listings any time from your desk."

**Footer CTA:** "Open your free desk today." · "Set up a workspace, add your first client, and buy your first links in minutes."

**FAQ** (6 items):
1. *Are these real articles on real websites?* — "Yes. Every link is placed inside a genuine, original article published on a live CityDesk city newspaper with real hyperlocal coverage across seven sections — not a private blog network or a thin link farm."
2. *Do the links stay live permanently?* — "Yes. Placements are permanent. Once an article is published it stays on the site and in your dashboard — there are no monthly rentals and nothing expires when your bundle ends."
3. *Can I set the target URL and anchor text?* — "You set the target URL and preferred anchor for each order. Our editors place it contextually inside an on-topic article so it reads naturally and passes editorial review."
4. *How does this work for an agency with many clients?* — "Each client gets its own white-labeled desk inside your account. Buy bundles or à la carte per client, track every placement in one dashboard, and export clean reports with live URLs and publish dates."
5. *How fast do articles get published?* — "Bundles publish on a steady cadence — typically two to three articles per week — so links land naturally over time rather than all at once. À la carte orders enter the same publishing queue."
6. *How is the business directory different from backlinks?* — "The directory is a separate annual product: a permanent listing for a business at $89/year, or $149/year for a Featured listing that also runs a banner in the sidebar of article pages across the paper. Backlinks are the editorial placements; the directory is an always-on presence."

---

## 7. Logo / brand

Wordmark only (icon TBD — user will supply). Render: `CityDesk` in Libre Caslon Display ~27px + a 1px vertical rule + `MARKETING` in IBM Plex Mono 12px, `letter-spacing: 0.28em`, uppercase, red. Same lockup in the footer (lighter). Build it as `<Logo />` so the eventual real mark drops in cleanly. Favicon: reuse the network's SVG mark recolored to press red once provided.

---

## 8. Components to scaffold (`src/components/`)

`DatelineBar.astro` · `SiteHeader.astro` · `Logo.astro` · `Button.astro` (variants: `primary` red / `secondary` outline / `ink`) · `Hero.astro` · `ClippingMock.astro` · `NetworkStrip.astro` · `HowItWorks.astro` · `Step.astro` · `Packages.astro` · `BundleCard.astro` (prop `popular` → dark variant) · `AlaCarte.astro` · `Cities.astro` · `CityCard.astro` · `Directory.astro` · `TierCard.astro` · `Testimonials.astro` · `Faq.astro` (`<details>`) · `FooterCta.astro` · `SiteFooter.astro`.

## 9. Accessibility & responsive
- Real heading hierarchy (one `<h1>`, sequential `<h2>`/`<h3>`). Nav is a `<nav>` with a real list. Buttons that submit are `<button>`; links are `<a>`.
- Min body text 14.5px; CTA hit areas ≥ 44px tall.
- **Breakpoints:** below ~960px collapse all 4-col / 3-col / 2-col grids to 1 column; header nav → hamburger; hero stacks (clipping mock below copy). The DC is desktop-first at 1200px — you own the mobile pass.
- Respect `prefers-reduced-motion` for the backdrop blur / any transitions.

## 10. SEO
- Per-page `<title>`/meta description, canonical, OpenGraph (mirror the city sites' meta pattern). Add `@astrojs/sitemap`, a `robots.txt`, and JSON-LD `Organization` + `Product`/`OfferCatalog` for the bundles and directory tiers.
