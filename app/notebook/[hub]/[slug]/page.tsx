import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import {
  allArticles,
  articlesByHub,
  articlesBySlug,
  formatDate,
  hubBySlug,
  relatedArticles,
} from "@/lib/articles";
import { hubContent, hubContentBySlug } from "@/content/hubs";
import { projectCaseStudies } from "@/content/projects";
import { getArticleContent } from "@/lib/articleContent";
import { markdownToHtml } from "@/lib/markdown";
import { extractFaqs } from "@/lib/faq";
import { SITE, SEO, HAS_GITHUB } from "@/lib/site";
import { absoluteUrl, articlePath, paths } from "@/lib/urls";
import { blogPostingNode, breadcrumbNode, faqNode, graph } from "@/lib/schema";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleBody, FaqSection, Toc, ReadingProgress } from "@/components/blog/ArticleClient";
import { SignatureMark } from "@/components/ui/placeholder";
import { ArticleCard } from "@/components/blog/ArticleCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import "../../../article.css";

export function generateStaticParams() {
  return allArticles.map((article) => ({ hub: article.hub, slug: article.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { hub: string; slug: string };
}): Metadata {
  const article = articlesBySlug[params.slug];
  if (!article || article.hub !== params.hub) return {};

  const url = absoluteUrl(articlePath(article));
  const hub = hubContentBySlug[article.hub];
  const description = article.excerpt.length > 158
    ? `${article.excerpt.slice(0, 155).trimEnd()}…`
    : article.excerpt;
  // Brand the SERP title only while it still fits (~62 chars before truncation).
  const branded = `${article.title} | ${SITE.name}`;

  return {
    title: { absolute: branded.length <= 62 ? branded : article.title },
    description,
    alternates: { canonical: articlePath(article) },
    authors: [{ name: SITE.name, url: absoluteUrl(paths.home) }],
    openGraph: {
      type: "article",
      url,
      title: `${article.title} | ${SITE.name}`,
      description,
      siteName: `${SITE.name} — Developer Notebook`,
      publishedTime: article.publishDate,
      modifiedTime: article.updatedDate ?? article.publishDate,
      authors: [SITE.name],
      section: hub?.name,
      tags: [article.primaryKeyword, ...article.secondaryKeywords],
      images: [
        { url: absoluteUrl(article.socialPath), width: 1200, height: 630, alt: article.imageAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | ${SITE.name}`,
      description,
      images: [absoluteUrl(article.socialPath)],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { hub: string; slug: string };
}) {
  const article = articlesBySlug[params.slug];
  if (!article) notFound();
  // One canonical URL per article: a stale or aliased hub prefix 301s to the
  // article's own hub instead of serving a duplicate page.
  if (article.hub !== params.hub) permanentRedirect(articlePath(article));

  const md = getArticleContent(article.slug);
  if (!md) notFound();

  const { body, faqs } = extractFaqs(md);
  const { html, headings } = await markdownToHtml(body, { stripH1: true });
  const related = relatedArticles(article, 3);
  const hub = hubBySlug(article.hub);
  const hubInfo = hubContentBySlug[article.hub];
  const sameHub = articlesByHub(article.hub)
    .filter((item) => item.slug !== article.slug)
    .slice(0, 5);

  /** Case studies that point at this article — keeps articles and projects connected. */
  const relatedCaseStudies = projectCaseStudies.filter((project) =>
    project.relatedArticles.includes(article.slug)
  );

  const jsonLd = graph([
    blogPostingNode(article, hub),
    breadcrumbNode([
      { name: "Home", path: paths.home },
      { name: "Notebook", path: paths.notebook },
      { name: hub?.name ?? "Articles", path: paths.hub(article.hub) },
      { name: article.title, path: articlePath(article) },
    ]),
    ...(faqs.length > 0 ? [faqNode(faqs)] : []),
  ]);

  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main" className="pb-24">
        <ReadingProgress />
        <article>
          <Breadcrumbs
            items={[
              { name: "Home", path: paths.home },
              { name: "Notebook", path: paths.notebook },
              { name: hub?.name ?? "Articles", path: paths.hub(article.hub) },
              { name: "Article", path: articlePath(article) },
            ]}
          />

          <header className="relative overflow-hidden border-b border-line">
            <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
            <div className="container-x relative pb-10 pt-10">
              {hubInfo && (
                <Link
                  href={paths.hub(article.hub)}
                  className="focus-ring inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent transition-opacity hover:opacity-80"
                >
                  {hubInfo.name} hub →
                </Link>
              )}

              <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold tracking-tightest text-ink sm:text-5xl lg:text-6xl">
                {article.title}
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-soft">
                {article.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-soft">
                <span>
                  By{" "}
                  <Link href={paths.home} className="focus-ring link-underline text-ink">
                    {SITE.name}
                  </Link>
                </span>
                <span className="text-accent" aria-hidden>/</span>
                <time dateTime={article.publishDate}>{formatDate(article.publishDate)}</time>
                <span className="text-accent" aria-hidden>/</span>
                <span>{article.readingTime} min read</span>
                <span className="text-accent" aria-hidden>/</span>
                <span>~{article.wordCount.toLocaleString()} words</span>
              </div>
            </div>
          </header>

          <div className="container-x mt-12 grid gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
            <div className="min-w-0">
              {article.feat && (
                <div className="mb-10 overflow-hidden rounded-xl border border-line">
                  <Image
                    src={article.origPath}
                    alt={article.imageAlt}
                    width={1200}
                    height={675}
                    priority
                    className="h-auto w-full object-cover"
                    sizes="(min-width: 1024px) 60vw, 100vw"
                  />
                </div>
              )}

              <ArticleBody html={html} />
              <FaqSection faqs={faqs} />

              {/* Author block */}
              <div className="mt-16 flex items-center gap-5 rounded-xl border border-line bg-raised p-6">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line bg-surface">
                  {SITE.portrait.src ? (
                    <Image
                      src={SITE.portrait.src}
                      alt={SITE.portrait.alt}
                      width={SITE.portrait.width}
                      height={SITE.portrait.height}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-ink/40"
                    >
                      {SITE.initials}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-ink">{SITE.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-soft">
                    {SITE.role}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-soft">
                    I write about what I&apos;m learning as I learn it.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4">
                    <Link
                      href={paths.home}
                      className="focus-ring link-underline font-mono text-[11px] uppercase tracking-[0.16em] text-accent"
                    >
                      About me →
                    </Link>
                    {HAS_GITHUB && SITE.social.github ? (
                      <a
                        href={SITE.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring link-underline font-mono text-[11px] uppercase tracking-[0.16em] text-accent"
                      >
                        GitHub →
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Case studies behind this article */}
              {relatedCaseStudies.length > 0 && (
                <section className="mt-16 border-t border-line pt-10" aria-labelledby="related-projects">
                  <h2 id="related-projects" className="font-display text-2xl font-semibold text-ink">
                    The projects behind this
                  </h2>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                    {relatedCaseStudies.slice(0, 2).map((project) => (
                      <li key={project.slug}>
                        <Link
                          href={paths.project(project.slug)}
                          className="focus-ring group block h-full rounded-xl border border-line bg-raised p-5 transition-colors hover:border-accent/60"
                        >
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                            Case study
                          </span>
                          <span className="mt-2 block font-display text-lg font-semibold text-ink transition-colors group-hover:text-accent">
                            {project.name}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-soft">
                            {project.tagline}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="mt-16 border-t border-line pt-10">
                <div className="flex items-center gap-4">
                  <SignatureMark className="w-40 text-accent" />
                  <div>
                    <p className="font-serif text-2xl italic text-ink">Keep Building.</p>
                    <p className="mt-1 max-w-md text-sm leading-relaxed text-soft">
                      Built something similar? The projects behind these notes are documented
                      end to end.
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href={paths.projects}
                    className="focus-ring rounded-full bg-accent px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.16em] text-on-accent transition-transform hover:-translate-y-0.5"
                  >
                    See the projects
                  </Link>
                  <Link
                    href={paths.notebook}
                    className="focus-ring rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-soft transition-colors hover:border-accent hover:text-ink"
                  >
                    Back to the notebook
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="relative hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <Toc headings={headings} />

                {hubInfo && (
                  <div className="rounded-xl border border-line bg-raised p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
                      Topic hub
                    </p>
                    <Link
                      href={paths.hub(hubInfo.slug)}
                      className="focus-ring mt-2 block font-display text-base font-semibold text-ink transition-colors hover:text-accent"
                    >
                      {hubInfo.name} →
                    </Link>
                    <p className="mt-2 text-sm leading-relaxed text-soft">{hubInfo.tagline}</p>
                  </div>
                )}

                <div className="rounded-xl border border-line bg-raised p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">Share</p>
                  <div className="mt-3 flex gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(absoluteUrl(articlePath(article)))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring rounded-full border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-soft transition-colors hover:border-accent hover:text-ink"
                    >
                      Share
                    </a>
                  </div>
                </div>

                {sameHub.length > 0 && hub && (
                  <div className="rounded-xl border border-line bg-raised p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
                      More in {hub.name}
                    </p>
                    <ul className="mt-3 space-y-3">
                      {sameHub.map((item) => (
                        <li key={item.slug}>
                          <Link href={articlePath(item)} className="focus-ring group block">
                            <span className="font-display text-sm font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                              {item.title}
                            </span>
                            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
                              {item.readingTime} min read
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </article>

        {/* Related */}
        <section className="container-x mt-20 border-t border-line pt-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Keep reading
            </h2>
            <Link
              href={paths.notebook}
              className="focus-ring link-underline font-mono text-[11px] uppercase tracking-[0.18em] text-soft hover:text-ink"
            >
              All {allArticles.length} articles →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <ArticleCard key={item.slug} article={item} index={index} />
            ))}
          </div>
          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
            Topics:{" "}
            {hubContent.map((item, index) => (
              <span key={item.slug}>
                {index > 0 ? " · " : ""}
                <Link href={paths.hub(item.slug)} className="focus-ring hover:text-ink">
                  {item.name}
                </Link>
              </span>
            ))}
          </p>
        </section>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  );
}
