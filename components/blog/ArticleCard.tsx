"use client";

import Link from "next/link";
import Image from "next/image";
import type { ArticleMeta } from "@/content/types";
import { formatDate } from "@/lib/articles";
import { Reveal, Tilt } from "@/components/ui/primitives";

export function ArticleCard({
  article,
  index = 0,
  large = false,
}: {
  article: ArticleMeta;
  index?: number;
  large?: boolean;
}) {
  return (
    <Reveal delay={(index % 3) * 0.06} className="h-full">
      <Link
        href={`/blog/${article.slug}`}
        data-cursor="READ"
        className="focus-ring group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-raised transition-colors hover:border-accent/50"
      >
        <Tilt max={2} className="overflow-hidden">
          <div className={`relative isolate overflow-hidden ${large ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
            <Image
              src={article.origPath}
              alt={article.imageAlt}
              width={large ? 1200 : 800}
              height={large ? 675 : 500}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
            />
            <div className="absolute left-3 top-3">
              <span className="rounded-full bg-surface/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink backdrop-blur">
                {article.category}
              </span>
            </div>
          </div>
        </Tilt>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-soft">
            <span>{formatDate(article.publishDate)}</span>
            <span className="text-accent">/</span>
            <span>{article.readingTime} min read</span>
          </div>
          {/* Title - fixed to avoid footer overlap with explicit line clamp and spacing */}
          <h3
            className={`mt-3 line-clamp-3 font-display font-semibold tracking-tight text-ink transition-colors group-hover:text-accent ${
              large ? "text-2xl sm:text-3xl" : "text-xl leading-snug"
            }`}
          >
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-soft">{article.excerpt}</p>
          {/* Footer - isolated with border and safe spacing to prevent overlap */}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-line/50 pt-4">
            <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-soft/70">
              {article.primaryKeyword}
            </span>
            <span className="shrink-0 font-mono text-xs text-accent transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
