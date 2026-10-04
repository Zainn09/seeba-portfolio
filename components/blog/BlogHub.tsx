"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, filterArticles } from "@/lib/articles";
import type { FilterId } from "@/content/types";
import { Reveal } from "@/components/ui/primitives";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { hubs } from "@/content/articles";
import { paths } from "@/lib/urls";

/**
 * In-page notebook browser. Search and filters are local component state — they
 * never write a query string, so there is no way for a crawler to discover
 * thousands of filtered duplicate URLs. Each hub card is a real link to a
 * static hub page.
 */
export default function BlogHub() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");

  const results = useMemo(() => filterArticles(query, filter), [query, filter]);

  return (
    <section id="blog-hub" className="relative border-t border-line py-24 sm:py-32">
      <div className="bg-grid-fine absolute inset-0 opacity-40" aria-hidden />
      <div className="container-x relative">
        {/* heading */}
        <Reveal>
          <p className="meta-label flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            THE SEARCHABLE LIBRARY
          </p>
          <h2 className="mt-5 font-display text-4xl font-semibold tracking-tightest text-ink sm:text-5xl lg:text-6xl">
            Things I&apos;m <em className="font-serif font-normal italic text-soft">learning</em> &amp; building
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-soft">
            An indexed collection of notes, tutorials, and project walkthroughs — the
            same knowledge I&apos;m using to build my Python and AI/ML foundation.
            Search it, filter it, or browse the full notebook.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={paths.notebook}
              className="focus-ring rounded-full bg-accent px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-on-accent transition-transform hover:-translate-y-0.5"
            >
              Open the full notebook →
            </Link>
            <Link
              href={paths.projects}
              className="focus-ring rounded-full border border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-soft transition-colors hover:border-accent hover:text-ink"
            >
              Project case studies
            </Link>
          </div>
        </Reveal>

        {/* search + filters */}
        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <label className="relative block w-full max-w-md">
              <span className="sr-only">Search articles</span>
              <span
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-soft"
                aria-hidden
              >
                ⌕
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Python, AI, projects..."
                className="focus-ring w-full rounded-full border border-line bg-raised py-3.5 pl-11 pr-5 text-sm text-ink placeholder:text-soft/70"
              />
            </label>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter articles by topic"
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={filter === c.id}
                  onClick={() => setFilter(c.id as FilterId)}
                  className={`focus-ring rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                    filter === c.id
                      ? "border-accent bg-accent text-on-accent"
                      : "border-line bg-raised text-soft hover:border-accent/60 hover:text-ink"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* result count */}
        <Reveal delay={0.12} className="mt-8">
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-soft">
            <span>{results.length} article{results.length === 1 ? "" : "s"}</span>
            <span className="h-px w-10 bg-line" aria-hidden />
            <span>{filter === "all" ? "all topics" : filter.replace("-", " ")}</span>
          </p>
        </Reveal>

        {/* grid — editorial mixed sizes */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} large={i === 0 && query === "" && filter === "all"} />
          ))}
        </div>

        {results.length === 0 && (
          <div className="mt-10 rounded-xl border border-dashed border-line p-12 text-center">
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-soft">
              Nothing matches &ldquo;{query}&rdquo;
            </p>
            <p className="mt-2 text-sm text-soft/70">
              Try a broader keyword, clear the filters, or{" "}
              <Link href={paths.notebook} className="focus-ring link-underline text-ink">
                browse the full notebook
              </Link>
              .
            </p>
          </div>
        )}

        {/* hubs */}
        <Reveal delay={0.1} className="mt-20">
          <div className="border-t border-line pt-10">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
              Explore by hub
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {hubs.map((h) => (
                <Link
                  key={h.slug}
                  href={paths.hub(h.slug)}
                  style={{ ["--hub" as string]: h.accent }}
                  className="focus-ring group rounded-xl border border-line bg-raised p-5 transition-colors hover:border-accent/50"
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: h.accent }}
                    aria-hidden
                  />
                  <h4 className="mt-3 font-display text-lg font-semibold text-ink">{h.name}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-soft">{h.tagline}</p>
                  <span className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                    Open hub →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
