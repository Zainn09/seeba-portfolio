import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * robots.txt — everything public is crawlable; only the JSON endpoints and the
 * in-page search/filter views are kept out of the index. CSS/JS bundles under
 * /_next/ are deliberately NOT blocked, because Google needs them to render.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          // The notebook search + hub filters are client state with no URLs;
          // these patterns are belt-and-braces in case one is ever shared.
          "/*?q=",
          "/*?s=",
          "/*?search=",
          "/*?filter=",
        ],
      },
    ],
    sitemap: `${SITE.baseUrl}/sitemap.xml`,
    host: SITE.canonicalHost,
  };
}
