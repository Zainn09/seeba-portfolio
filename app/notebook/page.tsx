import type { Metadata } from "next";
import Link from "next/link";
import { allArticles, FEATURED, formatDate } from "@/lib/articles";
import { hubContent } from "@/content/hubs";
import { SITE, SEO } from "@/lib/site";
import { graph, breadcrumbNode, collectionPageNode } from "@/lib/schema";
import { absoluteUrl, articlePath, paths } from "@/lib/urls";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import { Reveal } from "@/components/ui/primitives";
import { ArticleCard } from "@/components/blog/ArticleCard";

const DESCRIPTION =
  "The Abdul Haseeb developer notebook: articles on Python, AI/ML, Android, problem solving and the student developer journey.";

export const metadata: Metadata = {
  title: { absolute: "Developer Notebook — Python, AI/ML & Android Articles" },
  description: DESCRIPTION,
  alternates: { canonical: paths.notebook },
  openGraph: {
    type: "website",
    url: absoluteUrl(paths.notebook),
    title: "Developer Notebook | Abdul Haseeb",
    description: DESCRIPTION,
    siteName: `${SITE.name} — Developer Notebook`,
    images: [{ url: SEO.ogImage, width: 1200, height: 630, alt: SEO.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Notebook | Abdul Haseeb",
    description: DESCRIPTION,
    images: [SEO.ogImage],
  },
};

export default function NotebookPage() {
  const featured = FEATURED.slice(0, 2);
  const grouped = hubContent
    .map((hub) => ({
      hub,
      articles: allArticles
        .filter((article) => article.hub === hub.slug)
        .sort((a, b) => a.publishDate.localeCompare(b.publishDate)),
    }))
    .filter((group) => group.articles.length > 0);

  const jsonLd = graph([
    breadcrumbNode([
      { name: "Home", path: paths.home },
      { name: "Notebook", path: paths.notebook },
    ]),
    collectionPageNode({
      name: "Abdul Haseeb — Developer Notebook",
      description: DESCRIPTION,
      path: paths.notebook,
      items: hubContent.map((hub) => ({ name: hub.name, path: paths.hub(hub.slug) })),
    }),
  ]);

  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main" className="relative">
        <Breadcrumbs items={[{ name: "Home", path: paths.home }, { name: "Notebook", path: paths.notebook }]} />

        <header className="container-x relative pt-8 sm:pt-12">
          <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative max-w-3xl">
            <p className="meta-label flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              THE NOTEBOOK / {allArticles.length} ARTICLES
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tightest text-ink sm:text-5xl lg:text-6xl">
              The developer <em className="font-serif font-normal italic text-accent">notebook</em>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-soft">
              Everything I write while learning: Python fundamentals, AI and machine
              learning concepts, Android development, problem-solving habits and the
              student developer journey. Every article is a real page you can read
              directly — no filters required.
            </p>
            <p className="mt-4 leading-relaxed text-soft">
              Written by <Link href={paths.home} className="focus-ring link-underline text-ink">Abdul Haseeb</Link>,
              a BSCS student and Python developer working toward AI/ML. The projects
              behind these notes live under{" "}
              <Link href={paths.projects} className="focus-ring link-underline text-ink">Projects</Link>.
            </p>
          </div>
        </header>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="container-x mt-16" aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
              Start here
            </h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {featured.map((article, index) => (
                <ArticleCard key={article.slug} article={article} index={index} large={index === 0} />
              ))}
            </div>
          </section>
        )}

        {/* Topic hubs */}
        <section className="container-x mt-20" aria-labelledby="hubs-heading">
          <h2 id="hubs-heading" className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Explore by topic
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-soft">
            Six topic clusters, each with its own hub page. Hubs are a good place to
            start if you want a subject end to end rather than a single article.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hubContent.map((hub) => {
              const count = allArticles.filter((article) => article.hub === hub.slug).length;
              return (
                <Reveal key={hub.slug} delay={0.04}>
                  <Link
                    href={paths.hub(hub.slug)}
                    className="focus-ring group flex h-full flex-col rounded-xl border border-line bg-raised p-6 transition-colors hover:border-accent/60"
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: hub.accent }}
                      aria-hidden
                    />
                    <h3 className="mt-3 font-display text-xl font-semibold text-ink transition-colors group-hover:text-accent">
                      {hub.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-soft">{hub.tagline}</p>
                    <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-soft">
                      {count} article{count === 1 ? "" : "s"} →
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Full index, grouped — crawlable from static HTML */}
        <section className="container-x mt-20" aria-labelledby="all-heading">
          <h2 id="all-heading" className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            All articles
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-soft">
            {allArticles.length} articles across {grouped.length} topics, newest first
            within each topic.
          </p>

          <div className="mt-10 space-y-12">
            {grouped.map(({ hub, articles }) => (
              <div key={hub.slug}>
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    <Link href={paths.hub(hub.slug)} className="focus-ring link-underline">
                      {hub.name}
                    </Link>
                  </h3>
                  <Link
                    href={paths.hub(hub.slug)}
                    className="focus-ring font-mono text-[10px] uppercase tracking-[0.16em] text-soft transition-colors hover:text-ink"
                  >
                    Hub page →
                  </Link>
                </div>
                <ul className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                  {articles.map((article) => (
                    <li key={article.slug}>
                      <Link href={articlePath(article)} className="focus-ring group block">
                        <span className="font-display text-base font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                          {article.title}
                        </span>
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
                          {formatDate(article.publishDate)} · {article.readingTime} min read
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="container-x mt-20">
          <div className="rounded-2xl border border-line bg-raised p-8 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              Looking for the code, not the notes?
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-soft">
              The Projects section has full case studies — what each build does, how it
              is structured, and what it taught me.
            </p>
            <Link
              href={paths.projects}
              className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.16em] text-on-accent transition-transform hover:-translate-y-0.5"
            >
              See the projects →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  );
}
