export type SiteEvent = "cta_click" | "case_open" | "product_access_click" | "help_open" | "locale_switch" | "composer_start" | "composer_summary_generated" | "composer_copy" | "composer_open_whatsapp" | "composer_open_email" | "contact_open_whatsapp" | "contact_open_email";

// No provider, network requests, identifiers, storage, or free-text payloads.
// A future consent-aware adapter can subscribe to this in-memory event.
export function trackSiteEvent(name: SiteEvent, data: { placement?: "header" | "footer" | "content"; target?: "whatsapp" | "email" | "product" | "contact"; needs_count?: number } = {}) {
  if (typeof window === "undefined") return;
  const safe = {
    ...(["header", "footer", "content"].includes(data.placement ?? "") && { placement: data.placement }),
    ...(["whatsapp", "email", "product", "contact"].includes(data.target ?? "") && { target: data.target }),
    ...(typeof data.needs_count === "number" && Number.isFinite(data.needs_count) && { needs_count: Math.max(0, Math.min(4, Math.floor(data.needs_count))) }),
  };
  window.dispatchEvent(new CustomEvent("luksuri:site-event", { detail: { name, ...safe } }));
}
