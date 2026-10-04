/**
 * Central site configuration — single source of truth for the personal brand
 * and for every canonical URL the site emits.
 *
 * Canonical host resolution (first match wins):
 *   1. NEXT_PUBLIC_SITE_URL         — set in Vercel when a custom domain is live
 *   2. SITE_URL                     — build-time / server override
 *   3. VERCEL_PROJECT_PRODUCTION_URL — the project's stable production domain
 *   4. FALLBACK_BASE_URL            — the current production deployment
 *
 * Every canonical tag, sitemap entry, Open Graph URL, RSS-less feed link and
 * JSON-LD `@id` derives from `baseUrl`. Connecting a custom domain therefore
 * means setting NEXT_PUBLIC_SITE_URL (see README) — nothing is hardcoded, so
 * Vercel URL, www, non-www, http and https can never compete as duplicates.
 *
 * Nothing here invents an identity fact. Values that are not configured are
 * simply not rendered anywhere: no `YOUR_...` placeholder text ships.
 */

const FALLBACK_BASE_URL = "https://seeba-portfolio.vercel.app";

function toOrigin(value: string): string {
  return (/^https?:\/\//i.test(value) ? value : `https://${value}`).replace(/\/+$/, "");
}

function resolveBaseUrl(): string {
  for (const candidate of [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    const value = candidate?.trim();
    if (value) return toOrigin(value);
  }
  return FALLBACK_BASE_URL;
}

function optional(value: string | undefined | null): string | null {
  const v = value?.trim();
  return v ? v : null;
}

const baseUrl = resolveBaseUrl();

export const SITE = {
  name: "Abdul Haseeb",
  initials: "AH",
  mark: "AH",
  /** Used in metadata, hero and article bylines. */
  role: "BSCS Student · Python Developer · AI/ML Enthusiast",
  tagline: "BSCS Student. Python Developer. AI/ML Enthusiast.",
  statement:
    "I build things to understand how they work — and keep learning until ideas become something real.",
  university: "Superior University",
  degree: "BS Computer Science",
  /** Optional — set NEXT_PUBLIC_LOCATION (e.g. "Lahore, Pakistan") to claim a city. */
  city: optional(process.env.NEXT_PUBLIC_LOCATION),

  /** Canonical origin. Never append a trailing slash; `absoluteUrl()` handles it. */
  baseUrl,
  canonicalHost: baseUrl.replace(/^https?:\/\//, ""),
  /** Bump when homepage / hub / project copy changes; drives <lastmod> for those pages. */
  contentUpdated: "2026-10-05",

  /** Only real, verified profiles — these feed `sameAs` and nothing is faked. */
  social: {
    github: optional(process.env.NEXT_PUBLIC_GITHUB_URL),
    linkedin: optional(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    twitter: optional(process.env.NEXT_PUBLIC_TWITTER_URL),
  },

  email: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),

  /**
   * Optional real portrait. Until one is supplied the hero renders a designed
   * monogram panel — never a "YOUR_PROFILE_IMAGE" placeholder.
   */
  portrait: {
    src: optional(process.env.NEXT_PUBLIC_PORTRAIT_IMAGE),
    alt: "Abdul Haseeb, BSCS student and Python developer",
    width: 800,
    height: 1000,
  },
} as const;

/** Real public profiles only — empty when none are configured. */
export const SAME_AS: string[] = [
  SITE.social.github,
  SITE.social.linkedin,
  SITE.social.twitter,
].filter((value): value is string => Boolean(value));

export const HAS_GITHUB = Boolean(SITE.social.github);
export const HAS_EMAIL = Boolean(SITE.email);

export const SEO = {
  title: "Abdul Haseeb — BSCS Student, Python Developer & AI/ML Learner",
  description:
    "Portfolio of Abdul Haseeb — BSCS student, Python developer and Android builder working toward AI/ML, with real projects and a developer notebook.",
  ogImage: "/images/og-image.jpg",
  ogImageAlt: "Abdul Haseeb — BSCS student, Python developer and AI/ML learner",
} as const;
