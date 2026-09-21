import type { ArticleMeta } from "@/content/types";

export function articlePath(a: ArticleMeta): string {
  return `/blog/${a.slug}`;
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://abdulhaseeb.dev";
  return `${base}${path}`;
}
