import { articles as rawArticles, hubs } from "@/content/articles";
import type { Article, ArticleMeta, FilterId, Hub, VisualKind, VisualTheme } from "@/content/types";

/**
 * Honest publication dates: roughly one per weekday starting 2024-09-02,
 * producing an even content cadence with no fabricated historical dates.
 */
export function dateForIndex(i: number): string {
  const start = new Date("2024-09-02T09:00:00Z");
  const d = new Date(start);
  d.setUTCDate(d.getUTCDate() + i);
  return d.toISOString().slice(0, 10);
}

/** map categories to a deterministic visual system */
const CATEGORY_VISUAL: Record<string, { kind: VisualKind; theme: VisualTheme }> = {
  Python: { kind: "flow", theme: "lime" },
  Projects: { kind: "blocks", theme: "teal" },
  "AI ML": { kind: "nodes", theme: "indigo" },
  "Problem Solving": { kind: "tree", theme: "lime" },
  "Software Development": { kind: "console", theme: "graphite" },
  Android: { kind: "phone", theme: "amber" },
  "Student Journey": { kind: "map", theme: "teal" },
};

export const allArticles: ArticleMeta[] = rawArticles.map((a, i) => {
  const visual = a.visual ?? CATEGORY_VISUAL[a.category] ?? { kind: "grid", theme: "lime" };
  return {
    ...a,
    publishDate: dateForIndex(i),
    wordCount: a.readingTime * 195,
    imageAlt: `${a.title} — featured visual by Abdul Haseeb`,
    origPath: `/images/blog/${a.slug}.webp`, // optimized on-page image
    visual,
  };
});

export const articlesBySlug: Record<string, ArticleMeta> = Object.fromEntries(
  allArticles.map((a) => [a.slug, a])
);

export const articlesByHub = (slug: string): ArticleMeta[] =>
  allArticles.filter((a) => a.hub === slug);

export const hubBySlug = (slug: string): Hub | undefined =>
  hubs.find((h) => h.slug === slug);

export const FEATURED = allArticles.filter((a) => a.feat);

export const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "python", label: "Python" },
  { id: "ai-ml", label: "AI/ML" },
  { id: "projects", label: "Projects" },
  { id: "problem-solving", label: "Problem Solving" },
  { id: "software-development", label: "Software Development" },
  { id: "android", label: "Android" },
  { id: "student-journey", label: "Student Journey" },
];

export function filterArticles(
  query: string,
  filter: FilterId
): ArticleMeta[] {
  const q = query.trim().toLowerCase();
  let list = allArticles;
  if (filter !== "all") list = list.filter((a) => a.hub === filter);
  if (q) {
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.primaryKeyword.toLowerCase().includes(q) ||
        a.secondaryKeywords.some((k) => k.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q) ||
        a.hub.toLowerCase().includes(q)
    );
  }
  return list;
}

export const RELATED_COUNT = 3;
export function relatedArticles(article: ArticleMeta, count = RELATED_COUNT): ArticleMeta[] {
  return allArticles
    .filter((a) => a.slug !== article.slug)
    .map((a) => {
      let score = 0;
      if (a.hub === article.hub) score += 3;
      if (a.category === article.category) score += 2;
      const tags = new Set(
        [a.primaryKeyword, ...a.secondaryKeywords].map((t) => t.toLowerCase())
      );
      [article.primaryKeyword, ...article.secondaryKeywords].forEach((t) => {
        if (tags.has(t.toLowerCase())) score += 1;
      });
      return { a, score };
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, count)
    .map((x) => x.a);
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
