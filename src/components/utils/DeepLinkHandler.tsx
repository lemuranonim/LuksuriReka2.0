"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

/**
 * Reads URL query params on mount and translates them into Zustand state.
 * Must be wrapped in <Suspense> in the parent because useSearchParams()
 * requires it under the Next.js App Router.
 *
 * Supported params:
 *   ?section=portfolio   → setActiveSection('ceo-portfolio')
 *   ?section=casestudy   → setActiveSection('case-study')
 *   ?section=services    → setActiveSection('services')
 *   ?section=about       → setActiveSection('about')
 *   ?action=contact      → open mascot comms channel
 */
export default function DeepLinkHandler() {
    const searchParams = useSearchParams();
    const { setActiveSection, toggleMascotSpeaking, isMascotSpeaking } = useAppStore();

    useEffect(() => {
        const section = searchParams.get("section");
        const action = searchParams.get("action");

        // Give the scene a moment to mount before triggering camera transitions
        const timer = setTimeout(() => {
            if (section === "portfolio") {
                setActiveSection("ceo-portfolio");
            } else if (section === "casestudy") {
                setActiveSection("case-study");
            } else if (section === "services") {
                setActiveSection("services");
            } else if (section === "about") {
                setActiveSection("about");
            }

            if (action === "contact") {
                // Only toggle on if not already speaking
                if (!isMascotSpeaking) {
                    setActiveSection("mascot");
                    toggleMascotSpeaking();
                }
            }
        }, 600); // 600 ms — after splash + scene render

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount only

    return null;
}
