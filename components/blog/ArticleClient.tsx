"use client";

import { useEffect, useState } from "react";
import type { Faq } from "@/lib/faq";
import type { Heading } from "@/lib/markdown";

function CopyCode() {
  useEffect(() => {
    const pres = document.querySelectorAll<HTMLPreElement>(".prose-article pre");
    pres.forEach((pre) => {
      if (pre.querySelector("[data-copy]")) return;
      const code = pre.querySelector("code");
      if (!code) return;

      const label = code.className.match(/language-([\w-]+)/)?.[1] ?? "";
      const bar = document.createElement("div");
      bar.className = "flex items-center justify-between gap-3 px-4 py-2 border-b border-white/10 bg-white/[0.02]";
      bar.innerHTML = `<span class="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">${label || "code"}</span>`;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.copy = "1";
      btn.className =
        "font-mono text-[10px] uppercase tracking-[0.16em] text-white/60 hover:text-[#B8F56A] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B8F56A] rounded px-1";
      btn.textContent = "Copy code";
      btn.addEventListener("click", () => {
        navigator.clipboard?.writeText(code.innerText).then(() => {
          btn.textContent = "Copied ✓";
          setTimeout(() => (btn.textContent = "Copy code"), 1800);
        });
      });
      bar.appendChild(btn);
      pre.prepend(bar);
    });
  }, []);

  return null;
}

export function ArticleBody({
  html,
  faqsTitle,
}: {
  html: string;
  faqsTitle?: string;
}) {
  return (
    <div className="relative">
      <CopyCode />
      <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />
      {faqsTitle ? (
        <div className="prose-article mt-0" dangerouslySetInnerHTML={{ __html: faqsTitle }} />
      ) : null}
    </div>
  );
}

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section aria-label="Frequently asked questions" className="mt-14">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Frequently asked questions
      </h2>
      <div className="mt-5 divide-y divide-line rounded-xl border border-line bg-raised">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.question}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display text-base font-medium text-ink sm:text-lg">
                  {f.question}
                </span>
                <span
                  className={`shrink-0 font-mono text-lg text-accent transition-transform ${isOpen ? "rotate-45" : ""}`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5">
                  <p className="leading-relaxed text-soft">{f.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Toc({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;
  const visible = headings.filter((h) => h.level <= 3);

  return (
    <nav aria-label="Table of contents" className="rounded-xl border border-line bg-raised p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">On this page</p>
      <ul className="mt-3 space-y-2">
        {visible.map((h) => (
          <li key={h.text + h.id}>
            <a
              href={`#${h.id}`}
              className="focus-ring block border-l-2 border-line pl-3 text-sm text-soft transition-colors hover:border-accent hover:text-ink"
              style={{ marginLeft: (h.level - 2) * 12 }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setPct(total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[60] h-[2px] w-full bg-transparent" aria-hidden>
      <div
        className="h-full bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
