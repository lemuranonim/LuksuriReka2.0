"use client";

import { useAppStore } from "@/store/useAppStore";
import { Terminal, Code2 } from "lucide-react";

export default function Navbar() {
    const { isDevMode, toggleDevMode } = useAppStore();

    return (
        <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-auto mix-blend-difference text-white">
            <div className="font-sans font-bold text-xl tracking-tighter">
                LUKSURI<span className="text-neon-cyan">REKA</span>
            </div>
            <button
                onClick={toggleDevMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm transition-all duration-300 ${isDevMode ? 'bg-neon-cyan text-trust-blue shadow-[0_0_15px_rgba(0,240,255,0.5)]' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20'}`}
            >
                {isDevMode ? <Code2 size={16} /> : <Terminal size={16} />}
                {isDevMode ? "DEV_MODE: ON" : "DEV_MODE: OFF"}
            </button>
        </nav>
    );
}
