import type { MetadataRoute } from "next";
import { hubs } from "@/content/articles";
import { allArticles } from "@/lib/articles";
import { projectCaseStudies } from "@/content/projects";
import { SITE } from "@/lib/site";
import { absoluteUrl, articlePath, paths } from "@/lib/urls";

/**
 * XML sitemap — canonical, indexable URLs only.
 *
 * Included: homepage, project index, project case studies, notebook index,
 * topic hubs, articles.
 * Excluded: /api/*, legacy /blog/* redirects, 404s, anything non-canonical.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = SITE.contentUpdated;

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(paths.home),
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl(paths.projects),
      lastModified: updated,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...projectCaseStudies.map((project) => ({
      url: absoluteUrl(paths.project(project.slug)),
      lastModified: updated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: absoluteUrl(paths.notebook),
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...hubs.map((hub) => ({
      url: absoluteUrl(paths.hub(hub.slug)),
      lastModified: updated,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...allArticles.map((article) => ({
      url: absoluteUrl(articlePath(article)),
      lastModified: article.updatedDate ?? article.publishDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return entries;
}
