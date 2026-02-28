"use client";

import { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/ui/Navbar";
import DevOverlay from "@/components/ui/DevOverlay";
import ContentOverlay from "@/components/ui/ContentOverlay";
import Scene from "@/components/canvas/Scene";
import SplashScreen from "@/components/ui/SplashScreen";
import MobileTechHub2D from "@/components/ui/MobileTechHub2D";
import MultiverseCanvas from "@/components/canvas/MultiverseCanvas";
import WarpTransition from "@/components/ui/WarpTransition";
import DeepLinkHandler from "@/components/utils/DeepLinkHandler";
import { useMobile } from "@/hooks/useMobile";
import { useAppStore } from "@/store/useAppStore";

// ─── Canvas swap timing ───────────────────────────────────────────────────────
// The WarpTransition white-flash peaks at ~950 ms after isMultiverseView toggles.
// We delay the actual canvas mount/unmount by SWAP_DELAY ms so the swap happens
// behind the opaque white flash — eliminating any canvas "bleed-through".
const SWAP_DELAY = 950; // ms — matches the "flash" phase in WarpTransition.tsx

export default function Home() {
  const isMobile = useMobile();
  const { isMultiverseView } = useAppStore();

  // renderMultiverse trails isMultiverseView by SWAP_DELAY ms.
  // During that window the WarpTransition overlay is fully opaque white,
  // so the canvas swap is completely hidden.
  const [renderMultiverse, setRenderMultiverse] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setRenderMultiverse(isMultiverseView), SWAP_DELAY);
    return () => clearTimeout(id);
  }, [isMultiverseView]);

  // Navbar / DevOverlay: hide them only once the multiverse is actually rendered
  const showHubUI = !renderMultiverse;

  return (
    <main
      className={[
        "relative w-full bg-trust-blue text-crisp-white",
        // 3D view needs a locked viewport; 2D mobile must scroll freely
        isMobile ? "min-h-screen" : "h-screen overflow-hidden",
      ].join(" ")}
    >
      <SplashScreen />

      {/* Always-on warp flash — renders above everything at z-[70] */}
      <WarpTransition />

      {/* Deep link handler — reads ?section= / ?action= on mount */}
      <Suspense fallback={null}>
        <DeepLinkHandler />
      </Suspense>

      {showHubUI && <Navbar />}
      {showHubUI && <DevOverlay />}

      {isMobile ? (
        <MobileTechHub2D />
      ) : renderMultiverse ? (
        /* ── Multiverse view ── */
        <MultiverseCanvas />
      ) : (
        /* ── Tech Hub view ── */
        <>
          <Scene />
          <ContentOverlay />
        </>
      )}
    </main>
  );
}
