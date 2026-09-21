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

### The notebook (blog)
- 51 full articles (~900–1,050 words each, 5–6 min reads) across 7 hubs:
  Python, AI & ML, Projects, Problem Solving, Software Development,
  Student Journey, Android
- Editorial article pages with table of contents, reading progress, code
  copy buttons, FAQs (with `FAQPage` schema only where real), author block,
  and a "Keep Building." end section
- Original generated featured images per article (SVG + PNG + WebP)

---

## Replace the placeholders

Everything personal lives in **`lib/site.ts`** — one file, clearly labelled:

| Placeholder | Where | What to put |
|---|---|---|
| `YOUR_PROFILE_IMAGE` | `lib/site.ts` → `profileImage` | `/images/abdul-haseeb-portrait.jpg` |
| `YOUR_SIGNATURE_SVG_OR_PNG` | `lib/site.ts` → `signature` | transparent PNG/SVG of the real signature |
| `YOUR_GITHUB_URL` | `lib/site.ts` → `githubUrl` | `https://github.com/you` |
| `YOUR_EMAIL` | `lib/site.ts` → `email` | your address |
| `YOUR_LINKEDIN_URL` | `lib/site.ts` → `linkedinUrl` | LinkedIn profile |
| `GOOGLE_SEARCH_CONSOLE_VERIFICATION` | `lib/site.ts` | verification token |
| `GOOGLE_ANALYTICS_ID` / `GOOGLE_TAG_MANAGER_ID` | `lib/site.ts` | analytics IDs (optional) |

Drop the real portrait at `public/images/abdul-haseeb-portrait.jpg` and the
signature at `public/images/abdul-haseeb-signature.svg`. The components render
tasteful branded placeholders until those files exist — nothing ever looks
like a broken image.

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
`content/sections/`). Nothing else needs touching.

**Featured images** are generated:

```bash
npx tsx scripts/generate-article-images.ts
```

It writes `public/images/blog/<slug>.{svg,png,webp}`. Swap any image later by
replacing the file — no component changes needed.

---

## SEO & technical

- Semantic HTML, single meaningful `h1`, ordered heading hierarchy
- `WebSite` + `Person` JSON-LD on the home page; `BlogPosting`,
  `BreadcrumbList`, and **honest** `FAQPage` on articles
- Canonical URLs, Open Graph + Twitter cards, per-article OG images
- `/sitemap.xml` and `/robots.txt` (via rewrites to `app/api/*`)
- Light/dark theme both meet readable contrast; `prefers-reduced-motion`
  reduces or disables non-essential motion
- Custom cursor is desktop/pointer-fine only; the 3D scene lazy-loads and
  lowers fidelity on small screens
- All articles are statically pre-rendered (zero TTFB for content pages)

---

## Content authenticity

Nothing on this site invents employment, metrics, statistics, testimonials,
or professional AI/ML experience. Abdul is represented exactly as he is:
a BSCS student building real projects and *working toward* AI/ML. Where a
real asset is missing, the site uses an explicit placeholder instead of a
fabricated fact.
