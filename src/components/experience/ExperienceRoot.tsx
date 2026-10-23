"use client";

import dynamic from "next/dynamic";
import { Component, createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { text, type Locale } from "@/lib/site-content";
import { changeEffectChoice, clamp, compositionPresented, experiencePolicy, localInspectionAllowed, parseEffectPreference, selectVisibleStage, type EffectChoice, type EffectPreference, type ExperienceSignals, type ExperienceStage, type StudioState } from "@/lib/experience";

const StudioCanvas = dynamic(() => import("./StudioCanvas"), { ssr: false });
const ExperienceDiagnostics = dynamic(() => import("./ExperienceDiagnostics"), { ssr: false });
let rememberedChoice: EffectChoice = { preference: "auto", resume: "auto" };
const initialSignals: ExperienceSignals = { enabled: true, preference: "auto", reducedMotion: false, saveData: false, slowNetwork: false, coarsePointer: false, webgl: false, failed: false, degraded: false };

type EffectContextValue = {
  preference: EffectPreference;
  choose: (preference: EffectPreference) => void;
  togglePause: () => void;
  mode: ReturnType<typeof experiencePolicy>["mode"];
  reason: ReturnType<typeof experiencePolicy>["reason"];
  initialized: boolean;
};
const EffectContext = createContext<EffectContextValue | null>(null);

class CanvasBoundary extends Component<{ onFailure: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

type NetworkHints = { saveData?: boolean; effectiveType?: string; addEventListener?: (name: string, callback: () => void) => void; removeEventListener?: (name: string, callback: () => void) => void };

export default function ExperienceRoot({ locale, children }: { locale: Locale; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement | null>(null);
  const studio = useRef<StudioState>({ stage: "identity", focus: -1, pointer: { x: 0, y: 0 }, progress: 0, visible: false, reduced: false });
  const [signals, setSignals] = useState(initialSignals);
  const [initialized, setInitialized] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [renderedStage, setRenderedStage] = useState<ExperienceStage | null>(null);
  const [inspect, setInspect] = useState(false);
  const measured = useRef(false);
  const policy = experiencePolicy(signals);
  const animated = policy.mode === "full" || policy.mode === "light";

  const fail = useCallback(() => { setReady(false); setRenderedStage(null); setSignals(current => ({ ...current, failed: true })); }, []);
  const degrade = useCallback(() => { setSignals(current => ({ ...current, degraded: true })); }, []);
  const onReady = useCallback((stage: ExperienceStage) => {
    setReady(true);
    setRenderedStage(stage);
    if (!measured.current) {
      measured.current = true;
      performance.mark("lr:experience:first-frame");
      if (performance.getEntriesByName("lr:experience:request").length) performance.measure("lr:experience:initialization", "lr:experience:request", "lr:experience:first-frame");
    }
  }, []);
  const choose = useCallback((preference: EffectPreference) => {
    rememberedChoice = changeEffectChoice(rememberedChoice, preference);
    setSignals(current => ({ ...current, preference }));
  }, []);
  const togglePause = useCallback(() => {
    choose(rememberedChoice.preference === "still" ? rememberedChoice.resume : "still");
  }, [choose]);

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const requested = parseEffectPreference(params.get("effects"));
    if (requested) rememberedChoice = changeEffectChoice(rememberedChoice, requested);
    setInspect(localInspectionAllowed(window.location.hostname, params.get("inspect")));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const connection = (navigator as Navigator & { connection?: NetworkHints }).connection;
    const update = () => setSignals(current => ({ ...current, preference: rememberedChoice.preference, reducedMotion: motion.matches, coarsePointer: coarse.matches, saveData: Boolean(connection?.saveData), slowNetwork: connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g", webgl: typeof window.WebGL2RenderingContext !== "undefined" }));
    update(); setInitialized(true);
    motion.addEventListener("change", update); coarse.addEventListener("change", update); connection?.addEventListener?.("change", update);
    return () => { motion.removeEventListener("change", update); coarse.removeEventListener("change", update); connection?.removeEventListener?.("change", update); };
  }, []);

  useEffect(() => {
    if (!initialized || !animated) { setEligible(false); setReady(false); setRenderedStage(null); measured.current = false; return; }
    if (eligible || !active) return;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let idle: number | undefined;
    const enable = () => { performance.mark("lr:experience:request"); setEligible(true); };
    // Give HTML, font/layout work, and the static composition priority.
    if ("requestIdleCallback" in window) idle = window.requestIdleCallback(enable, { timeout: 1800 });
    else timeout = setTimeout(enable, 700);
    return () => { if (idle !== undefined) window.cancelIdleCallback(idle); if (timeout !== undefined) clearTimeout(timeout); };
  }, [initialized, animated, active, eligible]);

  useEffect(() => {
    if (!eligible || !animated || ready || !active) return;
    const timeout = setTimeout(fail, 12000);
    return () => clearTimeout(timeout);
  }, [eligible, animated, ready, active, fail]);

  useEffect(() => {
    studio.current.reduced = policy.mode === "light";
    studio.current.invalidate?.();
    if (policy.mode !== "full") studio.current.pointer = { x: 0, y: 0 };
    if (initialized) window.dispatchEvent(new CustomEvent("luksuri:experience", { detail: { event: "mode", mode: policy.mode, reason: policy.reason } }));
  }, [policy.mode, policy.reason, initialized, animated]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const frames = [...element.querySelectorAll<HTMLElement>("[data-lr-stage]")];
    let pending = 0;
    let lastActive = false;
    const update = () => {
      pending = 0;
      const candidates = frames.map(node => ({ node, rect: node.getBoundingClientRect() }));
      const visible = document.hidden ? undefined : selectVisibleStage(candidates, window.innerHeight);
      if (panel.current !== visible?.node) {
        panel.current?.removeAttribute("data-rendered");
        panel.current = visible?.node ?? null;
      }
      const showing = Boolean(visible) && !document.hidden;
      studio.current.visible = showing;
      if (showing !== lastActive) { lastActive = showing; setActive(showing); }
      if (visible && layer.current) {
        const { rect, node } = visible;
        studio.current.stage = node.dataset.lrStage as ExperienceStage;
        studio.current.progress = clamp((window.innerHeight / 2 - rect.top) / rect.height, 0, 1);
        layer.current.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
        layer.current.style.width = `${rect.width}px`;
        layer.current.style.height = `${rect.height}px`;
        const presented = animated && compositionPresented(studio.current.stage, renderedStage, ready);
        if (presented) node.dataset.rendered = "true";
        else node.removeAttribute("data-rendered");
        layer.current.style.visibility = presented ? "visible" : "hidden";
      } else if (layer.current) layer.current.style.visibility = "hidden";
      studio.current.invalidate?.();
    };
    const schedule = () => { if (!pending) pending = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(schedule, { threshold: [0, .08, .25, .5, .75, 1] });
    const resize = new ResizeObserver(schedule);
    frames.forEach(frame => { observer.observe(frame); resize.observe(frame); });
    const resetFocus = () => {
      const focused = document.activeElement?.closest<HTMLElement>("[data-lr-solution-index]");
      studio.current.focus = focused ? Number(focused.dataset.lrSolutionIndex) : -1;
      studio.current.invalidate?.();
    };
    const focus = (event: Event) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-lr-solution-index]") : null;
      if (link) { studio.current.focus = Number(link.dataset.lrSolutionIndex); studio.current.invalidate?.(); }
    };
    const focusOut = () => queueMicrotask(resetFocus);
    const pointerOut = (event: PointerEvent) => {
      const from = event.target instanceof Element ? event.target.closest("[data-lr-solution-index]") : null;
      const to = event.relatedTarget instanceof Element ? event.relatedTarget.closest("[data-lr-solution-index]") : null;
      if (from && from !== to) resetFocus();
    };
    const pointer = (event: PointerEvent) => {
      if (policy.mode !== "full" || !panel.current) return;
      const rect = panel.current.getBoundingClientRect();
      const overControl = event.target instanceof Element && Boolean(event.target.closest("a,button,select,input,textarea,.lr-local-inspection"));
      const inside = !overControl && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      const next = inside ? { x: clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1), y: clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1) } : { x: 0, y: 0 };
      if (next.x === studio.current.pointer.x && next.y === studio.current.pointer.y) return;
      studio.current.pointer = next;
      studio.current.invalidate?.();
    };
    window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule); window.addEventListener("pageshow", schedule);
    document.addEventListener("visibilitychange", schedule); window.addEventListener("pointermove", pointer, { passive: true });
    element.addEventListener("pointerover", focus); element.addEventListener("pointerout", pointerOut); element.addEventListener("focusin", focus); element.addEventListener("pointerleave", resetFocus); element.addEventListener("focusout", focusOut);
    update();
    return () => {
      if (pending) cancelAnimationFrame(pending); observer.disconnect(); resize.disconnect();
      frames.forEach(frame => frame.removeAttribute("data-rendered"));
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); window.removeEventListener("pageshow", schedule);
      document.removeEventListener("visibilitychange", schedule); window.removeEventListener("pointermove", pointer);
      element.removeEventListener("pointerover", focus); element.removeEventListener("pointerout", pointerOut); element.removeEventListener("focusin", focus); element.removeEventListener("pointerleave", resetFocus); element.removeEventListener("focusout", focusOut);
    };
  }, [children, locale, ready, renderedStage, animated, policy.mode]);

  const palette = { ink: "#081b29", pearl: "#edf3f4", surface: "#102633", cyan: "#67e1de", muted: "#a5b5bf" };
  const [colors, setColors] = useState(palette);
  useEffect(() => {
    const foundation = root.current?.closest(".lr-foundation"); if (!foundation) return;
    const styles = getComputedStyle(foundation);
    setColors({ ink: styles.getPropertyValue("--lr-ink").trim(), pearl: styles.getPropertyValue("--lr-pearl").trim(), surface: styles.getPropertyValue("--lr-surface").trim(), cyan: styles.getPropertyValue("--lr-cyan").trim(), muted: styles.getPropertyValue("--lr-muted").trim() });
  }, []);

  return <EffectContext.Provider value={{ preference: signals.preference, choose, togglePause, mode: policy.mode, reason: policy.reason, initialized }}>
    <div ref={root} className="lr-experience" data-experience-mode={initialized ? policy.mode : "basic"} data-experience-reason={initialized ? policy.reason : "initial"} data-client-ready={initialized ? "true" : "false"}>
      {children}
      <div ref={layer} className="lr-canvas-layer" aria-hidden="true" data-canvas-ready={ready ? "true" : "false"}>
        {eligible && animated && <CanvasBoundary onFailure={fail}><StudioCanvas state={studio} active={active} mode={policy.mode} palette={colors} inspect={inspect} onReady={onReady} onFailure={fail} onSlow={degrade} /></CanvasBoundary>}
      </div>
      {inspect && <ExperienceDiagnostics state={studio} mode={policy.mode} reason={policy.reason} renderedStage={renderedStage} />}
    </div>
  </EffectContext.Provider>;
}

export function ExperienceControls({ locale }: { locale: Locale }) {
  const context = useContext(EffectContext);
  if (!context) return null;
  const { preference, choose, togglePause, mode, reason } = context;
  const canAnimate = mode === "full" || mode === "light";
  const canResume = preference === "still" && reason === "preference";
  return <div className="lr-effect-controls"><div><label>{text(locale, "Efek visual", "Visual effects")}<select aria-label={text(locale, "Pilih efek visual", "Choose visual effects")} value={preference} onChange={event => choose(event.target.value as EffectPreference)}><option value="auto">{text(locale, "Otomatis", "Automatic")}</option><option value="light">{text(locale, "Ringan", "Light")}</option><option value="still">{text(locale, "Tanpa gerak", "Still")}</option></select></label></div>{(canAnimate || canResume) && <button type="button" onClick={togglePause}>{canAnimate ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}{canAnimate ? text(locale, "Jeda efek", "Pause effects") : text(locale, "Lanjutkan efek", "Resume effects")}</button>}<p role="status">{mode === "basic" || mode === "still" ? text(locale, "Komposisi statis aktif.", "Static composition active.") : text(locale, "Pilih pengalaman yang nyaman untuk Anda.", "Choose the experience that feels right for you.")}</p></div>;
}
