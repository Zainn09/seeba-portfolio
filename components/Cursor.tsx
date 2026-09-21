"use client";

import { useEffect, useRef, useState } from "react";

type CursorMode = { label: string; active: boolean };

/**
 * Subtle custom cursor — desktop + fine pointer only. Hover targets carry
 * data-cursor attributes so each zone can say exactly what's happening
 * (WATCH / EXPLORE / THIS IS MINE).
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>({ label: "", active: false });
  const [enabled, setEnabled] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    let raf = 0;
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setHidden(false);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor],a,button");
      if (t) {
        const label = t.dataset.cursor ?? "";
        setMode({ label, active: true });
      } else {
        setMode({ label: "", active: false });
      }
    };

    const onLeave = () => setHidden(true);

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-opacity duration-200"
        style={{ opacity: hidden ? 0 : 1 }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[89] flex h-10 w-10 items-center justify-center rounded-full border border-ink/30 dark:border-ink/25 transition-all duration-200"
        style={{
          opacity: hidden ? 0 : 1,
          transform: "translate(-50%, -50%)",
          backgroundColor: mode.active ? "rgb(var(--accent))" : "transparent",
          borderColor: mode.active ? "rgb(var(--accent))" : undefined,
          scale: mode.active ? "1.6" : "1",
          mixBlendMode: mode.active ? "normal" : undefined,
        }}
      >
        {mode.active && mode.label ? (
          <span
            className="font-mono text-[8px] font-medium uppercase tracking-[0.14em]"
            style={{ color: "rgb(var(--on-accent))" }}
          >
            {mode.label}
          </span>
        ) : null}
      </div>
    </>
  );
}
