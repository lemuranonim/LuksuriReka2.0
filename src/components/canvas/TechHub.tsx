"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useAppStore } from "@/store/useAppStore";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export function TechHub() {
    const { isDevMode, setActiveSection } = useAppStore();
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* CEO Portfolio Desk */}
            <InteractiveObject
                position={[-3, 0, 0]}
                color="#00F0FF"
                label="CEO PORTFOLIO"
                onClick={() => setActiveSection('desk')}
            >
                <boxGeometry args={[1.5, 1, 1]} />
            </InteractiveObject>

            {/* Holographic Plant */}
            <InteractiveObject
                position={[0, 0.5, 0]}
                color="#00FF88"
                label="ENTERPRISE"
                onClick={() => setActiveSection('plant')}
            >
                <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
            </InteractiveObject>

      /* Server Rack */
            <InteractiveObject
                position={[3, 0, 0]}
                color="#FF0055"
                label="STARTUP/UMKM"
                onClick={() => setActiveSection('server')}
            >
                <boxGeometry args={[1, 2, 1]} />
            </InteractiveObject>

            {/* Base */}
            <mesh position={[0, -1.1, 0]}>
                <boxGeometry args={[10, 0.2, 4]} />
                <meshStandardMaterial color="#0b1b2b" wireframe={isDevMode} />
            </mesh>
        </group>
    );
}

function InteractiveObject({ children, position, color, label, onClick }: any) {
    const { isDevMode } = useAppStore();
    const [hovered, setHovered] = useState(false);
    const ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ref.current) {
            const targetY = hovered ? position[1] + 0.2 : position[1];
            const targetScale = hovered ? 1.05 : 1.0;

            ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.1);
            ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1));

            if (hovered) {
                ref.current.rotation.y += 0.01;
            } else {
                ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0, 0.05);
            }
        }
    });

    return (
        <group position={[position[0], 0, position[2]]}>
            <mesh
                ref={ref}
                position={[0, position[1], 0]}
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
                    onClick();
                }}
            >
                {children}
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.8 : 0.2}
                    wireframe={isDevMode}
                />
            </mesh>
            <Text
                position={[0, -1.5, 1]}
                fontSize={0.2}
                color={hovered ? color : "white"}
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </group>
    );
}
