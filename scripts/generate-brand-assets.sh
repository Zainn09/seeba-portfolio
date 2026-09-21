#!/usr/bin/env bash
# Generates the site-wide brand images (OG preview + placeholder portrait/signature
# frames) that live outside the blog set.
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p public/images

# ---- og-image.svg (converted to jpg below) ----
node -e '
const fs = require("fs");
const W = 1200, H = 630;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#080B12"/>
<defs><pattern id="g" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="#9BA6A5" stroke-opacity="0.1"/></pattern></defs>
<rect width="${W}" height="${H}" fill="url(#g)"/>
<rect x="80" y="80" width="64" height="64" rx="16" fill="#B8F56A"/>
<text x="112" y="124" text-anchor="middle" font-family="sans-serif" font-size="34" font-weight="700" fill="#080B12">AH</text>
<text x="168" y="114" font-family="monospace" font-size="22" letter-spacing="5" fill="#9BA6A5">BSCS / PYTHON / AI-ML</text>
<text x="80" y="360" font-family="sans-serif" font-size="110" font-weight="700" fill="#F3F6F4" letter-spacing="-3">Abdul Haseeb</text>
<text x="80" y="430" font-family="sans-serif" font-size="40" fill="#B8F56A">BSCS Student. Python Developer. AI/ML Enthusiast.</text>
<text x="80" y="500" font-family="monospace" font-size="24" fill="#9BA6A5">I build what I learn, and I learn from everything I build.</text>
</svg>`;
fs.writeFileSync("public/images/og-image.svg", svg);
'

npx tsx -e '
import sharp from "sharp";
const img = sharp("public/images/og-image.svg").resize(1200, 630);
await img.jpeg({ quality: 86 }).toFile("public/images/og-image.jpg");
console.log("og-image.jpg written");
'

echo "Brand assets done."
