"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useAppStore } from "@/store/useAppStore";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface ServerRackProps {
    position: [number, number, number];
}

export function ServerRack({ position }: ServerRackProps) {
    const { isDevMode, setActiveSection } = useAppStore();
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef<THREE.Group>(null);
    const [doorOpen, setDoorOpen] = useState(false); // Can animate door later if needed

    // LED references array
    const ledsRef = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            const targetScale = hovered ? 1.05 : 1.0;
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 8 * delta);
        }

        // Complex Blinking LEDs
        const time = state.clock.elapsedTime;
        ledsRef.current.forEach((mat, i) => {
            if (mat) {
                // Different blink patterns based on index
                const patternType = i % 3;
                let isLit = false;

                if (patternType === 0) {
                    // Fast erratic blink
                    isLit = Math.random() > 0.6;
                } else if (patternType === 1) {
                    // Pulsing blink
                    isLit = Math.sin(time * 8 + i) > 0.5;
                } else {
                    // Slow steady blink
                    isLit = Math.sin(time * 2 + i) > 0;
                }

                // Random yellow/red/blue/cyan for some LEDs
                const colorType = i % 8;
                let colorHex = "#00F0FF"; // Cyan
                if (colorType === 2) colorHex = "#10B981"; // Green
                if (colorType === 7) colorHex = "#F59E0B"; // Amber (Warning)

                if (isLit) {
                    mat.emissiveIntensity = 2.5;
                    mat.color.set(colorHex);
                    mat.emissive.set(colorHex);
                } else {
                    mat.emissiveIntensity = 0.2;
                    mat.color.set("#000000");
                    mat.emissive.set("#000000");
                }
            }
        });
    });

    // 6 server units
    const numServers = 6;
    const serverHeight = 0.25;

    return (
        <group
            position={position}
            ref={groupRef}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                setHovered(false);
                document.body.style.cursor = 'auto';
            }}
            onClick={(e) => {
                e.stopPropagation();
                setActiveSection('services');
                setDoorOpen(!doorOpen);
            }}
        >
            {/* Main Cabinet Frame */}
            {/* Top base */}
            <mesh position={[0, 2.0, 0]}>
                <boxGeometry args={[1.2, 0.05, 1.2]} />
                <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.6} wireframe={isDevMode} />
            </mesh>
            {/* Bottom base */}
            <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[1.2, 0.1, 1.2]} />
                <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.6} wireframe={isDevMode} />
            </mesh>
            {/* Pillar FL */}
            <mesh position={[-0.575, 1.05, 0.575]}>
                <boxGeometry args={[0.05, 1.9, 0.05]} />
                <meshStandardMaterial color="#1e293b" wireframe={isDevMode} />
            </mesh>
            {/* Pillar FR */}
            <mesh position={[0.575, 1.05, 0.575]}>
                <boxGeometry args={[0.05, 1.9, 0.05]} />
                <meshStandardMaterial color="#1e293b" wireframe={isDevMode} />
            </mesh>
            {/* Pillar BL */}
            <mesh position={[-0.575, 1.05, -0.575]}>
                <boxGeometry args={[0.05, 1.9, 0.05]} />
                <meshStandardMaterial color="#1e293b" wireframe={isDevMode} />
            </mesh>
            {/* Pillar BR */}
            <mesh position={[0.575, 1.05, -0.575]}>
                <boxGeometry args={[0.05, 1.9, 0.05]} />
                <meshStandardMaterial color="#1e293b" wireframe={isDevMode} />
            </mesh>

            {/* Side Panels */}
            <mesh position={[-0.59, 1.05, 0]}>
                <boxGeometry args={[0.02, 1.9, 1.15]} />
                <meshStandardMaterial color="#020617" roughness={0.8} wireframe={isDevMode} />
            </mesh>
            <mesh position={[0.59, 1.05, 0]}>
                <boxGeometry args={[0.02, 1.9, 1.15]} />
                <meshStandardMaterial color="#020617" roughness={0.8} wireframe={isDevMode} />
            </mesh>
            {/* Back Panel */}
            <mesh position={[0, 1.05, -0.59]}>
                <boxGeometry args={[1.15, 1.9, 0.02]} />
                <meshStandardMaterial color="#020617" roughness={0.8} wireframe={isDevMode} />
            </mesh>

            {/* Front Glass Door - slightly open if hovered/clicked */}
            <group position={[-0.55, 1.05, 0.6]} rotation={[0, hovered ? 0.3 : 0, 0]}>
                {/* Door pivot is on the left */}
                <mesh position={[0.55, 0, 0]}>
                    <boxGeometry args={[1.1, 1.85, 0.02]} />
                    <meshStandardMaterial color="#000" transparent opacity={0.5} roughness={0.1} metalness={0.9} wireframe={isDevMode} />
                </mesh>
                {/* Door Frame */}
                <mesh position={[0.55, 0, 0.015]}>
                    <boxGeometry args={[1.15, 1.9, 0.01]} />
                    <meshStandardMaterial color="#0f172a" wireframe={isDevMode} />
                </mesh>
                {/* Door Handle */}
                <mesh position={[1.05, 0, 0.03]}>
                    <boxGeometry args={[0.03, 0.3, 0.03]} />
                    <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} wireframe={isDevMode} />
                </mesh>
            </group>

            {/* Server Units inside */}
            {Array.from({ length: numServers }).map((_, i) => {
                const yPos = 0.3 + i * (serverHeight + 0.05);
                return (
                    <group key={`server-${i}`} position={[0, yPos, 0.1]}>
                        {/* Server Chassis */}
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[1.0, serverHeight, 0.9]} />
                            <meshStandardMaterial color="#1e293b" roughness={0.6} wireframe={isDevMode} />
                        </mesh>
                        {/* Front Panel Grid Details */}
                        <mesh position={[0, 0, 0.46]}>
                            <boxGeometry args={[0.9, serverHeight - 0.05, 0.02]} />
                            <meshStandardMaterial color="#0f172a" roughness={0.8} wireframe={isDevMode} />
                        </mesh>

                        {/* Random tiny LEDs per server */}
                        {Array.from({ length: 8 }).map((_, j) => (
                            <mesh key={`led-${i}-${j}`} position={[-0.4 + j * 0.06, 0.05 - (j % 2) * 0.1, 0.471]}>
                                <boxGeometry args={[0.02, 0.02, 0.01]} />
                                <meshStandardMaterial
                                    ref={(el) => { if (el) ledsRef.current.push(el); }}
                                    color="#000000"
                                    emissive="#000000"
                                    emissiveIntensity={0.2}
                                />
                            </mesh>
                        ))}

                        {/* Drive bays visualization */}
                        <mesh position={[0.1, 0, 0.47]}>
                            <boxGeometry args={[0.4, serverHeight - 0.1, 0.01]} />
                            <meshStandardMaterial color="#334155" wireframe={isDevMode} />
                        </mesh>
                    </group>
                );
            })}

            {/* Tooltip */}
            {hovered && (
                <Html position={[0, 2.5, 0]} center className="pointer-events-none">
                    <div className="bg-black/90 text-neon-cyan border border-neon-cyan/50 px-4 py-1.5 rounded-lg font-mono text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] whitespace-nowrap backdrop-blur-md">
                        Data Center Solutions
                    </div>
                </Html>
            )}
        </group>
    );
}
