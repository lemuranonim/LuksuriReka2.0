import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CompFeeds Project Report | Luksuri Reka",
    description: "Review of Project Progress & Financial Accountability for Compfeed",
};

// Next.js mewajibkan fungsi ini sebagai default export
export default function ProjectReportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-screen bg-[#050510]">
            {children}
        </section>
    );
}