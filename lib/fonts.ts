import localFont from "next/font/local";

/**
 * Self-hosted brand fonts — Space Grotesk (display), DM Mono (technical),
 * Instrument Serif (editorial accent). Served locally for performance and
 * zero build-time network dependency.
 */

export const fontDisplay = localFont({
  src: [
    { path: "../public/fonts/self/space-grotesk-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/self/space-grotesk-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/self/space-grotesk-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/self/space-grotesk-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const fontMono = localFont({
  src: [
    { path: "../public/fonts/self/dm-mono-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/self/dm-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/self/dm-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const fontSerif = localFont({
  src: [
    { path: "../public/fonts/self/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/self/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});
