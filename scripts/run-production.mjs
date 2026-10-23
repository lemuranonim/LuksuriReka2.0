import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildExperiencePosters } from "./build-experience-posters.mjs";

const command = process.argv[2];
if (!["dev", "build", "start"].includes(command)) throw new Error("Use dev, build, or start");
const args = process.argv.slice(3);
const foundation = args.includes("--foundation");
if (command !== "start") buildExperiencePosters();
const child = spawn(process.execPath, [fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url)), command, ...args.filter(arg => arg !== "--foundation")], {
  stdio: "inherit",
  env: { ...process.env, LR_EXPERIENCE_LOCAL_OUTPUT: "0", ...(foundation ? { NEXT_PUBLIC_LR_EXPERIENCE: "0" } : {}) },
});
child.on("exit", code => { process.exitCode = code ?? 1; });
child.on("error", error => { console.error(error.message); process.exitCode = 1; });
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
