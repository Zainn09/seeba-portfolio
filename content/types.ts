/**
 * Reusable article/content model (section 80). Adding a new article means
 * adding one object to content/articles.ts — the UI, routing, sitemap,
 * structured data and search all pick it up automatically.
 */

export type HubSlug =
  | "python"
  | "ai-ml"
  | "projects"
  | "problem-solving"
  | "software-development"
  | "student-journey"
  | "android";

export type FilterId =
  | "all"
  | "python"
  | "ai-ml"
  | "projects"
  | "problem-solving"
  | "software-development"
  | "android"
  | "student-journey";

export interface Hub {
  slug: HubSlug;
  name: string;
  tagline: string;
  accent: string;
}

export type VisualKind =
  | "lines"
  | "map"
  | "grid"
  | "bars"
  | "flow"
  | "nodes"
  | "console"
  | "phone"
  | "spread"
  | "astron"
  | "tree"
  | "blocks";

export type VisualTheme = "lime" | "teal" | "indigo" | "graphite" | "amber";

export interface Article {
  slug: string;
  title: string;
  category: string;
  hub: HubSlug;
  /** large featured treatment on the blog grid */
  feat?: boolean;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  audience: string;
  /** whole minutes of reading time */
  readingTime: number;
  excerpt: string;
  /** 3 reader questions the piece answers */
  readKeys?: string[];
  /** visual system for the generated featured image */
  visual?: { kind: VisualKind; theme: VisualTheme };
}

export interface ArticleMeta extends Article {
  /** stable, honest publication dates (no fake historical dates) */
  publishDate: string;
  updatedDate?: string;
  wordCount: number;
  imageAlt: string;
  origPath: string;
}
