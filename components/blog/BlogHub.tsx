"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, filterArticles } from "@/lib/articles";
import type { FilterId } from "@/content/types";
import { Reveal } from "@/components/ui/primitives";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { hubs } from "@/content/articles";

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
            An indexed collection of notes, tutorials, and project walkthroughs —
            the same knowledge I&apos;m using to build my Python and AI/ML foundation.
            Search it, filter it, read what matters to you.
          </p>
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
              role="tablist"
              aria-label="Filter articles by topic"
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={filter === c.id}
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
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-soft">
            <span>{results.length} article{results.length === 1 ? "" : "s"}</span>
            <span className="h-px w-10 bg-line" aria-hidden />
            <span>{filter === "all" ? "all topics" : filter.replace("-", " ")}</span>
          </div>
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
            <p className="mt-2 text-sm text-soft/70">Try a broader keyword, or clear the filters.</p>
          </div>
        )}

        {/* hubs */}
        <Reveal delay={0.1} className="mt-20">
          <div className="border-t border-line pt-10">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft">Explore by hub</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {hubs.map((h) => (
                <a
                  key={h.slug}
                  href={`#blog-hub`}
                  onClick={(e) => {
                    e.preventDefault();
                    setQuery("");
                    setFilter(h.slug as FilterId);
                    document.getElementById("blog-hub")?.scrollIntoView({ behavior: "smooth" });
                  }}
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
                  <span className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Filter →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
