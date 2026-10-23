import type { Metadata } from "next";
import { headers } from "next/headers";
import { inter, jetbrainsMono } from "./fonts";
import NotFound from "./not-found";
import { SITE_URL } from "@/lib/site-content";
import "./globals.css";
import "./foundation.css";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: "404 — Luksuri Reka", robots: { index: false, follow: true } };

// Render a complete 404 document before hydration, including the requested
// language passed by the proxy, without relying on a page's error shell.
export default async function GlobalNotFound() {
  const locale = (await headers()).get("x-lr-locale") === "en" ? "en" : "id";
  return <html lang={locale}><body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}><NotFound /></body></html>;
}
