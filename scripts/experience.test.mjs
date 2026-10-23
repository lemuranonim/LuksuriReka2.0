import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { foundationModule } from "./foundation-modules.mjs";

const { assemblyReveal, changeEffectChoice, compositionPresented, experienceEnabled, experiencePolicy, localInspectionAllowed, parseEffectPreference, stageVisibility, selectVisibleStage } = foundationModule("experience");
const { pageMeta, routes } = foundationModule("site-content");
const { navigationIntent, scrollEase } = foundationModule("site-motion");
const { solutionTimeline, solutionPose, solutionRoute, tracedRoute, pointOnRoute } = foundationModule("solution-motion");
const capable = { enabled: true, preference: "auto", reducedMotion: false, saveData: false, slowNetwork: false, coarsePointer: false, webgl: true, failed: false, degraded: false };

test("solution assembly connects before its finite signal pass and settles in both modes", () => {
  for (const light of [false, true]) {
    assert.deepEqual(solutionTimeline(0, light).reveals, [0, 0, 0]);
    const connecting = solutionTimeline((light ? .65 : 1) * .65, light);
    assert.ok(connecting.reveals[0] > connecting.reveals[2]);
    assert.equal(connecting.flow, 0);
    const flowing = solutionTimeline((light ? .65 : 1) * 1.5, light);
    assert.deepEqual(flowing.connections, [1, 1]);
    assert.ok(flowing.flow > 0 && flowing.flow < 1);
    const settled = solutionTimeline(light ? 1.3 : 2, light);
    assert.deepEqual(settled.reveals, [1, 1, 1]);
    assert.equal(settled.flow, 1);
    assert.equal(settled.settled, true);
  }
});

test("solution cards enter monotonically and sockets follow every focused pose", () => {
  for (const light of [false, true]) for (const index of [0, 1, 2]) {
    let previousY = -Infinity;
    for (let step = 0; step <= 100; step++) {
      const pose = solutionPose(index, step / 100, 0, .5, light);
      assert.ok(pose.position[1] >= previousY);
      previousY = pose.position[1];
    }
    for (const focus of [0, .25, 1]) {
      const pose = solutionPose(index, 1, focus, 1, light);
      assert.ok(Math.abs(pose.port[0] - pose.position[0] - Math.sin(pose.yaw) * .2) < 1e-12);
      assert.equal(pose.port[1], pose.position[1] - .775);
      assert.ok(pose.port.every(Number.isFinite));
    }
  }
});

test("drawn cables preserve their moving sockets and never stretch the entire route", () => {
  for (const light of [false, true]) for (const focus of [0, 1, 2]) {
    const poses = [0, 1, 2].map(index => solutionPose(index, 1, index === focus ? 1 : 0, .5, light));
    for (const index of [0, 1]) {
      const route = solutionRoute(poses[index], poses[index + 1]);
      assert.deepEqual(route[0], poses[index].port);
      assert.deepEqual(route.at(-1), poses[index + 1].port);
      assert.ok(tracedRoute(route, 0).every(segment => segment.length === 0));
      const complete = tracedRoute(route, 1);
      assert.deepEqual(complete[0].start, route[0]);
      for (let axis = 0; axis < 3; axis++) assert.ok(Math.abs(complete.at(-1).end[axis] - route.at(-1)[axis]) < 1e-12);
      assert.deepEqual(pointOnRoute(route, 0), route[0]);
      for (const t of [.1, .5, .9]) assert.ok(pointOnRoute(route, t).every(Number.isFinite));
    }
  }
});

test("studio navigation preserves localized pages, query preselection, and cross-page anchors", () => {
  const current = "https://www.luksurireka.com/produk";
  assert.deepEqual(navigationIntent("/kontak?need=operations", current), { kind: "route", href: "/kontak?need=operations", key: "/kontak?need=operations" });
  assert.deepEqual(navigationIntent("/en/products", current), { kind: "route", href: "/en/products", key: "/en/products" });
  assert.deepEqual(navigationIntent("/#solusi", current), { kind: "route", href: "/#solusi", key: "/" });
  assert.deepEqual(navigationIntent("/solusi/", current), { kind: "route", href: "/solusi", key: "/solusi" });
  assert.equal(navigationIntent("/kontak?note=hello%20world", current).key, "/kontak?note=hello+world");
});

test("only ordinary public same-origin links receive page transitions", () => {
  const current = "https://www.luksurireka.com/";
  for (const href of ["", "https://sign.luksurireka.com", "//example.com/karya", "mailto:hello@luksurireka.com", "javascript:alert(1)", "data:text/html,x", "/qa-proposal", "/missing"]) assert.equal(navigationIntent(href, current), null);
  for (const options of [{ modified: true }, { download: true }, { target: "_blank" }, { target: "report" }, { skip: true }]) assert.equal(navigationIntent("/produk", current, options), null);
  assert.equal(navigationIntent("/produk", current, { target: "_self" }).kind, "route");
});

test("same-page navigation scrolls while the accessibility skip link remains native", () => {
  const current = "https://www.luksurireka.com/";
  assert.deepEqual(navigationIntent("#kebutuhan", current), { kind: "anchor", hash: "#kebutuhan" });
  assert.deepEqual(navigationIntent("/", current + "#kebutuhan"), { kind: "top" });
  assert.equal(navigationIntent("#main", current), null);
  assert.deepEqual(navigationIntent("#mulai", "https://www.luksurireka.com/kontak?note=hello%20world"), { kind: "anchor", hash: "#mulai" });
});

test("short scrolling reaches its destination monotonically without overshoot", () => {
  assert.equal(scrollEase(-1), 0);
  assert.equal(scrollEase(0), 0);
  assert.equal(scrollEase(1), 1);
  assert.equal(scrollEase(2), 1);
  let previous = 0;
  for (let time = 0; time <= 1; time += .01) {
    const next = scrollEase(time);
    assert.ok(next >= previous && next <= 1);
    previous = next;
  }
  assert.ok(scrollEase(.5) > .5);
});

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
