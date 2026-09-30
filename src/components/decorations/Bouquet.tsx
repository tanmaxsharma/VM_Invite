import type { ComponentProps } from "react";
import { FloralSprig } from "./FloralSprig";

/** Three sprigs gathered and tied with a small ribbon. Colour via `text-*`. */
export function Bouquet(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden focusable="false" {...props}>
      <g transform="rotate(-24 60 112)">
        <FloralSprig x={36} y={4} width={48} height={96} />
      </g>
      <g transform="rotate(24 60 112) translate(120 0) scale(-1 1)">
        <FloralSprig x={36} y={4} width={48} height={96} />
      </g>
      <FloralSprig x={33} y={-8} width={54} height={108} />
      {/* ribbon */}
      <g stroke="currentColor" strokeWidth={0.9} strokeLinecap="round">
        <path d="M60 96c-6-6-15-6-15 0s9 5 15 0zM60 96c6-6 15-6 15 0s-9 5-15 0z" fill="currentColor" fillOpacity={0.12} />
        <path d="M58 98c-3 6-6 10-10 13M62 98c3 6 6 10 10 13" />
      </g>
      <circle cx="60" cy="96" r="1.8" fill="currentColor" />
    </svg>
  );
}
