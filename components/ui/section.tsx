import { Reveal } from "./primitives";

export function SectionHead({
  index,
  label,
  title,
  serif,
  aside,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  serif?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-10 md:mb-16">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tabular-nums tracking-[0.25em] text-accent">
            {index}
          </span>
          <span className="h-px w-10 bg-line" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-soft">
            {label}
          </span>
        </div>
      </Reveal>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <Reveal delay={0.08}>
          <h2 className="font-display text-4xl font-semibold tracking-tightest text-ink sm:text-5xl lg:text-6xl">
            {title}
            {serif ? (
              <>
                {" "}
                <em className="font-serif font-normal italic text-soft">{serif}</em>
              </>
            ) : null}
          </h2>
        </Reveal>
        {aside ? <Reveal delay={0.16}>{aside}</Reveal> : null}
      </div>
    </div>
  );
}
