import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

// Compares captured browser Resource Timing with the exact local build.
// A new build requires new browser evidence, because chunk names are content hashes.
const evidence = JSON.parse(readFileSync(process.argv[2] || new URL("../outputs/luksuri-reka-level-2-final-evidence.json", import.meta.url), "utf8"));
assert.equal(evidence.buildId, readFileSync(new URL("../.next-experience/BUILD_ID", import.meta.url), "utf8").trim(), "Collect browser evidence for this exact build before checking its bundle.");
const { stillRun, fullRun } = evidence;
assert.equal(stillRun.mode, "still");
assert.equal(stillRun.canvasCount, 0);
assert.ok(fullRun.mode === "full" || fullRun.mode === "light");
assert.equal(fullRun.canvasCount, 1);

const added = fullRun.resources.filter(resource => !stillRun.resources.some(other => other.path === resource.path));
const chunks = added.filter(resource => /^\/_next\/static\/chunks\/[a-f0-9-]+\.js$/.test(resource.path));
assert.ok(chunks.length > 0, "No additional JS observed; collect evidence after the first 3D frame.");
let rendererFound = false;
const sizes = chunks.map(resource => {
  const bytes = readFileSync(new URL(`../.next-experience/${resource.path.slice("/_next/".length)}`, import.meta.url));
  rendererFound ||= bytes.includes(Buffer.from("WebGLRenderer"));
  return { path: resource.path, raw: bytes.length, localGzip: gzipSync(bytes).length, browserEncoded: resource.encoded, browserTransferred: resource.transferred };
});
assert.ok(rendererFound, "The observed difference must contain the WebGL renderer.");
const gzip = sizes.reduce((sum, item) => sum + item.localGzip, 0);
assert.ok(gzip <= 1024 * 1024, "Additional observed JS exceeds the provisional 1 MiB budget.");
assert.equal(evidence.failureRun.mode, "basic");
assert.equal(evidence.failureRun.reason, "failure");
assert.equal(evidence.failureRun.canvasCount, 0);
console.log(JSON.stringify({ passed: true, additionalObservedJs: sizes, localGzipTotal: gzip, note: "Local captured build; cached transfers vary. Not a field performance or physical-device gate." }, null, 2));
