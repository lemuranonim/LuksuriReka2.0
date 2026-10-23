import type { Metadata } from "next";
import { pageMeta, routes, SITE_URL, type Locale, type PageKey } from "./site-content";

export function siteMetadata(page: PageKey, locale: Locale): Metadata {
  const meta = pageMeta(page, locale);
  const url = `${SITE_URL}${routes[page][locale]}`;
  return {
    title: page === "home" ? meta.title : `${meta.title} — Luksuri Reka`,
    description: meta.description,
    alternates: { canonical: url, languages: { id: `${SITE_URL}${routes[page].id}`, en: `${SITE_URL}${routes[page].en}`, "x-default": `${SITE_URL}${routes[page].id}` } },
    openGraph: { type: "website", siteName: "Luksuri Reka", title: meta.title, description: meta.description, url, locale: locale === "id" ? "id_ID" : "en_US", alternateLocale: locale === "id" ? "en_US" : "id_ID", images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Luksuri Reka — Studio Digital" }] },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: [`${SITE_URL}/opengraph-image`] },
  };
}
