import type { Metadata } from "next";
import Link from "next/link";
import { hubs } from "@/content/articles";
import { projectCaseStudies } from "@/content/projects";
import { paths } from "@/lib/urls";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404 — served with an HTTP 404 and `noindex`, but still useful: it links to
 * every top-level destination so a visitor (or crawler) that lands here can
 * reach real content in one click.
 */
export default function NotFound() {
  const links = [
    { name: "Home", href: paths.home, note: "Who I am and what I'm building" },
    { name: "Projects", href: paths.projects, note: "Case studies of everything I've built" },
    { name: "Notebook", href: paths.notebook, note: "Articles on Python, AI/ML and software" },
  ];

  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main" className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="container-x relative py-32 sm:py-40">
          <p className="meta-label flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            ERROR / 404
          </p>

          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tightest text-ink sm:text-6xl">
            This page doesn&apos;t exist
            <span className="text-accent">.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-soft">
            The link may be old or mistyped. Everything on this site is reachable
            from the three pages below — or use the notebook to find a specific
            article.
          </p>

          <ul className="mt-12 grid gap-4 sm:grid-cols-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring group block h-full rounded-xl border border-line bg-raised p-6 transition-colors hover:border-accent/60"
                >
                  <span className="font-display text-xl font-semibold text-ink">
                    {link.name}
                  </span>
                  <span aria-hidden className="ml-2 text-accent transition-transform group-hover:translate-x-1">
                    →
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-soft">
                    {link.note}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14 border-t border-line pt-10">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
              Notebook topics
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {hubs.map((hub) => (
                <li key={hub.slug}>
                  <Link
                    href={paths.hub(hub.slug)}
                    className="focus-ring inline-block rounded-full border border-line bg-raised px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-soft transition-colors hover:border-accent hover:text-ink"
                  >
                    {hub.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.22em] text-soft">
              Projects
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {projectCaseStudies.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={paths.project(project.slug)}
                    className="focus-ring inline-block rounded-full border border-line bg-raised px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-soft transition-colors hover:border-accent hover:text-ink"
                  >
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
