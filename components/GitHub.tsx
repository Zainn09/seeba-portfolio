"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import { SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/primitives";

export default function GitHub() {
  const connected = !SITE.githubUrl.startsWith("YOUR_");

  return (
    <section id="github" className="relative overflow-hidden py-24 sm:py-32">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="container-x relative">
        <SectionHead
          index="08"
          label="Where the work actually lives"
          title={<>Where the work</>}
          serif="actually lives"
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Case Study Card */}
          <Reveal className="group relative overflow-hidden rounded-2xl border border-line bg-raised p-7 sm:p-8">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl transition-colors group-hover:bg-accent/15" aria-hidden />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 items-center rounded-full border border-accent/30 bg-accent/10 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                  Case Study
                </span>
                <span className="h-px flex-1 bg-line" aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft">Android · Java · Firebase</span>
              </div>

              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tightest text-ink sm:text-3xl">
                SneakerStore — from auth to checkout, built end-to-end.
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-soft">
                The hero project so far. A modern e-commerce shoe app with Firebase Authentication,
                Cloud Firestore product catalog, SQLite cart persistence, and Material Design. No
                template — every screen wired by hand to understand how a real app holds together.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-line bg-surface/60 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">What I shipped</p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/80">
                    <li className="flex gap-2"><span className="text-accent">·</span> Email/password auth + session handling</li>
                    <li className="flex gap-2"><span className="text-accent">·</span> Product browsing with filters</li>
                    <li className="flex gap-2"><span className="text-accent">·</span> Cart + address + checkout flow</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-line bg-surface/60 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">What I learned</p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/80">
                    <li className="flex gap-2"><span className="text-accent">·</span> State lives longer than a screen</li>
                    <li className="flex gap-2"><span className="text-accent">·</span> Offline-first needs local persistence</li>
                    <li className="flex gap-2"><span className="text-accent">·</span> UI is a contract, not decoration</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Java", "XML", "Firebase Auth", "Firestore", "SQLite", "Material Design", "Android Studio"].map((c) => (
                  <span key={c} className="rounded-full border border-line bg-raised px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-soft">
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex items-center gap-4 border-t border-line pt-5">
                <a
                  href="#projects"
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-surface transition-transform hover:-translate-y-0.5"
                >
                  View build details →
                </a>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft/60">Case study · no metrics invented</span>
              </div>
            </div>
          </Reveal>

          {/* Build in Public Card */}
          <div className="flex flex-col gap-6">
            <Reveal className="relative overflow-hidden rounded-2xl border border-line bg-raised/60 p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
                  Build in public — contribution graph
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  {connected ? "LIVE SOON" : "NOT YET LIVE"}
                </span>
              </div>

              <div className="mt-5 grid grid-flow-col grid-rows-7 gap-[4px] overflow-hidden" aria-hidden>
                {Array.from({ length: 52 * 7 }).map((_, i) => {
                  const intensity = Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.13));
                  const level =
                    intensity > 0.82 ? 4 : intensity > 0.6 ? 3 : intensity > 0.4 ? 2 : intensity > 0.2 ? 1 : 0;
                  const colors = [
                    "bg-line/40",
                    "bg-accent/15",
                    "bg-accent/30",
                    "bg-accent/55",
                    "bg-accent",
                  ];
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: (i % 14) * 0.01 }}
                      className={`h-[10px] w-[10px] rounded-[3px] ${colors[level]}`}
                    />
                  );
                })}
              </div>
              <p className="mt-5 font-mono text-[10px] leading-relaxed tracking-wide text-soft/70">
                No commit counts, stars, or streaks invented. This space waits for a real GitHub handle —
                then the actual activity feeds straight in.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="flex flex-1 flex-col justify-between gap-6 rounded-2xl border border-accent/30 bg-raised p-7">
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tightest text-ink sm:text-3xl">
                  {connected ? "See the actual commits." : "The real proof comes later."}
                </h3>
                <p className="mt-3 leading-relaxed text-soft">
                  {connected ? (
                    <>Repositories, commits, and the slow build-up of practice — hosted on GitHub.</>
                  ) : (
                    <>Add a GitHub URL and this section connects automatically — repositories, activity, everything.</>
                  )}
                </p>
              </div>
              <div className="space-y-3">
                <a
                  href={connected ? SITE.githubUrl : "#contact"}
                  target={connected ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  data-cursor="EXPLORE"
                  className="focus-ring group inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-surface transition-transform hover:-translate-y-0.5"
                >
                  {connected ? "Open GitHub profile" : "View my repositories"} →
                </a>
                {!connected && (
                  <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-soft/70">
                    GITHUB_PROFILE_LINK_HERE
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 border-t border-line pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
                <span>BSCS</span>
                <span className="text-accent">·</span>
                <span>BUILD IN PUBLIC</span>
                <span className="text-accent">·</span>
                <span>KEEP EXPLORING</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
