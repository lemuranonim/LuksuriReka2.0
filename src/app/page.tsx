"use client";

import Navbar from "@/components/ui/Navbar";
import DevOverlay from "@/components/ui/DevOverlay";
import Scene from "@/components/canvas/Scene";
import { useAppStore } from "@/store/useAppStore";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { activeSection, setActiveSection } = useAppStore();

  return (
    <main className="relative w-full h-screen overflow-hidden bg-trust-blue text-crisp-white">
      <Navbar />
      <DevOverlay />

      {/* 3D Scene Layer */}
      <Scene />

      {/* 2D UI Overlay Layer via Framer Motion */}
      <AnimatePresence>
        {activeSection !== 'hub' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center p-8 mt-20"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl w-full max-w-4xl shadow-2xl pointer-events-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold font-sans">
                  {activeSection === 'desk' && "CEO PORTFOLIO"}
                  {activeSection === 'plant' && "ENTERPRISE CASE STUDY"}
                  {activeSection === 'server' && "STARTUP/UMKM SOLUTIONS"}
                </h2>
                <button
                  onClick={() => setActiveSection('hub')}
                  className="px-4 py-2 bg-neon-cyan/20 hover:bg-neon-cyan/40 text-neon-cyan rounded-full font-mono text-sm transition-colors border border-neon-cyan/50"
                >
                  RETURN TO HUB
                </button>
              </div>

              <div className="space-y-4 font-sans text-gray-200">
                {activeSection === 'desk' && (
                  <p>A deep dive into the visionary leadership and technical expertise driving Luksuri Reka Digital Solutions.</p>
                )}
                {activeSection === 'plant' && (
                  <p>Highlighting our comprehensive digital transformation work for PT Advanta Seeds Indonesia.</p>
                )}
                {activeSection === 'server' && (
                  <p>Scalable, high-performance software packages tailored for upcoming startups and UMKM enterprises.</p>
                )}
                <div className="h-40 border border-white/10 rounded-lg bg-black/20 flex items-center justify-center font-mono text-sm text-white/50">
                  // Content placeholder - to be expanded
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
