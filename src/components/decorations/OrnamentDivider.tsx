import type { ComponentProps } from "react";

const half = (
  <>
    <path d="M2 14H90" />
    <circle cx="94" cy="14" r="1.1" fill="currentColor" stroke="none" />
    <path d="M100 14l3.5-3 3.5 3-3.5 3z" />
    {/* side petal */}
    <path d="M120 20c-4-1.5-9-5-11-10 5 .5 9.5 4 11 10z" />
  </>
);

/** Horizontal rule with a lotus centrepiece. Colour via `text-*`. */
export function OrnamentDivider(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 240 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.75}
      strokeLinecap="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <g>{half}</g>
      <g transform="matrix(-1 0 0 1 240 0)">{half}</g>
      {/* centre petal */}
      <path d="M120 20c-3.2-3.8-3.2-11 0-16 3.2 5 3.2 12.2 0 16z" />
      <circle cx="120" cy="22.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
