"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { TechHub } from "./TechHub";
import { CameraRig } from "./CameraRig";
import { Particles } from "./Particles";
import { Suspense } from "react";
import { useTablet } from "@/hooks/useMobile";

export default function Scene() {
    const isTablet = useTablet();

    return (
        <div className="w-full h-screen absolute inset-0 z-0 bg-trust-blue text-neon-cyan flex items-center justify-center font-mono">
            <Canvas
                camera={{ position: [0, 2, 8], fov: 45 }}
                dpr={[1, 2]}
                fallback={
                    <div className="flex w-full h-full flex-col items-center justify-center z-10 relative">
                        <span>[SYSTEM WARNING: WebGL Context Failed]</span>
                        <span className="text-white mt-2">Loading 2D Parallax Fallback...</span>
                    </div>
                }
            >
                <color attach="background" args={["#0A2540"]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <Suspense fallback={null}>
                    <TechHub />
                    <Particles />
                    <Environment preset="city" />
                    <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={20} blur={2} far={4} />

                    {!isTablet && (
                        <EffectComposer>
                            <Bloom intensity={1.5} luminanceThreshold={1} mipmapBlur={true} />
                        </EffectComposer>
                    )}
                </Suspense>
                <CameraRig />
            </Canvas>
        </div>
    );
}
