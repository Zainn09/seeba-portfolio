"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SignatureMark, PortraitPlaceholder } from "@/components/ui/placeholder";
import { EASE } from "@/components/ui/primitives";
import { SITE } from "@/lib/site";

const AHScene = dynamic(() => import("@/components/signature/AHScene"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-full w-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.25em] text-soft"
      aria-hidden
    >
      AH / loading scene
    </div>
  ),
});

const METADATA = [
  "BSCS / SUPERIOR UNIVERSITY",
  "PYTHON / CURRENT FOCUS",
  "AI/ML / NEXT DIRECTION",
];

export default function Signature3D() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-25%" });
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  return (
    <section
      id="signature"
      ref={sectionRef}
      className="relative overflow-hidden border-y border-line"
    >
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="container-x relative grid min-h-[92vh] items-center gap-12 py-24 lg:grid-cols-2 lg:gap-20">
        {/* 3D monogram + orbiting technical fragments */}
        <div className="relative order-2 h-[340px] w-full sm:h-[440px] lg:order-1 lg:h-[560px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={started ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
            className="absolute inset-0"
          >
            <AHScene />
          </motion.div>
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.28em] text-soft/60" aria-hidden>
            3D / BRAND MARK
          </div>
        </div>

        {/* Portrait + signature + statement */}
        <div className="order-1 lg:order-2">
          <p className="meta-label flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            02 / PERSONAL BRAND
          </p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            className="mt-5 font-display text-4xl font-semibold tracking-tightest text-ink sm:text-5xl lg:text-6xl"
          >
            Built under{" "}
            <em className="font-serif font-normal italic text-accent">my name</em>
          </motion.h2>

          <div className="relative mt-10">
            {/* Portrait overlapping the signature */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={started ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: EASE, delay: 0.15 }}
              className="relative z-10 -mb-10 w-44 rotate-[-3deg] overflow-hidden rounded-xl border border-line bg-raised shadow-xl sm:w-52"
              data-cursor="THIS IS MINE"
            >
              <PortraitPlaceholder className="aspect-[4/5] w-full" note="YOUR_PROFILE_IMAGE" />
            </motion.div>

            {/* Signature draws onto the screen */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={started ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="relative -ml-2 w-[min(90vw,440px)] text-ink"
                data-cursor="THIS IS MINE"
              >
                <SignatureMark animated={started && !reduce} className="w-full" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={started ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="mt-1 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-soft/70"
              >
                YOUR_SIGNATURE_HERE — replace in /images
              </motion.span>
            </div>

            {/* Personal statement */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={started ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
              className="mt-6 max-w-md font-serif text-2xl italic leading-snug text-ink sm:text-3xl"
            >
              “I build what I learn, and I learn from everything I build.”
            </motion.p>

            {/* Technical metadata fades in afterward */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={started ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-7 flex flex-wrap gap-2"
            >
              {METADATA.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-line bg-raised px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-soft"
                >
                  {m}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* marquee of the same fragments — subtle ground line */}
      <div
        className="relative overflow-hidden border-t border-line py-3"
        aria-hidden
      >
        <div className="marquee-track flex w-max gap-8">
          {Array.from({ length: 2 }).map((_, rep) => (
            <div key={rep} className="flex gap-8">
              {["ABDUL HASEEB", "PYTHON", "BUILD", "LEARN", "SOLVE", "AI/ML", "BSCS"].map(
                (t) => (
                  <span
                    key={t + rep}
                    className="font-mono text-[11px] uppercase tracking-[0.3em] text-soft/60"
                  >
                    {t} <span className="text-accent">/</span>
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
