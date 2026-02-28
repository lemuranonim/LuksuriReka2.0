"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BentoCardProps {
    children: ReactNode;
    className?: string;
    colSpan?: "full" | "2" | "1";
    glowOnHover?: boolean;
    onClick?: () => void;
}

export default function BentoCard({
    children,
    className = "",
    colSpan = "1",
    glowOnHover = true,
    onClick,
}: BentoCardProps) {
    const spanClass =
        colSpan === "full" ? "col-span-full" :
            colSpan === "2" ? "col-span-1 md:col-span-2" :
                "col-span-1";

    return (
        <motion.div
            className={[
                "relative overflow-hidden",
                "bg-white/[0.04] border border-white/10 rounded-sm",
                "p-5 flex flex-col gap-3",
                glowOnHover
                    ? "transition-all duration-300 hover:border-[#00F0FF]/40 hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(0,240,255,0.06)]"
                    : "",
                onClick ? "cursor-pointer" : "",
                spanClass,
                className,
            ].join(" ")}
            variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0 },
            }}
            onClick={onClick}
        >
            {/* Blueprint corner marks */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00F0FF]/30" />
            <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00F0FF]/30" />
            <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00F0FF]/30" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00F0FF]/30" />
            {children}
        </motion.div>
    );
}
