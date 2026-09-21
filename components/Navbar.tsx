"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { navLinks } from "@/lib/content";
import { SITE } from "@/lib/site";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-line/70 bg-surface/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="container-x flex h-16 items-center justify-between md:h-[4.5rem]">
          <a
            href="#about"
            className="focus-ring group flex items-baseline gap-2 rounded-sm"
            aria-label="Back to top"
          >
            <span className="font-display text-lg font-bold tracking-tightest text-ink">
              Abdul<span className="text-accent">.</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
              ABH / 01
            </span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={l.href}
                className="focus-ring group rounded-sm font-mono text-[11px] uppercase tracking-[0.18em] text-soft transition-colors hover:text-ink"
              >
                <span className="mr-1 text-accent/80">{l.id}</span>
                <span className="link-underline">{l.label}</span>
              </a>
            ))}
            <div className="ml-2 flex items-center gap-2 border-l border-line pl-4">
              <a
                href={
                  SITE.githubUrl.startsWith("YOUR_")
                    ? "#github"
                    : SITE.githubUrl
                }
                target={SITE.githubUrl.startsWith("YOUR_") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="focus-ring rounded-sm font-mono text-[11px] uppercase tracking-[0.18em] text-soft transition-colors hover:text-ink"
                data-cursor="EXPLORE"
              >
                GitHub
              </a>
              <button
                type="button"
                onClick={toggle}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-line text-soft transition-all hover:border-accent hover:text-accent"
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={toggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-line text-soft"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="focus-ring flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border border-line"
            >
              <span
                className={`block h-px w-4 bg-ink transition-transform ${open ? "translate-y-1 rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-4 bg-ink transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col bg-surface/95 backdrop-blur-xl md:hidden"
          >
            <div className="container-x flex flex-1 flex-col justify-center gap-2 pt-16">
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  className="flex items-baseline gap-4 border-b border-line py-4"
                >
                  <span className="font-mono text-xs text-accent">{l.id}</span>
                  <span className="font-display text-3xl font-semibold tracking-tightest text-ink">
                    {l.label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
