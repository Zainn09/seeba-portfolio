import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { articlesBySlug, allArticles, relatedArticles, formatDate, hubBySlug, articlesByHub } from "@/lib/articles";
import { getArticleContent } from "@/lib/articleContent";
import { markdownToHtml } from "@/lib/markdown";
import { extractFaqs } from "@/lib/faq";
import { SITE } from "@/lib/site";
import { ArticleBody, FaqSection, Toc, ReadingProgress } from "@/components/blog/ArticleClient";
import { SignatureMark } from "@/components/ui/placeholder";
import { ArticleCard } from "@/components/blog/ArticleCard";
import "../article-import.css";

export function generateStaticParams() {
  return allArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = articlesBySlug[params.slug];
  if (!article) return {};
  const url = `${SITE.baseUrl}/blog/${article.slug}`;
  const metaTitle = `${article.title} | ${SITE.name}`;
  const description = article.excerpt;

  return {
    title: article.title,
    description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      url,
      title: metaTitle,
      description,
      siteName: `${SITE.name} — Developer Notebook`,
      publishedTime: article.publishDate,
      authors: [SITE.name],
      tags: [article.primaryKeyword, ...article.secondaryKeywords],
      images: [
        { url: `${SITE.baseUrl}${socialImage(article)}`, ...dimensions(article) },
        { url: `${SITE.baseUrl}${socialImage(article)}`, width: 1200, height: 630, alt: article.imageAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description,
      images: [`${SITE.baseUrl}${socialImage(article)}`],
    },
  };
}

/** Social platforms prefer PNG/JPEG over WebP — serve PNG to crawlers. */
function socialImage(a: { slug: string }) {
  return `/images/blog/${a.slug}.png`;
}

function dimensions(a: { feat?: boolean }) {
  return a.feat ? { width: 1200, height: 675 } : { width: 800, height: 500 };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articlesBySlug[params.slug];
  if (!article) notFound();

  const md = getArticleContent(article.slug);
  if (!md) notFound();

  const { body, faqs } = extractFaqs(md);
  const { html, headings } = await markdownToHtml(body, { stripH1: true });
  const related = relatedArticles(article, 3);
  const hub = hubBySlug(article.hub);
  const sameHub = articlesByHub(article.hub)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: article.title,
        description: article.excerpt,
        image: `${SITE.baseUrl}/images/blog/${article.slug}.png`,
        datePublished: article.publishDate,
        dateModified: article.publishDate,
        author: {
          "@type": "Person",
          name: SITE.name,
          jobTitle: "BSCS Student · Python Developer · AI/ML Enthusiast",
        },
        publisher: {
          "@type": "Person",
          name: SITE.name,
        },
        mainEntityOfPage: `${SITE.baseUrl}/blog/${article.slug}`,
        keywords: [article.primaryKeyword, ...article.secondaryKeywords].join(", "),
        wordCount: article.wordCount,
        about: article.primaryKeyword,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.baseUrl },
          { "@type": "ListItem", position: 2, name: hub?.name ?? "Notebook", item: `${SITE.baseUrl}/#blog-hub` },
          { "@type": "ListItem", position: 3, name: article.title, item: `${SITE.baseUrl}/blog/${article.slug}` },
        ],
      },
      ...(faqs.length > 0
        ? ([
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ] as object[])
        : []),
    ],
  };

  return (
    <main className="pb-24">
      <ReadingProgress />
      <article>
        {/* Header */}
        <header className="relative overflow-hidden border-b border-line">
          <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
          <div className="container-x relative pb-10 pt-28 sm:pt-32">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                href="/#blog-hub"
                className="focus-ring inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-soft transition-colors hover:text-ink"
              >
                ← Back to notebook
              </Link>
              <span className="text-line" aria-hidden>·</span>
              {hub && (
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  {hub.name}
                </span>
              )}
            </div>

            <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold tracking-tightest text-ink sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-soft">
              {article.excerpt}
            </p>

            {/* meta row */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-soft">
              <span>By {SITE.name}</span>
              <span className="text-accent" aria-hidden>/</span>
              <span>{formatDate(article.publishDate)}</span>
              <span className="text-accent" aria-hidden>/</span>
              <span>{article.readingTime} min read</span>
              <span className="text-accent" aria-hidden>/</span>
              <span>~{article.wordCount.toLocaleString()} words</span>
            </div>
          </div>
        </header>

        <div className="container-x mt-12 grid gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
          {/* Body */}
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
                <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-ink/40">
                  AH
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-ink">{SITE.name}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-soft">
                  BSCS Student · Python Developer · AI/ML Enthusiast
                </p>
                <Link
                  href="/#about"
                  className="focus-ring mt-1 inline-block link-underline font-mono text-[11px] uppercase tracking-[0.16em] text-accent"
                >
                  About me →
                </Link>
              </div>
            </div>

            {/* end section */}
            <div className="mt-16 border-t border-line pt-10">
              <div className="flex items-center gap-4">
                <SignatureMark className="w-40 text-accent" />
                <div>
                  <p className="font-serif text-2xl italic text-ink">Keep Building.</p>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-soft">
                    Built something similar? Explore the projects behind these ideas on the main page.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/#projects"
                  className="focus-ring rounded-full bg-accent px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.16em] text-on-accent transition-transform hover:-translate-y-0.5"
                >
                  See the projects
                </Link>
                <Link
                  href="/#contact"
                  className="focus-ring rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-soft transition-colors hover:border-accent hover:text-ink"
                >
                  Start a conversation
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="relative hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <Toc headings={headings} />
              <div className="rounded-xl border border-line bg-raised p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">Share</p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`${SITE.baseUrl}/blog/${article.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring rounded-full border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-soft transition-colors hover:border-accent hover:text-ink"
                  >
                    Share
                  </a>
                </div>
              </div>
              {hub && (
                <div className="rounded-xl border border-line bg-raised p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
                    More in {hub.name}
                  </p>
                  <ul className="mt-3 space-y-3">
                    {sameHub.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/blog/${a.slug}`}
                          className="focus-ring group block"
                        >
                          <span className="font-display text-sm font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                            {a.title}
                          </span>
                          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
                            {a.readingTime} min read
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
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Keep reading
          </h2>
          <Link
            href="/#blog-hub"
            className="focus-ring link-underline font-mono text-[11px] uppercase tracking-[0.18em] text-soft hover:text-ink"
          >
            All articles →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} />
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
