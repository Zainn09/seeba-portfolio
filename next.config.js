/** @type {import('next').NextConfig} */
const legacyRedirects = require("./redirects.generated.json");

const DEFAULT_ORIGIN = "https://seeba-portfolio.vercel.app";

/**
 * Redirects are resolved by the host before routing, so they answer with a real
 * 308 + `Location:` header (Next's static `permanentRedirect()` does not).
 *
 *  1. Every original /blog/<slug> URL → its canonical /notebook/<hub>/<slug>
 *     (see scripts/generate-redirects.mjs — regenerate with `npm run redirects`).
 *  2. When a custom domain is configured, the Vercel URL and the www variant →
 *     the canonical origin, so Google can never index two copies of the site.
 */
function hostRedirects() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return [];

  const target = (/^https?:\/\//i.test(configured) ? configured : `https://${configured}`).replace(
    /\/+$/,
    ""
  );
  const host = target.replace(/^https?:\/\//, "");
  if (host.endsWith(".vercel.app")) return [];

  const apex = host.replace(/^www\./, "");
  const defaultHost = DEFAULT_ORIGIN.replace(/^https?:\/\//, "");

  const candidates = new Set([`www.${apex}`, apex, defaultHost, `www.${defaultHost}`]);
  candidates.delete(host); // the canonical host must never redirect to itself

  return [...candidates].map((value) => ({
    source: "/:path*",
    has: [{ type: "host", value }],
    destination: `${target}/:path*`,
    permanent: true,
  }));
}

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      ...legacyRedirects.map(({ source, destination }) => ({
        source,
        destination,
        permanent: true,
      })),
      ...hostRedirects(),
    ];
  },
};

module.exports = nextConfig;
