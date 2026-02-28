"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BentoCard from "@/components/ui/BentoCard";
import Link from "next/link";

// ─── Constants ────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
    {
        id: "inv",
        q: "How to read your Luksuri Reka Invoice",
        a: "Every invoice issued by Luksuri Reka contains a unique Document ID (e.g., DOC-YYYYMM-XXX). The top-right section shows the digital signature fingerprint. You can verify the invoice's authenticity at any time using the Document Verification module above. Check the due date, line items, and bank transfer details carefully before processing payment.",
    },
    {
        id: "prop",
        q: "Proposal Consultation Workflow",
        a: "Client submits a brief → Luksuri Reka issues a scoped proposal within 2–5 business days → Client reviews and requests revisions (up to 2 rounds) → Signed proposal activates the project agreement. All proposals are digitally signed and verifiable via the Document Verification module.",
    },
    {
        id: "maint",
        q: "Server Maintenance Schedules",
        a: "Routine maintenance windows occur every Sunday 00:00–03:00 WIB. Emergency patches are announced via WhatsApp channel at least 1 hour in advance. Client dashboards may be briefly unavailable during these windows. SLA uptime guarantee: 99.5% monthly.",
    },
    {
        id: "pay",
        q: "Payment Terms & Invoice Disputes",
        a: "Standard payment terms: NET-14 from invoice date. Disputes must be raised within 7 calendar days of invoice receipt. Contact the CEO directly via WhatsApp (+62 821 4370 6440) or email for any billing discrepancies. Late payments beyond NET-30 incur a 2% monthly service charge.",
    },
    {
        id: "proj",
        q: "Project Delivery & Handover Protocol",
        a: "Upon project completion, a KWT (Kwitansi/Receipt) document is issued along with a technical handover briefing. Source code is delivered via private repository. A 30-day post-delivery support period is included. All deliverables are documented in the final KWT, which is verifiable via the Document Verification system.",
    },
];

const SERVICES = [
    { label: "Custom Web & Mobile Apps", status: "OPERATIONAL", color: "#00F0FF" },
    { label: "Cloud Infrastructure", status: "OPERATIONAL", color: "#00F0FF" },
    { label: "UI/UX Design Studio", status: "OPERATIONAL", color: "#00F0FF" },
    { label: "Digital Signature (Sign)", status: "OPERATIONAL", color: "#00F0FF" },
    { label: "Client Dashboard", status: "OPERATIONAL", color: "#00F0FF" },
    // { label: "Client Dashboard", status: "MAINTENANCE", color: "#F59E0B" },
];

// ─── Stagger containers ───────────────────────────────────────────────────────
const grid = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

// ─── Document Verification Module ────────────────────────────────────────────

function DocVerify() {
    const [documentId, setDocumentId] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState("");
    const [log, setLog] = useState<string[]>([]);

    // Simulated scan log lines to show while querying
    const SCAN_LINES = [
        "» Initialising L.A. Database connection…",
        "» Authenticating query token…",
        "» Scanning document registry…",
        "» Cross-referencing signature chain…",
        "» Validating CEO endorsement hash…",
    ];

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();

        if (!documentId.trim()) {
            setError("Please enter a valid Document ID.");
            return;
        }

        setError("");
        setIsScanning(true);
        setLog([]);

        // Roll out scan log lines one by one
        SCAN_LINES.forEach((line, i) => {
            setTimeout(() => setLog((prev) => [...prev, line]), i * 210);
        });

        // Navigate at ~1200ms
        setTimeout(() => {
            // Reset in case user presses back
            setIsScanning(false);
            window.location.href =
                "https://sign.luksurireka.com/validate/" + encodeURIComponent(documentId.trim());
        }, 1200);
    };

    return (
        <BentoCard colSpan="2" className="gap-4">
            {/* Module label */}
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-neon-cyan rounded-full" />
                <span className="font-mono text-[0.6rem] tracking-[0.25em] text-neon-cyan/70 uppercase">
                    Module / Document Verification
                </span>
                {/* Live indicator during scan */}
                {isScanning && (
                    <span className="ml-auto flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                        <span className="font-mono text-[0.55rem] text-neon-cyan/70 tracking-widest uppercase">
                            Scanning
                        </span>
                    </span>
                )}
            </div>

            <h2 className="text-base font-bold text-white leading-tight">
                Digital Signature &amp; Document Verification
            </h2>
            <p className="text-xs text-white/50 leading-relaxed font-mono">
                Verify the authenticity of documents signed by{" "}
                <span className="text-white/80">LUDTANZA WIJAYA</span> (CEO, Luksuri Reka).
                Enter the Document ID from your proposal, invoice, or receipt.{" "}
                Format: <span className="text-neon-cyan/70">DOC-&lt;timestamp&gt;-&lt;code&gt;</span>{" "}
                (e.g., DOC-1771XXXXXXXXX-XXXX).
            </p>

            {/* Input + Button */}
            <form onSubmit={handleVerify} className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={documentId}
                        onChange={(e) => {
                            setDocumentId(e.target.value);
                            if (error) setError("");
                        }}
                        disabled={isScanning}
                        placeholder="e.g., DOC-1771XXXXXXXXX-XXXX"
                        className={[
                            "flex-1 bg-black/40 rounded-sm px-3 py-2 font-mono text-xs text-white",
                            "placeholder:text-white/25 focus:outline-none transition-colors min-w-0",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            error
                                ? "border border-red-500/60 focus:border-red-400"
                                : "border border-white/15 focus:border-neon-cyan/60",
                        ].join(" ")}
                    />
                    <button
                        type="submit"
                        disabled={isScanning}
                        className={[
                            "shrink-0 px-4 py-2 rounded-sm font-mono text-xs font-bold tracking-widest uppercase",
                            "border border-[#00F0FF]/50 bg-[#00F0FF]/10 text-[#00F0FF]",
                            "hover:bg-[#00F0FF]/20 transition-all",
                            "disabled:opacity-60 disabled:cursor-not-allowed",
                            "flex items-center gap-2 whitespace-nowrap",
                        ].join(" ")}
                    >
                        {isScanning ? (
                            <>
                                {/* CSS spinner */}
                                <span
                                    className="block w-3 h-3 rounded-full border-2 border-neon-cyan/30 border-t-neon-cyan animate-spin"
                                    aria-hidden
                                />
                                Scanning L.A. Database...
                            </>
                        ) : (
                            "Verify Document"
                        )}
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <p className="font-mono text-xs text-red-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        {error}
                    </p>
                )}
            </form>

            {/* Rolling scan log */}
            <AnimatePresence>
                {isScanning && log.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-black/50 border border-white/[0.06] rounded-sm px-3 py-2 flex flex-col gap-0.5">
                            {log.map((line, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="font-mono text-[0.6rem] text-neon-cyan/60"
                                >
                                    {line}
                                </motion.p>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </BentoCard>
    );
}


function LAComms() {
    const [typed, setTyped] = useState("");
    const greeting = "Hello! I'm L.A., your Luksuri Assistant. How can I help you today?";

    // Typewriter effect on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        let i = 0;
        const id = setInterval(() => {
            i++;
            setTyped(greeting.slice(0, i));
            if (i >= greeting.length) clearInterval(id);
        }, 28);
        return () => clearInterval(id);
    }, []);

    return (
        <BentoCard colSpan="1" className="gap-0 !p-0 overflow-hidden min-h-[260px]">
            {/* ── Header bar ── */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.07] bg-white/[0.02]">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full border border-purple-400/40 bg-black/60 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
                            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                            <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                        </svg>
                    </div>
                    {/* Online dot */}
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#050510] shadow-[0_0_4px_rgba(52,211,153,0.8)]" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-bold text-white leading-tight">L.A. Assistant</p>
                    <p className="font-mono text-[0.55rem] text-emerald-400/80 tracking-wider">● ONLINE · Avg. reply &lt; 2 hrs</p>
                </div>
                {/* Module tag */}
                <span className="shrink-0 font-mono text-[0.5rem] tracking-widest text-purple-300/40 uppercase border border-purple-400/15 px-1.5 py-0.5 rounded-sm">
                    Comms
                </span>
            </div>

            {/* ── Chat area ── */}
            <div className="flex flex-col gap-3 px-4 py-3 flex-1">
                {/* Assistant greeting bubble */}
                <div className="flex items-start gap-2">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mt-0.5">
                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-purple-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
                            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                    </div>
                    <div className="flex-1 bg-purple-500/10 border border-purple-400/15 rounded-sm rounded-tl-none px-3 py-2">
                        <p className="font-mono text-[0.65rem] text-white/75 leading-relaxed">
                            {typed}
                            {typed.length < greeting.length && (
                                <span className="inline-block w-0.5 h-3 bg-purple-400 ml-0.5 animate-pulse align-middle" />
                            )}
                        </p>
                    </div>
                </div>

                {/* Response time / SLA note */}
                <p className="font-mono text-[0.55rem] text-white/25 text-center">
                    — Select a channel to start a session —
                </p>

                {/* Channel CTAs */}
                <div className="flex flex-col gap-2 mt-auto">
                    <a
                        href="https://wa.me/6282143706440?text=Hello%20L.A.%2C%20I%20need%20support%20from%20Luksuri%20Reka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-3 py-2.5 bg-emerald-500/8 border border-emerald-500/25 rounded-sm hover:bg-emerald-500/15 hover:border-emerald-400/45 transition-all duration-200"
                    >
                        <div className="w-7 h-7 rounded-sm bg-emerald-500/15 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/25 transition-colors">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-emerald-400" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.12 1.527 5.847L.057 23.882l6.204-1.428A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.525-5.177-1.435l-.371-.22-3.683.847.88-3.542-.242-.383A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="font-mono text-xs font-semibold text-emerald-400 leading-tight">WhatsApp</p>
                            <p className="font-mono text-[0.55rem] text-emerald-400/50">+62 821 4370 6440</p>
                        </div>
                        <svg viewBox="0 0 24 24" className="w-3 h-3 text-emerald-400/30 group-hover:text-emerald-400/70 ml-auto shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>

                    <a
                        href="mailto:mail@luksurireka.com?subject=Support%20Request%20via%20Engineering%20Bay"
                        className="group flex items-center gap-3 px-3 py-2.5 bg-neon-cyan/5 border border-neon-cyan/20 rounded-sm hover:bg-neon-cyan/10 hover:border-neon-cyan/40 transition-all duration-200"
                    >
                        <div className="w-7 h-7 rounded-sm bg-neon-cyan/10 flex items-center justify-center shrink-0 group-hover:bg-neon-cyan/20 transition-colors">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-neon-cyan" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="font-mono text-xs font-semibold text-neon-cyan leading-tight">Email</p>
                            <p className="font-mono text-[0.55rem] text-neon-cyan/50">mail@luksurireka.com</p>
                        </div>
                        <svg viewBox="0 0 24 24" className="w-3 h-3 text-neon-cyan/30 group-hover:text-neon-cyan/70 ml-auto shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-4 py-2 border-t border-white/[0.05] bg-white/[0.015] flex items-center justify-between">
                <span className="font-mono text-[0.5rem] text-white/20 tracking-widest uppercase">Powered by Luksuri AI</span>
                <span className="font-mono text-[0.5rem] text-purple-300/30">L.A. v2.0</span>
            </div>
        </BentoCard>
    );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FAQAccordion() {
    const [openId, setOpenId] = useState<string | null>(null);

    return (
        <BentoCard colSpan="2" className="gap-0">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-amber-400 rounded-full" />
                <span className="font-mono text-[0.6rem] tracking-[0.25em] text-amber-400/70 uppercase">Knowledge Base / FAQ</span>
            </div>

            <div className="flex flex-col divide-y divide-white/[0.06]">
                {FAQ_ITEMS.map((item) => (
                    <div key={item.id}>
                        <button
                            className="w-full flex items-center justify-between py-3 text-left group"
                            onClick={() => setOpenId(openId === item.id ? null : item.id)}
                        >
                            <span className="text-sm text-white/80 group-hover:text-white transition-colors pr-4 leading-snug">
                                {item.q}
                            </span>
                            <motion.span
                                animate={{ rotate: openId === item.id ? 45 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="shrink-0 text-neon-cyan/50 text-lg font-light"
                            >
                                +
                            </motion.span>
                        </button>
                        <AnimatePresence>
                            {openId === item.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.22, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-xs text-white/50 font-mono leading-relaxed pb-4 pt-1">
                                        {item.a}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </BentoCard>
    );
}

// ─── System Status ────────────────────────────────────────────────────────────

function SystemStatus() {
    return (
        <BentoCard colSpan="1">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-4 bg-emerald-400 rounded-full" />
                <span className="font-mono text-[0.6rem] tracking-[0.25em] text-emerald-400/70 uppercase">System Status</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">ALL SYSTEMS OPERATIONAL</span>
            </div>

            <div className="flex flex-col gap-2">
                {SERVICES.map((s, i) => (
                    <div key={i} className="flex items-center justify-between font-mono text-[0.65rem]">
                        <span className="text-white/50 truncate pr-2">{s.label}</span>
                        <span
                            className="shrink-0 px-2 py-0.5 rounded-sm border text-[0.55rem] tracking-widest uppercase"
                            style={{ color: s.color, borderColor: `${s.color}40`, background: `${s.color}0d` }}
                        >
                            {s.status}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-auto pt-4 font-mono text-[0.55rem] text-white/20 tracking-widest">
                LAST SYNC: {new Date().toISOString().slice(0, 16).replace("T", " ")} UTC
            </div>
        </BentoCard>
    );
}

// ─── Quick Links ──────────────────────────────────────────────────────────────

function QuickLinks() {
    return (
        <BentoCard colSpan="1">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-4 bg-neon-cyan/70 rounded-full" />
                <span className="font-mono text-[0.6rem] tracking-[0.25em] text-neon-cyan/60 uppercase">Quick Access</span>
            </div>
            <div className="flex flex-col gap-1.5">
                {[
                    { label: "/sign.luksurireka.com", href: "https://sign.luksurireka.com" },
                    { label: "/main-hub", href: "/" },
                    { label: "/portfolio", href: "/?section=portfolio" },
                    { label: "/contact", href: "/?action=contact" },
                ].map((l) => (
                    <a
                        key={l.href}
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="font-mono text-xs text-white/40 hover:text-neon-cyan transition-colors flex items-center gap-1.5 group"
                    >
                        <span className="text-neon-cyan/30 group-hover:text-neon-cyan transition-colors">›</span>
                        {l.label}
                    </a>
                ))}
            </div>
        </BentoCard>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HelpPage() {
    return (
        <div
            className="min-h-screen text-crisp-white font-sans"
            style={{
                background: "#050510",
                backgroundImage: `
                    linear-gradient(rgba(0,240,255,0.025) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,240,255,0.025) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
            }}
        >
            {/* Top bar */}
            <header className="border-b border-white/[0.07] px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-[#050510]/80">
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="font-mono text-xs text-white/40 hover:text-neon-cyan transition-colors flex items-center gap-1.5"
                    >
                        ← Main Hub
                    </Link>
                    <span className="text-white/10">|</span>
                    <span className="font-mono text-[0.65rem] text-white/25 tracking-widest uppercase">Help Center</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[0.6rem] text-emerald-400/70 tracking-widest uppercase hidden sm:block">Live</span>
                </div>
            </header>

            {/* Main grid */}
            <motion.div
                variants={grid}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 md:p-8 max-w-7xl mx-auto"
            >
                {/* ── Header — full width ── */}
                <BentoCard colSpan="full" glowOnHover={false} className="!bg-transparent !border-none !p-0 gap-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div>
                            <p className="font-mono text-[0.6rem] tracking-[0.3em] text-neon-cyan/60 uppercase mb-1">
                                Luksuri Reka Digital Solutions / Support
                            </p>
                            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">
                                Help Center
                            </h1>
                            <p className="text-sm text-white/40 font-mono mt-1">
                                Client Assistance, Document Verification, and Technical Support.
                            </p>
                        </div>
                        <div className="ml-auto hidden md:flex items-center gap-2 font-mono text-[0.6rem] text-white/25 border border-white/10 rounded-sm px-3 py-1.5">
                            <span className="text-neon-cyan/50">REF</span>
                            <span>LR-HELP-CENTER-v2.0</span>
                        </div>
                    </div>
                </BentoCard>

                {/* ── Doc Verify (2-col) + L.A. Comms (1-col) = 3 cols ── */}
                <DocVerify />
                <LAComms />

                {/* ── FAQ (2-col) + Status (1-col) ── */}
                <FAQAccordion />
                <SystemStatus />

                {/* ── Quick Links (1-col, fills the 4th column on lg) ── */}
                <QuickLinks />

                {/* ── Footer strip — full width ── */}
                <BentoCard colSpan="full" glowOnHover={false} className="!py-3 flex-row items-center justify-between flex-wrap gap-2">
                    <span className="font-mono text-[0.6rem] text-white/20 tracking-widest uppercase">
                        © {new Date().getFullYear()} PT Luksuri Reka Digital Solutions. All rights reserved.
                    </span>
                    <span className="font-mono text-[0.6rem] text-neon-cyan/30 tracking-wide">
                        Chief Executive Officer: LUDTANZA WIJAYA · Bandung, Tulungagung, East Java, Indonesia
                    </span>
                </BentoCard>
            </motion.div>
        </div>
    );
}
