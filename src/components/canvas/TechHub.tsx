"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAppStore } from "@/store/useAppStore";
import * as THREE from "three";

import { Desk } from "./Desk";
import { HologramSeed } from "./HologramSeed";
import { ServerRack } from "./ServerRack";
import { LuksuriAssistant } from "./LuksuriAssistant";
import { WarpPortal } from "./WarpPortal";

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
            {/* Point lights repositioned to match new layout */}
            <pointLight position={[0, 2, -3]} intensity={1.0} color="#00F0FF" distance={5} />
            <pointLight position={[0, 2.5, 2]} intensity={0.8} color="#00F0FF" distance={4} />
            <pointLight position={[-4, 2, -1]} intensity={0.5} color="#00F0FF" distance={4} />
            <pointLight position={[4, 2, -1]} intensity={0.5} color="#00F0FF" distance={4} />

            {/* ── LuksuriAssistant — Front & Center (focal point) ── */}
            <LuksuriAssistant position={[0, 0.6, 2]} />

            {/* ── Desk (CEO Portfolio) — Back-center ── */}
            <Desk position={[0, 0, -3]} />

            {/* ── Warp Portal — floating above the Desk ── */}
            <WarpPortal position={[0, 2.2, -3]} />

            {/* ── HologramSeed (Case Study) — Left, angled toward center ── */}
            <group rotation={[0, Math.PI / 5, 0]}>
                <HologramSeed position={[-4, 0, -1]} />
            </group>

            {/* ── ServerRack (Services) — Right, angled toward center ── */}
            <group rotation={[0, -Math.PI / 5, 0]}>
                <ServerRack position={[4, 0, -1]} />
            </group>

            {/* Main Base Platform — wider to contain the new layout */}
            <mesh position={[0, -0.1, 0]}>
                <cylinderGeometry args={[6.5, 6.5, 0.2, 64]} />
                <meshStandardMaterial color="#0b1b2b" wireframe={isDevMode} roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Inner Glowing Ring on Base */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[6.3, 6.45, 64]} />
                <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.5} wireframe={isDevMode} />
            </mesh>
        </group>
    );
}
