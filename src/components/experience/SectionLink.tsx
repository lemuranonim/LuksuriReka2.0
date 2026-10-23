"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

/** A short, cancellable anchor journey. Native links still work before hydration. */
export default function SectionLink({ href, label, children }: { href: `#${string}`; label: string; children: ReactNode }) {
  const cancel = useRef<(() => void) | undefined>(undefined);
  useEffect(() => () => cancel.current?.(), []);

  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    cancel.current?.();
    const start = window.scrollY;
    const end = Math.max(0, Math.min(start + target.getBoundingClientRect().top, document.documentElement.scrollHeight - window.innerHeight));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 520;
    // Save the departure position before animation so browser Back restores it.
    if (window.location.hash !== href) history.pushState(null, "", href);
    let frame = 0;
    let started: number | undefined;
    const events = new AbortController();
    const stop = () => { cancelAnimationFrame(frame); events.abort(); cancel.current = undefined; };
    cancel.current = stop;
    for (const name of ["wheel", "touchstart", "pointerdown", "popstate", "pagehide"]) window.addEventListener(name, stop, { passive: true, signal: events.signal });
    window.addEventListener("keydown", event => { if (["Escape", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Tab"].includes(event.key)) stop(); }, { signal: events.signal });
    const finish = () => {
      stop();
      const previous = target.getAttribute("tabindex");
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (previous === null) target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
    };
    const step = (now: number) => {
      started ??= now;
      const progress = duration ? Math.min(1, (now - started) / duration) : 1;
      const eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo({ top: start + (end - start) * eased, behavior: "instant" });
      if (progress < 1) frame = requestAnimationFrame(step);
      else finish();
    };
    frame = requestAnimationFrame(step);
  };

  return <a href={href} aria-label={label} onClick={navigate}>{children}</a>;
}
