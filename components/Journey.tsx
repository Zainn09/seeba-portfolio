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

        <div className="relative mt-4">
          {/* timeline rail */}
          <div
            className="absolute left-[7px] top-2 h-full w-px bg-gradient-to-b from-accent via-line to-transparent md:left-1/2"
            aria-hidden
          />

          <ol className="space-y-14 md:space-y-24">
            {journeyStages.map((stage, i) => {
              const flip = i % 2 === 1;
              return (
                <li key={stage.id} className="relative md:grid md:grid-cols-2 md:gap-16">
                  {/* node */}
                  <span
                    className="absolute left-0 top-2 flex h-[15px] w-[15px] items-center justify-center md:left-1/2 md:-translate-x-1/2"
                    aria-hidden
                  >
                    <span className={`absolute h-full w-full rounded-full border border-accent ${i === 3 ? "bg-accent/20" : ""}`} />
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${i === 3 ? "bg-accent" : "bg-accent/60"}`}
                    />
                  </span>

                  <Reveal
                    delay={i * 0.05}
                    className={`pl-10 md:pl-0 ${flip ? "md:col-start-2 md:text-left" : "md:col-start-1 md:text-right"}`}
                  >
                    <div className={flip ? "md:text-left" : "md:text-right"}>
                      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                        {stage.index}
                      </div>
                      <h3 className="mt-2 font-display text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
                        {stage.title}
                      </h3>
                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-soft">
                        {stage.sub}
                      </p>
                      <p className={`mt-4 max-w-md leading-relaxed text-soft ${flip ? "md:text-left" : "md:ml-auto md:text-right"}`}>
                        {stage.body}
                      </p>
                      <ul
                        className={`mt-5 flex max-w-md flex-wrap gap-x-4 gap-y-2 ${flip ? "md:justify-start" : "md:ml-auto md:justify-end"}`}
                      >
                        {stage.points.map((p) => (
                          <li key={p} className="flex items-center gap-1.5 text-sm text-ink/80">
                            <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <div className={`mt-5 flex flex-wrap gap-2 ${flip ? "md:justify-start" : "md:justify-end"}`}>
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
                    </div>
                  </Reveal>

                  {/* spacer for the empty column */}
                  <div className={flip ? "md:col-start-1 md:row-start-1" : "md:col-start-2 md:row-start-1"} aria-hidden />
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
