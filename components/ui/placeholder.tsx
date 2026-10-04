"use client";

import Image from "next/image";
import { SITE } from "@/lib/site";

/**
 * The brand portrait. Renders a real configured photograph when one exists;
 * otherwise a designed monogram panel — never "YOUR_PROFILE_IMAGE" text or a
 * broken <img>. To use a real photo, set NEXT_PUBLIC_PORTRAIT_IMAGE to a file
 * in /public/images and it is optimised, sized and alt-texted automatically.
 */
export function BrandPortrait({ className }: { className?: string }) {
  if (SITE.portrait.src) {
    return (
      <div className={`relative overflow-hidden ${className ?? ""}`}>
        <Image
          src={SITE.portrait.src}
          alt={SITE.portrait.alt}
          width={SITE.portrait.width}
          height={SITE.portrait.height}
          sizes="(min-width: 1024px) 400px, 90vw"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`portrait-placeholder relative overflow-hidden ${className ?? ""}`}>
      <div className="bg-grid-fine absolute inset-0 opacity-40" aria-hidden />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <span
          className="font-display text-[18vw] font-bold leading-none tracking-tightest text-ink/10 sm:text-[11vw]"
          aria-hidden
        >
          {SITE.initials}
        </span>
        <span className="mt-2 h-8 w-px bg-ink/20" aria-hidden />
        <span className="mt-3 font-display text-lg font-semibold tracking-tightest text-ink">
          {SITE.name}
        </span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
          BSCS / PYTHON / AI-ML
        </span>
      </div>
      <div className="absolute bottom-3 left-3 h-2 w-2 rounded-full bg-accent" aria-hidden />
    </div>
  );
}

/**
 * The hand-drawn signature mark used as the personal brand device. It is a
 * designed inline SVG (not a missing asset), so it renders instantly with no
 * image request and no layout shift.
 */
export function SignatureMark({
  className,
  animated = false,
  label = "Abdul Haseeb signature mark",
}: {
  className?: string;
  animated?: boolean;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={label}
    >
      <path
        className={animated ? "signature-path" : ""}
        d="M30 78 C 40 44, 52 30, 66 40 S 78 70, 84 84 C 88 94, 94 100, 102 96 C 110 91, 106 74, 98 68 C 90 62, 74 66, 70 76 C 66 86, 78 92, 90 88 C 102 84, 116 72, 124 58 C 134 40, 150 26, 166 30 C 182 34, 186 54, 178 66 C 170 78, 152 80, 144 74 C 136 68, 138 58, 146 54 C 156 49, 172 52, 186 62 C 202 73, 218 86, 240 88 C 262 90, 276 74, 282 60 C 288 46, 280 32, 266 32 C 254 32, 248 42, 252 52 C 256 62, 270 66, 282 60 C 294 54, 306 44, 318 40 C 332 35, 350 36, 362 44"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
    </svg>
  );
}
