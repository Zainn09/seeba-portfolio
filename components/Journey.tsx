"use client";

import { motion } from "framer-motion";
import { journeyStages } from "@/lib/content";
import { SectionHead } from "@/components/ui/section";
import { Reveal, EASE } from "@/components/ui/primitives";

export default function Journey() {
  return (
    <section id="journey" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHead
          index="03"
          label="How I got here"
          title={<>A short history of</>}
          serif="getting curious"
        />

        <div className="relative mt-8">
          {/* Green center rail - solid, prominent, zigzag anchor */}
          <div
            className="absolute left-[7px] top-0 hidden h-full w-[2px] -translate-x-1/2 bg-accent md:left-1/2 md:block"
            aria-hidden
          >
            <div className="absolute inset-0 bg-accent blur-[6px] opacity-30" aria-hidden />
          </div>
          {/* Mobile rail - subtle green */}
          <div
            className="absolute left-[7px] top-2 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent md:hidden"
            aria-hidden
          />

          {/* Ledger header - numbered history ledger styling */}
          <div className="mb-10 hidden items-center gap-4 border-b border-dashed border-line pb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-soft md:flex">
            <span className="text-accent">Ledger</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
            <span>4 entries</span>
            <span className="text-accent" aria-hidden>·</span>
            <span>2019 — Present</span>
          </div>

          <ol className="space-y-16 md:space-y-28">
            {journeyStages.map((stage, i) => {
              const flip = i % 2 === 1;
              const ledgerNumber = String(i + 1).padStart(3, "0");
              return (
                <li key={stage.id} className="relative md:grid md:grid-cols-2 md:gap-16">
                  {/* Node on green rail */}
                  <span
                    className="absolute left-0 top-2 flex h-[15px] w-[15px] items-center justify-center md:left-1/2 md:-translate-x-1/2"
                    aria-hidden
                  >
                    <span className="absolute h-full w-full rounded-full border-2 border-accent bg-surface shadow-[0_0_0_4px_rgb(var(--surface)),0_0_12px_rgb(var(--accent)/0.4)]" />
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${i === 3 ? "bg-accent" : "bg-accent"}`}
                    />
                  </span>

                  <Reveal
                    delay={i * 0.05}
                    className={`pl-10 md:pl-0 ${flip ? "md:col-start-2 md:text-left" : "md:col-start-1 md:text-right"}`}
                  >
                    <div
                      className={`group relative rounded-xl border border-line bg-raised/40 p-5 backdrop-blur-sm transition-colors hover:border-accent/30 hover:bg-raised sm:p-6 ${
                        flip ? "md:text-left" : "md:text-right"
                      }`}
                    >
                      {/* Ledger line accent */}
                      <div
                        className={`absolute top-0 h-px w-12 bg-accent ${flip ? "left-6" : "right-6 md:left-auto md:right-6"}`}
                        aria-hidden
                      />

                      {/* Numbered ledger index */}
                      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
                        <span className="inline-flex h-6 min-w-[2.75rem] items-center justify-center rounded-full border border-accent/30 bg-accent/10 px-2 text-accent">
                          {ledgerNumber}
                        </span>
                        <span className="text-accent">{stage.index}</span>
                        <span className="h-px flex-1 bg-line/60" aria-hidden />
                      </div>

                      {/* Title + subtitle stacked directly under title - no gap, ledger style */}
                      <div className="mt-4 flex flex-col">
                        <h3 className="font-display text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
                          {stage.title}
                        </h3>
                        <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-accent/80">
                          {stage.sub}
                        </span>
                      </div>

                      <p
                        className={`mt-4 max-w-md leading-relaxed text-soft ${
                          flip ? "md:text-left" : "md:ml-auto md:text-right"
                        }`}
                      >
                        {stage.body}
                      </p>

                      <ul
                        className={`mt-5 flex max-w-md flex-wrap gap-x-4 gap-y-2 text-sm ${
                          flip ? "md:justify-start" : "md:ml-auto md:justify-end"
                        }`}
                      >
                        {stage.points.map((p) => (
                          <li key={p} className="flex items-center gap-1.5 text-ink/80">
                            <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                            {p}
                          </li>
                        ))}
                      </ul>

                      <div
                        className={`mt-5 flex flex-wrap gap-2 ${
                          flip ? "md:justify-start" : "md:justify-end"
                        }`}
                      >
                        {stage.chips.map((c) => (
                          <span
                            key={c}
                            className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                              i === 3
                                ? "border-accent/60 bg-accent/10 text-accent"
                                : "border-line bg-raised text-soft"
                            }`}
                          >
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Ledger footer line */}
                      <div className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-soft/50">
                        <span>Entry</span>
                        <span className="text-accent/50">·</span>
                        <span>{ledgerNumber}</span>
                        <span className="h-px flex-1 bg-line/40" aria-hidden />
                      </div>
                    </div>
                  </Reveal>

                  {/* spacer for the empty column */}
                  <div
                    className={flip ? "md:col-start-1 md:row-start-1" : "md:col-start-2 md:row-start-1"}
                    aria-hidden
                  />
                </li>
              );
            })}
          </ol>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-16 max-w-xl border-l-2 border-accent pl-5 font-mono text-sm leading-relaxed text-soft"
        >
          The goal isn&apos;t titles or percentages. It&apos;s to keep each stage honest —
          every project listed here is one I actually built, and the AI/ML direction
          is exactly that: a direction, being walked toward on purpose.
        </motion.p>
      </div>
    </section>
  );
}
