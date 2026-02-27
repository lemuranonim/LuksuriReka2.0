"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@react-three/drei";
import { useAppStore } from "@/store/useAppStore";

export default function SplashScreen() {
    const { progress } = useProgress();
    const setAppLoaded = useAppStore((state) => state.setAppLoaded);

    // We manage an internal state to handle the delayed dismount
    const [showSplash, setShowSplash] = useState(true);

    // Minimum duration the splash screen will stay visible (2 seconds)
    const MIN_SPLASH_TIME = 2000;

    useEffect(() => {
        const startTime = Date.now();

        // Check loading progress and timer simultaneously
        const checkLoading = setInterval(() => {
            const elapsed = Date.now() - startTime;

            // If 3D assets are loaded AND minimum time has passed
            if (progress === 100 && elapsed >= MIN_SPLASH_TIME) {
                clearInterval(checkLoading);
                setShowSplash(false);
                // Allow exit animation to complete before telling the app it's fully loaded
                setTimeout(() => {
                    setAppLoaded(true);
                }, 800);
            }
        }, 100);

        return () => clearInterval(checkLoading);
    }, [progress, setAppLoaded]);

    return (
        <AnimatePresence>
            {showSplash && (
                <motion.div
                    key="splash-screen"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        y: "-100%", // Slide up effect when leaving
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A2540] text-white overflow-hidden"
                >
                    {/* Background graphical elements */}
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px]" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-trust-blue/40 rounded-full blur-[120px]" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Logo / Company Name Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-center"
                        >
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                                Luksuri Reka
                            </h1>
                            <h2 className="text-sm md:text-base lg:text-lg text-neon-cyan tracking-[0.3em] uppercase font-mono opacity-80">
                                Digital Solutions
                            </h2>
                        </motion.div>

                        {/* Loading Bar Container */}
                        <motion.div
                            className="mt-16 w-64 md:w-80 h-[2px] bg-white/10 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            {/* Actual Loading Bar */}
                            <motion.div
                                className="h-full bg-neon-cyan"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear" }}
                            />
                        </motion.div>

                        {/* Loading Percentage Text */}
                        <motion.div
                            className="mt-4 text-xs font-mono text-white/50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            {Math.round(progress)}%
                        </motion.div>

                        {/* Simulated subtle pulsing effect while loading */}
                        <motion.div
                            className="mt-8 text-xs text-white/30 uppercase tracking-widest font-mono"
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
