import type { ComponentProps } from "react";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const flip: Record<Corner, string> = {
  "top-left": "",
  "top-right": "-scale-x-100",
  "bottom-left": "-scale-y-100",
  "bottom-right": "rotate-180",
};

/**
 * Frame corner with a curling vine. Drawn for the top-left corner and
 * mirrored for the others. Position it with `className`.
 */
export function CornerOrnament({
  corner = "top-left",
  className = "",
  ...props
}: ComponentProps<"svg"> & { corner?: Corner }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.8}
      strokeLinecap="round"
      aria-hidden
      focusable="false"
      className={`${flip[corner]} ${className}`}
      {...props}
    >
      {/* double bracket */}
      <path d="M4 118V26C4 13.8 13.8 4 26 4h92" />
      <path d="M10 118V32c0-12.2 9.8-22 22-22h86" opacity={0.5} />
      {/* spiral at the corner */}
      <path d="M22 22c10-4 20 2 18 11-1.6 7-11 7-11 1 0-4 5-5 7-2" />
      {/* vines running along each edge */}
      <path d="M40 30c14 2 24-2 34-8 8-4.6 16-6 26-4" />
      <path d="M30 40c2 14-2 24-8 34-4.6 8-6 16-4 26" />
      {/* leaves */}
      <path d="M58 26c2-6 8-9 13-8-2 5-7 8-13 8z" fill="currentColor" fillOpacity={0.15} />
      <path d="M84 20c3-4 8-5 12-3-3 3.5-7 4.5-12 3z" fill="currentColor" fillOpacity={0.15} />
      <path d="M26 58c-6 2-9 8-8 13 5-2 8-7 8-13z" fill="currentColor" fillOpacity={0.15} />
      <path d="M20 84c-4 3-5 8-3 12 3.5-3 4.5-7 3-12z" fill="currentColor" fillOpacity={0.15} />
      {/* bud dots */}
      <circle cx="104" cy="17.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="104" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
