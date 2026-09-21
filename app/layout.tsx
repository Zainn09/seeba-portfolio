import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/lib/theme";
import { fontDisplay, fontMono, fontSerif } from "@/lib/fonts";
import { SITE, SEO } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: SEO.title,
    template: "%s | Abdul Haseeb",
  },
  description: SEO.description,
  keywords: SEO.keywords,
  authors: [{ name: SITE.name, url: SITE.baseUrl }],
  creator: SITE.name,
  category: "Technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE.baseUrl,
    siteName: `${SITE.name} — Personal Brand`,
    title: SEO.title,
    description: SEO.description,
    locale: "en_US",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: SEO.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
    creator: SEO.twitterHandle,
    images: ["/images/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8F3" },
    { media: "(prefers-color-scheme: dark)", color: "#080B12" },
  ],
  colorScheme: "dark light",
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
      </body>
    </html>
  );
}
