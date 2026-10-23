export type ExperienceMode = "full" | "light" | "still" | "basic";
export type EffectPreference = "auto" | "light" | "still";
export type ExperienceStage = "identity" | "solutions" | "work";
export type ExperienceReason = "automatic" | "preference" | "reduced-motion" | "save-data" | "slow-network" | "touch-device" | "performance" | "unavailable" | "failure" | "disabled";

// Production uses Level 2 by default. A build-time zero retains the foundation.
export function experienceEnabled(value: string | undefined) {
  return value !== "0";
}

export function parseEffectPreference(value: string | null | undefined): EffectPreference | undefined {
  return value === "auto" || value === "light" || value === "still" ? value : undefined;
}

export function localInspectionAllowed(hostname: string, value: string | null) {
  return value === "1" && ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
}

export function compositionPresented(visible: ExperienceStage, rendered: ExperienceStage | null, ready: boolean) {
  return ready && visible === rendered;
}

export interface EffectChoice { preference: EffectPreference; resume: Exclude<EffectPreference, "still"> }
export function changeEffectChoice(current: EffectChoice, preference: EffectPreference): EffectChoice {
  return { preference, resume: preference === "still" ? current.resume : preference };
}

export interface StudioMetrics {
  stage: ExperienceStage;
  frames: number;
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
  dpr: number;
}

export interface ExperienceSignals {
  enabled: boolean;
  preference: EffectPreference;
  reducedMotion: boolean;
  saveData: boolean;
  slowNetwork: boolean;
  coarsePointer: boolean;
  webgl: boolean;
  failed: boolean;
  degraded: boolean;
}

export function experiencePolicy(signals: ExperienceSignals): { mode: ExperienceMode; reason: ExperienceReason } {
  if (!signals.enabled) return { mode: "basic", reason: "disabled" };
  if (signals.preference === "still") return { mode: "still", reason: "preference" };
  if (signals.reducedMotion) return { mode: "still", reason: "reduced-motion" };
  if (signals.saveData) return { mode: "still", reason: "save-data" };
  if (signals.slowNetwork) return { mode: "still", reason: "slow-network" };
  if (signals.failed) return { mode: "basic", reason: "failure" };
  if (!signals.webgl) return { mode: "basic", reason: "unavailable" };
  if (signals.preference === "light") return { mode: "light", reason: "preference" };
  if (signals.degraded) return { mode: "light", reason: "performance" };
  if (signals.coarsePointer) return { mode: "light", reason: "touch-device" };
  return { mode: "full", reason: "automatic" };
}

export interface StageRect { top: number; left: number; width: number; height: number }
export function stageVisibility(rect: StageRect, viewportHeight: number) {
  if (rect.width <= 0 || rect.height <= 0 || viewportHeight <= 0) return 0;
  return Math.max(0, Math.min(rect.top + rect.height, viewportHeight) - Math.max(rect.top, 0)) / Math.min(rect.height, viewportHeight);
}

export function selectVisibleStage<T extends { rect: StageRect }>(stages: T[], viewportHeight: number): T | undefined {
  return stages.filter(stage => stageVisibility(stage.rect, viewportHeight) > .08)
    .sort((a, b) => stageVisibility(b.rect, viewportHeight) - stageVisibility(a.rect, viewportHeight))[0];
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export interface StudioState {
  stage: ExperienceStage;
  focus: number;
  pointer: { x: number; y: number };
  progress: number;
  visible: boolean;
  reduced: boolean;
  invalidate?: () => void;
  metrics?: StudioMetrics;
  loseContext?: () => void;
}
