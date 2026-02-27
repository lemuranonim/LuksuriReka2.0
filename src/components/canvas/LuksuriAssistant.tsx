"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, Billboard } from "@react-three/drei";
import { useAppStore } from "@/store/useAppStore";
import * as THREE from "three";
import { ThreeElements } from "@react-three/fiber";

export function LuksuriAssistant(props: ThreeElements['group']) {
    const { isMascotSpeaking, toggleMascotSpeaking, isDevMode, setActiveSection, activeSection } = useAppStore();
    const groupRef = useRef<THREE.Group>(null);
    const eyeRef1 = useRef<THREE.MeshPhysicalMaterial>(null);
    const eyeRef2 = useRef<THREE.MeshPhysicalMaterial>(null);

    const [mascotTexture, setMascotTexture] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        const texLoader = new THREE.TextureLoader();
        texLoader.load(
            '/mascot.png',
            (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                setMascotTexture(tex);
            },
            undefined,
            () => {
                console.warn("Mascot image not found. Fallback to primitive.");
            }
        );
    }, []);

    useFrame((state) => {
        // Pulsate eyes for fallback primitive robot
        if (!mascotTexture) {
            const t = state.clock.elapsedTime;
            const pulse = Math.abs(Math.sin(t * 2)) * 0.5 + 0.5;
            if (eyeRef1.current) eyeRef1.current.emissiveIntensity = pulse;
            if (eyeRef2.current) eyeRef2.current.emissiveIntensity = pulse;
        }
    });

    const [hovered, setHovered] = useState(false);

    // Dynamic rotation if hovered or speaking
    useFrame((state, delta) => {
        if (groupRef.current) {
            const targetRotationY = hovered || isMascotSpeaking ? 0.5 : 0;
            // Target scaling logic
            let targetScale = 1;
            if (isMascotSpeaking) {
                targetScale = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.05;
            }

            // Apply rotation & scale (Sprite rotation is ignored as Billboard handles it, but Group can scale)
            if (!mascotTexture) {
                groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotationY, 4, delta);
            }

            groupRef.current.scale.set(
                THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 4, delta),
                THREE.MathUtils.damp(groupRef.current.scale.y, targetScale, 4, delta),
                THREE.MathUtils.damp(groupRef.current.scale.z, targetScale, 4, delta)
            );
        }
    });

    return (
        <group
            {...props}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
            onClick={(e) => {
                e.stopPropagation();
                toggleMascotSpeaking();
                if (activeSection !== 'mascot') {
                    setActiveSection('mascot');
                } else {
                    setActiveSection('hub');
                }
            }}
        >
            <Float
                speed={isMascotSpeaking ? 4 : 2}
                rotationIntensity={isMascotSpeaking ? (mascotTexture ? 0.2 : 1) : (mascotTexture ? 0.1 : 0.5)}
                floatIntensity={isMascotSpeaking ? 2 : 1}
            >
                <group ref={groupRef}>
                    {mascotTexture ? (
                        <Billboard>
                            <mesh position={[0, 0, 0]}>
                                <planeGeometry args={[1.5, 1.5]} />
                                <meshBasicMaterial
                                    map={mascotTexture}
                                    transparent={true}
                                    color={hovered || isMascotSpeaking ? "#ffffff" : "#e0e0e0"}
                                />
                            </mesh>
                        </Billboard>
                    ) : (
                        <group>
                            {/* Mascot Body (Head) Fallback */}
                            <mesh position={[0, 0, 0]}>
                                <boxGeometry args={[0.8, 0.6, 0.6]} />
                                <meshStandardMaterial color="#0b1b2b" metalness={0.8} roughness={0.2} wireframe={isDevMode} />
                            </mesh>

                            {/* Antenna */}
                            <mesh position={[0, 0.4, 0]}>
                                <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                                <meshStandardMaterial color="#333" />
                            </mesh>
                            <mesh position={[0, 0.55, 0]}>
                                <sphereGeometry args={[0.08]} />
                                <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={isMascotSpeaking ? 1 : 0.5} />
                            </mesh>

                            {/* Eyes */}
                            <mesh position={[-0.2, 0.1, 0.31]}>
                                <boxGeometry args={[0.2, 0.1, 0.05]} />
                                <meshPhysicalMaterial ref={eyeRef1} color="#00F0FF" emissive="#00F0FF" emissiveIntensity={1} />
                            </mesh>
                            <mesh position={[0.2, 0.1, 0.31]}>
                                <boxGeometry args={[0.2, 0.1, 0.05]} />
                                <meshPhysicalMaterial ref={eyeRef2} color="#00F0FF" emissive="#00F0FF" emissiveIntensity={1} />
                            </mesh>

                            {/* Jaw/Mouth section */}
                            <mesh position={[0, -0.2, 0.31]}>
                                <boxGeometry args={[0.4, 0.05, 0.05]} />
                                <meshStandardMaterial color={isMascotSpeaking ? "#00F0FF" : "#111"} emissive={isMascotSpeaking ? "#00F0FF" : "black"} emissiveIntensity={isMascotSpeaking ? 1 : 0} />
                            </mesh>
                        </group>
                    )}
                </group>
            </Float>

            {/* Tooltip */}
            {hovered && !isMascotSpeaking && (
                <Html position={[0, 0.9, 0]} center className="pointer-events-none">
                    <div className="bg-black/90 text-neon-cyan border border-neon-cyan/50 px-4 py-1.5 rounded-lg font-mono text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] whitespace-nowrap backdrop-blur-md">
                        Luksuri Assistant
                    </div>
                </Html>
            )}
        </group>
    );
}
