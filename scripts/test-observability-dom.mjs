#!/usr/bin/env node
/**
 * DOM-level proof that Vercel Web Analytics and Speed Insights are rendered on
 * every page.
 *
 *   npm run build && npm run test:observability:dom
 *
 * `npm run verify:observability` proves the wiring statically (the components are
 * rendered in the root layout and every built page loads the chunk that injects
 * the scripts). This script closes the loop: it boots the production server on a
 * free port, hydrates every built route in jsdom, and asserts that the
 * `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js` tags are
 * actually present in the DOM afterwards — because both packages inject their
 * script from a client effect, so the tags never appear in prerendered HTML.
 *
 * The 404 route is included on purpose: a not-found page must still be measured.
 */
import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";

const ROOT = process.cwd();
const APP_OUT = path.join(ROOT, ".next", "server", "app");
const HOST = "127.0.0.1";

const ANALYTICS = "/_vercel/insights/script.js";
const SPEED = "/_vercel/speed-insights/script.js";
const NOT_FOUND_PROBE = "/this-route-does-not-exist-observability-probe";

const SERVER_READY_TIMEOUT_MS = 90_000;
const INJECTION_TIMEOUT_MS = 20_000;

if (!existsSync(APP_OUT)) {
  console.error("✗ No build found — run `npm run build` first.");
  process.exit(1);
}

let JSDOM;
let VirtualConsole;
try {
  ({ JSDOM, VirtualConsole } = await import("jsdom"));
} catch {
  console.error("✗ jsdom is required for the DOM test — run `npm install` first.");
  process.exit(1);
}

/* ---------------------------------------------------------------- routes -- */

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(full)));
    else if (full.endsWith(".html")) files.push(full);
  }
  return files;
}

const routes = (await htmlFiles(APP_OUT))
  .map((file) => {
    const route = path
      .relative(APP_OUT, file)
      .replace(/\.html$/, "")
      .split(path.sep)
      .filter((segment) => segment !== "index")
      .join("/");
    return route ? `/${route}` : "/";
  })
  .sort();

routes.push(NOT_FOUND_PROBE);

/* ---------------------------------------------------------------- server -- */

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.unref();
    probe.on("error", reject);
    probe.listen(0, HOST, () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

const port = await freePort();
const nextBin = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");

const server = spawn(process.execPath, [nextBin, "start", "-H", HOST, "-p", String(port)], {
  cwd: ROOT,
  stdio: ["ignore", "pipe", "pipe"],
});

let serverLog = "";
server.stdout.on("data", (chunk) => (serverLog += chunk.toString()));
server.stderr.on("data", (chunk) => (serverLog += chunk.toString()));

const stopServer = () => {
  if (!server.killed) server.kill("SIGTERM");
};
process.on("SIGINT", () => {
  stopServer();
  process.exit(130);
});

const origin = `http://${HOST}:${port}`;

async function waitForServer() {
  const deadline = Date.now() + SERVER_READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`server exited early (code ${server.exitCode})\n${serverLog.trim()}`);
    }
    try {
      const res = await fetch(`${origin}/`);
      if (res.status < 500) return;
    } catch {
      /* not up yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`server did not become ready in ${SERVER_READY_TIMEOUT_MS / 1000}s\n${serverLog.trim()}`);
}

/* ------------------------------------------------------------------- DOM -- */

function webStubs(window) {
  // Node globals jsdom lacks but Next/React need before hydration can run.
  for (const key of [
    "ReadableStream", "WritableStream", "TransformStream", "ByteLengthQueuingStrategy",
    "CountQueuingStrategy", "TextEncoder", "TextDecoder", "MessageChannel", "MessagePort",
    "AbortController", "AbortSignal", "Blob", "File", "FormData", "Headers", "Request",
    "Response", "fetch", "structuredClone", "queueMicrotask", "performance",
  ]) {
    if (globalThis[key] !== undefined && window[key] === undefined) {
      try {
        window[key] = globalThis[key];
      } catch {
        /* read-only property */
      }
    }
  }
  window.matchMedia =
    window.matchMedia ||
    (() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => false,
    }));
  class Observer {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  window.IntersectionObserver = Observer;
  window.ResizeObserver = Observer;
  window.scrollTo = () => {};
  window.HTMLCanvasElement.prototype.getContext = () => null;
  window.requestIdleCallback =
    window.requestIdleCallback || ((cb) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 1));
}

async function check(route) {
  const res = await fetch(`${origin}${route}`);
  const html = await res.text();

  const virtualConsole = new VirtualConsole();
  const errors = [];
  virtualConsole.on("jsdomError", (error) => errors.push(error.message));

  const dom = new JSDOM(html, {
    url: `${origin}${route}`,
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse: webStubs,
  });

  const has = (needle) =>
    [...dom.window.document.querySelectorAll("script")].some(
      (script) => (script.getAttribute("src") || "") === needle
    );

  const deadline = Date.now() + INJECTION_TIMEOUT_MS;
  while (Date.now() < deadline && !(has(ANALYTICS) && has(SPEED))) {
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  const result = {
    route,
    status: res.status,
    analytics: has(ANALYTICS),
    speed: has(SPEED),
    queue: typeof dom.window.va,
    errors: errors.slice(0, 2),
  };

  dom.window.close();
  return result;
}

/* ------------------------------------------------------------------ run --- */

const failures = [];

try {
  await waitForServer();
  console.log(`\nVercel observability — DOM check (${routes.length} routes on ${origin})\n`);

  for (const route of routes) {
    try {
      const result = await check(route);
      if (result.analytics && result.speed) {
        console.log(
          `  ✓ ${route.padEnd(52)} status=${result.status}  Analytics=injected  SpeedInsights=injected  window.va=${result.queue}`
        );
      } else {
        failures.push(
          `${route}: ${result.analytics ? "" : "Analytics missing"}${!result.analytics && !result.speed ? " + " : ""}${
            result.speed ? "" : "Speed Insights missing"
          }`
        );
        console.log(
          `  ✗ ${route.padEnd(52)} status=${result.status}  Analytics=${
            result.analytics ? "injected" : "MISSING"
          }  SpeedInsights=${result.speed ? "injected" : "MISSING"}`
        );
        if (result.errors.length) console.log(`      jsdom: ${result.errors.join(" | ").slice(0, 200)}`);
      }
    } catch (error) {
      failures.push(`${route}: ${error.message}`);
      console.log(`  ✗ ${route.padEnd(52)} ${error.message}`);
    }
  }
} finally {
  stopServer();
}

if (failures.length) {
  console.log(`\n✗ ${failures.length}/${routes.length} route(s) missing instrumentation:`);
  failures.slice(0, 20).forEach((message) => console.log(`    · ${message}`));
  if (failures.length > 20) console.log(`    … and ${failures.length - 20} more`);
  console.log("");
  process.exit(1);
}

console.log(
  `\n✓ Analytics + Speed Insights injected in the DOM on all ${routes.length} routes (including a 404).\n`
);
process.exit(0);
