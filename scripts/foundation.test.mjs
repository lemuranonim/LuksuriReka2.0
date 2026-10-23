import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { foundationModule } from "./foundation-modules.mjs";

const { routes, resolveRoute, CONTACT, cases, solutions } = foundationModule("site-content");
const { emptyBrief, toggleNeed, briefRecommendations, briefSections, buildBrief, contactLinks } = foundationModule("composer");
const { trackSiteEvent } = foundationModule("site-analytics");

test("published routes have unique, reciprocal ID and EN destinations", () => {
  const paths = new Set();
  for (const [page, localized] of Object.entries(routes)) {
    for (const locale of ["id", "en"]) {
      const path = localized[locale];
      assert.ok(!paths.has(path), `Duplicate route ${path}`);
      paths.add(path);
      assert.ok(existsSync(new URL(`../src/app${path === "/" ? "" : path}/page.tsx`, import.meta.url)), `Missing page entry ${path}`);
      assert.deepEqual(resolveRoute(path), { page, locale });
      if (path !== "/") assert.deepEqual(resolveRoute(`${path}/`), { page, locale });
      assert.equal(locale === "en", /^\/en(?:\/|$)/.test(path));
    }
  }
  assert.equal(paths.size, 28);
  for (const path of ["/en/karya", "/solusi/unknown", "/en/work/missing", "/karya/kroscekapps/extra", "/missing"]) assert.equal(resolveRoute(path), null);
});

test("work and solution links point to published content in both languages", () => {
  for (const solution of solutions) {
    for (const related of solution.related) assert.ok(cases.some(study => study.key === related));
    for (const locale of ["id", "en"]) {
      assert.ok(solution.questions[locale].length);
      assert.ok(solution.scope[locale].length);
    }
  }
  for (const study of cases) for (const locale of ["id", "en"]) {
    assert.ok(routes[study.key][locale]);
    assert.equal(study.steps[locale].length, 3);
    assert.ok(study.context[locale] && study.role[locale] && study.outcome[locale]);
  }
});

test("multiple needs combine; unsure is exclusive and selections can be removed", () => {
  let needs = toggleNeed([], "website");
  needs = toggleNeed(needs, "operations");
  assert.deepEqual(needs, ["website", "operations"]);
  assert.deepEqual(toggleNeed(needs, "website"), ["operations"]);
  assert.deepEqual(toggleNeed(needs, "unsure"), ["unsure"]);
  assert.deepEqual(toggleNeed(["unsure"], "integration"), ["integration"]);
  assert.deepEqual(toggleNeed(["unsure"], "unsure"), []);
});

test("skipped context stays unknown and does not invent client facts", () => {
  for (const locale of ["id", "en"]) {
    const brief = { ...emptyBrief, needs: ["unsure"] };
    const sections = briefSections(brief, locale);
    assert.equal((sections.answers.match(new RegExp(locale === "id" ? "Belum dijelaskan" : "Not specified", "g")) ?? []).length, 4);
    assert.ok(sections.directions && sections.questions);
    assert.equal(briefRecommendations(brief, locale).length, 1);
  }
});

test("field and existing systems add questions without committing to offline features", () => {
  const baseline = { ...emptyBrief, needs: ["operations"] };
  assert.equal(briefRecommendations(baseline, "id").length, 1);
  const withContext = briefRecommendations({ ...baseline, place: "field", existing: "yes" }, "id");
  assert.equal(withContext.length, 3);
  assert.match(withContext[1].question, /sinyal/);
  assert.match(withContext[2].question, /akses/);
  assert.doesNotMatch(withContext.map(item => item.reason).join(" "), /pasti|wajib offline|otomatis offline/i);
});

test("drafts preserve client text, Unicode, line breaks, and reserved URL characters", () => {
  const goal = "Toko A&B + gudang? #1 / üji 🚀\nBaris kedua = 50%";
  for (const locale of ["id", "en"]) {
    const summary = buildBrief({ ...emptyBrief, needs: ["website", "integration"], goal }, locale);
    assert.ok(summary.includes(goal));
    assert.match(summary, locale === "id" ? /bukan penawaran.*komitmen fitur/ : /not a quote.*feature commitment/);
    const links = contactLinks(summary, locale);
    const whatsapp = new URL(links.whatsapp);
    const email = new URL(links.email);
    assert.equal(whatsapp.hostname, "wa.me");
    assert.equal(whatsapp.pathname, `/${CONTACT.whatsapp}`);
    assert.equal(whatsapp.searchParams.get("text"), summary);
    assert.equal(email.pathname, CONTACT.email);
    assert.equal(email.searchParams.get("body"), summary);
    assert.ok(email.searchParams.get("subject").includes("Luksuri Reka"));
  }
});

test("event adapter is safe on the server and drops free text and draft URLs", () => {
  assert.doesNotThrow(() => trackSiteEvent("composer_start"));
  const events = [];
  const oldWindow = globalThis.window;
  globalThis.window = { dispatchEvent: event => events.push(event.detail) };
  try {
    trackSiteEvent("composer_summary_generated", { needs_count: 900, placement: "content", goal: "private", url: "mailto:test?body=private" });
    assert.deepEqual(events[0], { name: "composer_summary_generated", placement: "content", needs_count: 4 });
    trackSiteEvent("cta_click", { target: "private text", placement: "private text", needs_count: NaN });
    assert.deepEqual(events[1], { name: "cta_click" });
  } finally {
    if (oldWindow === undefined) delete globalThis.window;
    else globalThis.window = oldWindow;
  }
});

test("primary text and Composer controls meet their basic contrast targets", () => {
  const css = readFileSync(new URL("../src/app/foundation.css", import.meta.url), "utf8");
  const declarations = block => Object.fromEntries([...block.matchAll(/([\w-]+):\s*(#[0-9a-f]{3}(?:[0-9a-f]{3})?)/gi)].map(match => [match[1], match[2]]));
  const dark = declarations(css.match(/\.lr-foundation \{([^}]+)\}/)[1]);
  const light = declarations(css.match(/\.lr-light \{([^}]+)\}/)[1]);
  const luminance = color => {
    if (color.length === 4) color = `#${color.slice(1).split("").map(value => value + value).join("")}`;
    const [r, g, b] = color.slice(1).match(/../g).map(part => {
      const channel = parseInt(part, 16) / 255;
      return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    });
    return .2126 * r + .7152 * g + .0722 * b;
  };
  const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
  for (const [foreground, background] of [
    [dark["--lr-pearl"], dark["--lr-ink"]], [dark["--lr-muted"], dark["--lr-ink"]],
    [dark["--lr-accent-ink"], dark["--lr-cyan"]], [light["--lr-muted"], light.background],
    [light["--lr-pearl"], light.background], [light["--lr-accent-ink"], light["--lr-cyan"]],
  ]) assert.ok(contrast(foreground, background) >= 4.5, `${foreground} on ${background}`);
  const field = css.match(/\.lr-field textarea, \.lr-field select, \.lr-brief-summary textarea \{([^}]+)\}/)[1];
  const fieldBorder = field.match(/border: 1px solid (#[0-9a-f]{6})/)[1];
  const fieldBackground = field.match(/background: (#[0-9a-f]{6})/)[1];
  assert.ok(contrast(fieldBorder, fieldBackground) >= 3);
  const checkboxBorder = css.match(/\.lr-checkbox-visual \{[^}]+border: 1px solid (#[0-9a-f]{6})/)[1];
  assert.ok(contrast(checkboxBorder, dark["--lr-surface"]) >= 3);
});
