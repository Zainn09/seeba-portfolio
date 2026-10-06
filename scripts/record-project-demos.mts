/**
 * Complete project-video recorder — standalone HTML + headless Chrome screenshots + ffmpeg
 * 
 * Big idea: Real demos are React components, homepage has heavy 3D that makes direct
 * screen-recording impossible (headless Chrome chokes ~20s per frame). So instead:
 * 1. Rebuild each demo as standalone HTML (plain HTML/CSS/JS, no framework)
 * 2. Play animations in real time in headless Chrome
 * 3. Take 12 screenshots per second
 * 4. Stitch into MP4 with ffmpeg
 * 
 * Prerequisites (handled automatically if missing):
 * - /tmp/al2023/lib from @sparticuz/chromium bin/al2023.tar.br (NSS shims)
 * - ffmpeg from imageio-ffmpeg pip package
 * 
 * Usage:
 *   npx tsx scripts/record-project-demos.mts
 * 
 * Output:
 *   public/videos/*.mp4 (150-250KB, H.264, 12fps, faststart)
 *   public/videos/*.jpg posters
 */

import { mkdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { createServer } from "node:http";
import { execSync, spawnSync } from "node:child_process";

// --- Setup NSS libs for @sparticuz/chromium (LD_LIBRARY_PATH trick) ---
async function setupChromiumLibs() {
  const al2023Tar = join(process.cwd(), "node_modules/@sparticuz/chromium/bin/al2023.tar.br");
  const al2023Out = join(tmpdir(), "al2023");
  const libPath = join(al2023Out, "lib");
  
  if (!existsSync(libPath) || !existsSync(join(libPath, "libnss3.so"))) {
    console.log("Extracting @sparticuz/chromium NSS libs from al2023.tar.br...");
    mkdirSync(al2023Out, { recursive: true });
    // al2023.tar.br is brotli compressed tar
    // Use node to decompress via @sparticuz/chromium's own logic or via python
    try {
      // Try using chromium package's own extraction via tsx
      const { execSync } = await import("node:child_process");
      // The package uses tar-fs and brotli, we can mimic via node
      const { readFileSync } = await import("node:fs");
      const { createBrotliDecompress } = await import("node:zlib");
      const { extract } = await import("tar-fs");
      const { pipeline } = await import("node:stream/promises");
      const { createReadStream } = await import("node:fs");
      
      const input = createReadStream(al2023Tar);
      const brotli = createBrotliDecompress();
      const extractor = extract(al2023Out);
      await pipeline(input, brotli, extractor);
      console.log(`Extracted to ${al2023Out}, lib exists: ${existsSync(libPath)}`);
    } catch (e) {
      console.log("Failed to extract via tar-fs, trying python brotli...", e);
      // Fallback: use python to decompress
      execSync(`python3 -c "import brotli; data=open('${al2023Tar}','rb').read(); open('/tmp/al2023.tar','wb').write(brotli.decompress(data))" && tar -xf /tmp/al2023.tar -C /tmp/`, { stdio: "inherit" });
    }
  }
  
  const currentLD = process.env.LD_LIBRARY_PATH || "";
  if (!currentLD.includes(libPath)) {
    process.env.LD_LIBRARY_PATH = currentLD ? `${libPath}:${currentLD}` : libPath;
    console.log(`Set LD_LIBRARY_PATH=${process.env.LD_LIBRARY_PATH}`);
  }
  
  // Also need fonts
  const fontsTar = join(process.cwd(), "node_modules/@sparticuz/chromium/bin/fonts.tar.br");
  const fontsOut = join(tmpdir(), "fonts");
  if (!existsSync(fontsOut) || !existsSync(join(fontsOut, "fonts.conf"))) {
    console.log("Extracting fonts.tar.br...");
    try {
      const { createReadStream } = await import("node:fs");
      const { createBrotliDecompress } = await import("node:zlib");
      const { extract } = await import("tar-fs");
      const { pipeline } = await import("node:stream/promises");
      mkdirSync(fontsOut, { recursive: true });
      const input = createReadStream(fontsTar);
      const brotli = createBrotliDecompress();
      const extractor = extract(tmpdir());
      await pipeline(input, brotli, extractor);
    } catch (e) {
      console.log("Fonts extract fallback via python");
      execSync(`python3 -c "import brotli; data=open('${fontsTar}','rb').read(); open('/tmp/fonts.tar','wb').write(brotli.decompress(data))" && tar -xf /tmp/fonts.tar -C /tmp/`, { stdio: "inherit" });
    }
  }
  process.env.FONTCONFIG_PATH = fontsOut;
  process.env.HOME = tmpdir();
  
  return { libPath, fontsOut };
}

function getFfmpegPath(): string {
  try {
    const out = execSync(`python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"`, { encoding: "utf8" }).trim();
    if (existsSync(out)) return out;
  } catch {}
  // Fallback to system ffmpeg or imageio-ffmpeg binary
  const possible = "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2";
  if (existsSync(possible)) return possible;
  return "ffmpeg";
}

// --- Standalone HTML builders (plain HTML/CSS/JS, no framework, no WebGL) ---
// Dark title card frame: project name top-left, mono label top-right, AH badge

function wrapWithFrame(projectName: string, label: string, innerHtml: string, innerCss: string, innerJs: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1280, height=720">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1280px;height:720px;overflow:hidden;background:#080B12;color:#F7F8F3;font-family:ui-monospace, SFMono-Regular, Menlo, monospace}
  .frame{position:relative;width:1280px;height:720px;background:#080B12;overflow:hidden}
  .titlebar{position:absolute;top:0;left:0;right:0;height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.08);z-index:10}
  .titlebar .name{font-family:ui-sans-serif,system-ui; font-weight:700; letter-spacing:-0.02em; font-size:14px; color:#F7F8F3}
  .titlebar .name span{color:#B8F56A}
  .titlebar .label{font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.5)}
  .titlebar .badge{position:absolute;left:50%;transform:translateX(-50%);font-size:10px;letter-spacing:0.2em;color:#B8F56A;background:rgba(184,245,106,0.12);border:1px solid rgba(184,245,106,0.3);padding:4px 10px;border-radius:999px}
  .content{position:absolute;top:44px;left:0;right:0;bottom:0;overflow:hidden}
  ${innerCss}
</style>
</head>
<body>
<div class="frame">
  <div class="titlebar">
    <div class="name">${projectName}<span>.</span></div>
    <div class="badge">AH / 01 — ${label}</div>
    <div class="label">${label} · 12 FPS · FROM SCRATCH</div>
  </div>
  <div class="content">
    ${innerHtml}
  </div>
</div>
<script>
${innerJs}
</script>
</body>
</html>`;
}

function buildCafeHtml(): string {
  const innerCss = `
    .cafe{width:100%;height:100%;background:#fdfbf4;color:#1b1f1a;font-family:ui-sans-serif,system-ui;overflow:hidden;position:relative}
    .cafe .nav{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:#fff;border-bottom:1px solid rgba(0,0,0,0.08)}
    .cafe .nav .logo{font-weight:800;font-size:18px;letter-spacing:-0.02em}
    .cafe .nav .logo span{color:#b3592a}
    .cafe .nav .links{display:flex;gap:18px}
    .cafe .nav .links span{font-size:11px;letter-spacing:0.14em;text-transform:uppercase;transition:color 0.3s}
    .cafe .nav .links span.active{color:#b3592a}
    .cafe .nav .links span:not(.active){color:rgba(0,0,0,0.4)}
    .cafe .hero{position:relative;padding:28px 28px 18px;overflow:hidden}
    .cafe .hero .blob{position:absolute;right:-10px;top:-10px;width:110px;height:110px;border-radius:50%;background:#f4e3cd}
    .cafe .hero .blob2{position:absolute;right:40px;top:24px;width:64px;height:64px;border-radius:50%;background:rgba(224,176,138,0.6)}
    .cafe .hero .eyebrow{font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#b3592a}
    .cafe .hero h1{font-family:Georgia,serif;font-size:42px;line-height:0.95;font-weight:800;margin-top:6px;max-width:360px}
    .cafe .board{margin:12px 28px 0;background:#fff;border:1px solid rgba(0,0,0,0.1);border-radius:12px;padding:14px 18px}
    .cafe .board .head{display:flex;justify-content:space-between;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(0,0,0,0.4);margin-bottom:12px}
    .cafe .board .row{display:flex;justify-content:space-between;border-bottom:1px dotted rgba(0,0,0,0.15);padding:8px 0;font-size:14px}
    .cafe .board .row:last-child{border-bottom:none}
    .cafe .board .row .price{font-family:ui-monospace,monospace;color:rgba(0,0,0,0.6)}
  `;
  const innerHtml = `
    <div class="cafe">
      <div class="nav">
        <div class="logo">Chai<span>Dosti</span></div>
        <div class="links" id="navLinks">
          <span class="active">home</span><span>menu</span><span>about</span><span>contact</span>
        </div>
        <div style="border:1px solid rgba(179,89,42,0.4);padding:4px 12px;border-radius:999px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#b3592a">Order</div>
      </div>
      <div class="hero">
        <div class="blob"></div><div class="blob2"></div>
        <div class="eyebrow">Est. in Lahore</div>
        <h1>Chai worth<br>stopping for.</h1>
      </div>
      <div class="board">
        <div class="head"><span>Today's board</span><span id="menuLabel">menu / 01</span></div>
        <div id="menuRows"></div>
      </div>
    </div>
  `;
  const innerJs = `
    const sections=["home","menu","about","contact"];
    const prices=[
      ["Karak Chai — Rs 150","Doodh Patti — Rs 120","Green Tea — Rs 180"],
      ["Bun Kebab — Rs 160","Samosa (2pc) — Rs 80","Paratha Roll — Rs 240"],
      ["Pakora Plate — Rs 220","Masala Fries — Rs 190","Lassi — Rs 180"]
    ];
    let active=0, menu=0;
    const navEl=document.getElementById('navLinks');
    const menuRows=document.getElementById('menuRows');
    const menuLabel=document.getElementById('menuLabel');
    function renderNav(){
      navEl.innerHTML=sections.map((s,i)=>\`<span class="\${i===active?'active':''}">\${s}</span>\`).join('');
    }
    function renderMenu(){
      menuRows.innerHTML=prices[menu].map(row=>{
        const [name,price]=row.split('—');
        return \`<div class="row"><span>\${name}</span><span class="price">\${price}</span></div>\`;
      }).join('');
      menuLabel.textContent='menu / '+String(menu+1).padStart(2,'0');
    }
    renderNav(); renderMenu();
    setInterval(()=>{ active=(active+1)%sections.length; renderNav(); }, 2600);
    setInterval(()=>{ menu=(menu+1)%prices.length; renderMenu(); }, 3600);
  `;
  return wrapWithFrame("Chai Dosti Café", "WEB FOUNDATIONS / 01", innerHtml, innerCss, innerJs);
}

function buildCalculatorHtml(): string {
  const innerCss = `
    .calc-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e9edf3}
    .calc{width:300px;background:#0e1218;border-radius:28px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.4)}
    .calc .display{padding:28px 24px 18px;text-align:right}
    .calc .display .note{font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.35)}
    .calc .display .value{font-size:40px;font-weight:300;color:#fff;margin-top:6px;min-height:48px}
    .calc .keys{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;background:#1a2130;padding:16px;border-radius:24px 24px 0 0}
    .calc .keys button{height:52px;border:none;border-radius:16px;font-size:18px;font-family:ui-monospace,monospace;transition:transform 0.12s, background 0.12s}
    .calc .keys button.op{background:#2b3550;color:#B8F56A}
    .calc .keys button.num{background:#232c40;color:rgba(255,255,255,0.9)}
    .calc .keys button.active{transform:scale(0.92);background:#B8F56A !important;color:#0e1218 !important}
  `;
  const innerHtml = `
    <div class="calc-wrap">
      <div class="calc">
        <div class="display">
          <div class="note" id="calcNote">responsive calc</div>
          <div class="value" id="calcValue">0</div>
        </div>
        <div class="keys" id="calcKeys"></div>
      </div>
    </div>
  `;
  const innerJs = `
    const expressions=[
      {keys:"7",display:"7",note:""},
      {keys:"×",display:"7 ×",note:""},
      {keys:"8",display:"7 × 8",note:""},
      {keys:"=",display:"56",note:"result"},
      {keys:"÷",display:"56 ÷",note:""},
      {keys:"7",display:"56 ÷ 7",note:""},
      {keys:"=",display:"8",note:"result"},
      {keys:"C",display:"0",note:"clear"},
      {keys:"1",display:"1",note:""},
      {keys:"2",display:"12",note:""},
      {keys:"×",display:"12 ×",note:""},
      {keys:"9",display:"12 × 9",note:""},
      {keys:"=",display:"108",note:"result"},
    ];
    const KEYS=["C","±","%","÷","7","8","9","×","4","5","6","−","1","2","3","+","0",".","="];
    const keysEl=document.getElementById('calcKeys');
    const valueEl=document.getElementById('calcValue');
    const noteEl=document.getElementById('calcNote');
    KEYS.forEach(k=>{
      const btn=document.createElement('button');
      btn.textContent=k;
      btn.className=(["÷","×","−","+","="].includes(k)?"op":"num");
      btn.dataset.key=k;
      keysEl.appendChild(btn);
    });
    let step=0;
    function render(){
      const cur=expressions[step];
      valueEl.textContent=cur.display;
      noteEl.textContent=cur.note||"responsive calc";
      keysEl.querySelectorAll('button').forEach(btn=>{
        btn.classList.toggle('active', btn.dataset.key===cur.keys);
      });
    }
    render();
    setInterval(()=>{ step=(step+1)%expressions.length; render(); }, 950);
  `;
  return wrapWithFrame("Responsive Calculator", "WEB FOUNDATIONS / 02", innerHtml, innerCss, innerJs);
}

function buildConsoleHtml(type: "library" | "student" | "bank"): string {
  const scripts = {
    library: [
      "/run library_system.py",
      "—— Library Management System ——",
      "1. View Books   2. Search   3. Issue   4. Return   5. Exit",
      "/1",
      "ID   TITLE                    AUTHOR        STATUS",
      "101  Clean Code               R. Martin     available",
      "202  Automate the Boring      A. Sweigart   available",
      "303  Python Crash Course      E. Matthes    issued",
      "/3",
      "Enter book ID: 202",
      "Enter member name: Abdul",
      "✓ Book 202 issued to Abdul",
      "/4",
      "Enter book ID: 202",
      "✓ Book 202 returned",
      "/1",
      "202  Automate the Boring      A. Sweigart   available",
      "· record updated — persisted to books.txt",
    ],
    student: [
      "/run student_system.py",
      "—— Student Management System ——",
      "1. Add   2. Search   3. Display All   4. Exit",
      "/1",
      "Name: Haseeb",
      "Roll no: BSCS-042",
      "Program: BS Computer Science",
      "CGPA: 3.6",
      "✓ Record saved",
      "/2",
      "Search roll no: BSCS-042",
      "Name: Haseeb   Program: BS Computer Science   CGPA: 3.6",
      "· fetched from students.csv",
      "/3",
      "BSCS-041 Ali — 3.4 | BSCS-042 Haseeb — 3.6 | BSCS-043 Sara — 3.9",
      "· display all — 3 records",
    ],
    bank: [
      "/run bank_system.py",
      "—— Bank Management System (fictional demo data) ——",
      "1. Create Account   2. Deposit   3. Withdraw   4. Balance   5. Exit",
      "/1",
      "Name: Sample User",
      "Account no: 1004-2024",
      "✓ Account created",
      "/2",
      "Deposit into 1004-2024: 5000",
      "✓ Deposited. New balance: 5000",
      "/3",
      "Withdraw from 1004-2024: 1200",
      "✓ Withdrawn. New balance: 3800",
      "/4",
      "Account 1004-2024 — balance: 3800",
      "· all amounts are fictional demonstration data",
    ],
  };
  const titles = {
    library: "Library Management System — Python Console",
    student: "Student Management System — Python Console",
    bank: "Bank Management System — Python Console (Fictional Data)",
  };
  
  const innerCss = `
    .console{width:100%;height:100%;background:#0a0f1a;color:#c8d3d0;font-size:14px;line-height:1.6;padding:18px 20px;overflow:hidden}
    .console .line{white-space:pre;min-height:20px}
    .console .line.in{color:#B8F56A}
    .console .line.ok{color:#7DE2D1}
    .console .line.dim{color:#6b7684}
    .console .cursor{display:inline-block;width:8px;height:16px;background:#B8F56A;vertical-align:middle;animation:blink 1s step-end infinite}
    @keyframes blink{50%{opacity:0}}
  `;
  const innerHtml = `<div class="console" id="console"></div>`;
  const innerJs = `
    const lines=${JSON.stringify(scripts[type])};
    const consoleEl=document.getElementById('console');
    let lineIdx=0, charIdx=0;
    let currentLineEl=null;
    
    function typeNext(){
      if(lineIdx>=lines.length){
        // Restart after pause
        setTimeout(()=>{ lineIdx=0; charIdx=0; consoleEl.innerHTML=''; typeNext(); }, 2000);
        return;
      }
      const text=lines[lineIdx];
      if(charIdx===0){
        currentLineEl=document.createElement('div');
        currentLineEl.className='line';
        // Determine tone
        if(text.startsWith('/')) currentLineEl.classList.add('in');
        else if(text.startsWith('✓')) currentLineEl.classList.add('ok');
        else if(text.startsWith('·') || text.startsWith('——') || text.startsWith('ID') || text.startsWith('1.')) currentLineEl.classList.add('dim');
        consoleEl.appendChild(currentLineEl);
      }
      if(charIdx<text.length){
        currentLineEl.textContent=text.slice(0,charIdx+1);
        charIdx++;
        // Add cursor
        if(!currentLineEl.querySelector('.cursor')){
          const cursor=document.createElement('span');
          cursor.className='cursor';
          currentLineEl.appendChild(cursor);
        }
        setTimeout(typeNext, 640 / Math.max(1, text.length) * 2 + Math.random()*20);
      } else {
        if(currentLineEl.querySelector('.cursor')) currentLineEl.querySelector('.cursor').remove();
        lineIdx++; charIdx=0;
        setTimeout(typeNext, 300);
        // Scroll
        if(consoleEl.children.length>18){
          consoleEl.removeChild(consoleEl.children[0]);
        }
      }
    }
    typeNext();
  `;
  return wrapWithFrame(titles[type], "PYTHON · CONSOLE / " + type.toUpperCase(), innerHtml, innerCss, innerJs);
}

function buildSneakerHtml(): string {
  const innerCss = `
    .sneaker{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0c101c;position:relative}
    .sneaker .device{width:320px;height:580px;background:#1a2234;border:6px solid rgba(255,255,255,0.1);border-radius:36px;overflow:hidden;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.5)}
    .sneaker .device .status{height:28px;background:#0e1320;display:flex;align-items:center;justify-content:space-between;padding:0 18px;font-size:10px;color:rgba(255,255,255,0.7)}
    .sneaker .device .screen{padding:16px;height:calc(100% - 28px);overflow:hidden}
    .sneaker .device .screen .title{font-size:20px;font-weight:700;color:#fff;margin-bottom:12px}
    .sneaker .device .screen .card{background:rgba(255,255,255,0.06);border-radius:14px;padding:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
    .sneaker .device .screen .card .name{color:#fff;font-size:13px;font-weight:600}
    .sneaker .device .screen .card .meta{color:rgba(255,255,255,0.5);font-size:11px;margin-top:2px}
    .sneaker .device .screen .card .price{color:#B8F56A;font-weight:700;font-size:13px}
    .sneaker .device .screen .hero{width:100%;height:160px;background:rgba(255,255,255,0.06);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:48px;margin-bottom:16px}
    .sneaker .device .screen .btn{width:100%;height:44px;background:#B8F56A;color:#0e1320;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;margin-top:16px}
    .sneaker .step-indicator{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:6px}
    .sneaker .step-indicator .dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.2);transition:background 0.3s}
    .sneaker .step-indicator .dot.active{background:#B8F56A}
  `;
  const innerHtml = `
    <div class="sneaker">
      <div class="device">
        <div class="status"><span>9:41</span><span>SneakerStore</span><span>●●● 100%</span></div>
        <div class="screen" id="screen"></div>
      </div>
      <div class="step-indicator" id="dots"></div>
    </div>
  `;
  const innerJs = `
    const steps=[
      {id:"launch", html: \`<div style="text-align:center;padding-top:60px"><div style="width:80px;height:80px;background:#B8F56A;border-radius:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:36px;font-weight:800;color:#0e1320">S</div><div style="color:#fff;font-size:22px;font-weight:700">SneakerStore</div><div style="color:rgba(255,255,255,0.5);font-size:12px;margin-top:8px">Find your perfect pair</div></div>\`},
      {id:"login", html: \`<div class="title">Welcome back</div><div style="color:rgba(255,255,255,0.5);font-size:12px;margin-bottom:20px">Sign in to continue</div><div style="background:rgba(255,255,255,0.08);border-radius:12px;padding:12px;margin-bottom:12px;color:#fff;font-size:13px">Email: haseeb@example.com</div><div style="background:rgba(255,255,255,0.08);border-radius:12px;padding:12px;color:#fff;font-size:13px">Password: ••••••••</div><div class="btn">Continue →</div>\`},
      {id:"browse", html: \`<div class="title">Sneakers</div><div class="card"><div><div class="name">Court Runner</div><div class="meta">Nike • ⭐ 4.8</div></div><div class="price">$79</div></div><div class="card"><div><div class="name">Grid Classic</div><div class="meta">Adidas • ⭐ 4.6</div></div><div class="price">$95</div></div><div class="card"><div><div class="name">Night Move</div><div class="meta">Puma • ⭐ 4.9</div></div><div class="price">$120</div></div>\`},
      {id:"detail", html: \`<div class="hero">👟</div><div class="title">Court Runner</div><div style="color:rgba(255,255,255,0.5);font-size:12px">Nike • Running • 4.8 ⭐ (124 reviews)</div><div style="color:#B8F56A;font-size:22px;font-weight:700;margin-top:12px">$79</div><div style="color:rgba(255,255,255,0.6);font-size:11px;margin-top:8px">Lightweight mesh upper, responsive cushioning.</div><div class="btn">Add to Cart — $79</div>\`},
      {id:"cart", html: \`<div class="title">Cart (1)</div><div class="card"><div><div class="name">Court Runner</div><div class="meta">Size 9 • Nike • Qty 1</div></div><div class="price">$79</div></div><div style="background:rgba(255,255,255,0.06);border-radius:14px;padding:12px;margin-top:16px"><div style="color:#fff;font-size:12px">Order Summary</div><div style="display:flex;justify-content:space-between;color:rgba(255,255,255,0.5);font-size:11px;margin-top:8px"><span>Subtotal</span><span>$79</span></div><div style="display:flex;justify-content:space-between;color:rgba(255,255,255,0.5);font-size:11px;margin-top:4px"><span>Shipping</span><span>Free</span></div><div style="display:flex;justify-content:space-between;color:#fff;font-weight:700;font-size:13px;margin-top:8px"><span>Total</span><span>$79</span></div></div><div class="btn" style="background:#7DE2D1">Checkout →</div>\`},
      {id:"address", html: \`<div class="title">Delivery Address</div><div class="card" style="border:1px solid #B8F56A;background:rgba(184,245,106,0.12)"><div><div class="name">Home</div><div class="meta">Street 12, Gulberg III, Lahore</div></div><div style="color:#B8F56A">✓</div></div><div class="card"><div><div class="name">Office</div><div class="meta">Plaza 4, MM Alam, Lahore</div></div></div>\`},
      {id:"checkout", html: \`<div style="text-align:center;padding-top:40px"><div style="width:72px;height:72px;background:#B8F56A;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:32px;color:#0e1320">✓</div><div style="color:#fff;font-size:20px;font-weight:700">Order placed!</div><div style="color:rgba(255,255,255,0.6);font-size:12px;margin-top:8px">Your sneakers are on the way</div><div style="color:#fff;font-size:10px;font-family:monospace;margin-top:16px">Order #SNK-2024-0842</div><div style="color:rgba(255,255,255,0.5);font-size:10px;margin-top:4px">Estimated: Tomorrow, 3PM</div></div>\`},
    ];
    const screen=document.getElementById('screen');
    const dots=document.getElementById('dots');
    dots.innerHTML=steps.map((_,i)=>\`<div class="dot \${i===0?'active':''}"></div>\`).join('');
    let current=0;
    function render(){
      screen.innerHTML=steps[current].html;
      dots.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active', i===current));
    }
    render();
    setInterval(()=>{ current=(current+1)%steps.length; render(); }, 2000);
  `;
  return wrapWithFrame("SneakerStore", "ANDROID · HERO / 06", innerHtml, innerCss, innerJs);
}

// --- Main recorder ---
const PROJECTS = [
  { slug: "chai-dosti-cafe", duration: 34, html: buildCafeHtml() },
  { slug: "responsive-calculator", duration: 30, html: buildCalculatorHtml() },
  { slug: "library-management-system", duration: 46, html: buildConsoleHtml("library") },
  { slug: "student-management-system", duration: 42, html: buildConsoleHtml("student") },
  { slug: "bank-management-system", duration: 46, html: buildConsoleHtml("bank") },
  { slug: "sneakerstore", duration: 50, html: buildSneakerHtml() },
];

async function main() {
  const { libPath } = await setupChromiumLibs();
  const ffmpegPath = getFfmpegPath();
  console.log(`Using ffmpeg: ${ffmpegPath}`);
  console.log(`LD_LIBRARY_PATH: ${process.env.LD_LIBRARY_PATH}`);
  
  // Import puppeteer-core and chromium after setting up libs
  const puppeteer = await import("puppeteer-core");
  const chromium = (await import("@sparticuz/chromium")).default;
  
  // Don't add custom GPU flags — use library's default args
  // chromium.setGraphicsMode = false is default
  
  const executablePath = await chromium.executablePath();
  console.log(`Chromium executable: ${executablePath}`);
  
  const outDir = join(process.cwd(), "public/videos");
  mkdirSync(outDir, { recursive: true });
  
  // Tiny static server for fonts
  const htmlMap = new Map<string, string>();
  PROJECTS.forEach(p => htmlMap.set(`/${p.slug}.html`, p.html));
  
  const server = createServer((req, res) => {
    const url = req.url || "/";
    if (htmlMap.has(url)) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(htmlMap.get(url));
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  });
  
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const port = address.port;
  console.log(`Static server listening on http://localhost:${port}`);
  
  const browser = await puppeteer.launch({
    args: chromium.args, // Use library's default args, no custom GPU flags
    defaultViewport: { width: 1280, height: 720 },
    executablePath,
    headless: true, // Use shell headless
  });
  
  console.log("Browser launched");
  
  for (const project of PROJECTS) {
    console.log(`\n=== Recording ${project.slug} — ${project.duration}s @ 12fps ===`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(`http://localhost:${port}/${project.slug}.html`, { waitUntil: "networkidle0" });
    await new Promise(r => setTimeout(r, 1000)); // Let animations start
    
    const frameDir = join(tmpdir(), `frames-${project.slug}`);
    if (existsSync(frameDir)) rmSync(frameDir, { recursive: true, force: true });
    mkdirSync(frameDir, { recursive: true });
    
    const totalFrames = project.duration * 12;
    console.log(`Capturing ${totalFrames} frames to ${frameDir}...`);
    
    for (let i = 0; i < totalFrames; i++) {
      const framePath = join(frameDir, `frame_${String(i+1).padStart(5, '0')}.jpg`);
      // Screenshot-bursts + ffmpeg is working path — don't use page.screencast()
      await page.screenshot({ path: framePath, type: "jpeg", quality: 85 });
      
      if (i % 50 === 0) console.log(`  Frame ${i+1}/${totalFrames} (${(i/12).toFixed(1)}s)`);
      
      // Wait ~83ms for 12 fps
      await new Promise(r => setTimeout(r, 83));
    }
    
    await page.close();
    
    // Encode with ffmpeg: -framerate 12 -i frame_%05d.jpg -c:v libx264 -pix_fmt yuv420p -crf 29 -preset medium -movflags +faststart out.mp4
    const outMp4 = join(outDir, `${project.slug}.mp4`);
    const ffmpegArgs = [
      "-framerate", "12",
      "-i", join(frameDir, "frame_%05d.jpg"),
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-crf", "29",
      "-preset", "medium",
      "-movflags", "+faststart",
      "-y",
      outMp4
    ];
    
    console.log(`Encoding ${outMp4}...`);
    console.log(`  ${ffmpegPath} ${ffmpegArgs.join(' ')}`);
    const result = spawnSync(ffmpegPath, ffmpegArgs, { stdio: "inherit" });
    if (result.status !== 0) {
      console.error(`ffmpeg failed for ${project.slug} with status ${result.status}`);
      continue;
    }
    
    // Poster: ffmpeg -ss 4 -i out.mp4 -frames:v 1 poster.jpg — pick good screen, for sneaker that's ~5s browse
    const posterTime = project.slug === "sneakerstore" ? "5" : "4";
    const outPoster = join(outDir, `${project.slug}.jpg`);
    const posterArgs = [
      "-ss", posterTime,
      "-i", outMp4,
      "-frames:v", "1",
      "-y",
      outPoster
    ];
    console.log(`Extracting poster ${outPoster} at ${posterTime}s...`);
    spawnSync(ffmpegPath, posterArgs, { stdio: "inherit" });
    
    // Also copy to poster-<slug>.jpg for backward compat
    const outPoster2 = join(outDir, `poster-${project.slug}.jpg`);
    try {
      const { copyFileSync } = await import("node:fs");
      copyFileSync(outPoster, outPoster2);
    } catch {}
    
    console.log(`✅ ${project.slug} — ${project.duration}s — ${(await import("node:fs")).statSync(outMp4).size / 1024 | 0}KB`);
    
    // Cleanup frames
    rmSync(frameDir, { recursive: true, force: true });
  }
  
  await browser.close();
  server.close();
  
  console.log("\n✅ All 6 videos built from scratch — real HTML + headless Chrome screenshots + ffmpeg");
  console.log("Output in public/videos/:");
  PROJECTS.forEach(p => {
    console.log(`  ${p.slug}.mp4 (${p.duration}s) + ${p.slug}.jpg`);
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
