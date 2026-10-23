import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { foundationModule } from "./foundation-modules.mjs";

const { assemblyReveal, changeEffectChoice, compositionPresented, experienceEnabled, experiencePolicy, localInspectionAllowed, parseEffectPreference, stageVisibility, selectVisibleStage } = foundationModule("experience");
const { pageMeta, routes } = foundationModule("site-content");
const capable = { enabled: true, preference: "auto", reducedMotion: false, saveData: false, slowNetwork: false, coarsePointer: false, webgl: true, failed: false, degraded: false };

test("assembly is bounded, staggered, and finishes without requiring idle frames", () => {
  for (const light of [false, true]) {
    for (const index of [0, 1, 2]) {
      assert.equal(assemblyReveal(-1, index, light), 0);
      assert.equal(assemblyReveal(0, index, light), 0);
      assert.equal(assemblyReveal(1.5, index, light), 1);
      let previous = 0;
      for (let elapsed = 0; elapsed < 2; elapsed += .01) {
        const value = assemblyReveal(elapsed, index, light);
        assert.ok(value >= previous && value <= 1);
        previous = value;
      }
    }
    assert.ok(assemblyReveal(.3, 0, light) > assemblyReveal(.3, 2, light));
  }
  assert.equal(assemblyReveal(.7, 2, true), 1);
  assert.ok(assemblyReveal(.7, 2, false) < 1);
});

test("production enables Level 2 by default and supports an explicit foundation rollback", () => {
  assert.equal(experienceEnabled(undefined), true);
  assert.equal(experienceEnabled("1"), true);
  assert.equal(experienceEnabled("0"), false);
});

test("shareable preview preferences accept only the public effect choices", () => {
  for (const preference of ["auto", "light", "still"]) assert.equal(parseEffectPreference(preference), preference);
  for (const value of ["", null, undefined, "full", "unknown", "<script>"]) assert.equal(parseEffectPreference(value), undefined);
});

test("pausing retains the previous animated preference for resume", () => {
  let choice = changeEffectChoice({ preference: "auto", resume: "auto" }, "light");
  choice = changeEffectChoice(choice, "still");
  assert.deepEqual(choice, { preference: "still", resume: "light" });
  assert.deepEqual(changeEffectChoice(choice, choice.resume), { preference: "light", resume: "light" });
  choice = changeEffectChoice(choice, "auto");
  assert.equal(changeEffectChoice(choice, "still").resume, "auto");
});

test("a composition is shown only after the matching rendered frame", () => {
  for (const stage of ["identity", "solutions", "work"]) {
    assert.equal(compositionPresented(stage, null, true), false);
    assert.equal(compositionPresented(stage, stage, false), false);
    assert.equal(compositionPresented(stage, stage, true), true);
  }
  assert.equal(compositionPresented("work", "identity", true), false);
});

test("inspection controls require an explicit local URL", () => {
  for (const host of ["localhost", "127.0.0.1", "[::1]"]) assert.equal(localInspectionAllowed(host, "1"), true);
  for (const host of ["luksurireka.com", "localhost.example.com", "127.0.0.2", ""]) assert.equal(localInspectionAllowed(host, "1"), false);
  for (const value of [null, "", "true"]) assert.equal(localInspectionAllowed("localhost", value), false);
});

test("the automatic mode uses full or light without overriding the user's lower-motion choice", () => {
  assert.deepEqual(experiencePolicy(capable), { mode: "full", reason: "automatic" });
  assert.deepEqual(experiencePolicy({ ...capable, coarsePointer: true }), { mode: "light", reason: "touch-device" });
  assert.deepEqual(experiencePolicy({ ...capable, degraded: true }), { mode: "light", reason: "performance" });
  assert.deepEqual(experiencePolicy({ ...capable, preference: "light" }), { mode: "light", reason: "preference" });
  assert.deepEqual(experiencePolicy({ ...capable, preference: "still", degraded: true }), { mode: "still", reason: "preference" });
});

test("reduced motion, save data, and slow connections select still before any 3D eligibility", () => {
  for (const reason of ["reducedMotion", "saveData", "slowNetwork"]) {
    for (const preference of ["auto", "light"]) assert.equal(experiencePolicy({ ...capable, [reason]: true, preference }).mode, "still");
  }
  assert.equal(experiencePolicy({ ...capable, reducedMotion: true, webgl: false }).mode, "still");
});

test("unavailable, failed, and disabled experiences preserve a basic fallback", () => {
  assert.deepEqual(experiencePolicy({ ...capable, enabled: false }), { mode: "basic", reason: "disabled" });
  assert.deepEqual(experiencePolicy({ ...capable, webgl: false }), { mode: "basic", reason: "unavailable" });
  assert.deepEqual(experiencePolicy({ ...capable, failed: true }), { mode: "basic", reason: "failure" });
});

test("the active studio follows the visible section after direct jumps and reverse scrolling", () => {
  const frame = (name, top, height = 420) => ({ name, rect: { top, left: 0, width: 500, height } });
  assert.equal(selectVisibleStage([frame("identity", 100), frame("solutions", 2000), frame("work", 3500)], 800).name, "identity");
  assert.equal(selectVisibleStage([frame("identity", -3300), frame("solutions", -1500), frame("work", 120)], 800).name, "work");
  assert.equal(selectVisibleStage([frame("identity", -1500), frame("solutions", 150), frame("work", 1700)], 800).name, "solutions");
  assert.equal(selectVisibleStage([frame("identity", -1000), frame("solutions", 1000)], 800), undefined);
  assert.equal(stageVisibility(frame("x", 0, 0).rect, 800), 0);
  assert.equal(stageVisibility(frame("x", 0).rect, 0), 0);
});

test("prototype outline is traceable to the bitmap, closed usable contours retain their holes", () => {
  const outline = JSON.parse(readFileSync(new URL("../src/components/experience/logo-outline.json", import.meta.url), "utf8"));
  const source = readFileSync(new URL("../public/logo.png", import.meta.url));
  assert.equal(outline.sourceSha256, createHash("sha256").update(source).digest("hex"));
  assert.match(outline.status, /prototype.*official vector pending/);
  assert.equal(outline.outlines.length, 2);
  assert.equal(outline.outlines.reduce((n, part) => n + part.holes.length, 0), 2);
  for (const shape of outline.outlines) for (const points of [shape.outer, ...shape.holes]) {
    assert.ok(points.length >= 3);
    assert.ok(points.every(point => point.length === 2 && point.every(Number.isFinite)));
  }
});

test("all public page descriptions are distinct within each language", () => {
  for (const locale of ["id", "en"]) {
    const descriptions = Object.keys(routes).map(page => pageMeta(page, locale).description);
    assert.ok(descriptions.every(description => description?.length >= 60));
    assert.equal(new Set(descriptions).size, descriptions.length);
  }
});
