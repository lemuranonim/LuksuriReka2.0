"use client";

import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";

export default function DevOverlay() {
    const { isDevMode, activeSection } = useAppStore();
    const [fps, setFps] = useState(60);

    useEffect(() => {
        if (!isDevMode) return;
        let frameId: number;
        let lastTime = performance.now();
        let frames = 0;

        const tick = (time: number) => {
            frames++;
            if (time >= lastTime + 1000) {
                setFps(Math.round((frames * 1000) / (time - lastTime)));
                frames = 0;
                lastTime = time;
            }
            frameId = requestAnimationFrame(tick);
        };

        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [isDevMode]);

    if (!isDevMode) return null;

    const debugData = {
        mode: "development",
        performance: { fps, target: 60 },
        currentState: { activeSection },
        renderEngine: "React Three Fiber w/ WebGL2",
        company: "PT Luksuri Reka Digital Solutions",
    };

    return (
        <div className="fixed bottom-6 left-6 z-40 bg-black/60 backdrop-blur-md border border-neon-cyan/30 rounded-lg p-4 font-mono text-xs text-neon-cyan pointer-events-none w-80 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
            <div className="flex justify-between items-center mb-4 border-b border-neon-cyan/30 pb-2">
                <span className="font-bold text-white">SYSTEM_DIAGNOSTICS</span>
                <span className={fps >= 55 ? "text-green-400" : "text-yellow-400"}>
                    FPS: {fps}
                </span>
            </div>
            <pre className="whitespace-pre-wrap overflow-hidden">
                {JSON.stringify(debugData, null, 2)}
            </pre>
        </div>
    );
}
