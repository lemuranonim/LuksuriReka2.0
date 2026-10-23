import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildExperiencePosters } from "./build-experience-posters.mjs";

const command = process.argv[2];
if (!["dev", "build", "start"].includes(command)) throw new Error("Use dev, build, or start");
if (command !== "start") buildExperiencePosters();
const args = process.argv.slice(3);
if (command !== "build" && !args.includes("--port")) args.push("--hostname", "127.0.0.1", "--port", "3001");
const child = spawn(process.execPath, [fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url)), command, ...args], {
  stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_LR_EXPERIENCE: "1", LR_EXPERIENCE_LOCAL_OUTPUT: "1" },
});
child.on("exit", code => { process.exitCode = code ?? 1; });
child.on("error", error => { console.error(error.message); process.exitCode = 1; });
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
