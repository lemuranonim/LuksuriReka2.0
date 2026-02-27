"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAppStore } from "@/store/useAppStore";
import * as THREE from "three";

import { Desk } from "./Desk";
import { HologramSeed } from "./HologramSeed";
import { ServerRack } from "./ServerRack";
import { LuksuriAssistant } from "./LuksuriAssistant";

export function TechHub() {
    const { isDevMode } = useAppStore();
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Dynamic Point Lights for glows */}
            <pointLight position={[-3, 1.5, 0]} intensity={0.5} color="#00F0FF" distance={3} />
            <pointLight position={[0, 1.5, 0]} intensity={1} color="#00F0FF" distance={4} />
            <pointLight position={[3, 1.5, 1]} intensity={0.5} color="#00F0FF" distance={3} />

            {/* CEO Portfolio Desk */}
            <Desk position={[-3, 0, 0]} />

            {/* Holographic Plant */}
            <HologramSeed position={[0, 0, 0]} />

            {/* Server Rack */}
            <ServerRack position={[3, 0, 0]} />

            {/* Luksuri Assistant Mascot */}
            <LuksuriAssistant position={[-3.5, 1, 2.5]} />

            {/* Main Base Platform */}
            <mesh position={[0, -0.1, 0]}>
                <cylinderGeometry args={[5, 5, 0.2, 64]} />
                <meshStandardMaterial color="#0b1b2b" wireframe={isDevMode} roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Inner Glowing Ring on Base */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[4.8, 4.9, 64]} />
                <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.5} wireframe={isDevMode} />
            </mesh>
        </group>
    );
}
