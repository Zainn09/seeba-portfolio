"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/site";
import { SignatureMark } from "@/components/ui/placeholder";
import { EASE } from "@/components/ui/primitives";

const META = ["BSCS", "PYTHON", "AI/ML", "GITHUB", "OPEN TO OPPORTUNITIES"];

export default function Footer() {
  const reduce = useReducedMotion();

  return (
    <footer className="relative overflow-hidden border-t border-line">
      {/* signature ground */}
      <div className="absolute inset-x-0 top-0 flex justify-center opacity-[0.05]" aria-hidden>
        <SignatureMark className="w-full max-w-5xl text-ink" />
      </div>

      <div className="container-x relative py-24 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-soft">
          The last page of this one
        </p>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-6 font-display text-[17vw] font-bold leading-none tracking-tightest text-ink sm:text-8xl lg:text-[9rem]"
          data-cursor="THIS IS MINE"
        >
          Abdul Haseeb
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 font-serif text-2xl italic text-ink/90 sm:text-4xl"
        >
          Build. Break. Understand. Improve. Repeat.
        </motion.p>

        <div className="mt-8 flex justify-center text-accent" data-cursor="THIS IS MINE">
          <SignatureMark className="w-52 opacity-80 sm:w-64" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {META.map((m, i) => (
            <span key={m} className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">{m}</span>
              {i < META.length - 1 && <span className="text-accent/70" aria-hidden>·</span>}
            </span>
          ))}
        </div>

        <p className="mt-10 font-mono text-[11px] text-soft/60">
          © {new Date().getFullYear()} Abdul Haseeb · Designed &amp; built by hand.
        </p>
      </div>
    </footer>
  );
}
