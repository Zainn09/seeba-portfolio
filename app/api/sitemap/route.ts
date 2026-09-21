import { NextResponse } from "next/server";
import { allArticles } from "@/lib/articles";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const base = SITE.baseUrl;
  const now = new Date().toISOString();

  const blogUrls = allArticles
    .map(
      (a) => `  <url>
    <loc>${base}/blog/${a.slug}</loc>
    <lastmod>${a.publishDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${now.slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${blogUrls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
