/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Allow Arena preview hosts to load chunks (fixes ChunkLoadError)
  allowedDevOrigins: ["*.e2b.app", "*.arena.site", "*.arena.ai"],
  // Ensure chunks are served correctly in preview
  experimental: {
    optimizePackageImports: [],
  },
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: "/api/sitemap" },
      { source: "/robots.txt", destination: "/api/robots" },
    ];
  },
};

module.exports = nextConfig;
