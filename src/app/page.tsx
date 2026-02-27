"use client";

import Navbar from "@/components/ui/Navbar";
import DevOverlay from "@/components/ui/DevOverlay";
import ContentOverlay from "@/components/ui/ContentOverlay";
import Scene from "@/components/canvas/Scene";
import SplashScreen from "@/components/ui/SplashScreen";
import MobileTechHub2D from "@/components/ui/MobileTechHub2D";
import { useMobile } from "@/hooks/useMobile";

export default function Home() {
  const isMobile = useMobile();

  return (
    <main className="relative w-full h-screen overflow-hidden bg-trust-blue text-crisp-white">
      <SplashScreen />
      <Navbar />
      <DevOverlay />

      {isMobile ? (
        <MobileTechHub2D />
      ) : (
        <>
          {/* 3D Scene Layer */}
          <Scene />

          {/* 2D UI Overlay Layer via Framer Motion */}
          <ContentOverlay />
        </>
      )}
    </main>
  );
}
