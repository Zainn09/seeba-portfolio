#!/usr/bin/env node
/**
 * Generates `redirects.generated.json` — the 301 map from the site's original
 * /blog/<slug> URLs to the canonical /notebook/<hub>/<slug> URLs.
 *
 * next.config.js consumes the file so the redirects are resolved by the host
 * before any page renders (a real `Location:` header, not an HTML redirect
 * page). Runs automatically via the `prebuild` npm script; commit the output.
 *
 *   node scripts/generate-redirects.mjs
 *
 * Fails loudly if the article data can't be parsed, so a broken manifest can
 * never silently drop redirects for URLs that were already shared or indexed.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "content", "articles.ts");
const OUTPUT = path.join(ROOT, "redirects.generated.json");

const file = readFileSync(SOURCE, "utf8");

const articlesStart = file.indexOf("export const articles");
if (articlesStart === -1) {
  console.error("✗ generate-redirects: could not find `export const articles` in content/articles.ts");
  process.exit(1);
}
const articlesSection = file.slice(articlesStart);

const objects = articlesSection
  .split(/\n\s*\{\s*\n/)
  .slice(1)
  .map((block) => block.split(/\n\s*\},?\s*\n/)[0]);

const entries = [];
const seen = new Set();

for (const block of objects) {
  const slug = block.match(/slug:\s*"([a-z0-9-]+)"/)?.[1];
  const hub = block.match(/hub:\s*"([a-z0-9-]+)"/)?.[1];
  if (!slug) continue;
  if (!hub) {
    console.error(`✗ generate-redirects: article "${slug}" has no hub — cannot build its URL`);
    process.exit(1);
  }
  if (seen.has(slug)) {
    console.error(`✗ generate-redirects: duplicate slug "${slug}"`);
    process.exit(1);
  }
  seen.add(slug);
  entries.push({ source: `/blog/${slug}`, destination: `/notebook/${hub}/${slug}` });
}

if (entries.length === 0) {
  console.error("✗ generate-redirects: parsed zero articles — refusing to write an empty manifest");
  process.exit(1);
}

const manifest = [
  { source: "/blog", destination: "/notebook" },
  ...entries.sort((a, b) => a.source.localeCompare(b.source)),
];

writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `✓ redirects.generated.json — ${manifest.length} permanent redirects (${entries.length} articles + index)`
);
