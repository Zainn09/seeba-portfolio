"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import { SectionHead } from "@/components/ui/section";
import { Reveal, EASE } from "@/components/ui/primitives";

export default function GitHub() {
  const connected = !SITE.githubUrl.startsWith("YOUR_");

  return (
    <section id="github" className="relative overflow-hidden py-24 sm:py-32">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="container-x relative">
        <SectionHead
          index="08"
          label="The evidence"
          title={<>Open source of</>}
          serif="my learning"
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
          {/* contribution / activity placeholder grid */}
          <div className="relative overflow-hidden rounded-2xl border border-line bg-raised/60 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
                Contribution graph — placeholder
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                {connected ? "LIVE SOON" : "NOT YET LIVE"}
              </span>
            </div>

            {/* fake-but-clearly-placeholder activity cells */}
            <div className="mt-5 grid grid-flow-col grid-rows-7 gap-[4px] overflow-hidden" aria-hidden>
              {Array.from({ length: 52 * 7 }).map((_, i) => {
                const intensity = Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.13));
                const level =
                  intensity > 0.82 ? 4 : intensity > 0.6 ? 3 : intensity > 0.4 ? 2 : intensity > 0.2 ? 1 : 0;
                const colors = [
                  "bg-line/40",
                  "bg-accent/15",
                  "bg-accent/30",
                  "bg-accent/55",
                  "bg-accent",
                ];
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (i % 14) * 0.01 }}
                    className={`h-[10px] w-[10px] rounded-[3px] ${colors[level]}`}
                  />
                );
              })}
            </div>
            <p className="mt-5 font-mono text-[10px] leading-relaxed tracking-wide text-soft/70">
              No commit counts, stars, or streaks invented. This space waits for a
              real GitHub handle — then the actual activity feeds straight in.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col justify-between gap-8 rounded-2xl border border-accent/30 bg-raised p-8">
            <div>
              <h3 className="font-display text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
                {connected ? "See the actual commits." : "The real proof comes later."}
              </h3>
              <p className="mt-4 leading-relaxed text-soft">
                {connected ? (
                  <>
                    Repositories, commits, and the slow build-up of practice — hosted
                    on GitHub.
                  </>
                ) : (
                  <>
                    Add a GitHub URL and this section connects automatically —
                    repositories, activity, everything.
                  </>
                )}
              </p>
            </div>
            <div className="space-y-3">
              <a
                href={connected ? SITE.githubUrl : "#contact"}
                target={connected ? "_blank" : undefined}
                rel="noopener noreferrer"
                data-cursor="EXPLORE"
                className="focus-ring group inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-surface transition-transform hover:-translate-y-0.5"
              >
                {connected ? "Open GitHub profile" : "View my repositories"} →
              </a>
              {!connected && (
                <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-soft/70">
                  GITHUB_PROFILE_LINK_HERE
                </p>
              )}
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
