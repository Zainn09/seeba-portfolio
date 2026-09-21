"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const SECTIONS = ["home", "menu", "about", "contact"];
const PRICES = [
  ["Karak Chai — Rs 150", "Doodh Patti — Rs 120", "Green Tea — Rs 180"],
  ["Bun Kebab — Rs 160", "Samosa (2pc) — Rs 80", "Paratha Roll — Rs 240"],
  ["Pakora Plate — Rs 220", "Masala Fries — Rs 190", "Lassi — Rs 180"],
];

export default function CafeDemo() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const nav = setInterval(
      () => setActive((a) => (a + 1) % SECTIONS.length),
      2600
    );
    const me = setInterval(() => setMenu((m) => (m + 1) % PRICES.length), 3600);
    return () => {
      clearInterval(nav);
      clearInterval(me);
    };
  }, [reduce]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-line bg-[#fdfbf4] text-[#1b1f1a]">
      {/* mock navbar */}
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 sm:px-6">
        <span className="font-display text-sm font-bold tracking-tight sm:text-base">
          Chai<span className="text-[#b3592a]">Dosti</span>
        </span>
        <div className="hidden gap-4 sm:flex">
          {SECTIONS.map((s, i) => (
            <span
              key={s}
              className={`cursor-pointer text-[11px] uppercase tracking-[0.14em] transition-colors ${
                active === i ? "text-[#b3592a]" : "text-black/40"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
        <span className="rounded-full border border-[#b3592a]/40 px-3 py-1 text-[10px] uppercase tracking-widest text-[#b3592a]">
          Order
        </span>
      </div>

      {/* hero strip */}
      <div className="relative overflow-hidden px-6 py-8">
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#f4e3cd]" aria-hidden />
        <div className="absolute right-10 top-6 h-16 w-16 rounded-full bg-[#e0b08a]/60" aria-hidden />
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#b3592a]">Est. in Lahore</p>
        <h4 className="mt-1 max-w-xs font-display text-2xl font-bold leading-tight sm:text-3xl">
          Chai worth
          <br />
          stopping for.
        </h4>
      </div>

      {/* menu roll */}
      <div className="border-t border-black/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">Today&apos;s board</span>
          <span className="font-mono text-[10px] text-black/40">menu / {String(menu + 1).padStart(2, "0")}</span>
        </div>
        <div className="mt-3 space-y-2">
          {PRICES[menu].map((row, i) => (
            <div
              key={row}
              className="flex items-center justify-between border-b border-dotted border-black/15 pb-1.5 text-xs sm:text-sm"
              style={{ animation: reduce ? undefined : `fade-row 0.5s ease ${i * 0.08}s both` }}
            >
              <span>{row.split("—")[0]}</span>
              <span className="font-mono text-black/60">{row.split("—")[1]}</span>
            </div>
          ))}
        </div>
        <style jsx>{`
          @keyframes fade-row {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>

      <div className="absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-black/30">
        responsive — try it on a phone
      </div>
    </div>
  );
}
