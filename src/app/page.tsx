"use client";

import Navbar from "@/components/ui/Navbar";
import DevOverlay from "@/components/ui/DevOverlay";
import ContentOverlay from "@/components/ui/ContentOverlay";
import Scene from "@/components/canvas/Scene";

export default function Home() {

  return (
    <main className="relative w-full h-screen overflow-hidden bg-trust-blue text-crisp-white">
      <Navbar />
      <DevOverlay />

      {/* 3D Scene Layer */}
      <Scene />

      {/* 2D UI Overlay Layer via Framer Motion */}
      <ContentOverlay />
    </main>
  );
}
