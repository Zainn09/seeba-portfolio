"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, motion } from "framer-motion";
import { projects, type Project } from "@/lib/content";
import { SectionHead } from "@/components/ui/section";
import { Reveal, Tilt, EASE } from "@/components/ui/primitives";
import { Console } from "@/components/demos/Console";
import { libraryScript, studentScript, bankScript } from "@/components/demos/pythonDemos";
import CafeDemo from "@/components/demos/CafeDemo";
import CalculatorDemo from "@/components/demos/CalculatorDemo";
import SneakerDemo from "@/components/demos/SneakerDemo";

/**
 * Each project has a "demo stage". The stage starts frozen with a branded
 * poster; clicking VIEW DEMO reveals the interaction (and honours
 * prefers-reduced-motion by leaving the poster state, harmlessly).
 */
function DemoStage({ demo, active, poster }: { demo: Project["demo"]; active: boolean; poster: string }) {
  const reduce = useReducedMotion();
  const playing = active && !reduce;

  return (
    <div className="relative h-full w-full">
      <div className={`h-full w-full transition-opacity duration-500 ${playing ? "opacity-0" : "opacity-100"}`}>
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-line bg-raised">
          <div className="bg-grid-fine absolute inset-0 opacity-60" aria-hidden />
          <div className="relative text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-soft">{poster}</span>
            <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-2xl text-accent" aria-hidden>
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
              ▸
            </div>
          </div>
        </div>
      </div>
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${playing ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!playing}
      >
        {demo === "library" && <Console lines={libraryScript} paused={!playing} />}
        {demo === "student" && <Console lines={studentScript} paused={!playing} />}
        {demo === "bank" && <Console lines={bankScript} paused={!playing} />}
        {demo === "cafe" && (playing ? <CafeDemo /> : null)}
        {demo === "calculator" && (playing ? <CalculatorDemo /> : null)}
        {demo === "sneaker" && (playing ? <SneakerDemo /> : null)}
      </div>
    </div>
  );
}

function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15%" });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!inView) setActive(false);
  }, [inView]);

  const hero = project.demo === "sneaker";
  const tech = project.demo !== "cafe" && project.demo !== "calculator" && project.demo !== "sneaker";

  return (
    <Reveal>
      <div
        ref={ref}
        className={`relative grid gap-6 ${hero ? "lg:grid-cols-2 lg:gap-12" : "md:grid-cols-[1fr_1.1fr] md:gap-10"}`}
      >
        {/* meta column */}
        <div className={`flex flex-col ${index % 2 ? "md:order-2" : ""}`}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.2em] text-accent">{project.index}</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
          </div>
          <h3 className="mt-4 font-display text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
            {project.name}
          </h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-soft">{project.tagline}</p>
          <p className="mt-4 max-w-md leading-relaxed text-soft">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.chips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-line bg-raised px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-soft"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              data-cursor="WATCH"
              onClick={() => setActive((a) => !a)}
              className="focus-ring group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-surface transition-transform hover:-translate-y-0.5"
            >
              <span
                className={`inline-block h-2 w-2 rounded-full transition-colors ${active ? "bg-accent" : "bg-accent/60"}`}
                aria-hidden
              />
              {active ? "STOP DEMO" : "VIEW DEMO"}
            </button>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft/70">
              {project.note}
            </span>
          </div>
        </div>

        {/* media column */}
        <div className={`${index % 2 ? "md:order-1" : ""}`}>
          <Tilt max={hero ? 3 : 5} className="h-full">
            <div className={hero ? "min-h-[420px] sm:min-h-[520px]" : `min-h-[300px] ${tech ? "sm:min-h-[360px]" : "sm:min-h-[340px]"}`}>
              <DemoStage demo={project.demo} active={active} poster={project.demo === "sneaker" ? "ANDROID APP WALKTHROUGH" : tech ? "PYTHON CONSOLE DEMO" : "LIVE UI DEMO"} />
            </div>
          </Tilt>
        </div>
      </div>
    </Reveal>
  );
}

export default function Projects() {
  const web = projects.filter((p) => p.group === "WEB FOUNDATIONS");
  const py = projects.filter((p) => p.group === "PYTHON · CONSOLE");
  const sneaker = projects.find((p) => p.demo === "sneaker");

  return (
    <section id="projects" className="relative border-t border-line py-24 sm:py-32">
      <div className="bg-grid-fine absolute inset-0 opacity-40" aria-hidden />
      <div className="container-x relative">
        <SectionHead
          index="04"
          label="The work"
          title={<>Things I&apos;ve</>}
          serif="actually built"
          aside={
            <span className="hidden max-w-xs text-right font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-soft md:block">
              no invented metrics.
              <br />
              just projects that exist.
            </span>
          }
        />

        {/* group label: web foundations */}
        <div className="mb-10 flex items-center gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Group 01 — Web Foundations</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
        </div>
        <div className="space-y-20">
          {web.map((p, i) => (
            <ProjectBlock key={p.id} project={p} index={i} />
          ))}
        </div>

        {/* group label: python */}
        <div className="mb-10 mt-24 flex items-center gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Group 02 — Python Console</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
        </div>
        <div className="space-y-20">
          {py.map((p, i) => (
            <ProjectBlock key={p.id} project={p} index={i} />
          ))}
        </div>

        {/* hero project */}
        {sneaker && (
          <>
            <div className="mb-10 mt-24 flex items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Group 03 — Highlight</span>
              <span className="h-px flex-1 bg-line" aria-hidden />
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-line bg-raised/60 p-6 sm:p-10">
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
                style={{ background: "radial-gradient(circle, rgb(var(--halo) / .6), transparent 65%)" }}
                aria-hidden
              />
              <ProjectBlock project={sneaker} index={0} />
            </div>
          </>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto mt-20 max-w-xl text-center font-mono text-xs leading-relaxed tracking-wide text-soft"
        >
          Every demo above is a live, lightweight animation — no fake screenshots,
          no borrowed footage. They play in-page and respect reduced-motion settings.
        </motion.p>
      </div>
    </section>
  );
}
