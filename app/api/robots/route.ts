import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const txt = `# Per-section robots.txt — nothing here blocks indexing.
User-agent: *
Allow: /

Sitemap: ${SITE.baseUrl}/sitemap.xml
`;
  return new NextResponse(txt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
