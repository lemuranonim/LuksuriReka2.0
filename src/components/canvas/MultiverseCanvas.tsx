"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Html, Float, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import * as THREE from "three";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PlanetConfig {
    name: string;
    label: string;
    tooltip: string;
    href: string | null;
    orbitRadius: number;
    orbitSpeed: number;
    orbitTilt: number;
    size: number;
    color: string;
    emissive: string;
    emissiveIntensity: number;
    metalness: number;
    roughness: number;
    wireframe: boolean;
    ringColor?: string;
    ringInner?: number;
    ringOuter?: number;
    dimFuture?: boolean;
}

// ─── Central Luksuri Core Star ───────────────────────────────────────────────

function LuksuriCore() {
    const coreRef = useRef<THREE.Mesh>(null);
    const midRef = useRef<THREE.Mesh>(null);
    const outerRef = useRef<THREE.Mesh>(null);
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);
    const flare1Ref = useRef<THREE.Mesh>(null);
    const flare2Ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        if (coreRef.current) {
            coreRef.current.rotation.y += 0.003;
            coreRef.current.rotation.x = Math.sin(t * 0.2) * 0.08;
        }
        if (midRef.current) {
            midRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.04);
            (midRef.current.material as THREE.MeshBasicMaterial).opacity =
                0.20 + Math.sin(t * 1.2) * 0.06;
        }
        if (outerRef.current) {
            outerRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.06);
            (outerRef.current.material as THREE.MeshBasicMaterial).opacity =
                0.05 + Math.sin(t * 0.7) * 0.025;
        }
        if (ring1Ref.current) ring1Ref.current.rotation.z += 0.0025;
        if (ring2Ref.current) ring2Ref.current.rotation.z -= 0.0018;
        if (flare1Ref.current) {
            flare1Ref.current.rotation.y = t * 0.15;
            (flare1Ref.current.material as THREE.MeshBasicMaterial).opacity =
                0.10 + Math.sin(t * 2.1) * 0.06;
        }
        if (flare2Ref.current) {
            flare2Ref.current.rotation.y = -t * 0.22;
            (flare2Ref.current.material as THREE.MeshBasicMaterial).opacity =
                0.08 + Math.sin(t * 1.7 + 1) * 0.05;
        }
    });

    return (
        <group>
            {/* ── Solar radiance lights (scaled for smaller star) ── */}
            <pointLight color="#00F0FF" intensity={18} distance={50} />
            <pointLight color="#0066ff" intensity={10} distance={70} />
            <pointLight color="#00ffcc" intensity={5} distance={35} />
            <pointLight color="#00F0FF" intensity={4} distance={20} position={[2, 0.5, 0]} />
            <pointLight color="#00F0FF" intensity={4} distance={20} position={[-2, -0.5, 0]} />
            <pointLight color="#00F0FF" intensity={4} distance={20} position={[0, 0, 2.5]} />

            {/* ── Outer Corona ── */}
            <mesh ref={outerRef}>
                <sphereGeometry args={[2.8, 32, 32]} />
                <meshBasicMaterial
                    color="#00F0FF"
                    transparent
                    opacity={0.05}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* ── Mid Corona ── */}
            <mesh ref={midRef}>
                <sphereGeometry args={[2.1, 48, 48]} />
                <meshBasicMaterial
                    color="#00c8ff"
                    transparent
                    opacity={0.20}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* ── Solar Flare Wisp 1 ── */}
            <mesh ref={flare1Ref} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[1.8, 0.28, 6, 60, Math.PI * 0.7]} />
                <meshBasicMaterial
                    color="#00F0FF"
                    transparent
                    opacity={0.10}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* ── Solar Flare Wisp 2 ── */}
            <mesh ref={flare2Ref} rotation={[-Math.PI / 4, Math.PI / 5, 0]}>
                <torusGeometry args={[2.0, 0.20, 6, 60, Math.PI * 0.55]} />
                <meshBasicMaterial
                    color="#4af0ff"
                    transparent
                    opacity={0.08}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* ── Equatorial Ring 1 ── */}
            <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.65, 0.04, 8, 120]} />
                <meshBasicMaterial color="#00F0FF" />
            </mesh>

            {/* ── Equatorial Ring 2 (tilted) ── */}
            <mesh ref={ring2Ref} rotation={[Math.PI / 2.8, 0, 0]}>
                <torusGeometry args={[1.5, 0.025, 8, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
            </mesh>

            {/* ── THE SUN CORE — meshBasicMaterial for HDR Bloom ── */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[1.4, 64, 64]} />
                <meshBasicMaterial color={new THREE.Color(0, 6, 8)} />
            </mesh>

            {/* ── Label ── */}
            <Html position={[0, 2.4, 0]} center className="pointer-events-none">
                <div className="text-center px-3 py-1.5 rounded-lg border border-neon-cyan/20 bg-black/40 backdrop-blur-sm">
                    <div className="text-neon-cyan font-mono font-bold text-[0.65rem] tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.9)]">
                        Luksuri Core
                    </div>
                </div>
            </Html>
        </group>
    );
}

// ─── Planet Component ─────────────────────────────────────────────────────────

function Planet({ config }: { config: PlanetConfig }) {
    const [hovered, setHovered] = useState(false);
    const { setWarpNavTarget } = useAppStore();
    const orbitRef = useRef<THREE.Group>(null);
    const planetRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;
        if (orbitRef.current) {
            orbitRef.current.rotation.y += delta * config.orbitSpeed;
        }
        if (planetRef.current) {
            planetRef.current.rotation.y += delta * (hovered ? 2.5 : 0.6);
            if (!config.wireframe && !config.dimFuture) {
                const pulse = hovered
                    ? config.emissiveIntensity * 2 + Math.sin(t * 5) * 0.5
                    : config.emissiveIntensity + Math.sin(t * 1.5) * 0.3;
                (planetRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
            }
        }
        if (ringRef.current) {
            ringRef.current.rotation.z += delta * 0.3;
        }
    });

    const handleClick = () => {
        if (!config.href) return;
        // Trigger the warp-out animation first; WarpTransition navigates at flash-peak
        setWarpNavTarget(config.href);
    };

    return (
        <group rotation={[config.orbitTilt, 0, 0]}>
            <group ref={orbitRef}>
                {/* Orbit path ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[config.orbitRadius, 0.006, 4, 200]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        transparent
                        opacity={config.dimFuture ? 0.06 : 0.12}
                        depthWrite={false}
                    />
                </mesh>

                {/* Planet group placed at orbit distance */}
                <group position={[config.orbitRadius, 0, 0]}>
                    <Float speed={config.dimFuture ? 0.5 : 1.5} floatIntensity={0.3} rotationIntensity={0}>
                        <group
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                setHovered(true);
                                if (config.href) document.body.style.cursor = "pointer";
                            }}
                            onPointerOut={(e) => {
                                e.stopPropagation();
                                setHovered(false);
                                document.body.style.cursor = "auto";
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClick();
                            }}
                        >
                            {/* Planet sphere */}
                            <mesh ref={planetRef}>
                                <sphereGeometry args={[config.size, 48, 48]} />
                                <meshStandardMaterial
                                    color={config.color}
                                    emissive={config.emissive}
                                    emissiveIntensity={config.emissiveIntensity}
                                    metalness={config.metalness}
                                    roughness={config.roughness}
                                    wireframe={config.wireframe}
                                    transparent={config.dimFuture}
                                    opacity={config.dimFuture ? 0.35 : 1}
                                />
                            </mesh>

                            {/* Optional ring (Luksuri Sign planet) */}
                            {config.ringColor && (
                                <mesh ref={ringRef} rotation={[Math.PI / 2.4, 0, 0]}>
                                    <torusGeometry args={[config.ringOuter ?? 0.6, 0.055, 8, 80]} />
                                    <meshStandardMaterial
                                        color={config.ringColor}
                                        emissive={config.ringColor}
                                        emissiveIntensity={hovered ? 4 : 1.8}
                                        transparent
                                        opacity={0.85}
                                    />
                                </mesh>
                            )}

                            {/* Hover glow aura for active planets */}
                            {hovered && !config.dimFuture && (
                                <mesh>
                                    <sphereGeometry args={[config.size * 1.5, 16, 16]} />
                                    <meshStandardMaterial
                                        color={config.emissive}
                                        emissive={config.emissive}
                                        emissiveIntensity={1}
                                        transparent
                                        opacity={0.12}
                                        depthWrite={false}
                                        blending={THREE.AdditiveBlending}
                                    />
                                </mesh>
                            )}

                            {/* Tooltip */}
                            {hovered && (
                                <Html
                                    position={[0, config.size + 0.6, 0]}
                                    center
                                    className="pointer-events-none"
                                    style={{ minWidth: "180px" }}
                                >
                                    <div className="bg-black/90 border border-white/20 px-4 py-2.5 rounded-xl font-mono text-center backdrop-blur-md shadow-lg">
                                        <div className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${config.dimFuture ? "text-gray-400" : "text-neon-cyan"}`}>
                                            {config.name}
                                        </div>
                                        <div className="text-white/70 text-[0.65rem] leading-snug">{config.tooltip}</div>
                                    </div>
                                </Html>
                            )}
                        </group>
                    </Float>
                </group>
            </group>
        </group>
    );
}

// ─── Scene graph ──────────────────────────────────────────────────────────────

// Sun core radius is now 1.4. Nearest planet starts at 5.5 (gap of 4.1 units).
const PLANETS: PlanetConfig[] = [
    {
        name: "Luksuri Sign",
        label: "Luksuri Sign",
        tooltip: "Digital Signature & Verification",
        href: "https://sign.luksurireka.com",
        orbitRadius: 5.5,   // clear of 1.4-unit sun + 2.8 outer corona
        orbitSpeed: 0.16,
        orbitTilt: 0.12,
        size: 0.52,
        color: "#0d1f2d",
        emissive: "#00a0ff",
        emissiveIntensity: 1.4,
        metalness: 0.95,
        roughness: 0.1,
        wireframe: false,
        ringColor: "#00F0FF",
        ringOuter: 0.75,
    },
    {
        name: "Help Center",
        label: "Help Center",
        tooltip: "Support & Documentation",
        href: "/help",
        orbitRadius: 8.5,
        orbitSpeed: 0.09,
        orbitTilt: -0.18,
        size: 0.38,
        color: "#e8f4ff",
        emissive: "#aaddff",
        emissiveIntensity: 0.9,
        metalness: 0.3,
        roughness: 0.6,
        wireframe: false,
    },
    {
        name: "Future Expansion",
        label: "???",
        tooltip: "Future Expansion — Coming Soon",
        href: null,
        orbitRadius: 12.0,
        orbitSpeed: 0.045,
        orbitTilt: 0.3,
        size: 0.55,
        color: "#334155",
        emissive: "#334155",
        emissiveIntensity: 0,
        metalness: 0.2,
        roughness: 0.9,
        wireframe: true,
        dimFuture: true,
    },
    {
        name: "Future Expansion",
        label: "???",
        tooltip: "Future Expansion — Coming Soon",
        href: null,
        orbitRadius: 16.0,
        orbitSpeed: 0.025,
        orbitTilt: -0.25,
        size: 0.7,
        color: "#1e293b",
        emissive: "#1e293b",
        emissiveIntensity: 0,
        metalness: 0.2,
        roughness: 0.9,
        wireframe: true,
        dimFuture: true,
    },
];

function MultiverseScene() {
    return (
        <>
            <Stars radius={120} depth={80} count={7000} factor={4} saturation={0.1} fade speed={0.6} />
            <ambientLight intensity={0.05} />
            <LuksuriCore />
            {PLANETS.map((p, i) => (
                <Planet key={i} config={p} />
            ))}
            <EffectComposer>
                <Bloom intensity={2.5} luminanceThreshold={0.4} mipmapBlur radius={0.8} />
            </EffectComposer>
            <OrbitControls
                enableZoom={true}
                minDistance={3}
                maxDistance={20}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.25}
                zoomSpeed={0.6}
            />
        </>
    );
}

// ─── Back Button ──────────────────────────────────────────────────────────────

function BackButton() {
    const { setMultiverseView } = useAppStore();
    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5, ease: "easeOut" }}
            onClick={() => setMultiverseView(false)}
            className="fixed top-6 left-6 z-50 flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-mono text-sm font-bold tracking-widest transition-all duration-300 border border-neon-cyan/30 bg-black/60 text-neon-cyan hover:bg-neon-cyan hover:text-[#050510] hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] backdrop-blur-md group"
        >
            <motion.span
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                ←
            </motion.span>
            Return to Base
        </motion.button>
    );
}

// ─── Legend HUD ───────────────────────────────────────────────────────────────

function MultiverseHUD() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-3 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md font-mono text-xs text-white/50"
        >
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
                <span>Click planet to navigate</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/30" />
                <span>Scroll to zoom</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400/60" />
                <span>Drag to orbit</span>
            </div>
        </motion.div>
    );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function MultiverseCanvas() {
    return (
        <div className="w-full h-screen absolute inset-0 z-0" style={{ background: "#050510" }}>
            {/* Back button + HUD live outside the canvas for performance */}
            <BackButton />
            <MultiverseHUD />

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none"
            >
                <p className="font-mono text-[0.6rem] tracking-[0.4em] text-neon-cyan/60 uppercase">
                    The Luksuri Multiverse
                </p>
            </motion.div>

            <Canvas
                camera={{ position: [0, 4, 16], fov: 55 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: false }}
            >
                <color attach="background" args={["#050510"]} />
                <Suspense fallback={null}>
                    <MultiverseScene />
                </Suspense>
            </Canvas>
        </div>
    );
}
