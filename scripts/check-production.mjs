import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { setTimeout } from "node:timers/promises";

const base = "http://127.0.0.1:3000";
const server = spawn(process.execPath, [fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url)), "start", "--hostname", "127.0.0.1", "--port", "3000"], { stdio: "inherit" });
let startupError;
server.on("error", error => { startupError = error; });
const run = script => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [fileURLToPath(new URL(script, import.meta.url))], { stdio: "inherit", env: { ...process.env, FOUNDATION_TEST_URL: base } });
  child.on("error", reject);
  child.on("exit", code => code === 0 ? resolve() : reject(new Error(`${script} failed (${code})`)));
});
try {
  let ready = false;
  for (let attempt = 0; attempt < 90; attempt++) {
    if (startupError) throw startupError;
    if (server.exitCode !== null) throw new Error("Production server stopped before readiness.");
    try { ready = (await fetch(base, { signal: AbortSignal.timeout(1500) })).ok; } catch { /* Server is starting. */ }
    if (ready) break;
    await setTimeout(500);
  }
  if (!ready) throw new Error("Production server did not become ready.");
  await run("./check-foundation-http.mjs");
  await run("./check-experience-http.mjs");
} finally {
  server.kill("SIGTERM");
}
