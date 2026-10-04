#!/usr/bin/env node
/**
 * Verifies that Vercel Web Analytics and Speed Insights reach every page.
 *
 *   npm run build && npm run verify:observability
 *
 * Both components live in the root layout and inject their <script> tag from a
 * client effect (that is how @vercel/analytics and @vercel/speed-insights work),
 * so the tags are deliberately absent from prerendered HTML. What must hold —
 * and what this checks — is:
 *
 *   1. `app/layout.tsx` actually renders <Analytics /> and <SpeedInsights />.
 *   2. The JavaScript bundle containing both injection paths is loaded by every
 *      generated page (i.e. no route escapes the root layout).
 *
 * A DOM-level confirmation (that the tags really appear after hydration) lives in
 * `scripts/test-observability-dom.mjs` — `npm run test:observability:dom`.
 */
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_OUT = path.join(ROOT, ".next", "server", "app");
const CHUNKS_DIR = path.join(ROOT, ".next", "static", "chunks");

const EXPECTED = [
  { name: "Web Analytics", import: "@vercel/analytics/next", component: "<Analytics />", needle: "/_vercel/insights/script.js" },
  { name: "Speed Insights", import: "@vercel/speed-insights/next", component: "<SpeedInsights />", needle: "/_vercel/speed-insights/script.js" },
];

const failures = [];

/* 1. Source wiring — the components must be rendered by the root layout. */
const layoutPath = path.join(ROOT, "app", "layout.tsx");
if (!existsSync(layoutPath)) {
  failures.push("app/layout.tsx not found");
} else {
  const layout = await readFile(layoutPath, "utf8");
  for (const { name, import: importPath, component } of EXPECTED) {
    if (!layout.includes(`from "${importPath}"`)) {
      failures.push(`app/layout.tsx does not import ${name} from "${importPath}"`);
    }
    if (!layout.includes(component)) {
      failures.push(`app/layout.tsx does not render ${component}`);
    }
  }
}

/* 2. Every built page must load the chunk that performs the injection. */
async function walk(dir, filter, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!filter(full)) continue;
      files.push(...(await walk(full, filter, base)));
    } else if (full.endsWith(".js")) {
      files.push(path.relative(base, full));
    }
  }
  return files;
}

if (!existsSync(APP_OUT) || !existsSync(CHUNKS_DIR)) {
  console.error("✗ Build output not found — run `npm run build` first.");
  process.exit(1);
}

const chunkFiles = await walk(CHUNKS_DIR, () => true);
const chunksWith = new Map();
for (const { name, needle } of EXPECTED) {
  const matching = [];
  for (const file of chunkFiles) {
    const source = await readFile(path.join(CHUNKS_DIR, file), "utf8");
    if (source.includes(needle)) matching.push(file);
  }
  if (matching.length === 0) {
    failures.push(`no built chunk contains ${needle} — ${name} would never load`);
  }
  chunksWith.set(
    name,
    matching.map((file) => `/_next/static/chunks/${file.split(path.sep).join("/")}`)
  );
}

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(full)));
    else if (full.endsWith(".html")) files.push(full);
  }
  return files;
}

const pages = await htmlFiles(APP_OUT);
const unprotected = [];

for (const page of pages) {
  const html = await readFile(page, "utf8");
  const missing = EXPECTED.filter(({ name }) => {
    const chunks = chunksWith.get(name) ?? [];
    return chunks.length === 0 || !chunks.some((chunk) => html.includes(chunk));
  }).map(({ name }) => name);

  if (missing.length) {
    unprotected.push({
      route:
        "/" +
        path
          .relative(APP_OUT, page)
          .replace(/\.html$/, "")
          .split(path.sep)
          .filter((s) => s !== "index")
          .join("/"),
      missing,
    });
  }
}

console.log("\nVercel observability — instrumentation check\n");
console.log(`  · pages inspected: ${pages.length}`);
for (const { name, needle } of EXPECTED) {
  const chunks = chunksWith.get(name) ?? [];
  if (chunks.length) console.log(`  · ${name}: injection code in ${chunks.join(", ")}`);
}

for (const item of unprotected) {
  failures.push(`${item.route}: does not load ${item.missing.join(" + ")}`);
}

if (failures.length) {
  console.log(`\nFAILED (${failures.length}):`);
  failures.slice(0, 25).forEach((message) => console.log(`  ✗ ${message}`));
  if (failures.length > 25) console.log(`  … and ${failures.length - 25} more`);
  console.log("");
  process.exit(1);
}

console.log(`\n✓ Analytics + Speed Insights are wired into the layout and loaded by all ${pages.length} pages.\n`);
