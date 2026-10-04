import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/lib/theme";
import { fontDisplay, fontMono, fontSerif } from "@/lib/fonts";
import { SITE, SEO } from "@/lib/site";
import { absoluteUrl, paths } from "@/lib/urls";
import { personNode, websiteNode } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: SEO.title,
    template: "%s | Abdul Haseeb",
  },
  description: SEO.description,
  applicationName: `${SITE.name} — Portfolio & Notebook`,
  authors: [{ name: SITE.name, url: absoluteUrl(paths.home) }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Technology",
  // No site-wide canonical here: each page declares its own, so a page can
  // never silently inherit the homepage URL.
  openGraph: {
    type: "website",
    url: absoluteUrl(paths.home),
    siteName: `${SITE.name} — Portfolio & Notebook`,
    title: SEO.title,
    description: SEO.description,
    locale: "en_US",
    images: [{ url: SEO.ogImage, width: 1200, height: 630, alt: SEO.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
    images: [SEO.ogImage],
    ...(SITE.social.twitter ? { creator: SITE.social.twitter } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Only set when a real code is provided — never ship a placeholder.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8F3" },
    { media: "(prefers-color-scheme: dark)", color: "#080B12" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

/** Person + WebSite describe the brand on every page without duplicating detail. */
const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [personNode(), websiteNode()],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontMono.variable} ${fontSerif.variable}`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <JsonLd data={siteGraph} />
      </body>
    </html>
  );
}
