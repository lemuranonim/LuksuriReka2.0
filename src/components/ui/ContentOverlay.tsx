"use client";

import { useAppStore } from "@/store/useAppStore";
import { AnimatePresence, motion, Variants } from "framer-motion";

export default function ContentOverlay() {
    const { activeSection, setActiveSection } = useAppStore();

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                when: "beforeChildren",
                staggerChildren: 0.15,
            }
        },
        exit: {
            opacity: 0,
            x: 50,
            transition: { duration: 0.4 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const renderCeoPortfolio = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bio Card */}
            <motion.div variants={itemVariants} className="md:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                <h3 className="text-xl font-bold text-white mb-2 font-sans tracking-wide">Bridging Logic & Aesthetics</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                    Passionate about merging complex backend architectures with pixel-perfect, highly interactive frontends. Dedicated to pushing the boundaries of web experiences through innovative tech like React Three Fiber, scalable Node.js services, and sophisticated cloud deployments.
                </p>
            </motion.div>

            {/* Tech Stack Card */}
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                <h3 className="text-xs font-bold text-neon-cyan mb-4 uppercase tracking-widest">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                    {["Next.js", "TypeScript", "React Three Fiber", "Node.js", "Tailwind", "Postgres"].map((tech) => (
                        <span key={tech} className="px-3 py-1.5 text-xs font-mono text-white bg-[#0A2540]/80 border border-white/5 rounded-full shadow-inner">
                            {tech}
                        </span>
                    ))}
                </div>
            </motion.div>

            {/* Experience Card */}
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg flex flex-col justify-center">
                <h3 className="text-xs font-bold text-neon-cyan mb-4 uppercase tracking-widest">Experience</h3>
                <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">5+</div>
                    <div className="text-sm text-gray-400 font-medium leading-snug">Years engineering<br />scalable systems</div>
                </div>
            </motion.div>
        </div>
    );

    // ── Typed project data for the Advanta case study ──────────────────────────
    interface CaseProject {
        name: string;
        type: string;
        accentColor: string;
        borderColor: string;
        badgeColor: string;
        stack: string[];
        highlights: { label: string; text: string }[];
    }

    const advantaProjects: CaseProject[] = [
        {
            name: "KrosCekApps",
            type: "Cross-Platform Mobile Application",
            accentColor: "from-emerald-500/10 to-teal-500/5",
            borderColor: "border-emerald-400/20",
            badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25",
            stack: ["Flutter", "Dart", "Hive (NoSQL)", "Firebase", "Supabase", "Google Sheets API"],
            highlights: [
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
            ]
        },
        {
            name: "Scify CompFeed",
            type: "Modern Fullstack Web Application",
            accentColor: "from-blue-500/10 to-cyan-500/5",
            borderColor: "border-neon-cyan/20",
            badgeColor: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/25",
            stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "WhatsApp API"],
            highlights: [
                {
                    label: "Serverless Architecture",
                    text: "Utilises Next.js Server Components and Server Actions for fast, SEO-friendly performance and direct database mutations without a traditional backend."
                },
                {
                    label: "QR Code Verification",
                    text: "Farmers and customers scan seed bags for instant product verification and automated complaint submissions."
                },
                {
                    label: "Automated Ticketing & SLA",
                    text: "WhatsApp and Email integration auto-notifies stakeholders at each investigation stage: Investigation → Lab Testing → Resolve."
                }
            ]
        }
    ];

    const renderCaseStudy = () => (
        <div className="space-y-6">
            {/* Section Header */}
            <motion.div variants={itemVariants}>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-sans leading-tight">
                    Transforming Agricultural Tech for{" "}
                    <br className="hidden md:block" />
                    <span className="text-neon-cyan">PT Advanta Seeds Indonesia</span>
                </h3>
            </motion.div>

            {/* Key-metric pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Multi-Platform Integration", "Offline-First Architecture", "Automated SLA Ticketing"].map((metric, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        className="p-4 rounded-xl bg-[#0A2540]/40 border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.08)] text-center flex items-center justify-center min-h-[70px]"
                    >
                        <span className="text-xs font-semibold text-neon-cyan tracking-wide">{metric}</span>
                    </motion.div>
                ))}
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {advantaProjects.map((project) => (
                    <motion.div
                        key={project.name}
                        variants={itemVariants}
                        className={`flex flex-col rounded-2xl border bg-gradient-to-br ${project.accentColor} ${project.borderColor} backdrop-blur-md shadow-lg overflow-hidden`}
                    >
                        {/* Card Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-white/5">
                            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-gray-400 block mb-1">
                                {project.type}
                            </span>
                            <h4 className="text-lg font-bold text-white leading-tight">{project.name}</h4>

                            {/* Tech Stack Badges */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {project.stack.map((tech) => (
                                    <span
                                        key={tech}
                                        className={`px-2 py-0.5 text-[0.6rem] font-mono rounded-full border ${project.badgeColor}`}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Architecture Highlights */}
                        <div className="px-6 py-5 flex flex-col gap-4 flex-grow">
                            {project.highlights.map((h) => (
                                <div key={h.label} className="flex gap-3">
                                    {/* Accent line */}
                                    <div className="mt-1 w-0.5 shrink-0 rounded-full bg-neon-cyan/40 self-stretch" />
                                    <div>
                                        <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider block mb-0.5">
                                            {h.label}
                                        </span>
                                        <p className="text-xs text-gray-300 leading-relaxed">{h.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const renderServices = () => (
        <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            {[
                {
                    title: "Starter Go-Digital",
                    target: "Local UMKM",
                    features: ["Modern Landing Page", "Responsive Mobile", "Basic SEO setup", "Contact form sync"],
                    accent: "border-white/10 bg-white/5"
                },
                {
                    title: "Startup MVP",
                    target: "Rapid Development",
                    features: ["Fullstack Next.js", "Database Architecture", "Authentication", "Admin Dashboard"],
                    accent: "border-neon-cyan/50 bg-neon-cyan/5 shadow-[0_0_20px_rgba(0,240,255,0.08)] transform md:-translate-y-2"
                },
                {
                    title: "Enterprise Scale",
                    target: "Custom Architecture",
                    features: ["Microservices Ready", "High Availability", "Advanced Security", "3D/WebGL experiences"],
                    accent: "border-white/10 bg-white/5"
                }
            ].map((tier, idx) => (
                <motion.div key={idx} variants={itemVariants} className={`flex-1 p-6 rounded-2xl border backdrop-blur-md flex flex-col ${tier.accent} transition-all duration-300 hover:border-white/30`}>
                    <div className="mb-5">
                        <span className="text-xs font-mono text-neon-cyan mb-1.5 block tracking-wider">{tier.target}</span>
                        <h3 className="text-xl font-bold text-white leading-tight">{tier.title}</h3>
                    </div>

                    <ul className="space-y-3.5 flex-grow mb-8">
                        {tier.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                                <svg className="w-4 h-4 text-neon-cyan mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{feat}</span>
                            </li>
                        ))}
                    </ul>

                    <button className="group relative w-full py-3 rounded-xl bg-black/40 hover:bg-neon-cyan hover:text-[#0A2540] text-white font-mono text-xs transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden border border-white/20 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                        <span className="relative z-10 font-bold tracking-widest">START PROJECT</span>
                        <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </motion.div>
            ))}
        </div>
    );

    const renderMascot = () => (
        <div className="space-y-6">
            <motion.div variants={itemVariants}>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-sans leading-tight">
                    Hello, I&apos;m <span className="text-neon-cyan">Luksuri Assistant</span>
                </h3>
                <p className="text-gray-300 mt-2 text-sm max-w-2xl">
                    I&apos;m here to help you connect with Luksuri Reka Digital Solutions. Feel free to reach out through any of the channels below if you have questions or want to start a project.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg flex flex-col gap-2">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Email</span>
                    <a href="mailto:hello@luksurireka.com" className="text-lg font-bold text-neon-cyan hover:text-white transition-colors">hello@luksurireka.com</a>
                </motion.div>

                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg flex flex-col gap-2">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Call / Whatsapp</span>
                    <a href="https://wa.me/6282143706440" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-neon-cyan hover:text-white transition-colors">+62 821 4370 6440</a>
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg flex flex-col gap-2">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Based in</span>
                    <p className="text-lg font-medium text-white leading-relaxed">
                        Kedungwilut, Bandung, <br />
                        Tulungagung, Jawa Timur 66247
                    </p>
                </motion.div>
            </div>
        </div>
    );

    const renderAbout = () => (
        <div className="space-y-6">
            <motion.div variants={itemVariants}>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-sans leading-tight">
                    Shaping The Future of <br className="hidden md:block" />
                    <span className="text-neon-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">Digital Interaction</span>
                </h3>
            </motion.div>

            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Luksuri Reka Digital is a cutting-edge creative and engineering lab based in Tulungagung, Jawa Timur. We specialize in building immersive web experiences, scalable cloud systems, and modern SaaS platforms that merge aesthetic brilliance with deep technical performance.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                    By leveraging state-of-the-art technologies such as <strong>React Three Fiber</strong>, <strong>Next.js</strong>, and robust microservice architectures, we empower brands to captivate users and automate complex workflows seamlessly.
                </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Founded", val: "2023" },
                    { label: "Focus", val: "WebGL & SaaS" },
                    { label: "Location", val: "Indonesia" },
                    { label: "Status", val: "Pioneering" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={itemVariants} className="p-4 rounded-xl bg-[#0A2540]/60 border border-white/10 text-center flex flex-col justify-center items-center shadow-inner">
                        <span className="text-[0.65rem] font-mono text-gray-400 uppercase tracking-widest mb-1">{stat.label}</span>
                        <span className="text-lg font-bold text-white">{stat.val}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const activeContent = activeSection !== 'hub' ? true : null;

    return (
        <AnimatePresence>
            {activeSection !== 'hub' && activeContent && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={containerVariants}
                    className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center md:justify-end p-4 md:p-8 pt-24 md:pt-8"
                >
                    <div className="backdrop-blur-xl bg-[#0A2540]/70 border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-4xl shadow-[0_0_50px_rgba(0,240,255,0.05)] pointer-events-auto mr-0 md:mr-12 max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col relative">

                        {/* Header Block */}
                        <div className="flex justify-between items-start mb-8 sticky top-0 z-20 pb-4 bg-[#0A2540]/60 backdrop-blur-md -mx-6 md:-mx-8 px-6 md:px-8 pt-2 rounded-t-3xl border-b border-white/5">
                            <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-bold font-sans text-white leading-tight pr-4 tracking-wide flex items-center gap-3">
                                <span className="w-2 h-8 bg-neon-cyan rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)] hidden md:block"></span>
                                {activeSection === 'ceo-portfolio' && "Luksuri Reka Digital"}
                                {activeSection === 'case-study' && "Project Case Studies"}
                                {activeSection === 'services' && "Digital Software Solutions"}
                                {activeSection === 'mascot' && "Contact Us"}
                                {activeSection === 'about' && "About Luksuri Reka"}
                            </motion.h2>
                            <button
                                onClick={() => setActiveSection('hub')}
                                className="px-4 py-2 bg-black/40 hover:bg-neon-cyan/20 text-white hover:text-neon-cyan rounded-full font-mono text-xs md:text-sm transition-all border border-white/20 hover:border-neon-cyan/50 whitespace-nowrap backdrop-blur-md"
                            >
                                CLOSE [X]
                            </button>
                        </div>

                        {/* Staggered Content Area */}
                        <div className="font-sans flex-grow pb-4">
                            {activeSection === 'ceo-portfolio' && renderCeoPortfolio()}
                            {activeSection === 'case-study' && renderCaseStudy()}
                            {activeSection === 'services' && renderServices()}
                            {activeSection === 'mascot' && renderMascot()}
                            {activeSection === 'about' && renderAbout()}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
