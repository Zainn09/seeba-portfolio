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
 * If a recorded video exists, it plays as primary, with live animation as fallback.
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

function VideoStage({
  project,
  active,
}: {
  project: Project;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const playing = active && !reduce;
  const [videoError, setVideoError] = useState(false);
  const [showLive, setShowLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (playing && !videoError && !showLive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing, videoError, showLive]);

  const posterLabel =
    project.demo === "sneaker"
      ? "ANDROID APP WALKTHROUGH"
      : project.demo === "cafe" || project.demo === "calculator"
      ? "LIVE UI DEMO"
      : "PYTHON CONSOLE DEMO";

  // If no video configured, fall back to live demo
  if (!project.video) {
    return <DemoStage demo={project.demo} active={active} poster={posterLabel} />;
  }

  // If user explicitly wants live demo, show it
  if (showLive) {
    return (
      <div className="relative h-full w-full">
        <DemoStage demo={project.demo} active={active} poster={`${posterLabel} · LIVE`} />
        <button
          onClick={() => setShowLive(false)}
          className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-surface backdrop-blur"
        >
          ← Back to video
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-line bg-raised">
      {/* Video element - always rendered, valid MP4 now */}
      <video
        ref={videoRef}
        src={project.video.mp4}
        poster={project.video.poster}
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setVideoError(true)}
        className="h-full w-full object-cover"
        data-demo={project.demo}
      />

      {/* Error fallback - still shows poster but indicates issue */}
      {videoError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-raised p-6 text-center">
          <div className="bg-grid-fine absolute inset-0 opacity-60" aria-hidden />
          <div className="relative">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-soft">Video failed to load</span>
            <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-soft">Showing live animation fallback. Regenerate via scripts/record-demo-videos.ts</p>
            <button
              onClick={() => setShowLive(true)}
              className="mt-4 rounded-full bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-surface"
            >
              View live demo →
            </button>
          </div>
        </div>
      )}

      {/* Poster overlay when not playing - shows for all 6 projects */}
      {!videoError && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-raised/90 backdrop-blur-[1px] transition-opacity duration-500 ${
            playing ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <div className="bg-grid-fine absolute inset-0 opacity-60" aria-hidden />
          <div className="relative text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-soft">
              {posterLabel} — RECORDED · {project.slug}
            </span>
            <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-soft/60">
              /videos/{project.slug}.mp4 · {project.demo} · loop · silent · 6 projects
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-2xl text-accent" aria-hidden>
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />▸
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLive(true);
              }}
              className="mt-4 rounded-full border border-line bg-surface/80 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-soft backdrop-blur hover:border-accent hover:text-ink"
            >
              Or view live animation
            </button>
          </div>
        </div>
      )}

      {/* Video badges - shows REC + demo type + project count */}
      <div className="absolute left-3 top-3 flex items-center gap-2">
        <span className="rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-surface backdrop-blur">
          REC
        </span>
        <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-on-accent backdrop-blur">
          VIDEO
        </span>
        <span className="rounded-full bg-surface/85 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink backdrop-blur">
          {project.demo}
        </span>
      </div>

      {/* Bottom right - project index */}
      <div className="absolute bottom-3 left-3 rounded-full bg-surface/85 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-soft backdrop-blur">
        {project.index} · {project.slug}
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
        data-demo={project.demo}
      >
        {/* meta column */}
        <div className={`flex flex-col ${index % 2 ? "md:order-2" : ""}`}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.2em] text-accent">{project.index}</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
            {project.video && (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                Video
              </span>
            )}
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
              {active ? "STOP DEMO" : project.video ? "PLAY VIDEO" : "VIEW DEMO"}
            </button>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft/70">
              {project.note}
            </span>
          </div>
          {project.video && (
            <p className="mt-3 font-mono text-[10px] leading-relaxed text-soft/60">
              Recorded demo: {project.video.mp4} — reproducible via{" "}
              <code className="rounded bg-raised px-1 py-0.5">scripts/record-demo-videos.ts</code>
            </p>
          )}
        </div>

        {/* media column */}
        <div className={`${index % 2 ? "md:order-1" : ""}`}>
          <Tilt max={hero ? 3 : 5} className="h-full">
            <div className={hero ? "min-h-[420px] sm:min-h-[520px]" : `min-h-[300px] ${tech ? "sm:min-h-[360px]" : "sm:min-h-[340px]"}`}>
              <VideoStage project={project} active={active} />
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
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">2 videos</span>
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
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">3 videos</span>
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
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">1 video · hero</span>
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
          Every demo above has a recorded video version in <code className="rounded bg-raised px-1">public/videos/</code> — silent,
          loopable, reproducible via Playwright. Live animation remains as fallback and respects reduced-motion.
        </motion.p>
      </div>
    </section>
  );
}
