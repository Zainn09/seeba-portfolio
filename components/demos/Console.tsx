"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Deterministic typing console — renders an authentic-looking terminal
 * that types a script line by line. Used by every Python project demo.
 */
export function Console({
  lines,
  speed = 14,
  className,
  paused = false,
  cursorColor = "var(--accent)",
}: {
  lines: { text: string; tone?: "in" | "out" | "dim" | "ok" | "" }[];
  speed?: number;
  className?: string;
  paused?: boolean;
  cursorColor?: string;
}) {
  const [rendered, setRendered] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    if (paused) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (cancelled) return;
      const line = lines[idx.current];
      if (!line) {
        idx.current = 0;
        setRendered([]);
        timer = setTimeout(step, 650);
        return;
      }
      if (line.text.startsWith("/")) {
        // command typed out character by character
        setTyping(true);
        const text = line.text;
        let ci = 0;
        const type = () => {
          if (cancelled) return;
          if (ci <= text.length) {
            setRendered((r) => {
              const copy = [...r];
              copy[idx.current] = "> " + text.slice(0, ci);
              return copy;
            });
            ci++;
            timer = setTimeout(type, speed);
          } else {
            setTyping(false);
            idx.current++;
            timer = setTimeout(step, 500);
          }
        };
        type();
      } else {
        setTyping(false);
        setRendered((r) => [...r, line.text]);
        idx.current++;
        timer = setTimeout(step, 620);
      }
    };

    timer = setTimeout(step, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [lines, speed, paused]);

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-[#0a0f1a] font-mono text-[12px] leading-relaxed sm:text-[13px] ${className ?? ""}`}
      role="img"
      aria-label="Animated terminal demonstration"
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
        <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
          python — demo
        </span>
      </div>
      <div className="flex-1 overflow-hidden p-4">
        <pre className="h-full whitespace-pre-wrap break-words text-[#c8d3d0]">
          {rendered.map((t, i) => (
            <div
              key={i}
              className={
                t.startsWith("> ")
                  ? "text-[#B8F56A] dark:text-[#B8F56A]"
                  : t.includes("✓") || t.includes("OK") || t.toLowerCase().includes("updated") || t.toLowerCase().includes("returned") || t.toLowerCase().includes("issued")
                  ? "text-[#7DE2D1]"
                  : t.startsWith("·") || t.startsWith("—")
                  ? "text-white/40"
                  : "text-[#c8d3d0]"
              }
            >
              {t}
              {i === rendered.length - 1 && typing && (
                <span className="ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] animate-pulse bg-[#B8F56A]" />
              )}
            </div>
          ))}
          {rendered.length === 0 && (
            <span className="inline-block h-[1em] w-[7px] translate-y-[2px] animate-pulse bg-[#B8F56A]" />
          )}
        </pre>
      </div>
    </div>
  );
}
