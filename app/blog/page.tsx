import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import BlogHub from "@/components/blog/BlogHub";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import Cursor from "@/components/Cursor";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Notebook — Developer Blog",
  description:
    "An indexed collection of notes, tutorials, and project walkthroughs — Python, AI/ML, Android, and software development from Abdul Haseeb's learning journey.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${SITE.baseUrl}/blog`,
    title: `Notebook — ${SITE.name}`,
    description:
      "Searchable library of 51 articles on Python, AI/ML, projects, and problem solving.",
    siteName: `${SITE.name} — Developer Notebook`,
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Abdul Haseeb — Notebook" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Notebook — ${SITE.name}`,
    description: "51 articles on Python, AI/ML, Android, and software development.",
    images: ["/images/og-image.jpg"],
  },
};

export default function BlogPage() {
  return (
    <>
      <SkipLink />
      <Cursor />
      <Navbar />
      <main id="main" className="pb-0">
        {/* Header */}
        <div className="relative overflow-hidden border-b border-line">
          <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
          <div className="container-x relative pb-12 pt-28 sm:pt-32">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="focus-ring inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-soft transition-colors hover:text-ink"
              >
                ← Back to home
              </Link>
              <span className="text-line" aria-hidden>·</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">The notebook</span>
            </div>
            <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold tracking-tightest text-ink sm:text-5xl lg:text-6xl">
              From my <em className="font-serif font-normal italic text-soft">notebook</em>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-soft">
              An indexed collection of notes, tutorials, and project walkthroughs — the same knowledge I&apos;m
              using to build my Python and AI/ML foundation. Search it, filter it, read what matters.
            </p>
            <div className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-soft">
              <span>51 articles</span>
              <span className="text-accent" aria-hidden>/</span>
              <span>7 hubs</span>
              <span className="text-accent" aria-hidden>/</span>
              <span>~900 words each</span>
            </div>
          </div>
        </div>

        <BlogHub />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
