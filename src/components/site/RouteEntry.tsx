import { SitePage } from "./SitePages";
import { type Locale, type Need, type PageKey } from "@/lib/site-content";

export interface RouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function RouteEntry({ page, locale, searchParams }: RouteProps & { page: PageKey; locale: Locale }) {
  const query = page === "contact" ? await searchParams : {};
  const needs: Need[] = ["website", "operations", "integration", "unsure"];
  const initialNeed = typeof query.need === "string" && needs.includes(query.need as Need) ? query.need as Need : undefined;
  return <SitePage page={page} locale={locale} initialNeed={initialNeed} />;
}
