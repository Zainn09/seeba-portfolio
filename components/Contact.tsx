"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/site";
import { SectionHead } from "@/components/ui/section";
import { Reveal, EASE } from "@/components/ui/primitives";

type Errors = { name?: string; email?: string; message?: string };

export default function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const reduce = useReducedMotion();

  function validate(): Errors {
    const e: Errors = {};
    if (!values.name.trim()) e.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "That email doesn't look right.";
    if (values.message.trim().length < 10) e.message = "A sentence or two helps me reply properly.";
    return e;
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setAttempted(true);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (SITE.email.startsWith("YOUR_")) {
      // No backend, no fake success — hand the draft to the mailbox app.
      const body = encodeURIComponent(`Hi Abdul,\n\n${values.message}\n\n— ${values.name} (${values.email})`);
      window.location.href = `mailto:${SITE.email}?subject=Portfolio message from ${encodeURIComponent(values.name)}&body=${body}`;
    }

    // If a real email + backend existed, the fetch would go here.
    // Never showing a "sent!" state that the server hasn't confirmed.
  }

  const field = (key: keyof Errors) =>
    attempted && errors[key]
      ? "border-red-400 ring-1 ring-red-400/60"
      : "border-line focus-within:border-accent";

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-[800px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(ellipse, rgb(var(--halo) / .5), transparent 60%)" }}
        aria-hidden
      />
      <div className="container-x relative">
        <SectionHead
          index="10"
          label="What's next"
          title={<>Let&apos;s build something</>}
          serif="worth learning from"
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <p className="max-w-md text-lg leading-relaxed text-ink">
              I&apos;m a BSCS student who learns by building. If you have a Python
              project, an AI/ML direction to explore, or an opportunity that helps
              me keep growing — I&apos;m listening.
            </p>
            <ul className="mt-8 space-y-2.5">
              {[
                "Python opportunities",
                "AI / ML opportunities",
                "Software-development opportunities",
                "Internships",
                "Learning-focused collaborations",
              ].map((o) => (
                <li key={o} className="flex items-center gap-3 text-soft">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  {o}
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-3 border-t border-line pt-8">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em]">
                <span className="text-soft">Email</span>
                <span className="text-ink">{SITE.email.startsWith("YOUR_") ? "add via /lib/site.ts" : SITE.email}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em]">
                <span className="text-soft">GitHub</span>
                <span className="text-ink">{SITE.githubUrl.startsWith("YOUR_") ? "add your handle" : "linked"}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em]">
                <span className="text-soft">LinkedIn</span>
                <span className="text-ink">{SITE.linkedinUrl.startsWith("YOUR_") ? "add your profile" : "linked"}</span>
              </div>
            </div>
          </div>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-line bg-raised p-6 sm:p-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-soft">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={values.name}
                    onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                    aria-invalid={!!(attempted && errors.name)}
                    aria-describedby={errors.name ? "name-err" : undefined}
                    className={`focus-ring w-full rounded-lg border bg-surface px-4 py-3 text-ink transition-colors ${field("name")}`}
                    placeholder="How should I address you?"
                  />
                  {attempted && errors.name && (
                    <p id="name-err" className="mt-1.5 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-soft">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                    aria-invalid={!!(attempted && errors.email)}
                    aria-describedby={errors.email ? "email-err" : undefined}
                    className={`focus-ring w-full rounded-lg border bg-surface px-4 py-3 text-ink transition-colors ${field("email")}`}
                    placeholder="you@example.com"
                  />
                  {attempted && errors.email && (
                    <p id="email-err" className="mt-1.5 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-soft">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={values.message}
                    onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                    aria-invalid={!!(attempted && errors.message)}
                    aria-describedby={errors.message ? "message-err" : undefined}
                    className={`focus-ring w-full resize-none rounded-lg border bg-surface px-4 py-3 text-ink transition-colors ${field("message")}`}
                    placeholder="What are you building, or what should we build?"
                  />
                  {attempted && errors.message && (
                    <p id="message-err" className="mt-1.5 text-sm text-red-400">{errors.message}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  data-cursor="SEND"
                  whileHover={reduce ? undefined : { y: -2 }}
                  className="focus-ring group inline-flex w-full items-center justify-center gap-3 rounded-full bg-accent px-6 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-on-accent"
                >
                  Start a Conversation
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </motion.button>

                <AnimatePresence>
                  {attempted && Object.keys(errors).length === 0 && SITE.email.startsWith("YOUR_") && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-xs leading-relaxed text-soft"
                    >
                      Sending opens your email app — no fake &ldquo;sent!&rdquo; state here
                      until a backend is wired in.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
