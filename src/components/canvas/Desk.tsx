"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useAppStore } from "@/store/useAppStore";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface DeskProps {
    position: [number, number, number];
}

export function Desk({ position }: DeskProps) {
    const { isDevMode, setActiveSection } = useAppStore();
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef<THREE.Group>(null);
    const monitorRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (monitorRef.current) {
            const targetEmissive = hovered ? 1.5 : 0.5;
            const material = monitorRef.current.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = THREE.MathUtils.lerp(
                material.emissiveIntensity,
                targetEmissive,
                10 * delta
            );
        }
    });

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
                setActiveSection('ceo-portfolio');
            }}
        >
            {/* Table Legs */}
            <mesh position={[-0.7, 0.4, -0.3]}>
                <boxGeometry args={[0.1, 0.8, 0.1]} />
                <meshStandardMaterial color="#334155" wireframe={isDevMode} />
            </mesh>
            <mesh position={[0.7, 0.4, -0.3]}>
                <boxGeometry args={[0.1, 0.8, 0.1]} />
                <meshStandardMaterial color="#334155" wireframe={isDevMode} />
            </mesh>
            <mesh position={[-0.7, 0.4, 0.3]}>
                <boxGeometry args={[0.1, 0.8, 0.1]} />
                <meshStandardMaterial color="#334155" wireframe={isDevMode} />
            </mesh>
            <mesh position={[0.7, 0.4, 0.3]}>
                <boxGeometry args={[0.1, 0.8, 0.1]} />
                <meshStandardMaterial color="#334155" wireframe={isDevMode} />
            </mesh>

            {/* Table Top */}
            <mesh position={[0, 0.85, 0]}>
                <boxGeometry args={[1.8, 0.1, 0.8]} />
                <meshStandardMaterial color="#1e293b" wireframe={isDevMode} />
            </mesh>

            {/* Monitor Base */}
            <mesh position={[0, 0.95, -0.2]}>
                <boxGeometry args={[0.2, 0.1, 0.2]} />
                <meshStandardMaterial color="#0f172a" wireframe={isDevMode} />
            </mesh>

            {/* Monitor Screen */}
            <mesh position={[0, 1.2, -0.2]} ref={monitorRef}>
                <boxGeometry args={[1.2, 0.7, 0.05]} />
                <meshStandardMaterial
                    color="#000000"
                    emissive="#00F0FF"
                    emissiveIntensity={0.5}
                    wireframe={isDevMode}
                />
            </mesh>

            {/* Tooltip */}
            {hovered && (
                <Html position={[0, 2, 0]} center className="pointer-events-none">
                    <div className="bg-black/80 text-neon-cyan border border-neon-cyan px-3 py-1 rounded font-mono text-sm whitespace-nowrap backdrop-blur-sm">
                        CEO Portfolio
                    </div>
                </Html>
            )}
        </group>
    );
}
