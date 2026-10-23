import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import SiteNavigation from "@/components/site/SiteNavigation";
import { inter, jetbrainsMono } from "./fonts";
import "./globals.css";
import "./foundation.css";
import "./experience.css";
import "./motion.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.luksurireka.com"),
  title: "Luksuri Reka — Studio Digital",
  description: "Studio digital yang menyatukan desain, pengembangan aplikasi, dan otomasi untuk membantu bisnis bekerja lebih baik.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get("x-lr-locale") === "id" ? "id" : "en";
  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Suspense fallback={null}><SiteNavigation /></Suspense>
        {children}
      </body>
    </html>
  );
}
