"use client";

import { useEffect } from "react";
import { CONTACT, resolveRoute, type Locale } from "@/lib/site-content";
import { trackSiteEvent, type SiteEvent } from "@/lib/site-analytics";

// Events stay in memory. Never forward a draft URL or its query parameters.
export default function SiteEvents({ locale }: { locale: Locale }) {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor?.closest(".lr-foundation") || anchor.closest(".lr-composer")) return;
      const placement = anchor.closest("header") ? "header" : anchor.closest("footer") ? "footer" : "content";
      const url = new URL(anchor.href, window.location.href);
      const route = url.origin === window.location.origin ? resolveRoute(url.pathname) : null;
      let name: SiteEvent | undefined;
      let target: "whatsapp" | "email" | "product" | "contact" | undefined;
      if (route?.locale !== undefined && route.locale !== locale) name = "locale_switch";
      else if (route?.page === "help") name = "help_open";
      else if (route?.page === "kroscekapps" || route?.page === "scify-compfeed") name = "case_open";
      else if (route?.page === "contact") { name = "cta_click"; target = "contact"; }
      else if (url.origin === new URL(CONTACT.product).origin) { name = "product_access_click"; target = "product"; }
      else if (url.hostname === "wa.me" && url.pathname === `/${CONTACT.whatsapp}`) { name = "contact_open_whatsapp"; target = "whatsapp"; }
      else if (url.protocol === "mailto:" && url.pathname === CONTACT.email) { name = "contact_open_email"; target = "email"; }
      if (name) trackSiteEvent(name, { placement, target });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [locale]);
  return null;
}
