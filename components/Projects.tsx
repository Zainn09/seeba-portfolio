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
 * A recorded, ≤1-minute walkthrough video is the primary media; a "live demo"
 * toggle still runs the in-page interaction for anyone who wants to play with
 * it (honours prefers-reduced-motion).
 */
function VideoStage({ project, playing, onToggle }: { project: Project; playing: boolean; onToggle: () => void }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-line bg-raised">
      <video
        className="h-full w-full object-contain"
        src={project.video}
        poster={project.poster}
        controls={playing}
        loop
        muted
        playsInline
        preload={playing ? "auto" : "metadata"}
        aria-label={`${project.name} — recorded demo walkthrough`}
      >
        Your browser doesn&apos;t support HTML video.
      </video>
      {!playing && (
        <button
          type="button"
          onClick={onToggle}
          data-cursor="WATCH"
          className="focus-ring group absolute inset-0 flex items-center justify-center"
          aria-label={`Play ${project.name} demo video`}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/60 bg-surface/70 text-accent backdrop-blur transition-transform group-hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
                <path d="M7 4.5v15l13-7.5Z" />
              </svg>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-soft">
              {project.note ?? "WATCH"}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

/**
 * The live, in-page interaction (React components) shown when "live demo" is on.
 */
function LiveStage({ demo, playing }: { demo: Project["demo"]; playing: boolean }) {
  return (
    <div className="h-full w-full" aria-hidden={!playing}>
      {demo === "library" && <Console lines={libraryScript} paused={!playing} />}
      {demo === "student" && <Console lines={studentScript} paused={!playing} />}
      {demo === "bank" && <Console lines={bankScript} paused={!playing} />}
      {demo === "cafe" && (playing ? <CafeDemo /> : null)}
      {demo === "calculator" && (playing ? <CalculatorDemo /> : null)}
      {demo === "sneaker" && (playing ? <SneakerDemo /> : null)}
    </div>
  );
}

function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15%" });
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"video" | "live">("video");
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    if (!inView) {
      setVideoPlaying(false);
      setMode("video");
    }
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
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              data-cursor="WATCH"
              onClick={() => {
                setMode("video");
                setVideoPlaying(true);
              }}
              className="focus-ring group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-surface transition-transform hover:-translate-y-0.5"
            >
              <span
                className={`inline-block h-2 w-2 rounded-full transition-colors ${mode === "video" ? "bg-accent" : "bg-surface/40"}`}
                aria-hidden
              />
              {mode === "video" ? "WATCH VIDEO" : "SHOW VIDEO"}
            </button>
            <button
              type="button"
              data-cursor="EXPLORE"
              onClick={() => setMode("live")}
              disabled={!!reduce}
              className={`focus-ring inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                mode === "live"
                  ? "border-accent text-accent"
                  : "border-line text-soft hover:border-accent/60 hover:text-ink"
              } ${reduce ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full transition-colors ${mode === "live" ? "bg-accent" : "bg-line"}`}
                aria-hidden
              />
              LIVE DEMO
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
              {mode === "video" ? (
                <VideoStage
                  project={project}
                  playing={videoPlaying}
                  onToggle={() => setVideoPlaying(true)}
                />
              ) : (
                <LiveStage demo={project.demo} playing />
              )}
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

        <div className="mb-10 flex items-center gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Group 01 — Web Foundations</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
        </div>
        <div className="space-y-20">
          {web.map((p, i) => (
            <ProjectBlock key={p.id} project={p} index={i} />
          ))}
        </div>

        <div className="mb-10 mt-24 flex items-center gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Group 02 — Python Console</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
        </div>
        <div className="space-y-20">
          {py.map((p, i) => (
            <ProjectBlock key={p.id} project={p} index={i} />
          ))}
        </div>

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
          Every project above has a short (under a minute) recorded walkthrough,
          plus an in-page live demo you can play with. All data is fictional and
          presented as a portfolio demonstration — no fake screenshots, no borrowed footage.
        </motion.p>
      </div>
    </section>
  );
}
