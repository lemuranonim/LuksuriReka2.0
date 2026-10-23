"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { resolveRoute } from "@/lib/site-content";
import { focusSection, motionAllowed, navigationIntent, shortScroll, SITE_MOTION } from "@/lib/site-motion";

interface Journey { key: string; resolve: () => void; view?: ViewTransition; timer: ReturnType<typeof setTimeout> }

/** A persistent enhancement; Next Link retains prefetch and native link semantics. */
export default function SiteNavigation() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const routeKey = pathname + (search ? `?${search}` : "");
  const router = useRouter();
  const previous = useRef(routeKey);
  const journey = useRef<Journey | undefined>(undefined);
  const scrolling = useRef<(() => void) | undefined>(undefined);
  const entry = useRef<Animation | undefined>(undefined);
  const sequence = useRef(0);

  function release(current: Journey) {
    clearTimeout(current.timer);
    current.resolve();
    if (journey.current !== current) return;
    journey.current = undefined;
    document.documentElement.dataset.lrNavigation = "idle";
    document.querySelector(".lr-foundation main")?.removeAttribute("aria-busy");
  }

  useLayoutEffect(() => {
    const route = resolveRoute(pathname);
    if (route) document.documentElement.lang = route.locale;
    if (previous.current === routeKey) return;
    previous.current = routeKey;
    scrolling.current?.();
    const current = journey.current;
    const main = document.querySelector<HTMLElement>(".lr-foundation main");
    main?.removeAttribute("aria-busy");
    if (current?.key === routeKey && current.view) {
      clearTimeout(current.timer);
      current.resolve();
      return;
    }
    if (!main || !motionAllowed()) { if (current?.key === routeKey) release(current); return; }
    entry.current?.cancel();
    document.documentElement.dataset.lrNavigation = "animating";
    document.documentElement.dataset.lrMotion = "entry";
    const animation = main.animate([{ opacity: .55, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: SITE_MOTION.page, easing: SITE_MOTION.easing });
    entry.current = animation;
    const finish = () => {
      if (entry.current !== animation) return;
      if (current?.key === routeKey) release(current);
      else if (!journey.current) document.documentElement.dataset.lrNavigation = "idle";
    };
    animation.finished.then(finish, finish);
  }, [pathname, routeKey]);

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.lrNavigation = "idle";
    const effects = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: string }>).detail;
      html.dataset.lrMotionPaused = detail?.mode === "still" ? "true" : "false";
    };
    const click = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor?.closest(".lr-foundation") || event.defaultPrevented || event.button !== 0) return;
      const intent = navigationIntent(anchor.getAttribute("href") ?? "", window.location.href, { modified: event.metaKey || event.ctrlKey || event.shiftKey || event.altKey, target: anchor.target, download: anchor.hasAttribute("download"), skip: anchor.classList.contains("lr-skip-link") });
      if (!intent) return;
      const request = ++sequence.current;
      scrolling.current?.();
      const previousJourney = journey.current;
      if (previousJourney) { previousJourney.view?.skipTransition(); release(previousJourney); }
      const menu = anchor.closest<HTMLDetailsElement>(".lr-mobile-menu");
      if (menu) menu.open = false;
      if (intent.kind !== "route") {
        let target: HTMLElement | null = null;
        if (intent.kind === "anchor") {
          try { target = document.getElementById(decodeURIComponent(intent.hash.slice(1))); } catch { return; }
          if (!target) return;
        }
        event.preventDefault();
        if (intent.kind === "anchor" && window.location.hash !== intent.hash) history.pushState(null, "", intent.hash);
        else if (intent.kind === "top" && window.location.hash) history.pushState(null, "", window.location.pathname + window.location.search);
        const destination = target;
        scrolling.current = shortScroll(destination ? window.scrollY + destination.getBoundingClientRect().top : 0, () => { if (destination) focusSection(destination); });
        return;
      }
      if (!motionAllowed()) { html.dataset.lrMotion = "reduced"; return; }
      entry.current?.cancel();
      html.dataset.lrNavigation = "pending";
      document.querySelector(".lr-foundation main")?.setAttribute("aria-busy", "true");
      let resolve = () => {};
      const committed = new Promise<void>(done => { resolve = done; });
      const current: Journey = { key: intent.key, resolve, timer: setTimeout(() => { current.view?.skipTransition(); release(current); }, 2000) };
      journey.current = current;
      if (typeof document.startViewTransition !== "function") { html.dataset.lrMotion = "entry"; return; }
      event.preventDefault();
      html.dataset.lrMotion = "view";
      let started = false;
      const navigate = () => { if (!started && request === sequence.current) { started = true; router.push(intent.href); } };
      try {
        current.view = document.startViewTransition(() => { navigate(); return committed; });
        current.view.ready.then(() => { if (journey.current === current) html.dataset.lrNavigation = "animating"; }, () => {});
        current.view.finished.then(() => release(current), () => release(current));
      } catch { release(current); navigate(); }
    };
    const historyNavigation = () => {
      sequence.current++;
      const current = journey.current;
      if (current) { current.view?.skipTransition(); release(current); }
    };
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", historyNavigation);
    window.addEventListener("luksuri:experience", effects);
    return () => {
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", historyNavigation);
      window.removeEventListener("luksuri:experience", effects);
      scrolling.current?.(); entry.current?.cancel();
      sequence.current++;
      if (journey.current) { journey.current.view?.skipTransition(); release(journey.current); }
      delete html.dataset.lrNavigation; delete html.dataset.lrMotion; delete html.dataset.lrMotionPaused;
    };
  }, [router]);

  return <div className="lr-route-progress" aria-hidden="true" />;
}
