"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Fictional Android e-commerce walkthrough — launch, login, browse, detail,
 * cart, address, checkout. Products are invented for the demo and clearly
 * presented as portfolio demonstration, not a real store.
 */

const SHOES = [
  { name: "Court Runner", price: "$79", tag: "NEW", hue: 150, sub: "Everyday street" },
  { name: "Grid Classic", price: "$95", tag: "", hue: 210, sub: "Retro built light" },
  { name: "Night Move", price: "$120", tag: "HOT", hue: 260, sub: "Low-light runner" },
];

const STEPS: { id: string; label: string }[] = [
  { id: "launch", label: "LAUNCH" },
  { id: "login", label: "LOGIN" },
  { id: "browse", label: "BROWSE" },
  { id: "detail", label: "DETAIL" },
  { id: "cart", label: "CART" },
  { id: "address", label: "ADDRESS" },
  { id: "checkout", label: "CHECKOUT" },
];

function sneakerShape(hue: number) {
  return (
    <svg viewBox="0 0 120 56" className="w-full drop-shadow" aria-hidden>
      <path
        d="M12 44 C 14 28, 22 16, 38 14 L 92 12 C 102 12, 110 20, 110 30 L 110 40 C 110 46, 96 50, 74 49 L 20 49 C 14 49, 11 47, 12 44 Z"
        fill={`hsl(${hue} 35% 22%)`}
      />
      <path
        d="M38 14 L 44 12 C 52 9, 60 12, 62 20 L 66 26 C 60 24, 50 22, 40 24 Z"
        fill={`hsl(${hue} 40% 16%)`}
      />
      <path d="M20 47 C 40 45, 70 45, 92 47 L 92 50 C 70 52, 40 52, 20 50 Z" fill={`hsl(${hue} 30% 45%)`} />
      <path d="M16 22 L 34 16" stroke={`hsl(${hue} 60% 70%)`} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M18 28 L 36 22" stroke={`hsl(${hue} 60% 70%)`} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="104" cy="44" r="4" fill="#B8F56A" />
    </svg>
  );
}

export default function SneakerDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState<number[]>([]);

  useEffect(() => {
    if (reduce) return;
    // cycle steps, with browse/detail getting extra dwell
    const dwell = (s: number) => (s === 2 || s === 3 ? 2600 : 2000);
    let cancelled = false;
    let current = 0;
    let t: ReturnType<typeof setTimeout>;
    const run = () => {
      if (cancelled) return;
      const next = (current + 1) % STEPS.length;
      current = next;
      setStep(next);
      if (next === 4) setCart([0]); // item drops into the cart on first entry
      t = setTimeout(run, dwell(next));
    };
    t = setTimeout(run, dwell(0));
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [reduce]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 rounded-xl border border-line bg-[#0c101c] p-6 sm:p-8">
      {/* device frame */}
      <div className="relative h-[380px] w-[200px] overflow-hidden rounded-[2rem] border-[6px] border-[#1a2234] bg-[#0e1320] shadow-2xl ring-1 ring-white/10 sm:h-[420px]">
        {/* status bar */}
        <div className="flex items-center justify-between bg-[#0e1320] px-4 pb-1 pt-2 text-[9px] font-medium text-white/70">
          <span>{`1${(step + 3) % 9}:0${(step * 3) % 6}`}</span>
          <span className="tracking-widest">SneakerStore</span>
          <span>▮▮▮</span>
        </div>

        {/* screen */}
        <div className="relative flex h-full flex-col">
          {/* LAUNCH */}
          {step === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 animate-[fade_0.4s_ease]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B8F56A] font-display text-2xl font-bold text-[#0e1320]">
                S
              </div>
              <span className="font-display text-lg font-semibold text-white">SneakerStore</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                portfolio demonstration
              </span>
            </div>
          )}

          {/* LOGIN */}
          {step === 1 && (
            <div className="flex flex-1 flex-col justify-center gap-3 px-5 animate-[fade_0.4s_ease]">
              <span className="font-display text-xl font-semibold text-white">Welcome back</span>
              <div className="rounded-xl bg-white/5 px-3 py-2.5 text-[11px] text-white/50">you@example.com</div>
              <div className="rounded-xl bg-white/5 px-3 py-2.5 text-[11px] text-white/50">••••••••</div>
              <div className="rounded-xl bg-[#B8F56A] py-2.5 text-center text-[12px] font-semibold text-[#0e1320]">
                Continue
              </div>
              <span className="text-center font-mono text-[9px] uppercase tracking-widest text-white/40">
                firebase auth
              </span>
            </div>
          )}

          {/* BROWSE */}
          {step === 2 && (
            <div className="flex flex-1 flex-col gap-3 px-4 py-3 animate-[fade_0.4s_ease]">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-white">Sneakers</span>
                <span className="rounded-full bg-[#B8F56A]/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-[#B8F56A]">3 items</span>
              </div>
              {SHOES.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3 rounded-2xl bg-white/5 p-2.5">
                  <div className="w-16 shrink-0 overflow-hidden rounded-xl bg-white/5 p-1.5">
                    {sneakerShape(s.hue)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-white">{s.name}</span>
                      {s.tag && (
                        <span className="rounded bg-[#7DE2D1]/20 px-1 text-[8px] font-bold uppercase text-[#7DE2D1]">
                          {s.tag}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-white/45">{s.sub}</div>
                  </div>
                  <span className="font-mono text-[12px] text-[#B8F56A]">{s.price}</span>
                </div>
              ))}
            </div>
          )}

          {/* DETAIL */}
          {step === 3 && (
            <div className="flex flex-1 flex-col animate-[fade_0.4s_ease]">
              <div className="flex items-center justify-center bg-gradient-to-b from-white/10 to-transparent py-6">
                <div className="w-28">{sneakerShape(SHOES[0].hue)}</div>
              </div>
              <div className="flex flex-1 flex-col gap-2 px-5 pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold text-white">{SHOES[0].name}</span>
                  <span className="font-mono text-lg text-[#B8F56A]">{SHOES[0].price}</span>
                </div>
                <span className="text-[10px] leading-relaxed text-white/50">
                  Fictional demo product · sizes 6–12 · Material Design UI
                </span>
                <div className="mt-auto rounded-xl bg-[#B8F56A] py-2.5 text-center text-[12px] font-semibold text-[#0e1320]">
                  Add to cart
                </div>
              </div>
            </div>
          )}

          {/* CART */}
          {step === 4 && (
            <div className="flex flex-1 flex-col gap-3 px-4 py-3 animate-[fade_0.4s_ease]">
              <span className="font-display text-lg font-semibold text-white">Cart</span>
              {cart.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/5 p-2.5">
                  <div className="w-12 overflow-hidden rounded-lg bg-white/5 p-1">{sneakerShape(SHOES[item].hue)}</div>
                  <div className="flex-1">
                    <div className="text-[12px] font-semibold text-white">{SHOES[item].name}</div>
                    <div className="text-[10px] text-white/45">Size 9 · Qty 1</div>
                  </div>
                  <span className="font-mono text-[12px] text-[#B8F56A]">{SHOES[item].price}</span>
                </div>
              ))}
              <div className="mt-auto rounded-xl bg-[#7DE2D1] py-2.5 text-center text-[12px] font-semibold text-[#0e1320]">
                Checkout
              </div>
            </div>
          )}

          {/* ADDRESS */}
          {step === 5 && (
            <div className="flex flex-1 flex-col gap-3 px-4 py-3 animate-[fade_0.4s_ease]">
              <span className="font-display text-lg font-semibold text-white">Delivery address</span>
              {[
                ["Home", "Sample Street 12, Lahore"],
                ["Office", "Sample Plaza, Floor 4"],
              ].map(([label, addr]) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                  <span className={`h-3.5 w-3.5 rounded-full border-2 ${label === "Home" ? "border-[#B8F56A] bg-[#B8F56A]/40" : "border-white/30"}`} />
                  <div>
                    <div className="text-[12px] font-semibold text-white">{label}</div>
                    <div className="text-[10px] text-white/45">{addr}</div>
                  </div>
                </div>
              ))}
              <div className="mt-auto rounded-xl border border-white/20 py-2.5 text-center text-[12px] font-semibold text-white/80">
                + Add new address
              </div>
            </div>
          )}

          {/* CHECKOUT */}
          {step === 6 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center animate-[fade_0.4s_ease]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B8F56A]/15 text-2xl">✓</div>
              <span className="font-display text-lg font-semibold text-white">Order placed</span>
              <span className="text-[10px] leading-relaxed text-white/50">
                Purchase-flow concept · no real payment, no real orders
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                demo complete
              </span>
            </div>
          )}
        </div>
      </div>

      {/* step indicator */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {STEPS.map((s, i) => (
          <span
            key={s.id}
            className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors ${
              i === step ? "bg-[#B8F56A] text-[#0e1320]" : "text-white/40"
            }`}
          >
            {s.label}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
