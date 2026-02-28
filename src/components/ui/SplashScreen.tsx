"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@react-three/drei";
import { useAppStore } from "@/store/useAppStore";

// ─── Timing constants ─────────────────────────────────────────────────────────
const MIN_SPLASH_MS = 1800; // minimum visible duration
const MOBILE_BAIL_MS = 2800; // hard timeout when no WebGL canvas is present
//                             (mobile MobileTechHub2D never fires useProgress)

export default function SplashScreen() {
    const { progress } = useProgress();
    const setAppLoaded = useAppStore((s) => s.setAppLoaded);

    const [showSplash, setShowSplash] = useState(true);

    // Fake progress value for display when real progress stalls at 0 (mobile)
    const [displayProgress, setDisplayProgress] = useState(0);

    // ── Animate displayProgress to give visual feedback even on mobile ──
    useEffect(() => {
        // Drive displayProgress toward Math.max(progress, fakeFloor)
        // so the bar always appears to move regardless of WebGL loading.
        let frame: ReturnType<typeof setTimeout>;
        const tick = () => {
            setDisplayProgress((prev) => {
                const target = Math.max(progress, prev);    // never go backwards
                const next = Math.min(prev + 1.2, target); // catch up if needed
                return next > 99.5 ? 100 : next;
            });
            frame = setTimeout(tick, 30);
        };
        frame = setTimeout(tick, 30);
        return () => clearTimeout(frame);
    }, [progress]);

    // ── Simulate artificial progress on mobile (no WebGL = progress stays 0) ──
    useEffect(() => {
        if (progress > 0) return; // real progress is moving, skip fake
        let fakeVal = 0;
        const id = setInterval(() => {
            fakeVal = Math.min(fakeVal + 2.5, 95); // climb to 95% then wait
            setDisplayProgress(fakeVal);
        }, 60);
        return () => clearInterval(id);
    }, []); // run once on mount

    // ── Dismissal logic ──────────────────────────────────────────────────────
    useEffect(() => {
        const startTime = Date.now();

        // Poll every 100ms: dismiss when either:
        //   (a) real WebGL progress === 100 AND min time elapsed, OR
        //   (b) hard timeout exceeded (mobile / no 3D canvas)
        const id = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const webglDone = progress === 100 && elapsed >= MIN_SPLASH_MS;
            const timedOut = elapsed >= MOBILE_BAIL_MS;

            if (webglDone || timedOut) {
                clearInterval(id);
                setDisplayProgress(100);
                // Let the bar visually fill before animating out
                setTimeout(() => {
                    setShowSplash(false);
                    setTimeout(() => setAppLoaded(true), 800);
                }, 300);
            }
        }, 100);

        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progress]);

    return (
        <AnimatePresence>
            {showSplash && (
                <motion.div
                    key="splash-screen"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        y: "-100%",
                        transition: { duration: 0.8, ease: "easeInOut" },
                    }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A2540] text-white overflow-hidden"
                >
                    {/* Background glows */}
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-neon-cyan/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-trust-blue/40 rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-sm">
                        {/* Company name */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="text-center"
                        >
                            <h1
                                className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-2"
                                style={{ fontFamily: "var(--font-inter)" }}
                            >
                                Luksuri Reka
                            </h1>
                            <h2 className="text-sm md:text-base text-neon-cyan tracking-[0.3em] uppercase font-mono opacity-80">
                                Digital Solutions
                            </h2>
                        </motion.div>

                        {/* Loading bar */}
                        <motion.div
                            className="mt-14 w-full h-[2px] bg-white/10 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <motion.div
                                className="h-full bg-neon-cyan"
                                style={{ width: `${displayProgress}%` }}
                                transition={{ ease: "linear", duration: 0.1 }}
                            />
                        </motion.div>

                        {/* Percentage */}
                        <motion.div
                            className="mt-3 text-xs font-mono text-white/50 tabular-nums"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {Math.round(displayProgress)}%
                        </motion.div>

                        {/* Pulse text */}
                        <motion.div
                            className="mt-6 text-[0.65rem] text-white/30 uppercase tracking-widest font-mono"
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                            Initializing Systems
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
