"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import { useAppStore } from "@/store/useAppStore";
import * as THREE from "three";

interface WarpPortalProps {
    position: [number, number, number];
}

export function WarpPortal({ position }: WarpPortalProps) {
    const { setMultiverseView } = useAppStore();
    const [hovered, setHovered] = useState(false);

    const outerRingRef = useRef<THREE.Mesh>(null);
    const innerRingRef = useRef<THREE.Mesh>(null);
    const swirl1Ref = useRef<THREE.Mesh>(null);
    const swirl2Ref = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const particlesRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;
        const speed = hovered ? 3.5 : 1.2;

        if (outerRingRef.current) {
            outerRingRef.current.rotation.z += delta * speed * 0.4;
        }
        if (innerRingRef.current) {
            innerRingRef.current.rotation.z -= delta * speed * 0.7;
        }
        if (swirl1Ref.current) {
            swirl1Ref.current.rotation.z -= delta * speed * 1.5;
            (swirl1Ref.current.material as THREE.MeshStandardMaterial).opacity =
                hovered ? 0.7 + Math.sin(t * 6) * 0.15 : 0.35 + Math.sin(t * 2) * 0.1;
        }
        if (swirl2Ref.current) {
            swirl2Ref.current.rotation.z += delta * speed * 2.2;
            (swirl2Ref.current.material as THREE.MeshStandardMaterial).opacity =
                hovered ? 0.5 + Math.sin(t * 8) * 0.15 : 0.2 + Math.sin(t * 3) * 0.08;
        }
        if (coreRef.current) {
            const pulse = hovered ? 2.5 + Math.sin(t * 10) * 1.2 : 1.2 + Math.sin(t * 3) * 0.4;
            (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
            coreRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.05);
        }
        if (particlesRef.current) {
            particlesRef.current.rotation.y = t * (hovered ? 1.2 : 0.4);
        }
    });

    return (
        <Float speed={hovered ? 3 : 1.5} floatIntensity={0.6} rotationIntensity={0}>
            <group
                position={position}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                    document.body.style.cursor = "pointer";
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHovered(false);
                    document.body.style.cursor = "auto";
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setMultiverseView(true);
                }}
            >
                {/* Outer jagged ring */}
                <mesh ref={outerRingRef}>
                    <torusGeometry args={[0.6, hovered ? 0.045 : 0.03, 8, 80]} />
                    <meshStandardMaterial
                        color="#00F0FF"
                        emissive="#00F0FF"
                        emissiveIntensity={hovered ? 3.5 : 1.8}
                        transparent
                        opacity={0.95}
                    />
                </mesh>

                {/* Inner ring — counter-rotating */}
                <mesh ref={innerRingRef}>
                    <torusGeometry args={[0.42, 0.018, 8, 64]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={hovered ? 4 : 2}
                        transparent
                        opacity={0.7}
                    />
                </mesh>

                {/* Swirl disc 1 — inner galaxy look */}
                <mesh ref={swirl1Ref} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.05, 0.38, 3, 1]} />
                    <meshStandardMaterial
                        color="#00F0FF"
                        emissive="#00F0FF"
                        emissiveIntensity={2}
                        transparent
                        opacity={0.35}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* Swirl disc 2 — faster, thinner */}
                <mesh ref={swirl2Ref} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.1, 0.3, 4, 1]} />
                    <meshStandardMaterial
                        color="#8B5CF6"
                        emissive="#8B5CF6"
                        emissiveIntensity={3}
                        transparent
                        opacity={0.2}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* Core glowing orb */}
                <mesh ref={coreRef}>
                    <sphereGeometry args={[0.12, 32, 32]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#00F0FF"
                        emissiveIntensity={1.5}
                        transparent
                        opacity={hovered ? 1 : 0.9}
                    />
                </mesh>

                {/* Orbiting micro-particles */}
                <group ref={particlesRef}>
                    {[0, 72, 144, 216, 288].map((deg, i) => {
                        const rad = (deg * Math.PI) / 180;
                        const r = 0.54;
                        return (
                            <mesh key={i} position={[Math.cos(rad) * r, 0, Math.sin(rad) * r]}>
                                <sphereGeometry args={[0.012, 8, 8]} />
                                <meshStandardMaterial
                                    color="#00F0FF"
                                    emissive="#00F0FF"
                                    emissiveIntensity={hovered ? 6 : 3}
                                />
                            </mesh>
                        );
                    })}
                </group>

                {/* Tooltip */}
                {hovered && (
                    <Html position={[0, 0.95, 0]} center className="pointer-events-none">
                        <div className="bg-black/90 border border-neon-cyan/60 px-4 py-2 rounded-xl font-mono text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] whitespace-nowrap backdrop-blur-md text-center">
                            <div className="text-neon-cyan font-bold tracking-widest text-xs uppercase mb-0.5">Warp Portal</div>
                            <div className="text-white/80 text-xs">Enter the Multiverse ✦</div>
                        </div>
                    </Html>
                )}
            </group>
        </Float>
    );
}
