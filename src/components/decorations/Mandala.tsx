import type { ComponentProps } from "react";

const OUTER_PETALS = 24;
const INNER_PETALS = 12;
const CORE_PETALS = 8;

const rotations = (count: number) =>
  Array.from({ length: count }, (_, i) => (360 / count) * i);

/**
 * Line-art mandala for low-opacity backgrounds. Colour via `text-*`,
 * add `animate-spin-slow` for a gentle rotation (disabled on reduced motion).
 */
export function Mandala(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="-100 -100 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.5}
      aria-hidden
      focusable="false"
      {...props}
    >
      <circle r="98" />
      <circle r="94" strokeDasharray="0.1 3.2" strokeLinecap="round" strokeWidth={1.2} />
      {rotations(OUTER_PETALS).map((deg) => (
        <path key={deg} transform={`rotate(${deg})`} d="M0-62c7-8 7-18 0-28-7 10-7 20 0 28z" />
      ))}
      <circle r="60" />
      {rotations(INNER_PETALS).map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <path d="M0-30c11-8 13-18 0-28-13 10-11 20 0 28z" />
          <path d="M0-35v-16" />
        </g>
      ))}
      <circle r="28" />
      <circle r="23" strokeDasharray="1 2" />
      {rotations(CORE_PETALS).map((deg) => (
        <path key={deg} transform={`rotate(${deg})`} d="M0-5c4-4 4-9 0-14-4 5-4 10 0 14z" />
      ))}
      <circle r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}
