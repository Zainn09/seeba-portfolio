"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Console } from "@/components/demos/Console";
import { bankScript, libraryScript, studentScript } from "@/components/demos/pythonDemos";
import CafeDemo from "@/components/demos/CafeDemo";
import CalculatorDemo from "@/components/demos/CalculatorDemo";
import SneakerDemo from "@/components/demos/SneakerDemo";
import type { Project } from "@/lib/content";

const POSTERS: Record<Project["demo"], string> = {
  sneaker: "ANDROID APP WALKTHROUGH",
  library: "PYTHON CONSOLE DEMO",
  student: "PYTHON CONSOLE DEMO",
  bank: "PYTHON CONSOLE DEMO",
  cafe: "LIVE UI DEMO",
  calculator: "LIVE UI DEMO",
  web: "LIVE UI DEMO",
};

/**
 * Reusable interactive demo player for project case studies — same behaviour as
 * the homepage stages: a static poster first, the interaction only on request,
 * and reduced-motion users stay on the poster rather than losing the content.
 */
export default function DemoPlayer({ demo }: { demo: Project["demo"] }) {
  const [active, setActive] = useState(false);
  const reduce = useReducedMotion();
  const playing = active && !reduce;

  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-xl border border-line bg-raised sm:min-h-[420px]">
      <div className={`absolute inset-0 transition-opacity duration-500 ${playing ? "opacity-0" : "opacity-100"}`}>
        <div className="bg-grid-fine absolute inset-0 opacity-60" aria-hidden />
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-soft">
            {POSTERS[demo]}
          </span>
          <button
            type="button"
            onClick={() => setActive((value) => !value)}
            aria-pressed={active}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-surface transition-transform hover:-translate-y-0.5"
          >
            <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${active ? "bg-accent" : "bg-accent/60"}`} />
            {active ? "Stop demo" : "View demo"}
          </button>
          <p className="max-w-sm text-xs leading-relaxed text-soft">
            Runs in the browser — no video download
            {reduce ? ". Motion is off because your system asks for reduced motion, so the demo stays paused." : "."}
          </p>
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
