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
    const seedRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (seedRef.current) {
            const rotationSpeed = hovered ? 3 : 1;
            seedRef.current.rotation.y += rotationSpeed * delta;
            seedRef.current.rotation.x += (rotationSpeed * 0.5) * delta;

            const targetEmissive = hovered ? 2 : 0.8;
            const material = seedRef.current.material as THREE.MeshStandardMaterial;
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
                setActiveSection('case-study');
            }}
        >
            {/* Projector Base */}
            <mesh position={[0, 0.15, 0]}>
                <cylinderGeometry args={[0.6, 0.7, 0.3, 32]} />
                <meshStandardMaterial color="#475569" wireframe={isDevMode} metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Inner Glowing Ring */}
            <mesh position={[0, 0.31, 0]}>
                <ringGeometry args={[0.3, 0.5, 32]} />
                <meshStandardMaterial
                    color="#00F0FF"
                    emissive="#00F0FF"
                    emissiveIntensity={1}
                    side={THREE.DoubleSide}
                    wireframe={isDevMode}
                />
            </mesh>

            {/* Floating Hologram Seed */}
            <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
                <mesh position={[0, 1.2, 0]} ref={seedRef}>
                    <icosahedronGeometry args={[0.4, 1]} />
                    <meshStandardMaterial
                        color="#00F0FF"
                        emissive="#00F0FF"
                        emissiveIntensity={0.8}
                        wireframe={true}
                        transparent={true}
                        opacity={0.8}
                    />
                </mesh>
            </Float>

            {/* Tooltip */}
            {hovered && (
                <Html position={[0, 2.2, 0]} center className="pointer-events-none">
                    <div className="bg-black/80 text-neon-cyan border border-neon-cyan px-3 py-1 rounded font-mono text-sm whitespace-nowrap backdrop-blur-sm">
                        Advanta Case Study
                    </div>
                </Html>
            )}
        </group>
    );
}
