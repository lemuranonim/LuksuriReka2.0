"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import type { ExperienceMode, ExperienceReason, ExperienceStage, StudioState } from "@/lib/experience";

interface Props {
  state: RefObject<StudioState>;
  mode: ExperienceMode;
  reason: ExperienceReason;
  renderedStage: ExperienceStage | null;
}

// Loaded only for an explicit localhost inspection. Reads technical timing data;
// never collects form values, visitor identity, or outbound draft URLs.
export default function ExperienceDiagnostics({ state, mode, reason, renderedStage }: Props) {
  const [snapshot, setSnapshot] = useState<object>({});
  const [contextAvailable, setContextAvailable] = useState(false);
  const takeSnapshot = useCallback(() => {
    const resources = (performance.getEntriesByType("resource") as PerformanceResourceTiming[])
      .filter(entry => {
        const url = new URL(entry.name);
        return url.origin === location.origin && (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/experience/"));
      }).map(entry => ({ path: new URL(entry.name).pathname, encoded: entry.encodedBodySize, transferred: entry.transferSize, durationMs: Math.round(entry.duration * 10) / 10 }));
    const initialization = performance.getEntriesByName("lr:experience:initialization").at(-1);
    setContextAvailable(Boolean(state.current.loseContext));
    setSnapshot({
      inspection: "localhost-only", mode, reason, renderedStage,
      visible: state.current.visible,
      canvasCount: document.querySelectorAll("canvas[data-lr-scene='studio']").length,
      viewport: { width: document.documentElement.clientWidth, height: window.innerHeight },
      renderer: state.current.metrics ?? null,
      solutions: state.current.stage === "solutions" ? state.current.solutionMetrics ?? null : null,
      contextLossAvailable: Boolean(state.current.loseContext),
      initializationMs: initialization ? Math.round(initialization.duration * 10) / 10 : null,
      resources,
      note: "One local run. Cached entries may have zero transfer. Not field Web Vitals or a physical device result.",
    });
  }, [state, mode, reason, renderedStage]);

  useEffect(() => {
    takeSnapshot();
    const interval = setInterval(takeSnapshot, 1000);
    return () => clearInterval(interval);
  }, [takeSnapshot]);

  return <details className="lr-local-inspection">
    <summary>Pemeriksaan lokal</summary>
    <p>Alat QA lokal. Tidak tampil untuk pengunjung situs. Pemutusan WebGL menguji fallback sampai halaman dimuat ulang.</p>
    <div><button type="button" onClick={takeSnapshot}>Ambil snapshot</button><button type="button" disabled={!contextAvailable || mode === "basic" || mode === "still"} onClick={() => state.current.loseContext?.()}>Putuskan WebGL untuk uji</button></div>
    <pre data-lr-inspection="snapshot">{JSON.stringify(snapshot, null, 2)}</pre>
  </details>;
}
