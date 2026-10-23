import { NextRequest, NextResponse } from "next/server";
import { resolveRoute } from "@/lib/site-content";

export function proxy(request: NextRequest) {
  const match = resolveRoute(request.nextUrl.pathname);
  const requestHeaders = new Headers(request.headers);
  // Existing report pages were authored in English. Public studio routes have
  // explicit locales, including on hard navigation and without JavaScript.
  const legacyPage = /(?:-proposal|-quotation|-report)$|^\/qa-budget$/.test(request.nextUrl.pathname);
  requestHeaders.set("x-lr-locale", match?.locale ?? (legacyPage || /^\/en(?:\/|$)/.test(request.nextUrl.pathname) ? "en" : "id"));
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (match) {
    const development = process.env.NODE_ENV !== "production";
    response.headers.set("Content-Security-Policy", [
      "default-src 'self'", `script-src 'self' 'unsafe-inline'${development ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:", "font-src 'self'",
      `connect-src 'self'${development ? " ws: wss:" : ""}`, "object-src 'none'", "base-uri 'self'", "form-action 'self'",
    ].join("; "));
  }
  return response;
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
