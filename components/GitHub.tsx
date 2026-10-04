"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SITE, HAS_GITHUB } from "@/lib/site";
import { paths } from "@/lib/urls";
import { projects } from "@/lib/content";
import { SectionHead } from "@/components/ui/section";
import { Reveal, EASE } from "@/components/ui/primitives";

/**
 * Open source / evidence section.
 *
 * There is no fabricated activity graph here. When a real GitHub profile is
 * configured (NEXT_PUBLIC_GITHUB_URL) the section links to it; until then it
 * honestly points at the projects and the notebook, which are the real work.
 */
export default function GitHub() {
  const featured = projects;

  return (
    <section id="github" className="relative overflow-hidden py-24 sm:py-32">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="container-x relative">
        <SectionHead
          index="08"
          label="Building in the open"
          title={<>Where the work</>}
          serif="actually lives"
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
          {/* Real project index — no invented commit data */}
          <div className="relative overflow-hidden rounded-2xl border border-line bg-raised/60 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
                Case studies in this portfolio
              </h3>
              <Link
                href={paths.projects}
                className="focus-ring font-mono text-[10px] uppercase tracking-[0.2em] text-accent"
              >
                All projects →
              </Link>
            </div>

            <ul className="mt-5 divide-y divide-line">
              {featured.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={paths.project(project.slug)}
                    className="focus-ring group flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3.5"
                  >
                    <span className="font-display text-base font-medium text-ink transition-colors group-hover:text-accent">
                      {project.name}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
                      {project.chips.slice(0, 3).join(" · ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-5 font-mono text-[10px] leading-relaxed tracking-wide text-soft/70">
              Every build listed here is documented as a full case study in this
              portfolio — and nothing on this page invents commits, stars or streaks.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col justify-between gap-8 rounded-2xl border border-accent/30 bg-raised p-8">
            <div>
              <h3 className="font-display text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
                {HAS_GITHUB ? "See the actual commits." : "I build in the open — as it ships."}
              </h3>
              <p className="mt-4 leading-relaxed text-soft">
                {HAS_GITHUB ? (
                  <>
                    Repositories, commits and the slow build-up of practice are on
                    GitHub, alongside the projects documented here.
                  </>
                ) : (
                  <>
                    I&apos;m a student developer, so most of what I learn leaves a trail:
                    a project, the notes I wrote about it, and the next thing I built
                    because of it. This section links to my GitHub profile as soon as
                    the repositories are published.
                  </>
                )}
              </p>
            </div>

            <div className="space-y-3">
              {HAS_GITHUB && SITE.social.github ? (
                <a
                  href={SITE.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="EXPLORE"
                  className="focus-ring group inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-surface transition-transform hover:-translate-y-0.5"
                >
                  Open GitHub profile →
                </a>
              ) : (
                <Link
                  href={paths.notebook}
                  data-cursor="READ"
                  className="focus-ring group inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-surface transition-transform hover:-translate-y-0.5"
                >
                  Read the technical notes →
                </Link>
              )}
              <Link
                href={paths.projects}
                className="focus-ring inline-flex w-full items-center justify-center gap-3 rounded-full border border-line px-6 py-3.5 font-mono text-xs uppercase tracking-[0.16em] text-soft transition-colors hover:border-accent hover:text-ink"
              >
                Browse case studies
              </Link>
            </div>

            <div className="flex items-center gap-4 border-t border-line pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
              <span>BSCS</span>
              <span className="text-accent">·</span>
              <span>BUILD IN PUBLIC</span>
              <span className="text-accent">·</span>
              <span>KEEP EXPLORING</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
