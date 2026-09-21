/**
 * Central site configuration — single source of truth for the personal brand.
 * Every value here is replaceable (profile image, signature, GitHub, email,
 * LinkedIn, analytics IDs) without touching component code.
 */

export const SITE = {
  name: "Abdul Haseeb",
  initials: "AH",
  mark: "AH",
  role: "BSCS Student · Python Developer · AI/ML Enthusiast",
  tagline: "BSCS Student. Python Developer. AI/ML Enthusiast.",
  statement:
    "I build things to understand how they work — and keep learning until ideas become something real.",
  university: "Superior University",
  degree: "BS Computer Science",

  // ------------------------------------------------------------------
  // PLACEHOLDERS — swap these when real assets/links exist.
  // ------------------------------------------------------------------
  profileImage: "/images/abdul-haseeb-portrait.jpg", // YOUR_PROFILE_IMAGE
  signature: "/images/abdul-haseeb-signature.svg", // YOUR_SIGNATURE_SVG_OR_PNG
  personalImage01: "/images/abdul-haseeb-personal-01.jpg", // YOUR_PERSONAL_IMAGE_01
  personalImage02: "/images/abdul-haseeb-personal-02.jpg", // YOUR_PERSONAL_IMAGE_02
  githubUrl: "YOUR_GITHUB_URL", // e.g. https://github.com/your-username
  email: "YOUR_EMAIL", // e.g. you@example.com
  linkedinUrl: "YOUR_LINKEDIN_URL",
  baseUrl: "https://abdulhaseeb.dev", // canonical URL placeholder

  // Analytics / Search Console placeholders — do NOT commit fake IDs.
  googleSiteVerification: "GOOGLE_SEARCH_CONSOLE_VERIFICATION",
  googleAnalyticsId: "GOOGLE_ANALYTICS_ID",
  googleTagManagerId: "GOOGLE_TAG_MANAGER_ID",
} as const;

export const SEO = {
  title:
    "Abdul Haseeb | BSCS Student | Python Developer | AI/ML Enthusiast",
  description:
    "Portfolio of Abdul Haseeb, a BSCS student and Python developer focused on problem solving, real-world software projects, and building toward Artificial Intelligence and Machine Learning.",
  keywords: [
    "Abdul Haseeb",
    "BSCS student",
    "Python developer",
    "AI/ML enthusiast",
    "problem solving",
    "software development",
  ] as string[],
  twitterHandle: "@YOU", // placeholder — YOUR_TWITTER_HANDLE
} as const;

export type { } 
