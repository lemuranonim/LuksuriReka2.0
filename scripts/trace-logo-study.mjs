import { createHash } from "node:crypto";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

// A prototype outline derived from the existing bitmap, never an official
// replacement identity asset. This is an offline geometry preparation step.
const source = readFileSync(new URL("../public/logo.png", import.meta.url));
const { data, info } = await sharp(source).resize(384, 384, { fit: "inside" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const inside = (x, y) => x >= 0 && y >= 0 && x < info.width && y < info.height && data[(y * info.width + x) * info.channels + 3] >= 128;
const edges = new Map();
function edge(a, b) { const key = a.join(","); const list = edges.get(key) ?? []; list.push(b); edges.set(key, list); }
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (inside(x, y)) {
  if (!inside(x, y - 1)) edge([x, y], [x + 1, y]);
  if (!inside(x + 1, y)) edge([x + 1, y], [x + 1, y + 1]);
  if (!inside(x, y + 1)) edge([x + 1, y + 1], [x, y + 1]);
  if (!inside(x - 1, y)) edge([x, y + 1], [x, y]);
}
const area = points => points.reduce((sum, a, i) => { const b = points[(i + 1) % points.length]; return sum + a[0] * b[1] - b[0] * a[1]; }, 0) / 2;
function simplify(points, tolerance = 1.3) {
  const a = points[0], b = points[points.length - 1];
  let distance = 0, index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i]; const dx = b[0] - a[0], dy = b[1] - a[1];
    const t = dx || dy ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy))) : 0;
    const d = Math.hypot(x - (a[0] + t * dx), y - (a[1] + t * dy));
    if (d > distance) { distance = d; index = i; }
  }
  return distance > tolerance ? [...simplify(points.slice(0, index + 1), tolerance).slice(0, -1), ...simplify(points.slice(index), tolerance)] : [a, b];
}
const loops = [];
while (edges.size) {
  const startKey = edges.keys().next().value;
  const start = startKey.split(",").map(Number); const points = [start]; let key = startKey;
  for (let count = 0; count < 10000; count++) {
    const list = edges.get(key); if (!list?.length) break;
    const next = list.pop(); if (!list.length) edges.delete(key);
    points.push(next); key = next.join(","); if (key === startKey) break;
  }
  if (Math.abs(area(points)) > 30) loops.push(simplify(points).slice(0, -1));
}
function contains(polygon, point) {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j];
    if ((a[1] > point[1]) !== (b[1] > point[1]) && point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) hit = !hit;
  }
  return hit;
}
const outlines = loops.filter(points => area(points) > 0).map(outer => ({ outer, holes: loops.filter(points => area(points) < 0 && contains(outer, points[0])) }));
if (!outlines.length) throw new Error("No usable outline in bitmap alpha channel");
const all = loops.flat(); const minX = Math.min(...all.map(p => p[0])), maxX = Math.max(...all.map(p => p[0]));
const minY = Math.min(...all.map(p => p[1])), maxY = Math.max(...all.map(p => p[1]));
const scale = 3.3 / (maxY - minY);
const normalize = points => points.map(([x, y]) => [Number(((x - (minX + maxX) / 2) * scale).toFixed(4)), Number((-(y - (minY + maxY) / 2) * scale).toFixed(4))]);
const normalized = outlines.map(({ outer, holes }) => ({ outer: normalize(outer), holes: holes.map(normalize) }));
mkdirSync(new URL("../src/components/experience/", import.meta.url), { recursive: true });
writeFileSync(new URL("../src/components/experience/logo-outline.json", import.meta.url), JSON.stringify({ source: "public/logo.png", sourceSha256: createHash("sha256").update(source).digest("hex"), status: "prototype bitmap-derived study; official vector pending", outlines: normalized }, null, 2) + "\n");
const svgPath = loops.map(points => "M" + points.map(p => p.join(" ")).join("L") + "Z").join("");
const transform = `translate(${270 - (minX + maxX) / 2} ${275 - (minY + maxY) / 2})`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 540"><title>Luksuri Reka — studi bentuk</title><desc>Prototype study derived from the existing bitmap; official vector pending.</desc><defs><linearGradient id="metal" x2=".8" y2="1"><stop stop-color="#edf3f4"/><stop offset=".4" stop-color="#bacfd0"/><stop offset=".65" stop-color="#668992"/><stop offset="1" stop-color="#dbe7e5"/></linearGradient><linearGradient id="plate" x2="1" y2="1"><stop stop-color="#173743"/><stop offset="1" stop-color="#0b202d"/></linearGradient><pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="#27404c" stroke-width=".7"/></pattern><path id="mark" fill-rule="evenodd" d="${svgPath}"/></defs><rect width="540" height="540" fill="#081b29"/><rect x="30" y="30" width="480" height="480" fill="url(#grid)" opacity=".5"/><g transform="translate(270 270) rotate(-10) translate(-270 -270)"><rect x="65" y="70" width="410" height="390" rx="3" fill="url(#plate)" stroke="#34515c"/><rect x="88" y="93" width="364" height="344" rx="2" fill="none" stroke="#34515c"/><g transform="${transform}"><use href="#mark" transform="translate(13 16)" fill="#22616a"/><use href="#mark" transform="translate(6 8)" fill="#477780"/><use href="#mark" fill="url(#metal)"/></g></g><path d="M28 270H58M482 270H512" stroke="#67e1de"/><circle cx="28" cy="270" r="3" fill="#67e1de"/><circle cx="512" cy="270" r="3" fill="#67e1de"/></svg>`;
mkdirSync(new URL("../public/experience/", import.meta.url), { recursive: true });
writeFileSync(new URL("../public/experience/identity-poster.svg", import.meta.url), svg);
console.log(JSON.stringify({ outlines: normalized.length, holes: normalized.reduce((n, s) => n + s.holes.length, 0), vertices: normalized.reduce((n, s) => n + s.outer.length + s.holes.reduce((a, h) => a + h.length, 0), 0), status: "Prototype outline and SVG poster generated" }));
