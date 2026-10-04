/**
 * Canonical URL shapes for the whole site.
 *
 * Every internal link, canonical tag, sitemap entry and structured-data URL
 * goes through this module so there is exactly one URL per piece of content:
 *
 *   /                       home
 *   /projects               project index
 *   /projects/<slug>        project case study
 *   /notebook               notebook index (topic clusters)
 *   /notebook/<hub>         hub page for a topic cluster
 *   /notebook/<hub>/<slug>  article
 *
 * Legacy `/blog/<slug>` URLs permanently redirect to their notebook URL.
 */
import { SITE } from "./site";

export const paths = {
  home: "/",
  projects: "/projects",
  project: (slug: string) => `/projects/${slug}`,
  notebook: "/notebook",
  hub: (hub: string) => `/notebook/${hub}`,
  article: (hub: string, slug: string) => `/notebook/${hub}/${slug}`,
} as const;

/** Minimal shape needed to build an article URL. */
export type ArticleRef = { hub: string; slug: string };

/** Canonical path for an article (hub-nested, one URL per article). */
export function articlePath(article: ArticleRef): string {
  return paths.article(article.hub, article.slug);
}

/** Absolute, canonical version of any site path. */
export function absoluteUrl(path: string): string {
  if (!path || path === "/") return `${SITE.baseUrl}/`;
  return `${SITE.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Path with the hash fragment removed — used when rewriting legacy links. */
export function stripHash(path: string): { pathname: string; hash: string } {
  const index = path.indexOf("#");
  if (index === -1) return { pathname: path, hash: "" };
  return { pathname: path.slice(0, index), hash: path.slice(index) };
}
