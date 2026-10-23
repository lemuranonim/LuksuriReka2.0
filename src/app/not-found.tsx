import { headers } from "next/headers";
import { Action, PageIntro, SiteShell } from "@/components/site/SiteShell";
import { routes, text } from "@/lib/site-content";

export default async function NotFound() {
  const locale = (await headers()).get("x-lr-locale") === "en" ? "en" : "id";
  return <SiteShell locale={locale} page="home"><PageIntro locale={locale} eyebrow="404 / LUKSURI REKA" title={text(locale, "Halaman belum ditemukan.", "This page could not be found.")} description={text(locale, "Jelajahi karya atau kembali ke beranda untuk menemukan yang Anda perlukan.", "Explore our work or return home to find what you need.")}><Action href={routes.home[locale]}>{text(locale, "Kembali ke beranda", "Back to home")}</Action></PageIntro></SiteShell>;
}
