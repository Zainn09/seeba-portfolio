import { SITE } from "@/lib/site";
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

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: SITE.name,
        url: SITE.baseUrl,
        image: `${SITE.baseUrl}${SITE.profileImage}`,
        jobTitle: "BSCS Student · Python Developer · AI/ML Enthusiast",
        alumniOf: { "@type": "CollegeOrUniversity", name: SITE.university },
        knowsAbout: [
          "Python",
          "Java",
          "HTML",
          "CSS",
          "XML",
          "Android Development",
          "SQLite",
          "Firebase",
          "Git",
          "Artificial Intelligence",
          "Machine Learning",
        ],
        description:
          "BSCS student and Python developer focused on problem solving, real-world software projects, and building toward Artificial Intelligence and Machine Learning.",
      },
      {
        "@type": "WebSite",
        name: `${SITE.name} — Personal Brand`,
        url: SITE.baseUrl,
      },
    ],
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
