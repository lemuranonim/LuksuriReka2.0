"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Briefcase, Code2, Zap, MessageSquare, Info } from 'lucide-react';


// ─────────────────────────────────────────────────────────────────────────────
// Section data
// ─────────────────────────────────────────────────────────────────────────────
const sections = [
    {
        id: 'ceo',
        title: 'CEO/CTO Portfolio',
        subtitle: 'Ludtanza Wijaya',
        icon: <Briefcase className="w-5 h-5" />,
        accentFrom: 'from-blue-500/25',
        accentTo: 'to-cyan-500/10',
        borderColor: 'border-blue-400/30',
        iconBg: 'bg-blue-500/20 text-blue-300',
        content: (
            <div className="space-y-5">
                {/* Bio */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <h4 className="text-xs font-mono text-neon-cyan uppercase tracking-widest mb-2">About</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Passionate about merging complex backend architectures with pixel-perfect frontends. Dedicated to pushing the boundaries of web experiences through React Three Fiber, scalable Node.js services, and sophisticated cloud deployments.
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-[#0A2540]/60 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">5+</div>
                        <div className="text-xs text-gray-400 mt-1 font-mono">Years Experience</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0A2540]/60 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-neon-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">CEO</div>
                        <div className="text-xs text-gray-400 mt-1 font-mono">Luksuri Reka</div>
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <h4 className="text-xs font-mono text-neon-cyan uppercase tracking-widest mb-3">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                        {["Next.js", "TypeScript", "React Three Fiber", "Node.js", "Tailwind", "PostgreSQL"].map((tech) => (
                            <span key={tech} className="px-3 py-1.5 text-xs font-mono text-white bg-[#0A2540]/80 border border-white/10 rounded-full">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'case-study',
        title: 'Project Case Studies',
        subtitle: 'Our Projects',
        icon: <Code2 className="w-5 h-5" />,
        accentFrom: 'from-purple-500/25',
        accentTo: 'to-pink-500/10',
        borderColor: 'border-purple-400/30',
        iconBg: 'bg-purple-500/20 text-purple-300',
        content: (
            <div className="space-y-5">
                <h4 className="text-base font-bold text-white leading-tight">
                    Transforming Agricultural Tech for{' '}
                    <span className="text-neon-cyan">PT Advanta Seeds Indonesia</span>
                </h4>

                {/* Key metric pills — matches ContentOverlay exactly */}
                <div className="grid grid-cols-1 gap-2.5">
                    {["Multi-Platform Integration", "Offline-First Architecture", "Automated SLA Ticketing"].map((metric) => (
                        <div
                            key={metric}
                            className="p-3 rounded-xl bg-[#0A2540]/40 border border-neon-cyan/30 text-center shadow-[0_0_15px_rgba(0,240,255,0.08)]"
                        >
                            <span className="text-xs font-semibold text-neon-cyan tracking-wide">{metric}</span>
                        </div>
                    ))}
                </div>

                {/* KrosCekApps */}
                <div className="flex flex-col rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-400/20 backdrop-blur-md shadow-lg overflow-hidden">
                    <div className="px-5 pt-5 pb-4 border-b border-white/5">
                        <span className="text-[0.6rem] font-mono uppercase tracking-widest text-gray-400 block mb-1">
                            Cross-Platform Mobile Application
                        </span>
                        <h5 className="text-base font-bold text-white">KrosCekApps</h5>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {["Flutter", "Dart", "Hive (NoSQL)", "Firebase", "Supabase", "Google Sheets API"].map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2 py-0.5 text-[0.6rem] font-mono rounded-full border bg-emerald-500/15 text-emerald-300 border-emerald-400/25"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="px-5 py-4 flex flex-col gap-4">
                        {[
                            {
                                label: "Offline-First",
                                text: "Built for remote agricultural areas with unstable internet. Uses Hive for rapid local caching of vegetative, generative, and harvest inspection data."
                            },
                            {
                                label: "Hybrid Cloud Sync",
                                text: "Automatically synchronises local data with Firebase Firestore and Supabase once a connection is re-established."
                            },
                            {
                                label: "Geo-Tagging",
                                text: "Integrates maps_flutter and flutter_map for precise real-time location tracking of field workers."
                            }
                        ].map((h) => (
                            <div key={h.label} className="flex gap-3">
                                <div className="mt-1 w-0.5 shrink-0 rounded-full bg-neon-cyan/40 self-stretch" />
                                <div>
                                    <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider block mb-0.5">{h.label}</span>
                                    <p className="text-xs text-gray-300 leading-relaxed">{h.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scify CompFeed */}
                <div className="flex flex-col rounded-2xl border bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-neon-cyan/20 backdrop-blur-md shadow-lg overflow-hidden">
                    <div className="px-5 pt-5 pb-4 border-b border-white/5">
                        <span className="text-[0.6rem] font-mono uppercase tracking-widest text-gray-400 block mb-1">
                            Modern Fullstack Web Application
                        </span>
                        <h5 className="text-base font-bold text-white">Scify CompFeed</h5>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "WhatsApp API"].map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2 py-0.5 text-[0.6rem] font-mono rounded-full border bg-neon-cyan/10 text-neon-cyan border-neon-cyan/25"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="px-5 py-4 flex flex-col gap-4">
                        {[
                            {
                                label: "Serverless Architecture",
                                text: "Utilises Next.js Server Components and Server Actions for fast, SEO-friendly performance and direct database mutations."
                            },
                            {
                                label: "QR Code Verification",
                                text: "Farmers and customers scan seed bags for instant product verification and automated complaint submissions."
                            },
                            {
                                label: "Automated Ticketing & SLA",
                                text: "WhatsApp and Email integration auto-notifies stakeholders at each stage: Investigation → Lab Testing → Resolve."
                            }
                        ].map((h) => (
                            <div key={h.label} className="flex gap-3">
                                <div className="mt-1 w-0.5 shrink-0 rounded-full bg-neon-cyan/40 self-stretch" />
                                <div>
                                    <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider block mb-0.5">{h.label}</span>
                                    <p className="text-xs text-gray-300 leading-relaxed">{h.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'services',
        title: 'Digital Solutions',
        subtitle: 'Our Service Tiers',
        icon: <Zap className="w-5 h-5" />,
        accentFrom: 'from-emerald-500/25',
        accentTo: 'to-teal-500/10',
        borderColor: 'border-emerald-400/30',
        iconBg: 'bg-emerald-500/20 text-emerald-300',
        content: (
            <div className="space-y-4">
                {[
                    {
                        title: "Starter Go-Digital",
                        target: "Local UMKM",
                        features: ["Modern Landing Page", "Responsive Mobile", "Basic SEO Setup", "Contact Form Sync"],
                        glow: false
                    },
                    {
                        title: "Startup MVP",
                        target: "Rapid Development",
                        features: ["Fullstack Next.js", "Database Architecture", "Authentication", "Admin Dashboard"],
                        glow: true
                    },
                    {
                        title: "Enterprise Scale",
                        target: "Custom Architecture",
                        features: ["Microservices Ready", "High Availability", "Advanced Security", "3D/WebGL Experiences"],
                        glow: false
                    }
                ].map((tier, idx) => (
                    <div
                        key={idx}
                        className={`p-5 rounded-2xl border backdrop-blur-md flex flex-col gap-4 transition-all duration-300 ${tier.glow
                            ? 'border-neon-cyan/50 bg-neon-cyan/5 shadow-[0_0_20px_rgba(0,240,255,0.08)]'
                            : 'border-white/10 bg-white/5'
                            }`}
                    >
                        <div>
                            <span className="text-xs font-mono text-neon-cyan tracking-wider">{tier.target}</span>
                            <h4 className="text-base font-bold text-white mt-0.5">{tier.title}</h4>
                        </div>
                        <ul className="space-y-2">
                            {tier.features.map((feat) => (
                                <li key={feat} className="flex items-center gap-2.5 text-sm text-gray-300">
                                    <svg className="w-4 h-4 text-neon-cyan shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-2.5 rounded-xl bg-black/40 hover:bg-neon-cyan hover:text-[#0A2540] text-white font-mono text-xs transition-all duration-300 border border-white/20 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] font-bold tracking-widest">
                            START PROJECT →
                        </button>
                    </div>
                ))}
            </div>
        )
    },
    {
        id: 'contact',
        title: 'Contact Us',
        subtitle: 'Luksuri Assistant',
        icon: <MessageSquare className="w-5 h-5" />,
        accentFrom: 'from-yellow-500/25',
        accentTo: 'to-orange-500/10',
        borderColor: 'border-yellow-400/30',
        iconBg: 'bg-yellow-500/20 text-yellow-300',
        content: (
            <div className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                    Ready to start a project or have questions? Reach out through any of the channels below.
                </p>
                <div className="grid grid-cols-1 gap-3">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-1">
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Email</span>
                        <a href="mailto:hello@luksurireka.com" className="text-base font-bold text-neon-cyan hover:text-white transition-colors">
                            hello@luksurireka.com
                        </a>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-1">
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">WhatsApp</span>
                        <a href="https://wa.me/6282143706440" target="_blank" rel="noopener noreferrer" className="text-base font-bold text-neon-cyan hover:text-white transition-colors">
                            +62 821 4370 6440
                        </a>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-1">
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Office</span>
                        <p className="text-base font-medium text-white leading-relaxed">
                            Kedungwilut, Bandung,<br />
                            Tulungagung, Jawa Timur 66247
                        </p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'about',
        title: 'About Luksuri Reka',
        subtitle: 'Digital Pioneers',
        icon: <Info className="w-5 h-5" />,
        accentFrom: 'from-indigo-500/25',
        accentTo: 'to-violet-500/10',
        borderColor: 'border-indigo-400/30',
        iconBg: 'bg-indigo-500/20 text-indigo-300',
        content: (
            <div className="space-y-5">
                <h4 className="text-base font-bold text-white leading-tight">
                    Shaping The Future of{' '}
                    <span className="text-neon-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">Digital Interaction</span>
                </h4>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Luksuri Reka Digital is a cutting-edge creative and engineering lab based in Tulungagung, Jawa Timur. We specialize in building immersive web experiences, scalable cloud systems, and modern SaaS platforms.
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Leveraging <strong className="text-white">React Three Fiber</strong>, <strong className="text-white">Next.js</strong>, and microservice architectures, we empower brands through captivating interactive technology.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: "Founded", val: "2023" },
                        { label: "Focus", val: "WebGL & SaaS" },
                        { label: "Location", val: "Indonesia" },
                        { label: "Status", val: "Pioneering" },
                    ].map((stat) => (
                        <div key={stat.label} className="p-4 rounded-xl bg-[#0A2540]/60 border border-white/10 text-center flex flex-col justify-center items-center">
                            <span className="text-[0.65rem] font-mono text-gray-400 uppercase tracking-widest mb-1">{stat.label}</span>
                            <span className="text-base font-bold text-white">{stat.val}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function MobileTechHub2D() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

    return (
        <div className="min-h-[100dvh] w-full bg-[#0A2540] text-crisp-white overflow-y-auto pb-24 relative font-mono">

            {/* ── Animated Background Orbs ── */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-15%] left-[-15%] w-[65vw] h-[65vw] rounded-full bg-blue-600 blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                    className="absolute bottom-[-15%] right-[-15%] w-[70vw] h-[70vw] rounded-full bg-neon-cyan blur-[140px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                    className="absolute top-[40%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-purple-700 blur-[120px]"
                />
            </div>

            {/* ── Grid Pattern Overlay ── */}
            <div
                className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,240,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* ── Content ── */}
            <div className="relative z-10 px-5 pt-28 pb-10 space-y-8 max-w-lg mx-auto">

                {/* HERO */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-center space-y-5"
                >
                    {/* Logo */}
                    <div className="flex justify-center">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Image
                                src="/logo.png"
                                alt="Luksuri Reka Logo"
                                width={56}
                                height={56}
                                className="object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]"
                                priority
                            />
                        </motion.div>
                    </div>

                    {/* Brand name */}
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight font-sans">
                            <span className="text-white">LUKSURI</span>
                            <span className="text-neon-cyan drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">REKA</span>
                        </h1>
                        <p className="text-xs font-mono text-neon-cyan/70 tracking-[0.3em] mt-1 uppercase">
                            Digital Solutions
                        </p>
                    </div>

                    <p className="text-gray-400 text-sm max-w-[300px] mx-auto leading-relaxed">
                        Innovating digital experiences — tailored enterprise solutions &amp; immersive web technology.
                    </p>

                    {/* Decorative divider */}
                    <div className="flex items-center gap-3 max-w-[200px] mx-auto">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-neon-cyan/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-neon-cyan/50" />
                    </div>
                </motion.div>

                {/* ACCORDION CARDS */}
                <div className="space-y-3">
                    {sections.map((section, index) => {
                        const isOpen = expandedId === section.id;
                        return (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                                className={`rounded-2xl border overflow-hidden bg-gradient-to-br ${section.accentFrom} ${section.accentTo} ${section.borderColor} backdrop-blur-md shadow-lg transition-all duration-300 ${isOpen ? 'shadow-[0_0_25px_rgba(0,240,255,0.08)]' : ''}`}
                            >
                                {/* Card Header / Toggle */}
                                <button
                                    onClick={() => toggle(section.id)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors duration-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${section.iconBg} shadow-inner`}>
                                            {section.icon}
                                        </div>
                                        <div>
                                            <span className="font-bold text-base text-white block leading-tight">{section.title}</span>
                                            <span className="font-mono text-xs text-gray-400">{section.subtitle}</span>
                                        </div>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}
                                        className="shrink-0 ml-2"
                                    >
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </motion.div>
                                </button>

                                {/* Animated Content */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: "easeInOut" }}
                                            style={{ overflow: "hidden" }}
                                        >
                                            <div className="px-5 pb-6 pt-1 border-t border-white/5 font-sans">
                                                {section.content}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* FOOTER CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-8 p-6 rounded-3xl border border-neon-cyan/20 bg-neon-cyan/5 backdrop-blur-md text-center space-y-4 shadow-[0_0_30px_rgba(0,240,255,0.06)]"
                >
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Experience the <span className="text-neon-cyan font-semibold">full interactive 3D view</span> on a desktop or tablet browser.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-neon-cyan/60 tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                        Luksuri Reka Digital Solutions © 2024
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
