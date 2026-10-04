import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT = join(process.cwd(), "public/videos");
mkdirSync(OUT, { recursive: true });

type Poster = {
  slug: string;
  title: string;
  subtitle: string;
  accent: string;
  bg: string;
};

const POSTERS: Poster[] = [
  {
    slug: "chai-dosti-cafe",
    title: "Chai Dosti Café",
    subtitle: "WEB FOUNDATIONS · HTML + CSS",
    accent: "#B8F56A",
    bg: "#080B12",
  },
  {
    slug: "responsive-calculator",
    title: "Responsive Calculator",
    subtitle: "WEB FOUNDATIONS · Grid + Responsive",
    accent: "#7DE2D1",
    bg: "#081013",
  },
  {
    slug: "library-management-system",
    title: "Library Management System",
    subtitle: "PYTHON · File Handling + OOP",
    accent: "#A7B5FF",
    bg: "#0A0C18",
  },
  {
    slug: "student-management-system",
    title: "Student Management System",
    subtitle: "PYTHON · Data Structures",
    accent: "#B8F56A",
    bg: "#0B0D0F",
  },
  {
    slug: "bank-management-system",
    title: "Bank Management System",
    subtitle: "PYTHON · OOP + State",
    accent: "#F59E0B",
    bg: "#100C08",
  },
  {
    slug: "sneakerstore",
    title: "SneakerStore",
    subtitle: "ANDROID · Java + Firebase · HERO",
    accent: "#B8F56A",
    bg: "#080B12",
  },
];

async function generatePoster(p: Poster) {
  const W = 1280;
  const H = 720;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="g" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#9BA6A5" stroke-opacity="0.12"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${p.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <!-- accent glow -->
  <circle cx="${W * 0.8}" cy="${H * 0.2}" r="300" fill="${p.accent}" opacity="0.12"/>
  <circle cx="${W * 0.2}" cy="${H * 0.8}" r="250" fill="${p.accent}" opacity="0.08"/>
  
  <!-- brand mark -->
  <rect x="60" y="50" width="48" height="48" rx="12" fill="${p.accent}"/>
  <text x="84" y="82" text-anchor="middle" font-family="sans-serif" font-size="26" font-weight="700" fill="${p.bg}">AH</text>
  
  <!-- meta -->
  <text x="130" y="78" font-family="monospace" font-size="18" letter-spacing="4" fill="#9BA6A5">DEMO VIDEO · ${p.slug.toUpperCase()}</text>
  
  <!-- title -->
  <text x="60" y="${H/2 - 20}" font-family="sans-serif" font-size="64" font-weight="700" fill="#F3F6F4" letter-spacing="-2">${p.title}</text>
  <text x="60" y="${H/2 + 30}" font-family="monospace" font-size="20" letter-spacing="3" fill="${p.accent}">${p.subtitle}</text>
  
  <!-- play indicator -->
  <g transform="translate(${W/2 - 40}, ${H/2 + 80})">
    <circle cx="40" cy="40" r="40" fill="${p.accent}" opacity="0.9"/>
    <polygon points="28,20 28,60 62,40" fill="${p.bg}"/>
  </g>
  
  <!-- footer -->
  <line x1="60" y1="${H - 80}" x2="${W - 60}" y2="${H - 80}" stroke="#9BA6A5" stroke-opacity="0.2" stroke-width="1"/>
  <text x="60" y="${H - 45}" font-family="monospace" font-size="16" letter-spacing="4" fill="#9BA6A5">ABDUL HASEEB · ${p.title.toUpperCase()} · RECORDED DEMO</text>
  <text x="${W - 60}" y="${H - 45}" text-anchor="end" font-family="monospace" font-size="14" fill="${p.accent}">● REC · SILENT · LOOP</text>
</svg>
  `;
  const outPath = join(OUT, `poster-${p.slug}.jpg`);
  await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(outPath);
  console.log(`Poster: ${outPath}`);
}

async function main() {
  for (const p of POSTERS) {
    await generatePoster(p);
  }
  console.log("All posters generated");
}

main().catch(console.error);
