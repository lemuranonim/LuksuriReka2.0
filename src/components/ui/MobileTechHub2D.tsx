import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Code, Briefcase, Zap } from 'lucide-react';

const sections = [
    {
        id: 'ceo',
        title: 'CEO Portfolio',
        icon: <Briefcase className="w-6 h-6" />,
        color: 'from-blue-500/20 to-cyan-500/20',
        content: (
            <div className="space-y-4 text-sm text-gray-300">
                <p>Ahmad Fajar - Chief Executive Officer</p>
                <p>Expertise in full-stack architecture, web3 integration, and scalable system design. Leading Luksuri Reka towards cutting-edge digital solutions.</p>
                <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-xs">React</span>
                    <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-xs">Node.js</span>
                    <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-xs">Cloud</span>
                </div>
            </div>
        )
    },
    {
        id: 'case-study',
        title: 'Advanta Case Study',
        icon: <Code className="w-6 h-6" />,
        color: 'from-purple-500/20 to-pink-500/20',
        content: (
            <div className="space-y-4 text-sm text-gray-300">
                <p>Advanta Seed Production Management System</p>
                <p>Revolutionized their logistics and seed tracking with a custom enterprise dashboard.</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>Performance increased by 40%</li>
                    <li>Real-time inventory tracking</li>
                </ul>
            </div>
        )
    },
    {
        id: 'services',
        title: 'Digital Solutions',
        icon: <Zap className="w-6 h-6" />,
        color: 'from-emerald-500/20 to-teal-500/20',
        content: (
            <div className="space-y-4 text-sm text-gray-300">
                <p>We build the future of the web.</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>Custom Web Applications</li>
                    <li>Enterprise Dashboards (PWA)</li>
                    <li>Interactive 3D Experiences</li>
                    <li>API Development & Integration</li>
                </ul>
            </div>
        )
    }
];

export default function MobileTechHub2D() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="min-h-[100dvh] w-full bg-[#0A2540] text-crisp-white overflow-y-auto pb-24 relative z-10 font-mono">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600 blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-neon-cyan blur-[120px]"
                />
            </div>

            <div className="relative z-10 px-6 pt-24 space-y-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-neon-cyan">
                        LUKSURI REKA
                    </h1>
                    <p className="text-gray-400 text-sm max-w-[280px] mx-auto">
                        Innovating digital experiences. Tailored enterprise solutions & immersive web technology.
                    </p>
                </motion.div>

                {/* Content Cards */}
                <div className="space-y-4">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-br ${section.color} backdrop-blur-md`}
                        >
                            <button
                                onClick={() => setExpandedId(expandedId === section.id ? null : section.id)}
                                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-white/5 text-neon-cyan">
                                        {section.icon}
                                    </div>
                                    <span className="font-bold text-lg">{section.title}</span>
                                </div>
                                <motion.div
                                    animate={{ rotate: expandedId === section.id ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {expandedId === section.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-5 pb-5 pt-2 border-t border-white/5">
                                            {section.content}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
