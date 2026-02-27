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

    // LED references array
    const ledsRef = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

    useFrame((state, delta) => {
        // Scale animation
        if (groupRef.current) {
            const targetScale = hovered ? 1.05 : 1.0;
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 10 * delta);
        }

        // Blink LEDs
        const time = state.clock.elapsedTime;
        ledsRef.current.forEach((mat, i) => {
            if (mat) {
                // Pseudo-random blinking offset per LED
                const blinkCycle = Math.sin(time * (10 + i * 2)) > 0.8;
                const isCyan = i % 2 === 0;

                if (blinkCycle) {
                    mat.emissiveIntensity = 2;
                    mat.color.set(isCyan ? "#00F0FF" : "#FFFFFF");
                    mat.emissive.set(isCyan ? "#00F0FF" : "#FFFFFF");
                } else {
                    mat.emissiveIntensity = 0.2;
                    mat.color.set("#000000");
                    mat.emissive.set("#000000");
                }
            }
        });
    });

    // Generate an array of positions for the LEDs on the front panel
    const ledPositions = Array.from({ length: 8 }).map((_, i) => ({
        x: -0.3 + (i % 2) * 0.1,
        y: 1.8 - Math.floor(i / 2) * 0.2, // Distribute along height
        z: 0.51
    }));

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
            }}
        >
            {/* Main Server Rack Body */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[1, 2, 1]} />
                <meshStandardMaterial color="#0f172a" wireframe={isDevMode} roughness={0.7} />
            </mesh>

            {/* Front Glass/Panel */}
            <mesh position={[0, 1, 0.505]}>
                <boxGeometry args={[0.9, 1.9, 0.05]} />
                <meshStandardMaterial color="#020617" wireframe={isDevMode} opacity={0.8} transparent />
            </mesh>

            {/* Blinking LEDs */}
            {ledPositions.map((pos, i) => (
                <mesh key={i} position={[pos.x, pos.y, pos.z]}>
                    <planeGeometry args={[0.05, 0.02]} />
                    <meshStandardMaterial
                        ref={(el) => { ledsRef.current[i] = el; }}
                        color="#000000"
                        emissive="#000000"
                        emissiveIntensity={0.2}
                        wireframe={isDevMode}
                    />
                </mesh>
            ))}

            {/* Server Slots / Blades (aesthetic details) */}
            {Array.from({ length: 5 }).map((_, i) => (
                <mesh key={`slot-${i}`} position={[0, 1.8 - i * 0.4, 0.501]}>
                    <boxGeometry args={[0.8, 0.1, 0.02]} />
                    <meshStandardMaterial color="#1e293b" wireframe={isDevMode} />
                </mesh>
            ))}

            {/* Tooltip */}
            {hovered && (
                <Html position={[0, 2.5, 0]} center className="pointer-events-none">
                    <div className="bg-black/80 text-neon-cyan border border-neon-cyan px-3 py-1 rounded font-mono text-sm whitespace-nowrap backdrop-blur-sm">
                        Digital Solutions
                    </div>
                </Html>
            )}
        </group>
    );
}
