import type { CSSProperties } from "react";

// Fixed layout (no Math.random) so server and client render identically.
// [left %, size px, duration s, delay s, drift vw, colour]
const PETALS: [number, number, number, number, number, string][] = [
  [8, 11, 19, 0, 6, "text-saffron-300"],
  [22, 8, 23, 6, -4, "text-maroon-300"],
  [37, 12, 21, 11, 5, "text-gold-300"],
  [54, 9, 25, 3, -6, "text-saffron-300"],
  [71, 10, 20, 9, 4, "text-maroon-300"],
  [86, 8, 24, 14, -5, "text-gold-300"],
  [15, 9, 26, 17, 3, "text-maroon-300"],
  [46, 10, 22, 20, -3, "text-saffron-300"],
  [63, 12, 27, 5, 6, "text-gold-300"],
  [93, 9, 21, 12, -4, "text-saffron-300"],
];

/** Mobile gets only the first few petals. */
const MOBILE_COUNT = 5;

/**
 * A handful of drifting petals, CSS-only (transform animations on the compositor).
 * Hidden entirely for reduced motion.
 */
export function Petals({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden ${className}`}
    >
      {PETALS.map(([left, size, duration, delay, drift, colour], i) => (
        <span
          key={i}
          className={`absolute -top-6 ${colour} ${i >= MOBILE_COUNT ? "max-md:hidden" : ""}`}
          style={
            {
              left: `${left}%`,
              "--petal-drift": `${drift}vw`,
              animation: `petal-fall ${duration}s linear -${delay}s infinite`,
            } as CSSProperties
          }
        >
          <span
            className="block"
            style={{ animation: `petal-sway ${duration / 4}s ease-in-out -${delay}s infinite` }}
          >
            <svg width={size} height={size * 1.4} viewBox="0 0 10 14" className="opacity-70">
              <path d="M5 0C9 4 9 10 5 14 1 10 1 4 5 0z" fill="currentColor" />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
