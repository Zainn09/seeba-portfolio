"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { thinkingStages } from "@/lib/content";
import { SectionHead } from "@/components/ui/section";
import { Reveal, EASE } from "@/components/ui/primitives";

export default function Thinking() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const stage = thinkingStages[active];

  return (
    <section id="thinking" className="relative overflow-hidden py-24 sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(ellipse, rgb(var(--halo) / .5), transparent 60%)" }}
        aria-hidden
      />
      <div className="container-x relative">
        <SectionHead
          index="05"
          label="How I think"
          title={<>Before</>}
          serif="I code"
          aside={
            <p className="max-w-xs text-sm leading-relaxed text-soft">
              I don&apos;t jump straight to the keyboard. Most problems are solved
              before a single line gets typed.
            </p>
          }
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* The chain */}
          <div className="relative">
            <div className="absolute left-[9px] top-2 bottom-2 w-px bg-line" aria-hidden />
            <ol className="space-y-1.5">
              {thinkingStages.map((s, i) => {
                const isActive = i === active;
                return (
                  <li key={s.id} className="relative">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      aria-pressed={isActive}
                      data-cursor="THINK"
                      className="focus-ring group flex w-full items-center gap-4 rounded-lg px-2 py-2.5 text-left"
                    >
                      <span className="relative z-10 flex h-[19px] w-[19px] items-center justify-center">
                        <span
                          className={`h-[9px] w-[9px] rounded-full border transition-all duration-300 ${
                            isActive
                              ? "scale-125 border-accent bg-accent"
                              : "border-soft/60 bg-surface group-hover:border-accent"
                          }`}
                          aria-hidden
                        />
                      </span>
                      <span
                        className={`font-mono text-[13px] uppercase tracking-[0.22em] transition-colors ${
                          isActive ? "text-ink" : "text-soft"
                        }`}
                      >
                        {s.label}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="thinking-arrow"
                          className="ml-auto font-mono text-sm text-accent"
                          aria-hidden
                        >
                          →
                        </motion.span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Detail panel */}
          <div className="relative min-h-[240px] rounded-2xl border border-line bg-raised p-8 sm:p-10">
            <div className="bg-grid-fine absolute inset-0 rounded-2xl opacity-40" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -14 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                  What happens here
                </span>
                <h3 className="mt-3 font-display text-3xl font-bold tracking-tightest text-ink sm:text-4xl">
                  {stage.label}
                </h3>
                <p className="mt-2 font-mono text-sm text-soft">{stage.clue}</p>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/90">{stage.detail}</p>
                <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
                  <span>STAGE {String(active + 1).padStart(2, "0")}</span>
                  <span className="text-accent">/</span>
                  <span>{String(thinkingStages.length).padStart(2, "0")}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-12 max-w-2xl border-l-2 border-accent pl-5 font-serif text-xl italic leading-relaxed text-ink/90">
            A bug is rarely the first mistake. Usually the first mistake happens in
            the step where nobody typed anything.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
