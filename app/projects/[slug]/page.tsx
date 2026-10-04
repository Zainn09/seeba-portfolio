import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  projectBySlug,
  projectCaseStudies,
  projectSeoTitle,
  relatedProjectsFor,
  type ProjectCaseStudy,
} from "@/content/projects";
import { articlesBySlug } from "@/lib/articles";
import { SITE, SEO, HAS_GITHUB } from "@/lib/site";
import { absoluteUrl, articlePath, paths } from "@/lib/urls";
import { breadcrumbNode, graph, softwareSourceCodeNode } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import DemoPlayer from "@/components/demos/DemoPlayer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";

export function generateStaticParams() {
  return projectCaseStudies.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projectBySlug[params.slug];
  if (!project) return {};

  const title = projectSeoTitle[project.slug] ?? `${project.name} — Project Case Study`;
  const branded = `${title} | ${SITE.name}`;
  const description =
    project.summary.length > 158
      ? `${project.summary.slice(0, 155).trimEnd()}…`
      : project.summary;

  return {
    title: { absolute: branded.length <= 62 ? branded : title },
    description,
    alternates: { canonical: paths.project(project.slug) },
    openGraph: {
      type: "article",
      url: absoluteUrl(paths.project(project.slug)),
      title: `${title} | ${SITE.name}`,
      description,
      siteName: `${SITE.name} — Developer Portfolio`,
      images: [{ url: SEO.ogImage, width: 1200, height: 630, alt: SEO.ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [SEO.ogImage],
    },
  };
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-10" aria-labelledby={id}>
      <h2 id={id} className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4 leading-relaxed text-soft">{children}</div>
    </section>
  );
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project: ProjectCaseStudy | undefined = projectBySlug[params.slug];
  if (!project) notFound();

  const related = relatedProjectsFor(project);
  const relatedArticles = project.relatedArticles
    .map((slug) => articlesBySlug[slug])
    .filter((article): article is NonNullable<typeof article> => Boolean(article));
  const others = projectCaseStudies.filter((item) => item.slug !== project.slug).slice(0, 4);

  const jsonLd = graph([
    softwareSourceCodeNode(project),
    breadcrumbNode([
      { name: "Home", path: paths.home },
      { name: "Projects", path: paths.projects },
      { name: project.name, path: paths.project(project.slug) },
    ]),
  ]);

  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main" className="pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: paths.home },
            { name: "Projects", path: paths.projects },
            { name: project.name, path: paths.project(project.slug) },
          ]}
        />

        <header className="relative overflow-hidden border-b border-line">
          <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
          <div className="container-x relative pb-12 pt-10">
            <p className="meta-label flex flex-wrap items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {project.index} / {project.group.toUpperCase()}
            </p>

            <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold tracking-tightest text-ink sm:text-5xl lg:text-6xl">
              {project.name}
            </h1>
            <p className="mt-4 max-w-2xl font-serif text-xl italic text-soft sm:text-2xl">
              {project.tagline}
            </p>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/90">{project.summary}</p>

            <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft">Role</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-soft">{project.role}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft">Platform</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-soft">{project.platform}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
                  Stack
                </dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-line bg-raised px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-soft"
                    >
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring rounded-full bg-accent px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.16em] text-on-accent transition-transform hover:-translate-y-0.5"
                >
                  View the code →
                </a>
              ) : (
                <Link
                  href={paths.notebook}
                  className="focus-ring rounded-full bg-accent px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.16em] text-on-accent transition-transform hover:-translate-y-0.5"
                >
                  Read the technical notes →
                </Link>
              )}
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-soft transition-colors hover:border-accent hover:text-ink"
                >
                  Live demo →
                </a>
              ) : null}
              <Link
                href={paths.projects}
                className="focus-ring link-underline font-mono text-[11px] uppercase tracking-[0.16em] text-soft hover:text-ink"
              >
                All projects →
              </Link>
            </div>
          </div>
        </header>

        <div className="container-x mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div className="min-w-0 space-y-12">
            <section aria-labelledby="demo-heading">
              <h2 id="demo-heading" className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
                Live demo
              </h2>
              <div className="mt-4">
                <DemoPlayer demo={project.demo} />
              </div>
            </section>

            <Section id="purpose" title="Why I built it">
              <p>{project.purpose}</p>
            </Section>

            <Section id="problem" title="The problem it solves">
              <p>{project.problem}</p>
            </Section>

            <Section id="features" title="What it does">
              <ul className="grid gap-5 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li key={feature.title} className="rounded-xl border border-line bg-raised p-5">
                    <h3 className="font-display text-base font-semibold text-ink">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-soft">{feature.detail}</p>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="process" title="How it was built">
              <ol className="space-y-5">
                {project.process.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="mt-0.5 font-mono text-[11px] tabular-nums text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-display text-base font-semibold text-ink">
                        {step.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-soft">
                        {step.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="learned" title="What I learned">
              <ul className="space-y-2.5">
                {project.learned.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="challenges" title="Challenges and how I worked through them">
              <div className="space-y-5">
                {project.challenges.map((challenge) => (
                  <div key={challenge.title} className="rounded-xl border border-line bg-raised p-5">
                    <h3 className="font-display text-base font-semibold text-ink">
                      {challenge.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-soft">{challenge.detail}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 rounded-xl border border-dashed border-line p-5 text-sm leading-relaxed text-soft">
                <strong className="font-medium text-ink">Honest note:</strong> {project.note}
              </p>
            </Section>

            {relatedArticles.length > 0 && (
              <Section id="related-reading" title="Go deeper on the concepts">
                <p>
                  These notebook articles explain the ideas behind this build — the same
                  material I used while working on it.
                </p>
                <ul className="mt-2 divide-y divide-line border-y border-line">
                  {relatedArticles.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={articlePath(article)}
                        className="focus-ring group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-base font-medium text-ink transition-colors group-hover:text-accent">
                            {article.title}
                          </span>
                          <span className="mt-1 block max-w-2xl text-sm leading-relaxed text-soft">
                            {article.excerpt}
                          </span>
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
                          {article.readingTime} min read
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {related.length > 0 && (
              <Section id="related-projects" title="Related projects">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={paths.project(item.slug)}
                        className="focus-ring group block h-full rounded-xl border border-line bg-raised p-5 transition-colors hover:border-accent/60"
                      >
                        <span className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-accent">
                          {item.name}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-soft">
                          {item.tagline}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6">
              <div className="rounded-xl border border-line bg-raised p-5">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
                  Project facts
                </h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft">Group</dt>
                    <dd className="text-ink">{project.group}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft">Built by</dt>
                    <dd className="text-ink">
                      <Link href={paths.home} className="focus-ring link-underline">
                        {SITE.name}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft">Repository</dt>
                    <dd className="text-ink">
                      {project.repoUrl ? (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring link-underline"
                        >
                          On GitHub
                        </a>
                      ) : (
                        <span className="text-soft">
                          Not published yet — code shared on request
                          {HAS_GITHUB ? " via GitHub or email" : ""}.
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-xl border border-line bg-raised p-5">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
                  More case studies
                </h2>
                <ul className="mt-3 space-y-3">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link href={paths.project(item.slug)} className="focus-ring group block">
                        <span className="font-display text-sm font-medium text-ink transition-colors group-hover:text-accent">
                          {item.name}
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
                          {item.group}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-accent/30 bg-raised p-5">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Want the full picture?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-soft">
                  The homepage covers the journey, the toolkit and what I&apos;m learning
                  next.
                </p>
                <Link
                  href={paths.home}
                  className="focus-ring mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent"
                >
                  Back to the homepage →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  );
}
