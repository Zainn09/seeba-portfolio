/**
 * Quality-check sweep across all articles. Run: npx tsx scripts/quality-check.ts
 * Verifies uniqueness, word counts, reading-time consistency, internal links
 * resolve, keywords don't cannibalize, and FAQ schema matches visible content.
 */
import { allArticles } from "../lib/articles";
import { getArticleContent } from "../lib/articleContent";
import { extractFaqs } from "../lib/faq";

function cw(md: string): number {
  let t = md;
  t = t.replace(/```/g, " ").replace(/[#>*_\-\[\]()|]/g, " ").replace(/[!.]/g, " ");
  t = t.replace(/`/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  return t.split(" ").length;
}

const issues: string[] = [];
const slugs = allArticles.map((a) => a.slug);
const titles = allArticles.map((a) => a.title);

// uniqueness
const dupSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupSlugs.length) issues.push(`duplicate slugs: ${dupSlugs.join(", ")}`);
const dupTitles = titles.filter((t, i) => titles.indexOf(t) !== i);
if (dupTitles.length) issues.push(`duplicate titles: ${dupTitles.join(", ")}`);
const dupPk = allArticles.map((a) => a.primaryKeyword).filter((k, i, arr) => arr.indexOf(k) !== i);
if (dupPk.length) issues.push(`duplicate primary keywords: ${dupPk.join(", ")}`);

// canonicalization / keyword collision (articles sharing >1 secondary keyword)
const kwMap = new Map<string, string[]>();
for (const a of allArticles) for (const k of [a.primaryKeyword, ...a.secondaryKeywords]) {
  const list = kwMap.get(k) ?? [];
  list.push(a.slug);
  kwMap.set(k, list);
}
for (const [kw, art] of kwMap) {
  if (art.length > 1) issues.push(`keyword "${kw}" shared by ${art.join(", ")} — check intent overlap`);
}

let under900 = 0;
let faqMismatch = 0;
let badLinks = 0;
let rtMismatch = 0;

for (const a of allArticles) {
  const md = getArticleContent(a.slug);
  if (!md) { issues.push(`no content for ${a.slug}`); continue; }
  const words = cw(md);
  if (words < 900) under900++;

  // reading time consistency (200wpm, clamp 4-12)
  const expect = Math.max(4, Math.min(12, Math.round(words / 200)));
  if (a.readingTime !== expect) rtMismatch++;

  // FAQ schema honesty: schema fires only where the FAQ section exists
  const { faqs } = extractFaqs(md);
  const hasFaqHeading = md.includes("## Frequently asked questions");
  if (hasFaqHeading && faqs.length === 0) { faqMismatch++; issues.push(`${a.slug}: FAQ heading present but 0 parsed FAQs`); }
  if (!hasFaqHeading && faqs.length > 0) { faqMismatch++; issues.push(`${a.slug}: FAQs parsed without FAQ heading`); }

  // internal links resolve
  const links = [...md.matchAll(/\]\(\/blog\/([\w-]+)\)/g)].map((m) => m[1]);
  for (const l of links) if (!slugs.includes(l)) { badLinks++; issues.push(`${a.slug}: broken internal link /blog/${l}`); }

  // H2/H3 variety
  const h2 = (md.match(/^## /gm) ?? []).length;
  const h3 = (md.match(/^### /gm) ?? []).length;
  if (h2 < 4) issues.push(`${a.slug}: only ${h2} H2 sections`);
}

console.log(`\nArticles checked: ${allArticles.length}`);
console.log(`Under 900 words: ${under900}`);
console.log(`Reading-time mismatches: ${rtMismatch}`);
console.log(`Broken internal links: ${badLinks}`);
console.log(`FAQ/schema mismatches: ${faqMismatch}`);
console.log(`Duplicate risks / other issues:`);
console.log(issues.length ? issues.map((i) => `  - ${i}`).join("\n") : "  none");
process.exitCode = issues.length > 0 || under900 > 0 || rtMismatch > 0 ? 1 : 0;
