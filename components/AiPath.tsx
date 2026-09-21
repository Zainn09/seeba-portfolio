"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { aiPathNodes } from "@/lib/content";
import { SectionHead } from "@/components/ui/section";
import { Reveal, EASE } from "@/components/ui/primitives";

export default function AiPath() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const node = aiPathNodes[active];

  const geometry = useMemo(() => aiPathNodes, []);

  return (
    <section id="direction" className="relative border-t border-line py-24 sm:py-32">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="container-x relative">
        <SectionHead
          index="06"
          label="The direction"
          title={<>Where I&apos;m</>}
          serif="going"
          aside={
            <p className="max-w-xs text-sm leading-relaxed text-soft">
              Nothing here is claimed as mastered. This is the path I&apos;m actively
              building along — one node at a time.
            </p>
          }
        />

        {/* Constellation */}
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-line bg-raised/50 p-6 sm:p-12">
          <div className="bg-grid-fine absolute inset-0 opacity-50" aria-hidden />

          {/* connectors */}
          <div className="relative z-10 mx-auto h-[460px] w-full max-w-4xl sm:h-[520px]">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 800 520"
              preserveAspectRatio="none"
              aria-hidden
            >
              {aiPathNodes.slice(0, -1).map((_, i) => {
                const start = nodePoint(i);
                const end = nodePoint(i + 1);
                return (
                  <motion.line
                    key={i}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="rgb(var(--accent))"
                    strokeOpacity={i <= active ? 0.55 : 0.14}
                    strokeWidth={1}
                    strokeDasharray="4 6"
                    initial={false}
                    animate={{ strokeDashoffset: reduce ? 0 : -8 }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                  />
                );
              })}
            </svg>

            {aiPathNodes.map((n, i) => {
              const p = nodePoint(i);
              return (
                <button
                  key={n.id}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  data-cursor="BUILD"
                  className="focus-ring absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${p.x}px`, top: `${p.y}px` }}
                >
                  <span
                    className={`relative flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-300 ${
                      active === i
                        ? "border-accent bg-accent shadow-[0_0_18px_rgb(var(--halo)/.8)]"
                        : "border-soft/60 bg-raised"
                    }`}
                  >
                    {active === i && (
                      <motion.span
                        layoutId="ai-core"
                        className="absolute h-2 w-2 rounded-full bg-on-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </span>
                </button>
              );
            })}

            {/* labels on hover-only (fade in via parent) */}
            {aiPathNodes.map((n, i) => {
              const p = nodePoint(i);
              const below = i % 2 === 1;
              return (
                <div
                  key={`label-${n.id}`}
                  className={`pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap text-center ${below ? "translate-y-4" : "-translate-y-[2.4rem]"}`}
                  style={{ left: `${p.x}px`, top: `${p.y}px` }}
                >
                  <span
                    className={`font-display text-sm font-semibold transition-opacity duration-300 sm:text-base ${
                      active === i ? "text-ink" : "text-soft/70"
                    }`}
                  >
                    {n.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* detail card */}
        <div className="mx-auto mt-8 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="rounded-xl border border-line bg-raised p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl font-bold tracking-tightest text-ink sm:text-3xl">
                  {node.label}
                </h3>
                <span className="rounded-full border border-accent/50 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                  {node.status}
                </span>
              </div>
              <p className="mt-3 leading-relaxed text-soft">{node.detail}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {node.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-soft"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-soft/70">
                <span>NODE {String(active + 1).padStart(2, "0")}</span>
                <span className="text-accent">/</span>
                <span>{String(aiPathNodes.length).padStart(2, "0")}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/** fixed constellation coordinates (0–800 × 0–520) */
function nodePoint(i: number) {
  const pts = [
    { x: 90, y: 300 },
    { x: 240, y: 180 },
    { x: 380, y: 340 },
    { x: 520, y: 200 },
    { x: 660, y: 330 },
    { x: 760, y: 180 },
  ];
  return pts[i % pts.length];
}
