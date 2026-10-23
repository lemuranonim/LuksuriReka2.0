import assert from "node:assert/strict";
import { foundationModule } from "./foundation-modules.mjs";

const { routes, SITE_URL } = foundationModule("site-content");
const origin = new URL(process.env.FOUNDATION_TEST_URL ?? "http://127.0.0.1:3000");
assert.ok(["127.0.0.1", "localhost"].includes(origin.hostname), "Run this check against a local preview");
const pages = [];
for (const [page, localized] of Object.entries(routes)) for (const locale of ["id", "en"]) pages.push({ page, locale, path: localized[locale] });
const publicPaths = new Set(pages.map(page => page.path));
let linksChecked = 0;
const read = path => fetch(new URL(path, origin), { signal: AbortSignal.timeout(30000), redirect: "manual" });

for (let i = 0; i < pages.length; i += 4) {
  const results = await Promise.allSettled(pages.slice(i, i + 4).map(async ({ locale, path, page }) => {
    const response = await read(path);
    assert.equal(response.status, 200, `${path} status`);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.ok(response.headers.get("content-security-policy")?.includes("object-src 'none'"));
    const html = await response.text();
    // Read rendered markup, excluding embedded scripts containing duplicated RSC text.
    const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    assert.ok(markup.includes(`<html lang="${locale}"`), `${path} html locale`);
    assert.equal((markup.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${path} one H1`);
    const canonical = markup.match(/rel="canonical" href="([^\"]+)"/)?.[1];
    assert.equal(new URL(canonical).href, new URL(path, SITE_URL).href, `${path} canonical`);
    for (const lang of ["id", "en"]) {
      const alternate = markup.match(new RegExp(`hrefLang="${lang}" href="([^\"]+)"`))?.[1];
      assert.equal(new URL(alternate).href, new URL(routes[page][lang], SITE_URL).href, `${path} hreflang ${lang}`);
    }
    assert.doesNotMatch(markup, /\[ISI\]|lorem ipsum|Ruang Reka|<canvas/i, `${path} placeholders / runtime canvas`);
    for (const match of markup.matchAll(/<a\b[^>]*href="([^\"]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&");
      const destination = new URL(href, origin);
      if (destination.origin !== origin.origin) continue;
      assert.ok(publicPaths.has(destination.pathname), `${path} unpublished link ${destination.pathname}`);
      if (destination.hash && destination.pathname === path) assert.ok(markup.includes(`id="${decodeURIComponent(destination.hash.slice(1))}"`), `${path} missing anchor ${destination.hash}`);
      linksChecked++;
    }
  }));
  const failures = results.filter(result => result.status === "rejected");
  if (failures.length) throw new AggregateError(failures.map(result => result.reason), "Public route checks failed");
}
console.log(`PASS: ${pages.length} localized pages, metadata, CSP, headings, ${linksChecked} internal links`);

for (const [path, destination, status] of [["/?section=portfolio", "/studio", 307], ["/?section=about", "/studio", 307], ["/?section=casestudy", "/karya", 307], ["/?section=services", "/solusi", 307], ["/?action=contact", "/kontak", 307], ["/help", "/bantuan", 308]]) {
  const response = await read(path);
  assert.equal(response.status, status, `${path} redirect status`);
  assert.equal(new URL(response.headers.get("location"), origin).pathname, destination);
}
console.log("PASS: six legacy entry points redirect to the intended public pages");

for (const [path, locale] of [["/missing-page", "id"], ["/en/missing-page", "en"], ["/missing.png", "id"]]) {
  const response = await read(path);
  const html = await response.text();
  assert.equal(response.status, 404);
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.ok(markup.includes(`<html lang="${locale}"`), `${path} localized document`);
  assert.ok(markup.includes("<h1>"), `${path} heading before JavaScript`);
  assert.ok(markup.includes('content="noindex'), `${path} noindex`);
}
for (const path of ["/kontak?need=operations", "/en/contact?need=integration", "/kontak?need=invalid"]) {
  const response = await read(path);
  const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.equal(response.status, 200);
  const checked = [...html.matchAll(/<input\b[^>]*checked[^>]*>/g)];
  assert.equal(checked.length, path.endsWith("invalid") ? 0 : 1, `${path} contextual selection`);
}
console.log("PASS: localized 404s and validated Composer preselection");

for (const path of ["/compfeeds-project-report", "/got-fet-proposal", "/maintenance-proposal", "/qa-budget", "/qa-plant-lab-proposal", "/qa-proposal", "/rsud-website-proposal", "/wa-integration-proposal", "/warehouse-quotation"]) {
  const response = await read(path);
  assert.equal(response.status, 200, `${path} legacy page`);
}
const sitemap = await (await read("/sitemap.xml")).text();
assert.equal((sitemap.match(/<loc>/g) ?? []).length, pages.length);
assert.doesNotMatch(sitemap, /proposal|quotation|report|qa-budget/);
const robots = await (await read("/robots.txt")).text();
assert.ok(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
const og = await read("/opengraph-image");
assert.equal(og.status, 200);
assert.ok(og.headers.get("content-type")?.includes("image/png"));
assert.deepEqual([...new Uint8Array(await og.arrayBuffer()).slice(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
console.log("PASS: nine legacy reports, sitemap, robots, and generated sharing image");
