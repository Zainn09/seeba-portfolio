#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== Demo Video Recorder (reproducible) =="
echo "Output dir: public/videos/"
mkdir -p public/videos

if ! command -v npx >/dev/null 2>&1; then
  echo "npx not found — install Node.js"
  exit 1
fi

# Step 1: ensure deps
if [ ! -d "node_modules/playwright" ]; then
  echo "Installing playwright (dev)..."
  npm install -D playwright@latest --no-save
  npx playwright install chromium
fi

# Step 2: dry run always writes README + manifest
echo "Writing README + manifest (dry run)..."
npx tsx scripts/record-demo-videos.ts

# Step 3: if --record passed, do real recording
if [[ "${1:-}" == "--record" ]]; then
  echo ""
  echo "Starting real recording — make sure 'npm run dev' is running on :3000"
  echo "Press Ctrl+C to abort, or wait..."
  sleep 2
  npx tsx scripts/record-demo-videos.ts --record

  echo ""
  echo "Post-process: compress videos to <3MB each"
  echo "  for f in public/videos/*.mp4; do"
  echo "    ffmpeg -i \"\$f\" -vcodec libx264 -crf 28 -preset slow -an \"\${f%.mp4}.tmp.mp4\" && mv \"\${f%.mp4}.tmp.mp4\" \"\$f\""
  echo "  done"
else
  echo ""
  echo "Dry run done. To record real videos:"
  echo "  Terminal 1: npm run dev"
  echo "  Terminal 2: ./scripts/record-demos.sh --record"
fi
