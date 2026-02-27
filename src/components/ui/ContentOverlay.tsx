"use client";

import { useAppStore } from "@/store/useAppStore";
import { AnimatePresence, motion } from "framer-motion";

export default function ContentOverlay() {
    const { activeSection, setActiveSection } = useAppStore();

    const contentMap = {
        'ceo-portfolio': {
            title: "CRAFTING DIGITAL EXCELLENCE",
            description: "A deep dive into the visionary leadership and technical expertise driving Luksuri Reka Digital Solutions.",
            mockup: "TECH_STACK_GRID_MOCKUP_DATA"
        },
        'case-study': {
            title: "AGRICULTURAL TECH AT SCALE",
            description: "Highlighting our comprehensive digital transformation work for PT Advanta Seeds Indonesia.",
            mockup: "SYSTEM_ARCHITECTURE_METRICS_MOCKUP"
        },
        'services': {
            title: "EMPOWERING UMKM & STARTUPS",
            description: "Scalable, high-performance software packages tailored for upcoming startups and UMKM enterprises.",
            mockup: "PRICING_TIER_MOCKUP"
        }
    };

    const activeContent = activeSection !== 'hub' ? contentMap[activeSection] : null;

    return (
        <AnimatePresence>
            {activeSection !== 'hub' && activeContent && (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="absolute inset-0 z-30 pointer-events-none flex items-center justify-end p-8 mt-20"
                >
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl w-full max-w-lg shadow-[0_0_40px_rgba(0,240,255,0.1)] pointer-events-auto mr-12 h-auto">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-3xl font-bold font-sans text-neon-cyan leading-tight pr-4">
                                {activeContent.title}
                            </h2>
                            <button
                                onClick={() => setActiveSection('hub')}
                                className="px-4 py-2 bg-neon-cyan/20 hover:bg-neon-cyan/40 text-neon-cyan rounded-full font-mono text-sm transition-colors border border-neon-cyan/50 whitespace-nowrap"
                            >
                                RETURN TO HUB
                            </button>
                        </div>

                        <div className="space-y-6 font-sans text-gray-200">
                            <p className="text-lg leading-relaxed">{activeContent.description}</p>

                            <div className="h-48 border border-neon-cyan/30 rounded-lg bg-black/40 flex items-center justify-center font-mono text-sm text-neon-cyan/70 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent opacity-50"></div>
                                <div className="flex flex-col items-center">
                                    <span className="block mb-2 font-bold opacity-50">&lt;MockupView /&gt;</span>
                                    <span className="text-xs leading-loose">{activeContent.mockup}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
