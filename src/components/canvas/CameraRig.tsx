"use client";

import { useRef, useEffect } from "react";
import { CameraControls } from "@react-three/drei";
import { useAppStore } from "@/store/useAppStore";

export function CameraRig() {
    const controlsRef = useRef<CameraControls>(null);
    const activeSection = useAppStore((state) => state.activeSection);

    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;

        switch (activeSection) {
            case 'ceo-portfolio':
                // Move closer to the Desk
                controls.setLookAt(-3, 1.5, 3, -3, 0.5, 0, true);
                break;
            case 'case-study':
                // Move closer to the Hologram Seed
                controls.setLookAt(0, 1.5, 3, 0, 0.5, 0, true);
                break;
            case 'services':
                // Move closer to the Server Rack
                controls.setLookAt(3, 1.5, 3, 3, 1, 0, true);
                break;
            case 'mascot':
                // Memposisikan kamera agar Luksuri Assistant berada di sebelah kiri layar (kamera geser kanan, memandang kiri)
                // Posisi asli Mascot: -3.5, 1, 2.5
                controls.setLookAt(-3.5, 1.2, 4.5, -2.5, 1.2, 2.5, true);
                break;
            case 'about':
                // Zoom out and pan up to show the entire tech hub scene symmetrically
                controls.setLookAt(0, 4, 10, 0, 0, 0, true);
                break;
            case 'hub':
            default:
                // Default isometric-ish view
                controls.setLookAt(0, 2, 8, 0, -0.5, 0, true);
                break;
        }
    }, [activeSection]);

    return (
        <CameraControls
            ref={controlsRef}
            makeDefault
            // Restrict camera movement so the user can't break the scene too much
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 4}
            // Configure responsiveness and damping
            smoothTime={0.4}
        />
    );
}
