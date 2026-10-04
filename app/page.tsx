import type { Metadata } from "next";
import { SITE, SEO } from "@/lib/site";
import { absoluteUrl, paths } from "@/lib/urls";
import { graph, profilePageNode } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";
import SkipLink from "@/components/SkipLink";
import Hero from "@/components/Hero";
import Signature3D from "@/components/Signature3D";
import Journey from "@/components/Journey";
import Projects from "@/components/Projects";
import Thinking from "@/components/Thinking";
import AiPath from "@/components/AiPath";
import Skills from "@/components/Skills";
import GitHub from "@/components/GitHub";
import BlogPreview from "@/components/BlogPreview";
import BlogHub from "@/components/blog/BlogHub";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  alternates: { canonical: paths.home },
  openGraph: {
    type: "profile",
    url: absoluteUrl(paths.home),
    siteName: `${SITE.name} — Portfolio & Notebook`,
    title: SEO.title,
    description: SEO.description,
    images: [{ url: SEO.ogImage, width: 1200, height: 630, alt: SEO.ogImageAlt }],
  },
};

export default function Home() {
  const jsonLd = graph([profilePageNode()]);

  return (
    <>
      <SkipLink />
      <Cursor />
      <Navbar />
      <main id="main">
        <Hero />
        <Signature3D />
        <Journey />
        <Projects />
        <Thinking />
        <AiPath />
        <Skills />
        <GitHub />
        <BlogPreview />
        <BlogHub />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <JsonLd data={jsonLd} />
    </>
  );
}
