"use client";

import { useAppStore } from "@/store/useAppStore";
import { Terminal, Code2 } from "lucide-react";

export default function Navbar() {
    const { isDevMode, toggleDevMode, setActiveSection } = useAppStore();

    return (
        <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-auto mix-blend-difference text-white">
            <button
                onClick={() => {
                    const { activeSection } = useAppStore.getState();
                    if (activeSection !== 'about') {
                        setActiveSection('about');
                    } else {
                        setActiveSection('hub');
                    }
                }}
                className="flex items-center gap-3 group transition-all duration-300"
            >
                {/* SVG Component for the Logo */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all duration-300">
                    <path d="M16 2L2 10V22L16 30L30 22V10L16 2Z" stroke="#00F0FF" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M16 8L8 12.5V19.5L16 24L24 19.5V12.5L16 8Z" fill="#00F0FF" fillOpacity="0.2" stroke="#00F0FF" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M16 8V24" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 12.5L24 19.5" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M24 12.5L8 19.5" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" />
                </svg>

                <div className="flex flex-col text-left">
                    <div className="font-sans font-bold text-xl tracking-tighter group-hover:text-neon-cyan transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                        LUKSURI<span className="text-neon-cyan">REKA</span>
                    </div>
                    <div className="font-mono text-[0.65rem] tracking-widest text-white/70 group-hover:text-neon-cyan/80 transition-colors duration-300">
                        DIGITAL SOLUTIONS
                    </div>
                </div>
            </button>
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
