"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const EXPRESSIONS: { keys: string; display: string; note: string }[] = [
  { keys: "7", display: "7", note: "" },
  { keys: "×", display: "7 ×", note: "" },
  { keys: "8", display: "7 × 8", note: "" },
  { keys: "=", display: "56", note: "result" },
  { keys: "÷", display: "56 ÷", note: "" },
  { keys: "7", display: "56 ÷ 7", note: "" },
  { keys: "=", display: "8", note: "result" },
  { keys: "C", display: "0", note: "clear" },
  { keys: "1", display: "1", note: "" },
  { keys: "2", display: "12", note: "" },
  { keys: "×", display: "12 ×", note: "" },
  { keys: "9", display: "12 × 9", note: "" },
  { keys: "=", display: "108", note: "result" },
];

const KEYS = ["C", "±", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ".", "="];

export default function CalculatorDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setStep((s) => (s + 1) % EXPRESSIONS.length), 950);
    return () => clearInterval(t);
  }, [reduce]);

  const current = EXPRESSIONS[step];

  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl border border-line bg-[#e9edf3] p-6 sm:p-10">
      <div className="w-full max-w-[260px] overflow-hidden rounded-3xl bg-[#0e1218] shadow-2xl ring-1 ring-black/40">
        {/* display */}
        <div className="flex flex-col items-end gap-1 px-6 pb-5 pt-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            {current.note || "responsive calc"}
          </span>
          <span
            key={step}
            className="font-mono text-4xl font-light tabular-nums text-white"
            style={{ animation: reduce ? undefined : "pop-in 0.35s ease" }}
          >
            {current.display}
          </span>
        </div>
        {/* keypad */}
        <div className="grid grid-cols-4 gap-2 rounded-t-3xl bg-[#1a2130] p-4">
          {KEYS.map((k) => {
            const highlighted = current.keys === k;
            const isOp = ["÷", "×", "−", "+", "="].includes(k);
            return (
              <button
                key={k}
                type="button"
                tabIndex={-1}
                aria-hidden
                className={`flex h-12 items-center justify-center rounded-2xl font-mono text-lg transition-all duration-150 ${
                  highlighted
                    ? "scale-105 bg-[#B8F56A] text-[#0e1218]"
                    : isOp
                    ? "bg-[#2b3550] text-[#B8F56A]"
                    : "bg-[#232c40] text-white/90"
                }`}
              >
                {k}
              </button>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        @keyframes pop-in {
          from { opacity: 0.2; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
