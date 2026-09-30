import type { ComponentProps } from "react";

const LEAF = "M0 0c5-6 14-7 20-3-5 6-14 7-20 3z";

/** Upright sprig with alternating leaves and a closed bud. Colour via `text-*`. */
export function FloralSprig(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 60 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.8}
      strokeLinecap="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M30 118c-4-24 4-46 0-68-2-12 0-20 0-26" />
      <g fill="currentColor" fillOpacity={0.15}>
        <path d={LEAF} transform="translate(30 96) rotate(-25)" />
        <path d={LEAF} transform="translate(30 80) scale(-1 1) rotate(-25)" />
        <path d={LEAF} transform="translate(31 62) rotate(-35) scale(.85)" />
        <path d={LEAF} transform="translate(29 46) scale(-1 1) rotate(-35) scale(.75)" />
      </g>
      {/* bud */}
      <path d="M30 24c-5-3-6-10-0-18 6 8 5 15 0 18z" fill="currentColor" fillOpacity={0.15} />
      <path d="M30 24c-3 1-7-1-9-4M30 24c3 1 7-1 9-4" />
    </svg>
  );
}
