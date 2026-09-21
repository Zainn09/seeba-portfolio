/**
 * Generates an original, branded SVG featured image for every article.
 * Each composition derives from the article's category/keyword so no two are
 * the same, while a shared layout — AH mark, mono metadata, accent system —
 * keeps the set recognizably "Abdul's".
 *
 * Run: npx tsx scripts/generate-article-images.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { allArticles } from "../lib/articles";
import type { VisualKind, VisualTheme } from "../content/types";

const OUT = join(process.cwd(), "public/images/blog");
mkdirSync(OUT, { recursive: true });

const THEME: Record<VisualTheme, { bg: string; accent: string; accent2: string; ink: string; dim: string }> = {
  lime:    { bg: "#080B12", accent: "#B8F56A", accent2: "#7DE2D1", ink: "#F3F6F4", dim: "#9BA6A5" },
  teal:    { bg: "#081013", accent: "#7DE2D1", accent2: "#B8F56A", ink: "#F3F6F4", dim: "#9BA6A5" },
  indigo:  { bg: "#0A0C18", accent: "#A7B5FF", accent2: "#7DE2D1", ink: "#F3F6F4", dim: "#9BA6A5" },
  graphite:{ bg: "#0B0D0F", accent: "#B8F56A", accent2: "#9BA6A5", ink: "#F3F6F4", dim: "#9BA6A5" },
  amber:   { bg: "#100C08", accent: "#F59E0B", accent2: "#7DE2D1", ink: "#F3F6F4", dim: "#9BA6A5" },
};

const W = 1600;
const H = 900;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Deterministic pseudo-random from a string seed. */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += h << 13; h ^= h >>> 7;
    h += h << 3; h ^= h >>> 17;
    h += h << 5;
    return (h >>> 0) / 4294967296;
  };
}

function motif(kind: VisualKind, rng: () => number, t: { accent: string; accent2: string; dim: string; bg: string }): string {
  const a = t.accent;
  const b = t.accent2;
  const d = t.dim;
  switch (kind) {
    case "flow": {
      // python — a winding line of braces/underscores/dots
      let pts = "";
      let x = 180, y = 640;
      const steps = 10;
      const pts2: string[] = [];
      for (let i = 0; i <= steps; i++) {
        x = 180 + (i / steps) * 1240;
        y = 640 + Math.sin(i * 1.7 + rng() * 1) * 220;
        pts2.push(`${x.toFixed(0)},${y.toFixed(0)}`);
      }
      pts = `<polyline points="${pts2.join(" ")}" fill="none" stroke="${a}" stroke-width="3" stroke-opacity="0.9"/>`;
      const dots = Array.from({ length: 26 }, (_, i) => {
        const dx = 180 + rng() * 1240;
        const dy = 120 + rng() * 560;
        const r = 2 + rng() * 4;
        return `<circle cx="${dx.toFixed(0)}" cy="${dy.toFixed(0)}" r="${r}" fill="${i % 3 === 0 ? b : a}" opacity="${0.3 + rng() * 0.5}"/>`;
      }).join("");
      const syms = ["def ", "()", ":", "_", "__", "->", ".py"]
        .map((s, i) => `<text x="${(300 + i * 190).toFixed(0)}" y="${(140 + rng() * 120).toFixed(0)}" fill="${d}" font-size="44" font-family="DM Mono, monospace" opacity="0.5">${esc(s)}</text>`)
        .join("");
      return pts + dots + syms;
    }
    case "nodes": {
      // ai/ml — connected constellation
      const pts = Array.from({ length: 14 }, () => ({ x: 220 + rng() * 1160, y: 160 + rng() * 540 }));
      const lines = pts.map((p, i) => {
        const q = pts[(i + 3) % pts.length];
        return `<line x1="${p.x.toFixed(0)}" y1="${p.y.toFixed(0)}" x2="${q.x.toFixed(0)}" y2="${q.y.toFixed(0)}" stroke="${d}" stroke-opacity="0.35" stroke-width="1.5"/>`;
      }).join("");
      const nodes = pts.map((p, i) =>
        `<circle cx="${p.x.toFixed(0)}" cy="${p.y.toFixed(0)}" r="${4 + rng() * 9}" fill="none" stroke="${i % 2 ? a : b}" stroke-width="2" opacity="0.9"/>`
      ).join("");
      return lines + nodes;
    }
    case "tree": {
      // problem solving — a split tree of decisions
      let out = "";
      const branch = (x1: number, y1: number, x2: number, y2: number, depth: number) => {
        out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${depth === 0 ? a : d}" stroke-width="${depth === 0 ? 4 : 2}" stroke-opacity="0.8"/>`;
        if (depth < 3) {
          const spread = 220 / (depth + 1);
          branch(x2, y2, x2 - spread, y2 + 140, depth + 1);
          branch(x2, y2, x2 + spread, y2 + 140, depth + 1);
        } else {
          out += `<circle cx="${x2}" cy="${y2}" r="7" fill="${b}" opacity="0.9"/>`;
        }
      };
      branch(W / 2, 150, W / 2, 300, 0);
      return out;
    }
    case "console": {
      // software dev — a code terminal
      const lines = ["def build():", "  plan()", "  code()", "  test()", "  improve()", "  return done", "", "> building..."]
        .map((l, i) => `<text x="320" y="${340 + i * 58}" fill="${i === 0 ? a : d}" font-size="42" font-family="DM Mono, monospace" font-weight="300">${esc(l)}</text>`)
        .join("");
      const prompt = `<rect x="270" y="220" width="1060" height="460" rx="18" fill="none" stroke="${d}" stroke-opacity="0.4" stroke-width="2"/>`;
      const dots = `<circle cx="330" cy="268" r="8" fill="${a}"/><circle cx="360" cy="268" r="8" fill="${b}"/><circle cx="390" cy="268" r="8" fill="${d}"/>`;
      return prompt + dots + lines;
    }
    case "phone": {
      // android — device frames
      const frame = (cx: number, w: number) => {
        const h = w * 2;
        return `<rect x="${cx - w / 2}" y="${(H - h) / 2 - 30}" width="${w}" height="${h}" rx="${w / 5}" fill="none" stroke="${a}" stroke-width="3" opacity="0.9"/>
        <rect x="${cx - w / 2 + 12}" y="${(H - h) / 2 - 6}" width="${w - 24}" height="${h - 40}" rx="12" fill="${a}" opacity="0.08"/>`;
      };
      const phone1 = frame(560, 220);
      const phone2 = frame(1040, 260);
      const connector = `<line x1="680" y1="440" x2="900" y2="430" stroke="${b}" stroke-width="2" stroke-dasharray="6 8" opacity="0.7"/>`;
      return phone1 + phone2 + connector;
    }
    case "blocks": {
      // projects — stacked blocks
      const cols = Array.from({ length: 6 }, (_, i) => i);
      const rects = cols.map((i) => {
        const seq = Math.floor(rng() * 5);
        const wdt = 180 + rng() * 120;
        const x = 220 + i * 200;
        const y = 260 + seq * 110;
        return `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${wdt.toFixed(0)}" height="72" rx="14" fill="none" stroke="${i % 2 ? b : a}" stroke-width="2" opacity="0.85"/>`;
      }).join("");
      return rects;
    }
    case "map": {
      // student journey — dotted path up and right
      const pts = Array.from({ length: 18 }, (_, i) => ({ x: 180 + i * 72, y: 640 - Math.sin(i * 0.45) * 380 }));
      const path = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
      const dpath = `<path d="${path}" fill="none" stroke="${a}" stroke-width="3" stroke-opacity="0.9"/>`;
      const dots = pts.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="${i % 4 === 0 ? 9 : 5}" fill="${i % 4 === 0 ? a : d}" opacity="0.9"/>`).join("");
      return dpath + dots;
    }
    default: {
      return `<circle cx="800" cy="450" r="300" fill="none" stroke="${a}" stroke-width="2" opacity="0.5"/>`;
    }
  }
}

function svgFor(kind: VisualKind, theme: VisualTheme, seed: string): string {
  const t = THEME[theme];
  const rng = seeded(seed);
  const grid = `<defs><pattern id="g" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="${t.dim}" stroke-opacity="0.12"/></pattern></defs>
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#g)"/>`;
  const art = motif(kind, rng, t);
  return grid + art;
}

function titleWords(title: string, max = 5): string[] {
  return title.split(" ").slice(0, max);
}

function render(seed: string, title: string, category: string, keyword: string, kind: VisualKind, theme: VisualTheme): string {
  const t = THEME[theme];
  const words = titleWords(title);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${svgFor(kind, theme, seed)}

<!-- brand mark -->
<g>
  <rect x="86" y="72" width="56" height="56" rx="14" fill="${t.accent}"/>
  <text x="114" y="112" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="30" font-weight="700" fill="${t.bg}">AH</text>
</g>

<!-- category + keyword meta -->
<text x="166" y="100" font-family="DM Mono, monospace" font-size="26" letter-spacing="6" fill="${t.dim}" font-weight="300">${esc(category.toUpperCase())} / ${esc(keyword.toUpperCase())}</text>

<!-- title block -->
${words.map((w, i) => `<text x="86" y="${660 + i * 96}" font-family="Space Grotesk, sans-serif" font-size="${108 - words.length * 6}" font-weight="700" fill="${t.ink}" letter-spacing="-2">${esc(w)}${i === words.length - 1 ? `<tspan fill="${t.accent}">.</tspan>` : ""}</text>`).join("\n")}

<!-- footer rule -->
<line x1="86" y1="826" x2="1514" y2="826" stroke="${t.dim}" stroke-opacity="0.25" stroke-width="1.5"/>
<text x="86" y="862" font-family="DM Mono, monospace" font-size="22" letter-spacing="5" fill="${t.dim}" font-weight="300">ABDUL HASEEB — DEVELOPER NOTEBOOK</text>
</svg>`;
}

let n = 0;
for (const article of allArticles) {
  const kind = article.visual!.kind;
  const theme = article.visual!.theme;
  const svg = render(article.slug, article.title, article.category, article.primaryKeyword, kind, theme);
  const svgFile = join(OUT, `${article.slug}.svg`);
  writeFileSync(svgFile, svg);
  n++;
}

console.log(`Generated ${n} featured SVGs → ${OUT}`);

// PNG + WebP conversion for social/OG and optimized delivery.
import sharp from "sharp";
(async () => {
  for (const article of allArticles) {
    const svg = join(OUT, `${article.slug}.svg`);
    await sharp(svg).resize(1600, 900).webp({ quality: 82 }).toFile(join(OUT, `${article.slug}.webp`));
    await sharp(svg).resize(1600, 900).png({ compressionLevel: 9 }).toFile(join(OUT, `${article.slug}.png`));
  }
  console.log(`Converted ${n} featured images to PNG + WebP.`);
})();

