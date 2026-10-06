"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import { projects, type Project } from "@/lib/content";
import { SectionHead } from "@/components/ui/section";
import { Reveal, Tilt, EASE } from "@/components/ui/primitives";
import { Console } from "@/components/demos/Console";
import { libraryScript, studentScript, bankScript } from "@/components/demos/pythonDemos";
import CafeDemo from "@/components/demos/CafeDemo";
import CalculatorDemo from "@/components/demos/CalculatorDemo";
import SneakerDemo from "@/components/demos/SneakerDemo";

<<<<<<< HEAD
function DemoStage({ demo, active, poster }: { demo: Project["demo"]; active: boolean; poster: string }) {
  return (
    <div className="relative h-full w-full">
      <div className={`h-full w-full transition-opacity duration-500 ${active ? "opacity-0" : "opacity-100"}`}>
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-line bg-raised">
          <div className="bg-grid-fine absolute inset-0 opacity-60" aria-hidden />
          <div className="relative text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-soft">{poster}</span>
            <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-2xl text-accent" aria-hidden>
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />▸
            </div>
          </div>
        </div>
      </div>
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!active}
      >
        {demo === "library" && <Console lines={libraryScript} paused={!active} />}
        {demo === "student" && <Console lines={studentScript} paused={!active} />}
        {demo === "bank" && <Console lines={bankScript} paused={!active} />}
        {demo === "cafe" && (active ? <CafeDemo /> : null)}
        {demo === "calculator" && (active ? <CalculatorDemo /> : null)}
        {demo === "sneaker" && (active ? <SneakerDemo /> : null)}
      </div>
=======
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
>>>>>>> origin/arena/01a108d8-seeba-portfolio
    </div>
  );
}

function VideoStage({
  project,
  active,
  onToggle,
}: {
  project: Project;
  active: boolean;
  onToggle: () => void;
}) {
  const [videoError, setVideoError] = useState(false);
  const [showLive, setShowLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active && !videoError && !showLive) {
      v.play().catch(() => {
        // Autoplay blocked, still show controls
      });
    } else {
      v.pause();
    }
  }, [active, videoError, showLive]);

  const posterLabel =
    project.demo === "sneaker"
      ? "ANDROID APP WALKTHROUGH"
      : project.demo === "cafe" || project.demo === "calculator"
      ? "LIVE UI DEMO"
      : "PYTHON CONSOLE DEMO";

  if (!project.video) {
    return <DemoStage demo={project.demo} active={active} poster={posterLabel} />;
  }

  if (showLive) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-line bg-raised">
        <DemoStage demo={project.demo} active={active} poster={`${posterLabel} · LIVE`} />
        <div className="absolute bottom-3 left-3 right-3 flex justify-between gap-2">
          <button
            onClick={() => setShowLive(false)}
            className="rounded-full bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-surface"
          >
            ← Back to video
          </button>
          <span className="rounded-full bg-surface/85 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-soft">
            LIVE ANIMATION
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative h-full w-full cursor-pointer overflow-hidden rounded-xl border border-line bg-raised transition-colors hover:border-accent/40"
      onClick={onToggle}
      data-demo={project.demo}
    >
      {/* Video element - always rendered, valid MP4 */}
      <video
        ref={videoRef}
        src={project.video.mp4}
        poster={project.video.poster}
        muted
        loop
        playsInline
        controls={active}
        preload="metadata"
        onError={() => setVideoError(true)}
        className="h-full w-full cursor-pointer object-cover"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      />

      {/* Error state */}
      {videoError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-raised p-6 text-center">
          <div className="bg-grid-fine absolute inset-0 opacity-60" aria-hidden />
          <div className="relative">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-soft">Video failed to load</span>
            <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-soft">
              Showing live fallback. File: {project.video.mp4}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setVideoError(false);
                  videoRef.current?.load();
                }}
                className="rounded-full bg-raised border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-soft"
              >
                Retry
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLive(true);
                }}
                className="rounded-full bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-surface"
              >
                Live demo →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Poster overlay - clickable to play */}
      {!videoError && !active && (
        <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-raised/90 backdrop-blur-[1px] transition-opacity group-hover:bg-raised/80">
          <div className="bg-grid-fine absolute inset-0 opacity-60" aria-hidden />
          <div className="relative text-center p-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent shadow-[0_0_20px_rgb(var(--accent)/0.4)] transition-transform group-hover:scale-110">
              <span className="ml-1 text-2xl text-on-accent">▶</span>
            </div>
            <span className="mt-4 block font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
              {project.name}
            </span>
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              {posterLabel} — CLICK TO PLAY VIDEO
            </span>
            <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-soft/70">
              /videos/{project.slug}.mp4 · {project.demo} · 6 projects
            </div>
          </div>
        </div>
      )}

      {/* Playing indicator */}
      {active && !videoError && !showLive && (
        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-surface backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> Playing · Click to pause
        </div>
      )}

      {/* Badges */}
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
        <span className="rounded-full bg-ink/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-surface backdrop-blur">
          REC
        </span>
        <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-on-accent backdrop-blur">
          VIDEO · PLAYABLE
        </span>
        <span className="rounded-full bg-surface/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink backdrop-blur">
          {project.demo}
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-surface/90 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-soft backdrop-blur">
        {project.index}
      </div>

      {/* Live toggle when video is active */}
      {active && !videoError && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowLive(true);
          }}
          className="absolute right-3 top-3 rounded-full bg-surface/90 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-soft backdrop-blur hover:bg-ink hover:text-surface"
        >
          Live →
        </button>
      )}
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
        data-demo={project.demo}
      >
        <div className={`flex flex-col ${index % 2 ? "md:order-2" : ""}`}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.2em] text-accent">{project.index}</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
            {project.video && (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                VIDEO · CLICKABLE
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
<<<<<<< HEAD
              {active ? "PAUSE" : project.video ? "PLAY VIDEO" : "VIEW DEMO"}
=======
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
>>>>>>> origin/arena/01a108d8-seeba-portfolio
            </button>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft/70">{project.note}</span>
          </div>
          {project.video && (
            <p className="mt-3 font-mono text-[10px] leading-relaxed text-soft/60">
              Click video to play/pause · {project.video.mp4} · 6 videos total
            </p>
          )}
        </div>

        <div className={`${index % 2 ? "md:order-1" : ""}`}>
          <Tilt max={hero ? 3 : 5} className="h-full">
            <div className={hero ? "min-h-[420px] sm:min-h-[520px]" : `min-h-[300px] ${tech ? "sm:min-h-[360px]" : "sm:min-h-[340px]"}`}>
<<<<<<< HEAD
              <VideoStage project={project} active={active} onToggle={() => setActive((a) => !a)} />
=======
              {mode === "video" ? (
                <VideoStage
                  project={project}
                  playing={videoPlaying}
                  onToggle={() => setVideoPlaying(true)}
                />
              ) : (
                <LiveStage demo={project.demo} playing />
              )}
>>>>>>> origin/arena/01a108d8-seeba-portfolio
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
              6 videos · clickable · playable
              <br />
              no invented metrics.
            </span>
          }
        />

        <div className="mb-10 flex items-center gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Group 01 — Web Foundations</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">2 videos · clickable</span>
        </div>
        <div className="space-y-20">
          {web.map((p, i) => (
            <ProjectBlock key={p.id} project={p} index={i} />
          ))}
        </div>

        <div className="mb-10 mt-24 flex items-center gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Group 02 — Python Console</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">3 videos · playable</span>
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
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">1 video · hero · clickable</span>
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
<<<<<<< HEAD
          All 6 demos have valid MP4s in <code className="rounded bg-raised px-1">public/videos/</code> — 335KB-370KB, H.264,
          faststart moov, silent loop, clickable to play/pause. Click any video or PLAY VIDEO button.
=======
          Every project above has a short (under a minute) recorded walkthrough,
          plus an in-page live demo you can play with. All data is fictional and
          presented as a portfolio demonstration — no fake screenshots, no borrowed footage.
>>>>>>> origin/arena/01a108d8-seeba-portfolio
        </motion.p>
      </div>
    </section>
  );
}
