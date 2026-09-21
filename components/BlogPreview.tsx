import { FEATURED, allArticles } from "@/lib/articles";
import { SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/primitives";
import { ArticleCard } from "@/components/blog/ArticleCard";
import Link from "next/link";

export default function BlogPreview() {
  const featured = FEATURED[0];
  const rest = allArticles.filter((a) => a.slug !== featured.slug).slice(0, 4);

  return (
    <section id="notebook" className="relative border-t border-line py-24 sm:py-32">
      <div className="container-x">
        <SectionHead
          index="09"
          label="The notebook"
          title={<>From my</>}
          serif="notebook"
          aside={
            <Link
              href="#blog-hub"
              className="focus-ring group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-soft transition-colors hover:border-accent hover:text-ink"
            >
              Browse the whole library
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* featured */}
          <ArticleCard article={featured} large />

          {/* side list */}
          <div className="flex flex-col divide-y divide-line rounded-xl border border-line bg-raised">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.05}>
                <Link
                  href={`/blog/${a.slug}`}
                  data-cursor="READ"
                  className="focus-ring group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-accent/[0.04]"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                      {a.category}
                    </span>
                    <h3 className="mt-1 truncate-2 font-display text-base font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                      {a.title}
                    </h3>
                  </div>
                  <div className="shrink-0 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
                    <span>{a.readingTime}m</span>
                    <span className="mt-1 block text-accent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
                      →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
