"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/site";
import { PortraitPlaceholder } from "@/components/ui/placeholder";
import { EASE } from "@/components/ui/primitives";

function useParallax() {
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setOffset({ x: nx, y: ny }));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return offset;
}

export default function Hero() {
  const { x, y } = useParallax();

  return (
    <section id="top" className="relative overflow-hidden">
      {/* layered backdrop */}
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -right-40 top-24 h-[520px] w-[520px] rounded-full opacity-25 blur-3xl sm:-right-24"
        style={{ background: "radial-gradient(circle, rgb(var(--halo) / .5), transparent 65%)" }}
        aria-hidden
      />

      <div className="container-x relative grid min-h-screen items-center gap-10 pb-20 pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-24 lg:pt-28">
        {/* Copy */}
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
            className="meta-label flex items-center gap-3"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            01 / PERSONAL PROFILE
            <span className="hidden h-px w-12 bg-line sm:block" aria-hidden />
            <span className="hidden sm:inline">BSCS / {SITE.university.toUpperCase()}</span>
          </motion.p>

          <h1 className="mt-6 font-display font-bold tracking-tightest text-ink">
            <span className="block overflow-hidden">
              <motion.span
                className="block text-[17vw] leading-[0.9] sm:text-7xl md:text-8xl lg:text-[7.5rem]"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
                style={{ transform: `translateY(${y * 3}px)` }}
              >
                Abdul
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block text-[17vw] leading-[0.9] sm:text-7xl md:text-8xl lg:text-[7.5rem]"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
              >
                <span className="text-accent">Haseeb</span>
                <span className="text-accent">.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-6 font-mono text-sm uppercase tracking-[0.18em] text-soft sm:text-base"
          >
            BSCS Student. Python Developer. AI/ML Enthusiast.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
            className="mt-5 max-w-lg text-lg leading-relaxed text-ink sm:text-xl"
          >
            {SITE.statement.split("—")[0]}
            <em className="font-serif not-italic sm:italic text-ink/80">
              {" "}— {SITE.statement.split("—")[1]}
            </em>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-5 max-w-xl leading-relaxed text-soft"
          >
            I&apos;m a <strong className="font-medium text-ink">BS Computer Science student</strong> building
            real software — from a café website to console programs to an Android
            e-commerce app — with the long-term goal of expertise in{" "}
            <strong className="font-medium text-ink">Artificial Intelligence</strong> and{" "}
            <strong className="font-medium text-ink">Machine Learning</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.2 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              data-cursor="BUILD"
              className="focus-ring group inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.16em] text-on-accent transition-transform hover:-translate-y-0.5"
            >
              See the work
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#contact"
              className="focus-ring link-underline font-mono text-xs uppercase tracking-[0.16em] text-soft hover:text-ink"
            >
              Get in touch
            </a>
          </motion.div>
        </div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.55 }}
          className="relative mx-auto w-full max-w-sm lg:max-w-md"
        >
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-t-[10rem] rounded-b-2xl border border-line shadow-2xl"
            style={{ transform: `translateY(${y * -10}px)` }}
          >
            <PortraitPlaceholder className="h-full w-full" />
          </div>

          {/* floating metadata chips */}
          <div
            className="absolute -left-4 top-10 hidden rotate-[-6deg] items-center gap-2 rounded-md border border-line bg-raised/90 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-soft shadow-lg backdrop-blur sm:flex"
            style={{ transform: `translate(${x * -16}px, ${y * 10}px)` }}
            aria-hidden
          >
            PYTHON / CURRENT FOCUS
          </div>
          <div
            className="absolute -right-2 bottom-16 hidden rotate-[5deg] items-center gap-2 rounded-md border border-line bg-raised/90 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-soft shadow-lg backdrop-blur sm:flex"
            style={{ transform: `translate(${x * 14}px, ${y * -8}px)` }}
            aria-hidden
          >
            AI/ML / NEXT DIRECTION
          </div>
          <div
            className="absolute -bottom-4 left-6 flex items-center gap-2 rounded-full border border-accent/40 bg-raised px-4 py-2 shadow-lg"
            aria-hidden
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft">
              BUILD / LEARN / SOLVE
            </span>
          </div>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="container-x absolute inset-x-0 bottom-6 flex items-center justify-between"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
          Scroll — the story unfolds
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="font-mono text-soft"
          aria-hidden
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
