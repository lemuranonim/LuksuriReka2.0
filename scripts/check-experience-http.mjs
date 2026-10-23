import assert from "node:assert/strict";

const base = new URL(process.env.FOUNDATION_TEST_URL || "http://127.0.0.1:3001");
if (!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) throw new Error("Experience HTTP checks require a localhost URL.");
for (const [path, caption] of [["/", "SKEMA ALUR · Dari konteks pengguna"], ["/en", "WORKFLOW DIAGRAM · From user context"]]) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200);
  const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.match(html, /data-experience-mode="basic"/, "The test must target the experience profile.");
  for (const kind of ["identity", "solutions", "work"]) {
    const poster = html.match(new RegExp(`<svg[^>]*data-lr-poster="${kind}"[^>]*>([\\s\\S]*?)<\\/svg>`));
    assert.ok(poster?.[1].includes("<path"), `${path}: ${kind} artwork must be in the server HTML.`);
    assert.ok(!/href="(?!#)/.test(poster[1]), "Inline artwork must not need an external image.");
  }
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: SVG and form IDs must remain unique.`);
  assert.ok(html.includes(caption), `${path}: honest visitor-facing diagram caption.`);
  assert.ok(!html.includes("/experience/identity-poster.svg"), "Poster must not depend on a network image.");
  assert.ok(!html.includes("<canvas"), "Canvas is not part of server HTML.");
  for (const copy of ["STUDI PENGALAMAN", "EXPERIENCE STUDY", "Tampilan produk asli menyusul", "Original product screens follow"]) assert.ok(!html.includes(copy));
}
console.log("PASS: ID/EN server HTML includes all three native SVG compositions, unique IDs, honest captions, and no external poster or Canvas dependency.");
