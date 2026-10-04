# Abdul Haseeb — Personal Brand Portfolio

A one-page editorial-tech portfolio for **Abdul Haseeb** (BSCS Student · Python
Developer · AI/ML Enthusiast) plus a 51-article, SEO-driven developer notebook.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion +
React Three Fiber (drei)**. Self-hosted fonts. Zero third-party analytics by
default.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all 51 article routes pre-render)
npm run start    # serve the production build
```

---

## What's inside

### The one-page experience
- **Hero** — "The person behind the code", cursor-parallax portrait
- **Signature 3D** — "Built Under My Name": a React Three Fiber `AH` monogram
  with orbiting technical fragments, portrait, and a self-drawing signature
- **Journey** — "How I Got Here" (HTML/CSS → Python → Android → AI/ML direction)
- **Projects** — "Things I've Actually Built", with live animated demos
  (console typing for the Python systems, an animated café + calculator, and a
  full SneakerStore Android walkthrough). No fake screenshots.
- **Thinking** — interactive "Before I Code" process (problem → improve)
- **Direction** — "Where I'm Going" AI/ML constellation
- **Skills** — connected constellation, Python emphasized, no fake percentages
- **GitHub** — honest placeholder until a real handle is added
- **Blog preview + hub** — "From My Notebook", search + topic filters
- **Contact** — validated form (no fake success state) + **signature footer**

### The notebook (`/notebook`)
- 51 full articles (~900–1,050 words each, 5–6 min reads) across 7 hubs:
  Python, AI & ML, Projects, Problem Solving, Software Development,
  Student Journey, Android
- Editorial article pages with table of contents, reading progress, code
  copy buttons, FAQs (with `FAQPage` schema only where real), author block,
  and a "Keep Building." end section
- Original generated featured images per article (SVG + PNG + WebP)

---

## Configuration (environment variables)

No personal value is hardcoded and **no `YOUR_...` placeholder text ships to
production**. Set what you have; anything unset is simply left out of the page.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Canonical origin.** Set this to the custom domain once one is connected (e.g. `https://abdulhaseeb.dev`). Every canonical tag, sitemap entry, OG URL and JSON-LD `@id` derives from it, and `next.config.js` then 301s the Vercel URL and `www.` variants to it. Unset → the current Vercel production domain is canonical. |
| `NEXT_PUBLIC_GITHUB_URL` | Real GitHub profile → enables the header/footer/contact links, the "open profile" CTA and `Person.sameAs`. |
| `NEXT_PUBLIC_LINKEDIN_URL` | Real LinkedIn profile (added to `sameAs`). |
| `NEXT_PUBLIC_TWITTER_URL` | Real X/Twitter profile (added to `sameAs` + card creator). |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Enables the contact form's mailto hand-off and `Person.email`. |
| `NEXT_PUBLIC_PORTRAIT_IMAGE` | Path to a real portrait in `/public/images` — optimised, sized and alt-texted automatically. Without it the hero renders a designed monogram panel. |
| `NEXT_PUBLIC_LOCATION` | Optional city (e.g. `Lahore, Pakistan`) for `Person.homeLocation`. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console verification token. |

**Unset values degrade honestly, never into placeholder text.** With no GitHub
URL, the GitHub section becomes a "built in the open" block that links to the
real case studies; with no email, the contact section points at the projects
and notebook instead of faking a working inbox.

---

## The article content model

Every article is **one object** in `content/articles.ts` with this shape
(section 80's reusable model):

```ts
{
  slug, title, category, hub, feature, primaryKeyword, secondaryKeywords,
  searchIntent, audience, readingTime, excerpt
}
```

The UI, routing, sitemap, structured data, related-articles engine, search and
filters all derive from that single source of truth.

**Article bodies** live in `lib/articleContent.ts` (category-authored
templates) with additive deep-dive sections in `content/sections/*.ts`. The
compiler splices the sections before the FAQ/outro so every piece clears the
word target. Reading times are computed from actual word counts — never
inflated.

**Adding a new article** = add one metadata object to `content/articles.ts` +
one writer function in `lib/articleContent.ts` (+ optionally an expansion in
`content/sections/`). Routing, sitemap, structured data, hub pages, internal
links and search all pick it up automatically — nothing else needs touching.

**Featured images** are generated:

```bash
npx tsx scripts/generate-article-images.ts
```

It writes `public/images/blog/<slug>.{svg,png,webp}`. Swap any image later by
replacing the file — no component changes needed.

---

## SEO & technical

### URL architecture

| URL | Content |
|---|---|
| `/` | Homepage — one H1, Person + WebSite + ProfilePage schema |
| `/projects` | Project index |
| `/projects/<slug>` | Project case study (6: SneakerStore, library, student, bank, café, calculator) |
| `/notebook` | Notebook index — all 51 articles linked from static HTML |
| `/notebook/<hub>` | Topic hub (7 clusters) with real introductory copy |
| `/notebook/<hub>/<slug>` | Article with breadcrumbs, TOC, author block, related reading |
| `/blog`, `/blog/<slug>` | **301** to the notebook equivalents — legacy URLs keep working |

### Crawling and indexing

- `/robots.txt` and `/sitemap.xml` are real Next metadata routes
  (`app/robots.ts`, `app/sitemap.ts`) — not rewrites to API handlers, so there
  are no duplicate `/api/*` copies of either file.
- The sitemap contains only canonical, indexable URLs (67 entries: home, project
  index, 6 case studies, notebook, 7 hubs, 51 articles). Redirects, 404s and
  `/api/*` are excluded.
- `robots.txt` allows crawling, blocks `/api/` and blocks query-string
  search/filter views (`?q=`, `?filter=`). It deliberately never blocks
  `/_next/`, because Google needs CSS and JS to render the page.
- Every page declares its own self-referencing canonical from a single origin —
  no page can inherit the homepage URL by accident.
- Structured data: `Person` + `WebSite` site-wide, `ProfilePage` on the
  homepage, `BlogPosting` + `BreadcrumbList` (plus `FAQPage` only where real
  FAQs exist) on articles, `CollectionPage` + `ItemList` on hubs and the
  project index, `SoftwareSourceCode` on case studies. `sameAs` is populated
  only from configured, real profiles — never invented.
- Search and hub filters are client-side state with no query strings, so
  filtered views can never become crawlable duplicate URLs.
- Visible breadcrumbs on every non-home page, and internal links connect
  articles → hubs → projects and projects → articles.

### Verification

```bash
npm run build && npm run seo:audit
```

`scripts/seo-audit.mjs` inspects the built HTML and fails on: missing or
duplicate titles/descriptions, a page without exactly one H1, a missing or wrong
canonical, shipped placeholder strings, JSON-LD that doesn't parse, sitemap
entries that aren't real 200 pages, indexable pages missing from the sitemap,
robots.txt that blocks assets, and any broken internal link.

```bash
npm run quality   # article-level checks (word counts, keyword overlap, links)
```

### Analytics & monitoring

Vercel Web Analytics and Speed Insights are mounted once in the root layout
(`app/layout.tsx`), so every route renders them — including the 404 page. Both
packages inject their tag from a client effect, which means the `<script>`
elements appear after hydration and never in the pre-rendered HTML; the checks
below account for that:

```bash
npm run verify:observability     # static: root-layout wiring + every built page loads the injection chunk
npm run test:observability:dom   # DOM: boots next start, hydrates every route in jsdom, asserts both scripts
npm run check:verify             # build + seo:audit + both observability checks, end to end
```

### Performance & accessibility

- The three.js brand scene is code-split and only fetched once its section is on
  screen — and never for `prefers-reduced-motion` users.
- Every content page is statically pre-rendered; fonts are self-hosted with
  `display: swap`; images use `next/image` with AVIF/WebP.
- Keyboard focus states, skip link, labelled form fields, `aria-pressed` filter
  buttons, descriptive link text and reduced-motion-friendly demos.

---

## Content authenticity

Nothing on this site invents employment, metrics, statistics, testimonials,
or professional AI/ML experience. Abdul is represented exactly as he is:
a BSCS student building real projects and *working toward* AI/ML. Where a
real asset is missing, the site uses an explicit placeholder instead of a
fabricated fact.
