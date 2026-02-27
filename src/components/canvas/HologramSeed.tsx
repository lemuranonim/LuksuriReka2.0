"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useAppStore } from "@/store/useAppStore";
import { Html, Float } from "@react-three/drei";
import * as THREE from "three";

interface HologramSeedProps {
    position: [number, number, number];
}

export function HologramSeed({ position }: HologramSeedProps) {
    const { isDevMode, setActiveSection } = useAppStore();
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef<THREE.Group>(null);
    const seedRef1 = useRef<THREE.Mesh>(null);
    const seedRef2 = useRef<THREE.Mesh>(null);
    const ringRef1 = useRef<THREE.Mesh>(null);
    const ringRef2 = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;
        const rotationSpeed = hovered ? 3 : 1;

        // Inner floating seeds rotation
        if (seedRef1.current && seedRef2.current) {
            seedRef1.current.rotation.y += rotationSpeed * delta;
            seedRef1.current.rotation.x += (rotationSpeed * 0.5) * delta;

            seedRef2.current.rotation.y -= (rotationSpeed * 1.5) * delta;
            seedRef2.current.rotation.z += (rotationSpeed * 0.8) * delta;

            // Pulse emissive intensity
            const intensity = hovered
                ? 4 + Math.sin(time * 5) * 2
                : 2 + Math.sin(time * 2) * 0.5;

            (seedRef1.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
            (seedRef2.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity * 0.8;
        }

        // Projector Rings rotation
        if (ringRef1.current && ringRef2.current) {
            ringRef1.current.rotation.z = time * 0.5;
            ringRef2.current.rotation.z = -time * 0.8;
        }

        // Bobbing effect for the whole group on hover
        if (groupRef.current && hovered) {
            groupRef.current.position.y = position[1] + Math.sin(time * 3) * 0.05;
        } else if (groupRef.current) {
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1], 10 * delta);
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
                setActiveSection('case-study');
            }}
        >
            {/* Projector Base (Multi-layered sci-fi pedestal) */}
            <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.8, 0.9, 0.1, 32]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.4} wireframe={isDevMode} />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
                <cylinderGeometry args={[0.7, 0.75, 0.1, 32]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} wireframe={isDevMode} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.5, 0.6, 0.1, 32]} />
                <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.2} wireframe={isDevMode} />
            </mesh>

            {/* Glowing inner projector lens core */}
            <mesh position={[0, 0.31, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} />
                <meshStandardMaterial color="#000" emissive="#00F0FF" emissiveIntensity={3} wireframe={isDevMode} />
            </mesh>

            {/* Light beam (shaft of light) */}
            <mesh position={[0, 1.0, 0]}>
                <cylinderGeometry args={[0.4, 0.45, 1.4, 32, 1, true]} />
                <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={hovered ? 2 : 0.5} transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Animated Projector Rings */}
            <group position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh ref={ringRef1}>
                    <torusGeometry args={[0.45, 0.015, 16, 64]} />
                    <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={1.5} wireframe={isDevMode} />
                </mesh>
                <mesh ref={ringRef2} position={[0, 0, 0.05]}>
                    <torusGeometry args={[0.35, 0.01, 16, 64]} />
                    <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} wireframe={isDevMode} />
                </mesh>
            </group>

            {/* Floating Hologram Seed (Nested detailed geometry) */}
            <Float speed={hovered ? 4 : 2} rotationIntensity={0} floatIntensity={0.8}>
                <group position={[0, 1.2, 0]}>
                    {/* Outer skeletal frame */}
                    <mesh ref={seedRef1}>
                        <icosahedronGeometry args={[0.45, 1]} />
                        <meshStandardMaterial
                            color="#00F0FF"
                            emissive="#00F0FF"
                            emissiveIntensity={2}
                            wireframe={true}
                            transparent={true}
                            opacity={0.6}
                        />
                    </mesh>

                    {/* Inner solid core */}
                    <mesh ref={seedRef2}>
                        <octahedronGeometry args={[0.25, 0]} />
                        <meshStandardMaterial
                            color="#fff"
                            emissive="#00F0FF"
                            emissiveIntensity={1}
                            transparent={true}
                            opacity={0.8}
                            metalness={1}
                            roughness={0}
                            wireframe={isDevMode}
                        />
                    </mesh>
                </group>
            </Float>

            {/* Tooltip */}
            {hovered && (
                <Html position={[0, 2.0, 0]} center className="pointer-events-none">
                    <div className="bg-black/90 text-neon-cyan border border-neon-cyan/50 px-4 py-1.5 rounded-lg font-mono text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] whitespace-nowrap backdrop-blur-md">
                        Digital Prototypes
                    </div>
                </Html>
            )}
        </group>
    );
}
