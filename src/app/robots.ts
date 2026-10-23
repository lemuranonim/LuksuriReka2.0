import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-content";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/reports/", "/compfeeds-project-report", "/warehouse-quotation", "/wa-integration-proposal", "/maintenance-proposal", "/rsud-website-proposal", "/got-fet-proposal", "/qa-proposal", "/qa-budget", "/qa-plant-lab-proposal"] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
