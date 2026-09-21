"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { skills } from "@/lib/content";
import { SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/primitives";

const W = 860;
const H = 620;

/** deterministic manual placement — Python sits center-stage */
const POSITION: Record<string, { x: number; y: number }> = {
  Python: { x: 430, y: 310 },
  Java: { x: 300, y: 220 },
  "Android Studio": { x: 300, y: 430 },
  HTML5: { x: 160, y: 160 },
  CSS3: { x: 120, y: 320 },
  XML: { x: 180, y: 470 },
  SQLite: { x: 590, y: 200 },
  "Firebase Authentication": { x: 640, y: 370 },
  "Cloud Firestore": { x: 560, y: 500 },
  Git: { x: 720, y: 160 },
  GitHub: { x: 750, y: 300 },
  Responsive: { x: 70, y: 240 },
};

export default function Skills() {
  const [hover, setHover] = useState<string | null>("Python");
  const reduce = useReducedMotion();

  const edges = useMemo(() => {
    const list: { from: string; to: string }[] = [];
    skills.forEach((s) =>
      s.links.forEach((target) => {
        if (POSITION[target] && POSITION[s.name]) {
          list.push({ from: s.name, to: target });
        }
      })
    );
    return list;
  }, []);

  const related = (name: string) =>
    new Set([
      name,
      ...skills.filter((s) => s.name === name).flatMap((s) => s.links),
      ...skills.filter((s) => s.links.includes(name)).map((s) => s.name),
    ]);

  const hovered = hover ? related(hover) : new Set<string>();

  return (
    <section id="skills" className="relative border-t border-line py-24 sm:py-32">
      <div className="container-x">
        <SectionHead
          index="07"
          label="Toolkit"
          title={<>The tools I</>}
          serif="work with"
          aside={
            <p className="max-w-xs text-sm leading-relaxed text-soft">
              No percentages, no &ldquo;expert&rdquo; labels. Just the technologies
              I actually build with — bigger where I spend more time.
            </p>
          }
        />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          {/* constellation */}
          <div className="relative overflow-hidden rounded-2xl border border-line bg-raised/50">
            <div className="bg-grid-fine absolute inset-0 opacity-50" aria-hidden />
            <div className="relative h-[460px] w-full sm:h-[560px]">
              <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" aria-hidden>
                {edges.map((e, i) => {
                  const a = POSITION[e.from];
                  const b = POSITION[e.to];
                  const lit = hovered.has(e.from) && hovered.has(e.to);
                  return (
                    <line
                      key={i}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke="rgb(var(--accent))"
                      strokeOpacity={lit ? 0.5 : 0.13}
                      strokeWidth={lit ? 1.4 : 1}
                    />
                  );
                })}
              </svg>

              {skills.map((s) => {
                const p = POSITION[s.name];
                const isPython = s.name === "Python";
                const lit = hovered.has(s.name);
                if (!p) return null;
                return (
                  <button
                    key={s.name}
                    type="button"
                    onMouseEnter={() => setHover(s.name)}
                    onFocus={() => setHover(s.name)}
                    onClick={() => setHover(s.name)}
                    data-cursor="BUILD"
                    className="focus-ring absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
                    aria-label={s.name}
                  >
                    <motion.span
                      animate={{ scale: lit ? 1.15 : 1 }}
                      transition={{ duration: 0.3 }}
                      className={`relative flex items-center justify-center rounded-full border font-mono uppercase tracking-[0.14em] transition-colors ${
                        isPython
                          ? "border-accent bg-accent text-on-accent"
                          : lit
                          ? "border-accent/70 bg-accent/10 text-ink"
                          : "border-line bg-raised text-soft"
                      }`}
                      style={{
                        width: isPython ? 96 : 64 + Math.round(s.weight * 8),
                        height: isPython ? 96 : 64 + Math.round(s.weight * 8),
                        fontSize: isPython ? 11 : 9,
                        boxShadow: isPython ? "0 0 32px rgb(var(--halo)/.45)" : lit ? "0 0 18px rgb(var(--halo)/.25)" : "none",
                      }}
                    >
                      {isPython ? (
                        <span className="text-center leading-tight">
                          {s.name}
                          <span className="block text-[8px] font-normal tracking-[0.2em] opacity-80">
                            primary
                          </span>
                        </span>
                      ) : (
                        s.name
                      )}
                    </motion.span>
                  </button>
                );
              })}
            </div>
            {!reduce && (
              <div className="pointer-events-none absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-[0.22em] text-soft/60" aria-hidden>
                hover a node to trace links
              </div>
            )}
          </div>

          {/* grouped list */}
          <div className="space-y-6">
            {(
              [
                ["Programming", ["Python", "Java"]],
                ["Frontend", ["HTML5", "CSS3", "XML"]],
                ["Mobile Development", ["Android Studio"]],
                ["Databases / Backend", ["SQLite", "Firebase Authentication", "Cloud Firestore"]],
                ["Tools", ["Git", "GitHub"]],
              ] as [string, string[]][]
            ).map(([group, names]) => (
              <Reveal key={group}>
                <div className="border-l-2 border-line pl-4">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
                    {group}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {names.map((n) => {
                      const lit = hovered.has(n);
                      return (
                        <button
                          key={n}
                          type="button"
                          onMouseEnter={() => setHover(n)}
                          onFocus={() => setHover(n)}
                          onClick={() => setHover(n)}
                          className={`focus-ring rounded-full border px-3 py-1.5 text-sm transition-colors ${
                            lit
                              ? "border-accent/70 bg-accent/10 text-ink"
                              : "border-line bg-raised text-soft"
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
