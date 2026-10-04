#!/usr/bin/env node
/**
 * Technical SEO audit — runs against a production build, no dependencies.
 *
 *   npm run build && npm run seo:audit
 *
 * The canonical origin is taken from NEXT_PUBLIC_SITE_URL / SITE_URL when set;
 * otherwise it is detected from the built pages themselves, so the audit works
 * identically before and after a custom domain is connected — and still fails if
 * pages disagree with each other.
 *
 * Checks:
 *   1. exactly one <h1> per indexable page
 *   2. a unique <title> and meta description per page
 *   3. a canonical link on every page, self-referencing, same origin everywhere
 *   4. no placeholder or stale-domain strings in shipped HTML
 *   5. every JSON-LD block parses and declares a type
 *   6. robots.txt allows crawling, references the sitemap, never blocks assets
 *   7. sitemap.xml: canonical host only, no redirects, no 404s, no orphans
 *   8. legacy /blog redirects exist for every article and point at real pages
 *   9. every internal link resolves, and no indexable page is orphaned
 */
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_OUT = path.join(ROOT, ".next", "server", "app");
const PUBLIC_DIR = path.join(ROOT, "public");
const FALLBACK_ORIGIN = "https://seeba-portfolio.vercel.app";

const FORBIDDEN = [
  "YOUR_PROFILE_IMAGE",
  "YOUR_SIGNATURE_HERE",
  "YOUR_GITHUB_URL",
  "YOUR_EMAIL",
  "YOUR_LINKEDIN_URL",
  "GITHUB_PROFILE_LINK_HERE",
  "YOUR_SIGNATURE_SVG_OR_PNG",
  "abdulhaseeb.dev",
];

const failures = [];
const warnings = [];
const notes = [];
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);

const trimSlash = (value) => value.replace(/\/+$/, "");
const originOf = (url) => {
  const match = url.match(/^https?:\/\/[^/]+/);
  return match ? match[0] : "";
};

/** Titles/descriptions are measured on decoded text, not HTML entities. */
const decodeEntities = (value) =>
  value
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&amp;|&#38;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2F;/g, "/");

/* ------------------------------------------------------------------ */
/* collect built output                                                */
/* ------------------------------------------------------------------ */

async function walk(dir, filter, base = dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full, filter, base)));
    } else if (filter(full)) {
      files.push(path.relative(base, full));
    }
  }
  return files;
}

function report() {
  console.log("\nSEO audit — build output\n");
  console.log(`  · canonical origin: ${CANONICAL_ORIGIN}`);
  notes.forEach((note) => console.log(`  · ${note}`));
  console.log(`  · pages checked: ${pages.length}`);
  console.log(`  · permanent legacy redirects: ${redirects.length}`);
  console.log(`  · internal links + orphan pages verified\n`);

  if (warnings.length) {
    console.log(`Warnings (${warnings.length}):`);
    warnings.forEach((message) => console.log(`  ! ${message}`));
    console.log("");
  }
  if (failures.length) {
    console.log(`FAILED (${failures.length}):`);
    failures.forEach((message) => console.log(`  ✗ ${message}`));
    console.log("");
    process.exit(1);
  }
  console.log("✓ All SEO checks passed.\n");
  process.exit(0);
}

const htmlFiles = await walk(APP_OUT, (file) => file.endsWith(".html"));
if (htmlFiles.length === 0) {
  fail(`No built HTML found in ${path.relative(ROOT, APP_OUT)} — run \`npm run build\` first.`);
  report();
}

const isRedirectHtml = (html) =>
  /http-equiv="refresh"|NEXT_REDIRECT/i.test(html) && !/<h1/i.test(html);

/* Pass 1 — read every page. */
const pages = [];
const redirects = [];

for (const relative of htmlFiles) {
  const route =
    "/" +
    relative
      .replace(/\.html$/, "")
      .split(path.sep)
      .filter((segment) => segment !== "index")
      .join("/");
  const routePath = route === "/" ? "/" : route.replace(/\/$/, "");
  const html = await readFile(path.join(APP_OUT, relative), "utf8");

  if (isRedirectHtml(html)) {
    redirects.push(routePath);
    continue;
  }

  pages.push({
    routePath,
    html,
    isNotFound: routePath === "/_not-found",
    title: decodeEntities((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim() ?? ""),
    description: decodeEntities(
      (html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i) || [])[1]?.trim() ?? ""
    ),
    canonical: trimSlash(
      (html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || [])[1]?.trim() ?? ""
    ),
    robotsMeta: (
      (html.match(/<meta[^>]+name="robots"[^>]+content="([^"]*)"/i) || [])[1] ?? ""
    ).toLowerCase(),
  });
}

/* Canonical origin: env wins, otherwise detect from the build itself. */
const envOrigin = trimSlash(
  (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "").trim()
);
const detectedOrigin =
  originOf(pages.find((page) => !page.isNotFound && page.canonical)?.canonical ?? "") || "";
const CANONICAL_ORIGIN = envOrigin || detectedOrigin || FALLBACK_ORIGIN;
const CANONICAL_HOST = CANONICAL_ORIGIN.replace(/^https?:\/\//, "");

if (!envOrigin && detectedOrigin && detectedOrigin !== FALLBACK_ORIGIN) {
  notes.push(`origin detected from build (no env var set): ${detectedOrigin}`);
}
if (envOrigin && detectedOrigin && trimSlash(detectedOrigin) !== trimSlash(envOrigin)) {
  fail(
    `pages were built for ${detectedOrigin} but NEXT_PUBLIC_SITE_URL is ${envOrigin} — rebuild with the same value`
  );
}

/* Pass 2 — page-level assertions. */
const titles = new Map();
const descriptions = new Map();

for (const page of pages) {
  const { routePath, html, title, description, canonical, robotsMeta, isNotFound } = page;

  if (isNotFound) {
    if (!robotsMeta.includes("noindex")) fail(`${routePath}: 404 page should be noindex`);
    continue;
  }

  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) fail(`${routePath}: expected exactly one <h1>, found ${h1Count}`);
  if (!title) fail(`${routePath}: missing <title>`);
  if (!description) fail(`${routePath}: missing meta description`);
  if (description.length > 165) {
    warn(`${routePath}: meta description is ${description.length} chars (aim ≤ 160)`);
  }
  if (title.length > 65) warn(`${routePath}: <title> is ${title.length} chars (may truncate in SERPs)`);

  const expectedCanonical = trimSlash(
    `${CANONICAL_ORIGIN}${routePath === "/" ? "/" : routePath}`
  );
  if (!canonical) fail(`${routePath}: missing canonical link`);
  else if (canonical !== expectedCanonical) {
    fail(`${routePath}: canonical is ${canonical}, expected ${expectedCanonical}`);
  }
  if (robotsMeta.includes("noindex")) fail(`${routePath}: unexpectedly noindex`);

  const previousTitle = titles.get(title);
  if (previousTitle) fail(`duplicate <title> on ${routePath} and ${previousTitle}: "${title}"`);
  else titles.set(title, routePath);

  const previousDescription = descriptions.get(description);
  if (previousDescription) warn(`duplicate meta description on ${routePath} and ${previousDescription}`);
  else descriptions.set(description, routePath);

  for (const needle of FORBIDDEN) {
    if (html.includes(needle)) fail(`${routePath}: shipped placeholder string "${needle}"`);
  }

  const jsonLdBlocks = [
    ...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi),
  ].map((match) => match[1]);
  if (jsonLdBlocks.length === 0) warn(`${routePath}: no JSON-LD structured data`);
  for (const block of jsonLdBlocks) {
    try {
      const parsed = JSON.parse(block.replace(/\\u003c/g, "<"));
      if (!parsed["@context"] && !parsed["@graph"]) {
        fail(`${routePath}: JSON-LD block has neither @context nor @graph`);
      }
    } catch (error) {
      fail(`${routePath}: JSON-LD does not parse (${error.message})`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* legacy redirect manifest                                            */
/* ------------------------------------------------------------------ */

const manifestPath = path.join(ROOT, "redirects.generated.json");
if (!existsSync(manifestPath)) {
  fail("redirects.generated.json is missing — run `npm run redirects`");
} else {
  let manifest = [];
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    fail(`redirects.generated.json does not parse: ${error.message}`);
  }

  const builtRoutes = new Set(pages.map((page) => page.routePath));
  for (const entry of manifest) {
    if (typeof entry.source !== "string" || typeof entry.destination !== "string") {
      fail("redirect entry is missing source/destination");
      continue;
    }
    if (!entry.source.startsWith("/blog")) {
      fail(`redirect source is not a legacy /blog URL: ${entry.source}`);
    }
    if (!builtRoutes.has(entry.destination)) {
      fail(`redirect target was never built: ${entry.source} → ${entry.destination}`);
    }
    redirects.push(entry.source);
  }

  // Keep the manifest in sync with the redirects that next.config.js applies.
  if (existsSync(path.join(ROOT, ".next", "routes-manifest.json"))) {
    const applied = JSON.parse(
      await readFile(path.join(ROOT, ".next", "routes-manifest.json"), "utf8")
    ).redirects.filter((rule) => !rule.has && rule.source.startsWith("/blog"));
    if (applied.length !== manifest.length) {
      fail(
        `next.config.js applies ${applied.length} /blog redirects but the manifest has ${manifest.length} — server and manifest disagree`
      );
    }
  }

  // Every article must stay reachable from its original URL.
  const articleRoutes = [...builtRoutes].filter((route) =>
    /^\/notebook\/[^/]+\/[^/]+$/.test(route)
  );
  for (const route of articleRoutes) {
    const slug = route.split("/").pop();
    if (!manifest.some((entry) => entry.source === `/blog/${slug}`)) {
      fail(`${route} has no legacy /blog/ redirect — old links would 404`);
    }
  }
  notes.push(`articles with legacy redirects: ${articleRoutes.length}`);
}

/* ------------------------------------------------------------------ */
/* sitemap + robots                                                    */
/* ------------------------------------------------------------------ */

const sitemapPath = path.join(APP_OUT, "sitemap.xml.body");
const robotsPath = path.join(APP_OUT, "robots.txt.body");
const sitemap = existsSync(sitemapPath) ? await readFile(sitemapPath, "utf8") : "";
const robots = existsSync(robotsPath) ? await readFile(robotsPath, "utf8") : "";

if (!sitemap) warn("sitemap.xml not found in build output (verify at runtime instead)");
if (!robots) warn("robots.txt not found in build output (verify at runtime instead)");

if (sitemap) {
  if (!sitemap.startsWith("<?xml")) fail("sitemap.xml does not start with an XML declaration");
  if (/<url>\s*<loc>\s*<\/loc>/i.test(sitemap)) fail("sitemap.xml contains an empty <loc>");

  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  notes.push(`sitemap entries: ${locs.length}`);

  const seen = new Set();
  for (const loc of locs) {
    const host = loc.replace(/^https?:\/\//, "").split("/")[0];
    if (host !== CANONICAL_HOST) {
      fail(`sitemap.xml entry on wrong host: ${loc} (expected ${CANONICAL_HOST})`);
    }
    const withoutOrigin = loc.replace(/^https?:\/\/[^/]+/, "").replace(/\/+$/, "");
    const route = withoutOrigin === "" ? "/" : withoutOrigin;

    if (seen.has(route)) fail(`sitemap.xml contains ${route} twice`);
    seen.add(route);
    if (route.startsWith("/api/")) fail(`sitemap.xml must not include API routes: ${route}`);
    if (redirects.includes(route)) fail(`sitemap.xml must not include the redirect ${route}`);
    if (!pages.some((page) => page.routePath === route && !page.isNotFound)) {
      fail(`sitemap.xml lists ${route} but no such page was built`);
    }
  }

  for (const page of pages) {
    if (page.isNotFound) continue;
    if (!seen.has(page.routePath)) fail(`${page.routePath} is indexable but missing from sitemap.xml`);
  }
}

if (robots) {
  if (!/User-agent:\s*\*/i.test(robots)) fail("robots.txt has no wildcard user-agent group");
  if (/^\s*Disallow:\s*\/\s*$/im.test(robots)) fail("robots.txt disallows the entire site");
  if (/Disallow:\s*\/_next/i.test(robots)) {
    fail("robots.txt blocks /_next/ — Google needs CSS and JS assets");
  }
  const expectedSitemap = `${CANONICAL_ORIGIN}/sitemap.xml`;
  const escaped = expectedSitemap.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!new RegExp(`^Sitemap:\\s*${escaped}$`, "im").test(robots)) {
    fail(`robots.txt does not reference ${expectedSitemap}`);
  }
}

/* ------------------------------------------------------------------ */
/* internal links + orphan pages                                       */
/* ------------------------------------------------------------------ */

const staticFiles = new Set(
  (await walk(PUBLIC_DIR, () => true)).map((file) => `/${file.split(path.sep).join("/")}`)
);
const builtRoutes = new Set(pages.map((page) => page.routePath));
const redirectSet = new Set(redirects);

/** Generated by Next metadata routes / the platform, not present in /public. */
const GENERATED_ROUTES = new Set([
  "/icon.svg",
  "/favicon.ico",
  "/apple-icon.png",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
]);

const inbound = new Map();
const broken = new Map();

for (const page of pages) {
  if (page.isNotFound) continue;
  const hrefs = [...page.html.matchAll(/href="(\/[^"#?]*)/g)].map((match) => match[1]);

  for (const href of hrefs) {
    const target = href === "/" ? "/" : href.replace(/\/$/, "");
    const isFile = /\.[a-z0-9]{2,5}$/i.test(target);
    if (isFile && (staticFiles.has(target) || target.startsWith("/_next/"))) continue;
    if (isFile && GENERATED_ROUTES.has(target)) continue;
    if (builtRoutes.has(target) || redirectSet.has(target) || GENERATED_ROUTES.has(target)) {
      if (target !== page.routePath) inbound.set(target, (inbound.get(target) ?? 0) + 1);
      continue;
    }
    if (!broken.has(target)) broken.set(target, page.routePath);
  }
}

for (const [target, source] of broken) {
  fail(`broken internal link: ${target} (linked from ${source})`);
}

const orphans = pages
  .filter((page) => !page.isNotFound && page.routePath !== "/")
  .filter((page) => !inbound.has(page.routePath))
  .map((page) => page.routePath);
if (orphans.length) fail(`orphan pages (no internal inbound links): ${orphans.join(", ")}`);

report();
