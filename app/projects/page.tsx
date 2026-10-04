import type { Metadata } from "next";
import Link from "next/link";
import { projectCaseStudies } from "@/content/projects";
import { hubContent } from "@/content/hubs";
import { SITE, SEO } from "@/lib/site";
import { absoluteUrl, paths } from "@/lib/urls";
import { breadcrumbNode, collectionPageNode, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import { Reveal } from "@/components/ui/primitives";

const DESCRIPTION =
  "Project case studies by Abdul Haseeb: SneakerStore, a Java Android e-commerce app, Python console systems and responsive HTML/CSS websites.";

export const metadata: Metadata = {
  title: "Projects — Android, Python & Web Case Studies",
  description: DESCRIPTION,
  alternates: { canonical: paths.projects },
  openGraph: {
    type: "website",
    url: absoluteUrl(paths.projects),
    title: "Projects | Abdul Haseeb",
    description: DESCRIPTION,
    siteName: `${SITE.name} — Developer Portfolio`,
    images: [{ url: SEO.ogImage, width: 1200, height: 630, alt: SEO.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Abdul Haseeb",
    description: DESCRIPTION,
    images: [SEO.ogImage],
  },
};

export default function ProjectsPage() {
  const groups = Array.from(new Set(projectCaseStudies.map((project) => project.group)));

  const jsonLd = graph([
    breadcrumbNode([
      { name: "Home", path: paths.home },
      { name: "Projects", path: paths.projects },
    ]),
    collectionPageNode({
      name: "Abdul Haseeb — software projects",
      description: DESCRIPTION,
      path: paths.projects,
      items: projectCaseStudies.map((project) => ({
        name: project.name,
        path: paths.project(project.slug),
      })),
    }),
  ]);

  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main" className="relative">
        <Breadcrumbs items={[{ name: "Home", path: paths.home }, { name: "Projects", path: paths.projects }]} />

        <header className="container-x relative pt-8 sm:pt-12">
          <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative max-w-3xl">
            <p className="meta-label flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              THE WORK / {projectCaseStudies.length} CASE STUDIES
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tightest text-ink sm:text-5xl lg:text-6xl">
              Things I&apos;ve <em className="font-serif font-normal italic text-accent">actually built</em>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-soft">
              Six projects, documented honestly: what each one does, the problem it was
              built to solve, the technologies involved, and what I learned while
              building it. No invented metrics, no borrowed screenshots.
            </p>
            <p className="mt-4 leading-relaxed text-soft">
              Every project below is by{" "}
              <Link href={paths.home} className="focus-ring link-underline text-ink">Abdul Haseeb</Link>{" "}
              — a BSCS student and Python developer working toward AI/ML. The technical
              notes behind them live in the{" "}
              <Link href={paths.notebook} className="focus-ring link-underline text-ink">developer notebook</Link>.
            </p>
          </div>
        </header>

        <div className="container-x mt-16 space-y-16">
          {groups.map((group) => (
            <section key={group} aria-labelledby={`group-${group}`}>
              <div className="flex items-center gap-4">
                <h2
                  id={`group-${group}`}
                  className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft"
                >
                  {group}
                </h2>
                <span className="h-px flex-1 bg-line" aria-hidden />
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {projectCaseStudies
                  .filter((project) => project.group === group)
                  .map((project, index) => (
                    <Reveal key={project.slug} delay={(index % 2) * 0.06} className="h-full">
                      <article className="flex h-full flex-col rounded-2xl border border-line bg-raised p-6 transition-colors hover:border-accent/50 sm:p-8">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                          {project.index}
                        </span>
                        <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                          <Link href={paths.project(project.slug)} className="focus-ring link-underline">
                            {project.name}
                          </Link>
                        </h3>
                        <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-soft">
                          {project.tagline}
                        </p>
                        <p className="mt-4 flex-1 leading-relaxed text-soft">{project.summary}</p>

                        <ul className="mt-5 flex flex-wrap gap-2">
                          {project.tech.map((tech) => (
                            <li
                              key={tech}
                              className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-soft"
                            >
                              {tech}
                            </li>
                          ))}
                        </ul>

                        <Link
                          href={paths.project(project.slug)}
                          className="focus-ring mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:text-accent"
                        >
                          Read the case study →
                        </Link>
                      </article>
                    </Reveal>
                  ))}
              </div>
            </section>
          ))}
        </div>

        <section className="container-x mt-20">
          <div className="rounded-2xl border border-line bg-raised p-8 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              How these projects are documented
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-soft">
              Each case study follows the same structure — purpose, the problem being
              solved, my role, technologies, features, development process, what I
              learned and the challenges I hit — and links to the notebook articles that
              explain the underlying concepts in more depth.
            </p>
            <h3 className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
              Concepts behind the builds
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {hubContent.map((hub) => (
                <li key={hub.slug}>
                  <Link
                    href={paths.hub(hub.slug)}
                    className="focus-ring inline-block rounded-full border border-line bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-soft transition-colors hover:border-accent hover:text-ink"
                  >
                    {hub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  );
}
