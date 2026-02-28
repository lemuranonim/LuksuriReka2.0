"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

// ─── Phase timeline ──────────────────────────────────────────────────────────
// idle  →  portal (0ms)
//       →  tunnel (350ms)  — streaks accelerate upward / toward planet
//       →  flash  (950ms)  — white overexposure punch-through
//       │                      ← navigation (href) or canvas swap happens here
//       →  fade   (1150ms) — collapses to destination
//       →  idle   (1900ms)

type Phase = "idle" | "portal" | "tunnel" | "flash" | "fade";

const NAV_DELAY = 950;  // ms — navigate at flash peak (screen is fully white)
const TOTAL_ANIM = 1900; // ms — when overlay hides itself

// ─── Deterministic pseudo-random from index ───────────────────────────────────
function seeded(i: number, salt: number) {
    const x = Math.sin(i * 9301 + salt * 49297 + 233) * 100;
    return x - Math.floor(x);
}

// ─── Streak & particle geometry (computed once) ───────────────────────────────
const STREAKS = Array.from({ length: 60 }, (_, i) => ({
    x: seeded(i, 1) * 100,
    delay: seeded(i, 2) * 0.25,
    height: 25 + seeded(i, 3) * 50,
    width: 1 + seeded(i, 4) * 2.5,
    opacity: 0.3 + seeded(i, 5) * 0.7,
    hue: seeded(i, 6) > 0.7 ? "#ffffff" : seeded(i, 6) > 0.35 ? "#00F0FF" : "#a855f7",
}));

const BURST_LINES = Array.from({ length: 36 }, (_, i) => ({
    angle: i * 10,
    length: 40 + seeded(i, 7) * 60,
    delay: seeded(i, 8) * 0.15,
    width: 1 + seeded(i, 9),
}));

const PARTICLES = Array.from({ length: 80 }, (_, i) => ({
    x: seeded(i, 10) * 100,
    y: 60 + seeded(i, 11) * 40,
    size: 1 + seeded(i, 12) * 3,
    delay: seeded(i, 13) * 0.5,
    opacity: 0.4 + seeded(i, 14) * 0.6,
}));

// ─── Main component ───────────────────────────────────────────────────────────

export default function WarpTransition() {
    const { isMultiverseView, warpNavTarget, setWarpNavTarget } = useAppStore();

    // triggerKey increments each time we want to play the animation
    const [triggerKey, setTriggerKey] = useState(0);
    const [phase, setPhase] = useState<Phase>("idle");

    // Label shown during tunnel phase
    const [label, setLabel] = useState("Warping...");

    // Track which nav target is being played (vs multiverse toggle)
    const pendingNav = useRef<string | null>(null);

    // ── Watch isMultiverseView ─────────────────────────────────────────────
    useEffect(() => {
        setLabel("Warping...");
        pendingNav.current = null;
        setTriggerKey((k) => k + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMultiverseView]);

    // ── Watch warpNavTarget (planet click) ────────────────────────────────
    useEffect(() => {
        if (!warpNavTarget) return;
        // Derive a human-readable label from the URL
        try {
            const url = warpNavTarget.startsWith("http")
                ? new URL(warpNavTarget).hostname.replace("www.", "")
                : warpNavTarget;
            setLabel(`Jumping to ${url}…`);
        } catch {
            setLabel("Warping...");
        }
        pendingNav.current = warpNavTarget;
        setTriggerKey((k) => k + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warpNavTarget]);

    // ── Phase sequencer ───────────────────────────────────────────────────
    useEffect(() => {
        if (triggerKey === 0) return; // initial mount, skip

        setPhase("portal");
        const t1 = setTimeout(() => setPhase("tunnel"), 350);
        const t2 = setTimeout(() => setPhase("flash"), 950);
        const t3 = setTimeout(() => setPhase("fade"), 1150);
        const t4 = setTimeout(() => {
            setPhase("idle");
            setWarpNavTarget(null); // clear pending nav
        }, TOTAL_ANIM);

        // Navigate at flash peak if this was a planet click
        const tNav = setTimeout(() => {
            if (pendingNav.current) {
                const href = pendingNav.current;
                pendingNav.current = null;
                window.location.href = href;
            }
        }, NAV_DELAY);

        return () => {
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
            clearTimeout(t4); clearTimeout(tNav);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerKey]);

    if (phase === "idle") return null;

    const inPortal = phase === "portal";
    const inTunnel = phase === "tunnel";
    const inFlash = phase === "flash";
    const inFade = phase === "fade";

    return (
        <AnimatePresence>
            <motion.div
                key={`warp-${triggerKey}`}
                className="fixed inset-0 z-[70] pointer-events-none overflow-hidden"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
            >
                {/* ── 1. BASE darkening ── */}
                <motion.div
                    className="absolute inset-0"
                    style={{ background: "#000010" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inPortal ? 0.55 : inTunnel ? 0.85 : inFlash ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                />

                {/* ── 2. PORTAL RING — expands from center ── */}
                <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-neon-cyan"
                    style={{ boxShadow: "0 0 40px 10px rgba(0,240,255,0.6), inset 0 0 40px rgba(0,240,255,0.3)" }}
                    initial={{ width: 0, height: 0, opacity: 0 }}
                    animate={
                        inPortal ? { width: 120, height: 120, opacity: 1 }
                            : inTunnel ? { width: "300vmax", height: "300vmax", opacity: 0.5, borderColor: "#ffffff" }
                                : { width: "400vmax", height: "400vmax", opacity: 0 }
                    }
                    transition={{ duration: inPortal ? 0.35 : 0.65, ease: inPortal ? "easeOut" : "easeIn" }}
                />

                {/* ── 3. VORTEX SWIRL ── */}
                <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                        width: "140vmax",
                        height: "140vmax",
                        background: "conic-gradient(from 0deg, transparent 0%, rgba(0,240,255,0.08) 20%, transparent 40%, rgba(168,85,247,0.08) 60%, transparent 80%)",
                    }}
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: inPortal ? 0 : inTunnel ? 1 : 0, rotate: 180 }}
                    transition={{ duration: 0.7, ease: "easeIn" }}
                />

                {/* ── 4. VERTICAL SPEED STREAKS ── */}
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inTunnel ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {STREAKS.map((s, i) => (
                        <motion.div
                            key={i}
                            className="absolute bottom-0 rounded-full"
                            style={{
                                left: `${s.x}%`,
                                width: `${s.width}px`,
                                background: `linear-gradient(to top, transparent, ${s.hue}, transparent)`,
                                opacity: s.opacity,
                            }}
                            initial={{ height: 0, y: 0 }}
                            animate={
                                inTunnel
                                    ? { height: `${s.height}vh`, y: `-110vh` }
                                    : inFlash || inFade
                                        ? { height: `${s.height * 2}vh`, y: `-150vh`, opacity: 0 }
                                        : { height: 0, y: 0 }
                            }
                            transition={{
                                duration: inTunnel ? 0.6 : 0.25,
                                delay: s.delay,
                                ease: inTunnel ? [0.2, 0, 0.8, 1] : "easeIn",
                            }}
                        />
                    ))}
                </motion.div>

                {/* ── 5. RADIAL BURST ── */}
                <motion.div
                    className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inTunnel ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                >
                    {BURST_LINES.map((b, i) => (
                        <motion.div
                            key={i}
                            className="absolute origin-top rounded-full"
                            style={{
                                left: "50%",
                                top: "50%",
                                rotate: `${b.angle}deg`,
                                width: `${b.width}px`,
                                transformOrigin: "top center",
                                background: "linear-gradient(to bottom, rgba(0,240,255,0.9), transparent)",
                                marginLeft: `-${b.width / 2}px`,
                            }}
                            initial={{ height: 0, opacity: 0 }}
                            animate={
                                inTunnel
                                    ? { height: `${b.length}vh`, opacity: 0.6 }
                                    : inFlash
                                        ? { height: `${b.length * 2}vh`, opacity: 0 }
                                        : { height: 0, opacity: 0 }
                            }
                            transition={{ duration: 0.6, delay: b.delay, ease: "easeOut" }}
                        />
                    ))}
                </motion.div>

                {/* ── 6. DUST PARTICLES flying upward ── */}
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inTunnel ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {PARTICLES.map((p, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{
                                left: `${p.x}%`,
                                bottom: `${100 - p.y}%`,
                                width: `${p.size}px`,
                                height: `${p.size * 3}px`,
                                opacity: p.opacity,
                            }}
                            initial={{ y: 0, opacity: p.opacity }}
                            animate={
                                inTunnel
                                    ? { y: "-110vh", opacity: [p.opacity, p.opacity * 0.8, 0] }
                                    : { y: 0, opacity: 0 }
                            }
                            transition={{ duration: 0.7, delay: p.delay, ease: "easeIn" }}
                        />
                    ))}
                </motion.div>

                {/* ── 7. CENTER CORE GLOW ── */}
                <motion.div
                    className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,240,255,0.8) 25%, rgba(0,100,255,0.4) 55%, transparent 75%)",
                    }}
                    initial={{ width: 0, height: 0, opacity: 0 }}
                    animate={
                        inPortal ? { width: 80, height: 80, opacity: 0.8 }
                            : inTunnel ? { width: 300, height: 300, opacity: 1 }
                                : inFlash ? { width: "250vw", height: "250vw", opacity: 1 }
                                    : { width: 0, height: 0, opacity: 0 }
                    }
                    transition={{
                        duration: inPortal ? 0.4 : inTunnel ? 0.65 : inFlash ? 0.25 : 0.3,
                        ease: inFlash ? [0.2, 0, 1, 0.8] : "easeInOut",
                    }}
                />

                {/* ── 8. CHROMATIC ABERRATION GHOST ── */}
                <motion.div
                    className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
                    style={{
                        background: "radial-gradient(circle, rgba(168,85,247,0.7) 0%, transparent 60%)",
                        filter: "blur(8px)",
                    }}
                    initial={{ width: 0, height: 0, opacity: 0 }}
                    animate={
                        inTunnel ? { width: 200, height: 200, opacity: 0.6, x: 12 }
                            : inFlash ? { width: 600, height: 600, opacity: 0, x: 30 }
                                : { width: 0, height: 0, opacity: 0, x: 0 }
                    }
                    transition={{ duration: 0.55, ease: "easeIn" }}
                />

                {/* ── 9. WHITE PUNCH-THROUGH flash ── */}
                <motion.div
                    className="absolute inset-0"
                    style={{ background: "#ffffff" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inFlash ? 1 : 0 }}
                    transition={{ duration: inFlash ? 0.12 : 0.35, ease: inFlash ? "easeOut" : "easeIn" }}
                />

                {/* ── 10. DEEP SPACE FADE after flash ── */}
                <motion.div
                    className="absolute inset-0"
                    style={{ background: "#050510" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inFade ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                />

                {/* ── 11. DYNAMIC LABEL ── */}
                <motion.div
                    className="absolute left-1/2 bottom-[20%] -translate-x-1/2 font-mono text-neon-cyan text-xs tracking-[0.35em] uppercase whitespace-nowrap"
                    style={{ textShadow: "0 0 12px rgba(0,240,255,0.9)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: inPortal || inTunnel ? 1 : 0,
                        y: inPortal ? 0 : inTunnel ? -20 : 10,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {label}
                </motion.div>

            </motion.div>
        </AnimatePresence>
    );
}
