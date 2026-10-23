import type { ReactNode } from "react";

// The persistent studio navigation enhances this native anchor after hydration.
export default function SectionLink({ href, label, children }: { href: `#${string}`; label: string; children: ReactNode }) {
  return <a href={href} aria-label={label}>{children}</a>;
}
