"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SITE, HAS_GITHUB } from "@/lib/site";
import { paths } from "@/lib/urls";
import { projects } from "@/lib/content";
import { hubs } from "@/content/articles";
import { SignatureMark } from "@/components/ui/placeholder";
import { EASE } from "@/components/ui/primitives";

const META = ["BSCS", "PYTHON", "AI/ML", "OPEN TO OPPORTUNITIES"];

const PORTFOLIO_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Journey", href: "/#journey" },
  { label: "Thinking", href: "/#thinking" },
  { label: "Building in the open", href: "/#github" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  const reduce = useReducedMotion();

  return (
    <footer className="relative overflow-hidden border-t border-line">
      {/* signature ground */}
      <div className="absolute inset-x-0 top-0 flex justify-center opacity-[0.05]" aria-hidden>
        <SignatureMark className="w-full max-w-5xl text-ink" label="Abdul Haseeb" />
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
      </div>

      {/* Site index — every important page is one click from every other page */}
      <div className="container-x relative border-t border-line py-14 text-left">
        <div className="grid gap-10 sm:grid-cols-3">
          <nav aria-labelledby="footer-portfolio">
            <h2 id="footer-portfolio" className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
              Portfolio
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href={paths.home} className="focus-ring link-underline text-sm text-soft transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              {PORTFOLIO_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <a href={link.href} className="focus-ring link-underline text-sm text-soft transition-colors hover:text-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-projects">
            <h2 id="footer-projects" className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
              Projects
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href={paths.projects} className="focus-ring link-underline text-sm text-ink transition-colors hover:text-accent">
                  All case studies →
                </Link>
              </li>
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={paths.project(project.slug)}
                    className="focus-ring link-underline text-sm text-soft transition-colors hover:text-ink"
                  >
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-notebook">
            <h2 id="footer-notebook" className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
              Notebook
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href={paths.notebook} className="focus-ring link-underline text-sm text-ink transition-colors hover:text-accent">
                  All articles →
                </Link>
              </li>
              {hubs.map((hub) => (
                <li key={hub.slug}>
                  <Link
                    href={paths.hub(hub.slug)}
                    className="focus-ring link-underline text-sm text-soft transition-colors hover:text-ink"
                  >
                    {hub.name}
                  </Link>
                </li>
              ))}
              {HAS_GITHUB && SITE.social.github ? (
                <li>
                  <a
                    href={SITE.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring link-underline text-sm text-soft transition-colors hover:text-ink"
                  >
                    GitHub
                  </a>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>

        <p className="mt-12 text-center font-mono text-[11px] text-soft/60">
          © {new Date().getFullYear()} {SITE.name} · Designed &amp; built by hand.
        </p>
      </div>
    </footer>
  );
}
