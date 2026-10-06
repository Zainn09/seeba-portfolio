# Demo Videos

This folder holds reproducible, silent, loopable demo clips for the Projects section.

## Source of truth

The recorder is `scripts/record-demo-videos.ts`. It uses Playwright to:

1. Open http://localhost:3000/#projects
2. Wait for each demo stage to be idle
3. Click "VIEW DEMO"
4. Record `durationMs` of the animation
5. Save as ``<slug>.mp4` + ``poster-<slug>.jpg`

## How to (re)generate

```bash
npm install -D playwright
npx playwright install chromium
# in terminal 1:
npm run dev
# in terminal 2:
npx tsx scripts/record-demo-videos.ts
```

## Why committed?

- No external video host, no CLS, no tracking.
- Posters are used for `prefers-reduced-motion` and as `<video poster>`.
- If a clip is missing, the live animation fallback renders.

## Manual fallback (no playwright)

If you can't run Playwright, record manually:

- macOS: QuickTime Player → New Screen Recording, crop to 1280x800, no audio.
- Windows: Xbox Game Bar (Win+G) or OBS Studio, 1280x800, 30fps, no audio.
- Trim to 6–12s, export H.264 MP4, place in this folder with exact slug name.

## Checklist

- [ ] Silent (no audio track)
- [ ] Loopable (starts/ends on idle state)
- [ ] < 3 MB each (compress with `ffmpeg -vcodec libx264 -crf 28`)
- [ ] Poster JPG at same size
- [ ] Respects reduced-motion (poster shown instead of auto-play)
