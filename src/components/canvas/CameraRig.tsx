"use client";

import { useRef, useEffect } from "react";
import { CameraControls } from "@react-three/drei";
import { useAppStore } from "@/store/useAppStore";

// New layout reference:
//   LuksuriAssistant → [0, 0.5, 2]   (front-center focal point)
//   Desk             → [0, 0, -3]     (back-center)
//   HologramSeed     → [-4, 0, -1]    (left)
//   ServerRack       → [4, 0, -1]     (right)
//   WarpPortal       → [0, 2.2, -3]   (above Desk)

export function CameraRig() {
    const controlsRef = useRef<CameraControls>(null);
    const activeSection = useAppStore((state) => state.activeSection);

    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;

        switch (activeSection) {
            case 'ceo-portfolio':
                // Frame the Desk from slightly above and in front
                controls.setLookAt(0, 2.5, 2, 1, 0.8, -3, true);
                break;

            case 'case-study':
                // Frame the HologramSeed on the left
                controls.setLookAt(-2, 2, 3, -4, 0.8, -1, true);
                break;

            case 'services':
                // Frame the ServerRack on the right
                controls.setLookAt(2.5, 2, 3, 8, 1, -1, true);
                break;

            case 'mascot':
                // Close-up on the LuksuriAssistant (front-center)
                controls.setLookAt(0, 1.5, 5, 1, 1.0, 2, true);
                break;

            case 'about':
                // Wide isometric establishing shot of the whole room
                controls.setLookAt(0, 6, 12, 1, 0, -1, true);
                break;

            case 'hub':
            default:
                // Default: LuksuriAssistant beautifully framed front-center,
                // Desk / HologramSeed / ServerRack visible in the background
                controls.setLookAt(0, 3, 9, 0, 0.8, 1.5, true);
                break;
        }
    }, [activeSection]);

    return (
        <CameraControls
            ref={controlsRef}
            makeDefault
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 4}
            smoothTime={0.4}
        />
    );
}
