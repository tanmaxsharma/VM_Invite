import type { ReactNode } from "react";

/**
 * Clips a line so its text can rise into view (animate the child's yPercent).
 * Padding keeps italic overhangs and descenders visible.
 */
export function Mask({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`block overflow-hidden px-[0.12em] pb-[0.06em] ${className}`}>{children}</span>;
}
