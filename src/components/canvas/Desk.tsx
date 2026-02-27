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
    const keyboardRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (monitorRef.current) {
            const targetEmissive = hovered ? 4 : 2;
            const material = monitorRef.current.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = THREE.MathUtils.lerp(
                material.emissiveIntensity,
                targetEmissive,
                10 * delta
            );
        }

        if (keyboardRef.current && hovered) {
            const time = state.clock.elapsedTime;
            const material = keyboardRef.current.material as THREE.MeshStandardMaterial;
            // RGB waving effect for keyboard when hovered
            material.emissive.setHSL((time * 0.5) % 1, 1, 0.5);
            material.emissiveIntensity = 2;
        } else if (keyboardRef.current) {
            const material = keyboardRef.current.material as THREE.MeshStandardMaterial;
            material.emissive.setHex(0x00F0FF);
            material.emissiveIntensity = 0.5;
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
            {/* Table Frame/Legs (Metal) */}
            <mesh position={[-0.9, 0.35, -0.4]}>
                <boxGeometry args={[0.05, 0.7, 0.05]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} wireframe={isDevMode} />
            </mesh>
            <mesh position={[0.9, 0.35, -0.4]}>
                <boxGeometry args={[0.05, 0.7, 0.05]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} wireframe={isDevMode} />
            </mesh>
            <mesh position={[-0.9, 0.35, 0.4]}>
                <boxGeometry args={[0.05, 0.7, 0.05]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} wireframe={isDevMode} />
            </mesh>
            <mesh position={[0.9, 0.35, 0.4]}>
                <boxGeometry args={[0.05, 0.7, 0.05]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} wireframe={isDevMode} />
            </mesh>
            {/* Crossbars (H-shape or 3-side connecting the legs near the floor) */}
            {/* Back crossbar connecting Left-Back and Right-Back (-0.9 to 0.9 on X, at Z -0.4) */}
            <mesh position={[0, 0.05, -0.4]}>
                <boxGeometry args={[1.8, 0.05, 0.05]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} wireframe={isDevMode} />
            </mesh>
            {/* Left side crossbar connecting Front-Left and Back-Left (-0.4 to 0.4 on Z, at X -0.9) */}
            <mesh position={[-0.9, 0.05, 0]}>
                <boxGeometry args={[0.05, 0.05, 0.8]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} wireframe={isDevMode} />
            </mesh>
            {/* Right side crossbar connecting Front-Right and Back-Right (-0.4 to 0.4 on Z, at X 0.9) */}
            <mesh position={[0.9, 0.05, 0]}>
                <boxGeometry args={[0.05, 0.05, 0.8]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} wireframe={isDevMode} />
            </mesh>

            {/* Table Top (Dark Wood / Carbon Fiber feel) */}
            <mesh position={[0, 0.725, 0]}>
                <boxGeometry args={[2, 0.05, 1]} />
                <meshStandardMaterial color="#0b0f19" roughness={0.9} wireframe={isDevMode} />
            </mesh>

            {/* Desk Mat */}
            <mesh position={[0, 0.755, 0.1]}>
                <boxGeometry args={[1.2, 0.01, 0.5]} />
                <meshStandardMaterial color="#020617" roughness={1} wireframe={isDevMode} />
            </mesh>

            {/* Monitor Arm/Stand */}
            <mesh position={[0, 0.9, -0.2]}>
                <cylinderGeometry args={[0.02, 0.05, 0.4, 16]} />
                <meshStandardMaterial color="#334155" metalness={0.6} wireframe={isDevMode} />
            </mesh>
            <mesh position={[0, 0.76, -0.2]}>
                <boxGeometry args={[0.3, 0.02, 0.2]} />
                <meshStandardMaterial color="#1e293b" wireframe={isDevMode} />
            </mesh>

            {/* Ultra-wide Curved Monitor Display */}
            {/* Using a bent box or thin cylinder segment for curved screen illusion */}
            <mesh position={[0, 1.1, -0.15]} rotation={[0.05, 0, 0]}>
                <boxGeometry args={[1.5, 0.6, 0.05]} />
                <meshStandardMaterial color="#000000" roughness={0.1} wireframe={isDevMode} />
            </mesh>

            {/* The actual Glowing Screen */}
            <mesh position={[0, 1.1, -0.12]} rotation={[0.05, 0, 0]} ref={monitorRef}>
                <planeGeometry args={[1.45, 0.55]} />
                <meshStandardMaterial
                    color="#000000"
                    emissive="#00F0FF"
                    emissiveIntensity={2}
                    wireframe={isDevMode}
                />
            </mesh>

            {/* Mechanical Keyboard */}
            <mesh position={[-0.1, 0.765, 0.2]} rotation={[0.05, 0, 0]} ref={keyboardRef}>
                <boxGeometry args={[0.5, 0.02, 0.15]} />
                <meshStandardMaterial color="#111" emissive="#00F0FF" emissiveIntensity={0.5} wireframe={isDevMode} />
            </mesh>

            {/* Mouse */}
            <mesh position={[0.4, 0.765, 0.2]}>
                <boxGeometry args={[0.08, 0.03, 0.12]} />
                <meshStandardMaterial color="#1e293b" roughness={0.5} wireframe={isDevMode} />
            </mesh>
            <mesh position={[0.4, 0.77, 0.2]}> {/* Mouse Glow */}
                <boxGeometry args={[0.06, 0.03, 0.02]} />
                <meshStandardMaterial color="#000" emissive="#00F0FF" emissiveIntensity={1} wireframe={isDevMode} />
            </mesh>

            {/* PC Case resting firmly on the right side crossbar */}
            <mesh position={[0.73, 0.35, -0.1]}>
                <boxGeometry args={[0.25, 0.6, 0.5]} />
                <meshStandardMaterial color="#020617" roughness={0.3} wireframe={isDevMode} />
            </mesh>
            {/* PC Case Glass Window */}
            <mesh position={[0.60, 0.35, -0.1]}>
                <boxGeometry args={[0.02, 0.5, 0.4]} />
                <meshStandardMaterial color="#000" emissive="#00F0FF" emissiveIntensity={1} transparent opacity={0.6} wireframe={isDevMode} />
            </mesh>

            {/* Tooltip */}
            {hovered && (
                <Html position={[0, 1.8, 0]} center className="pointer-events-none">
                    <div className="bg-black/90 text-neon-cyan border border-neon-cyan/50 px-4 py-1.5 rounded-lg font-mono text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] whitespace-nowrap backdrop-blur-md">
                        CEO Portfolio
                    </div>
                </Html>
            )}
        </group>
    );
}
