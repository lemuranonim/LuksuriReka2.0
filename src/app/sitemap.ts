import type { MetadataRoute } from "next";
import { routes, SITE_URL } from "@/lib/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.entries(routes).flatMap(([key, paths]) => (["id", "en"] as const).map(locale => ({
    url: `${SITE_URL}${paths[locale]}`,
    changeFrequency: "monthly" as const,
    priority: key === "home" ? 1 : key === "contact" || key === "privacy" ? 0.5 : 0.8,
    alternates: { languages: { id: `${SITE_URL}${paths.id}`, en: `${SITE_URL}${paths.en}` } },
  })));
}
