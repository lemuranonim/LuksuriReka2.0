"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';

export function Particles() {
    const pointsRef = useRef<THREE.Points>(null);
    const { isDevMode } = useAppStore();
    const count = 400; // Total particles

    // Generate soft circular glowing texture for realistic dust
    const dustTexture = useMemo(() => {
        if (typeof window === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (context) {
            const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.2, 'rgba(0, 240, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 32, 32);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    // Generate random positions and initial velocities
    const [positions, phases] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const phs = new Float32Array(count); // Random phases for twinkling

        for (let i = 0; i < count; i++) {
            // Spread them across the area (x: -10 to 10, y: 0 to 8, z: -10 to 10)
            pos[i * 3 + 0] = (Math.random() - 0.5) * 20;     // X
            pos[i * 3 + 1] = Math.random() * 8;              // Y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;     // Z

            phs[i] = Math.random() * Math.PI * 2;
        }

        return [pos, phs];
    }, [count]);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        // Very slowly rotate the entire particle cloud
        pointsRef.current.rotation.y += delta * 0.02;

        const time = state.clock.elapsedTime;
        const geometry = pointsRef.current.geometry;
        const positionsAttribute = geometry.attributes.position;

        // Animate a gentle upward floating motion and twinkle
        for (let i = 0; i < count; i++) {
            // Slow float upwards
            positionsAttribute.setY(i, positionsAttribute.getY(i) + delta * 0.1);

            // Reset if they float too high
            if (positionsAttribute.getY(i) > 8) {
                positionsAttribute.setY(i, 0);
            }
        }

        positionsAttribute.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                map={dustTexture || undefined}
                color="#00F0FF"
                transparent={true}
                opacity={0.6}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                // Dev mode shows much larger prominent dots for debugging bounding boxes
                size={isDevMode ? 0.2 : 0.08}
            />
        </points>
    );
}
