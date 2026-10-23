import { resolveRoute, routes } from "./site-content";

export const SITE_MOTION = { page: 260, panel: 220, anchor: 520, easing: "cubic-bezier(.22, 1, .36, 1)" } as const;
export type NavigationIntent = { kind: "route"; href: string; key: string } | { kind: "anchor"; hash: string } | { kind: "top" } | null;

/** Only enhance ordinary links within the public studio. */
export function navigationIntent(href: string, currentHref: string, options: { modified?: boolean; download?: boolean; target?: string; skip?: boolean } = {}): NavigationIntent {
  if (!href || options.modified || options.download || options.skip || (options.target && options.target !== "_self")) return null;
  let current: URL, target: URL;
  try { current = new URL(currentHref); target = new URL(href, current); } catch { return null; }
  const route = resolveRoute(target.pathname);
  if (!/^https?:$/.test(target.protocol) || target.origin !== current.origin || !route) return null;
  const path = routes[route.page][route.locale];
  const source = resolveRoute(current.pathname);
  const currentPath = source ? routes[source.page][source.locale] : current.pathname;
  const query = target.searchParams.toString();
  if (path === currentPath && query === current.searchParams.toString()) {
    if (!target.hash) return { kind: "top" };
    if (target.hash === "#main") return null;
    return { kind: "anchor", hash: target.hash };
  }
  return { kind: "route", href: path + target.search + target.hash, key: path + (query ? `?${query}` : "") };
}

export function scrollEase(progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  return 1 - Math.pow(1 - t, 3);
}

export function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && document.documentElement.dataset.lrMotionPaused !== "true";
}

export function focusSection(target: HTMLElement) {
  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
  }
  target.focus({ preventScroll: true });
}

/** Finite anchor/feature scrolling; user navigation takes over immediately. */
export function shortScroll(top: number, onFinish?: () => void, duration: number = SITE_MOTION.anchor) {
  const start = window.scrollY;
  const end = Math.max(0, Math.min(top, document.documentElement.scrollHeight - window.innerHeight));
  const timing = motionAllowed() ? duration : 0;
  let frame = 0;
  let started: number | undefined;
  const events = new AbortController();
  const stop = () => { cancelAnimationFrame(frame); events.abort(); };
  for (const name of ["wheel", "touchstart", "pointerdown", "popstate", "pagehide"]) window.addEventListener(name, stop, { passive: true, signal: events.signal });
  window.addEventListener("keydown", event => { if (["Escape", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Tab"].includes(event.key)) stop(); }, { signal: events.signal });
  const step = (now: number) => {
    started ??= now;
    const progress = timing ? Math.min(1, (now - started) / timing) : 1;
    window.scrollTo({ top: start + (end - start) * scrollEase(progress), behavior: "instant" });
    if (progress < 1) frame = requestAnimationFrame(step);
    else { stop(); onFinish?.(); }
  };
  frame = requestAnimationFrame(step);
  return stop;
}
