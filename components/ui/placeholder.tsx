"use client";

import { SITE } from "@/lib/site";

/**
 * Tasteful, obviously-swappable placeholders. Each one renders a branded
 * neutral composition and announces the replacement asset path in the dev
 * markup — so nothing looks like an accidental broken image.
 */

export function PortraitPlaceholder({
  className,
  note = "YOUR_PROFILE_IMAGE",
}: {
  className?: string;
  note?: string;
}) {
  return (
    <div className={`portrait-placeholder relative overflow-hidden ${className ?? ""}`}>
      <div className="bg-grid-fine absolute inset-0 opacity-40" aria-hidden />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <span
          className="font-display text-[18vw] font-bold leading-none tracking-tightest text-ink/10 sm:text-[11vw]"
          aria-hidden
        >
          AH
        </span>
        <div className="mt-2 h-8 w-px bg-ink/20" aria-hidden />
        <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-soft">
          {note}
        </span>
        <span className="mt-1 font-mono text-[10px] tracking-wider text-soft/70">
          {SITE.profileImage}
        </span>
      </div>
      <div
        className="absolute bottom-3 left-3 h-2 w-2 rounded-full bg-accent"
        aria-hidden
      />
    </div>
  );
}

export function MediaPlaceholder({
  className,
  label = "PROJECT_IMAGE_PLACEHOLDER",
  detail,
}: {
  className?: string;
  label?: string;
  detail?: string;
}) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-line bg-raised ${className ?? ""}`}
    >
      <div className="bg-grid-fine absolute inset-0 opacity-50" aria-hidden />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-soft">
        {label}
      </span>
      {detail ? (
        <span className="mt-1 px-4 text-center font-mono text-[10px] text-soft/70">
          {detail}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Inline SVG signature used until Abdul drops in his real signature PNG/SVG.
 * Replacing one asset in /images is all that's required.
 */
export function SignatureMark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Abdul Haseeb signature placeholder"
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
