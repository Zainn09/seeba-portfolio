import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allArticles, articlesByHub, articlesBySlug, formatDate } from "@/lib/articles";
import { hubContent, hubContentBySlug } from "@/content/hubs";
import { projectBySlug } from "@/content/projects";
import { absoluteUrl, articlePath, paths } from "@/lib/urls";
import { SITE, SEO } from "@/lib/site";
import { breadcrumbNode, collectionPageNode, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ArticleCard } from "@/components/blog/ArticleCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";

export function generateStaticParams() {
  return hubContent.map((hub) => ({ hub: hub.slug }));
}

export function generateMetadata({ params }: { params: { hub: string } }): Metadata {
  const hub = hubContentBySlug[params.hub];
  if (!hub) return {};
  const description = hub.summary;

  return {
    title: `${hub.name} Articles`,
    description,
    alternates: { canonical: paths.hub(hub.slug) },
    openGraph: {
      type: "website",
      url: absoluteUrl(paths.hub(hub.slug)),
      title: `${hub.name} Articles | Abdul Haseeb`,
      description,
      siteName: `${SITE.name} — Developer Notebook`,
      images: [{ url: SEO.ogImage, width: 1200, height: 630, alt: SEO.ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${hub.name} Articles | Abdul Haseeb`,
      description,
      images: [SEO.ogImage],
    },
  };
}

export default function HubPage({ params }: { params: { hub: string } }) {
  const hub = hubContentBySlug[params.hub];
  if (!hub) notFound();

  const articles = articlesByHub(hub.slug).sort((a, b) =>
    a.publishDate.localeCompare(b.publishDate)
  );
  if (articles.length === 0) notFound();

  const otherHubs = hubContent.filter((item) => item.slug !== hub.slug);
  const banner = articles.find((article) => article.feat) ?? articles[0];
  const rest = articles.filter((article) => article.slug !== banner.slug);

  const jsonLd = graph([
    breadcrumbNode([
      { name: "Home", path: paths.home },
      { name: "Notebook", path: paths.notebook },
      { name: hub.name, path: paths.hub(hub.slug) },
    ]),
    collectionPageNode({
      name: `${hub.name} — Abdul Haseeb developer notebook`,
      description: hub.summary,
      path: paths.hub(hub.slug),
      items: articles.map((article) => ({ name: article.title, path: articlePath(article) })),
    }),
  ]);

  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main" className="relative">
        <Breadcrumbs
          items={[
            { name: "Home", path: paths.home },
            { name: "Notebook", path: paths.notebook },
            { name: hub.name, path: paths.hub(hub.slug) },
          ]}
        />

        <header className="container-x relative pt-8 sm:pt-12">
          <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative max-w-3xl">
            <p className="meta-label flex items-center gap-3" style={{ color: hub.accent }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hub.accent }} aria-hidden />
              {hub.name.toUpperCase()} / {articles.length} ARTICLES
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tightest text-ink sm:text-5xl lg:text-6xl">
              {hub.name}
            </h1>
            <p className="mt-4 font-serif text-xl italic text-soft sm:text-2xl">{hub.tagline}</p>

            <div className="mt-7 space-y-4 text-lg leading-relaxed text-soft">
              {hub.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-line bg-raised p-6">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
                What this hub covers
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {hub.covers.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-soft">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        {/* Featured article in this hub */}
        <section className="container-x mt-16" aria-labelledby="hub-start-here">
          <h2 id="hub-start-here" className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
            Start with this one
          </h2>
          <div className="mt-6">
            <ArticleCard article={banner} large />
          </div>
        </section>

        {/* Remaining articles — plain links, no JS required */}
        {rest.length > 0 && (
          <section className="container-x mt-16" aria-labelledby="hub-articles">
            <h2 id="hub-articles" className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              All {hub.name} articles
            </h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {rest.map((article) => (
                <li key={article.slug}>
                  <Link href={articlePath(article)} className="focus-ring group flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:gap-6">
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-soft sm:w-32">
                      {formatDate(article.publishDate)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                        {article.title}
                      </span>
                      <span className="mt-1 block max-w-2xl text-sm leading-relaxed text-soft">
                        {article.excerpt}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-soft">
                      {article.readingTime} min
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Practical work behind this topic */}
        {hub.projectLinks.length > 0 && (
          <section className="container-x mt-16" aria-labelledby="hub-projects">
            <h2 id="hub-projects" className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Projects that use {hub.name}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-soft">
              These case studies put the ideas above into practice, with the decisions
              and problems that came up during the build.
            </p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {hub.projectLinks
                .filter((link) => projectBySlug[link.slug])
                .map((link) => (
                  <li key={link.slug}>
                    <Link
                      href={paths.project(link.slug)}
                      className="focus-ring inline-flex items-center gap-2 rounded-full border border-line bg-raised px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-soft transition-colors hover:border-accent hover:text-ink"
                    >
                      {link.name} →
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* Other hubs — lateral internal linking */}
        <section className="container-x mt-16" aria-labelledby="other-hubs">
          <h2 id="other-hubs" className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
            Other notebook topics
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {otherHubs.map((item) => (
              <li key={item.slug}>
                <Link
                  href={paths.hub(item.slug)}
                  className="focus-ring inline-block rounded-full border border-line bg-raised px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-soft transition-colors hover:border-accent hover:text-ink"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={paths.notebook}
                className="focus-ring inline-block rounded-full border border-accent/50 bg-raised px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink"
              >
                All {allArticles.length} articles →
              </Link>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  );
}
