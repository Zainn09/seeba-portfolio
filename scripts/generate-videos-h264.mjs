import { createCanvas } from "@napi-rs/canvas";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import H264MP4Encoder from "h264-mp4-encoder";

const OUT = join(process.cwd(), "public/videos");
mkdirSync(OUT, { recursive: true });

const PROJECTS = [
  { slug: "chai-dosti-cafe", title: "Chai Dosti Café", subtitle: "WEB FOUNDATIONS", color: "#B8F56A", bg: "#080B12" },
  { slug: "responsive-calculator", title: "Responsive Calculator", subtitle: "WEB FOUNDATIONS", color: "#7DE2D1", bg: "#081013" },
  { slug: "library-management-system", title: "Library Management System", subtitle: "PYTHON · CONSOLE", color: "#A7B5FF", bg: "#0A0C18" },
  { slug: "student-management-system", title: "Student Management System", subtitle: "PYTHON · CONSOLE", color: "#B8F56A", bg: "#0B0D0F" },
  { slug: "bank-management-system", title: "Bank Management System", subtitle: "PYTHON · CONSOLE", color: "#F59E0B", bg: "#100C08" },
  { slug: "sneakerstore", title: "SneakerStore", subtitle: "ANDROID · HERO PROJECT", color: "#B8F56A", bg: "#080B12" },
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

async function generateVideo(project) {
  const W = 1280;
  const H = 720;
  const fps = 30;
  const durationSec = 3;
  const totalFrames = fps * durationSec;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const encoder = await H264MP4Encoder.createH264MP4Encoder();
  encoder.width = W;
  encoder.height = H;
  encoder.frameRate = fps;
  encoder.kbps = 1000;
  encoder.speed = 10;
  encoder.quantizationParameter = 20;
  encoder.initialize();

  const bgRgb = hexToRgb(project.bg);
  const accentRgb = hexToRgb(project.color);

  for (let i = 0; i < totalFrames; i++) {
    const t = i / totalFrames;

    // Background
    ctx.fillStyle = project.bg;
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(155, 166, 165, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Glow
    ctx.fillStyle = project.color + "22";
    ctx.beginPath();
    ctx.arc(W * 0.8, H * 0.2, 300 + Math.sin(t * Math.PI * 2) * 20, 0, Math.PI * 2);
    ctx.fill();

    // Brand mark
    ctx.fillStyle = project.color;
    ctx.beginPath();
    ctx.roundRect(60, 50, 48, 48, 12);
    ctx.fill();
    ctx.fillStyle = project.bg;
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("AH", 84, 82);

    // Meta
    ctx.fillStyle = "#9BA6A5";
    ctx.font = "18px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`DEMO VIDEO · ${project.slug.toUpperCase()} · ${Math.floor(t * 100)}%`, 130, 78);

    // Title
    ctx.fillStyle = "#F3F6F4";
    ctx.font = "bold 64px sans-serif";
    ctx.fillText(project.title, 60, H / 2 - 20);

    ctx.fillStyle = project.color;
    ctx.font = "20px monospace";
    ctx.fillText(project.subtitle, 60, H / 2 + 30);

    // Play indicator with pulse
    const pulse = 1 + Math.sin(t * Math.PI * 4) * 0.1;
    ctx.save();
    ctx.translate(W / 2, H / 2 + 100);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = project.color;
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = project.bg;
    ctx.beginPath();
    ctx.moveTo(-12, -20);
    ctx.lineTo(-12, 20);
    ctx.lineTo(22, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Footer
    ctx.strokeStyle = "rgba(155, 166, 165, 0.2)";
    ctx.beginPath();
    ctx.moveTo(60, H - 80);
    ctx.lineTo(W - 60, H - 80);
    ctx.stroke();

    ctx.fillStyle = "#9BA6A5";
    ctx.font = "16px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`ABDUL HASEEB · ${project.title.toUpperCase()} · RECORDED DEMO`, 60, H - 45);

    ctx.fillStyle = project.color;
    ctx.textAlign = "right";
    ctx.fillText(`● REC · ${i + 1}/${totalFrames} · SILENT · LOOP`, W - 60, H - 45);

    // Get image data and encode
    const imageData = ctx.getImageData(0, 0, W, H);
    // h264-mp4-encoder expects RGBA
    encoder.addFrameRgba(imageData.data);
  }

  encoder.finalize();
  const mp4 = encoder.FS.readFile(encoder.outputFilename);
  const outPath = join(OUT, `${project.slug}.mp4`);
  writeFileSync(outPath, mp4);
  console.log(`Generated ${outPath} (${(mp4.byteLength / 1024).toFixed(1)} KB)`);
  encoder.delete();
}

async function main() {
  for (const p of PROJECTS) {
    console.log(`\nGenerating ${p.slug}...`);
    await generateVideo(p);
  }
  console.log("\nAll videos generated!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
