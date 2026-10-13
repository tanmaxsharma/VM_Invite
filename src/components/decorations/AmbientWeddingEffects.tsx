"use client";

import { useRef, type CSSProperties } from "react";
import { useLenis } from "lenis/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Butterfly } from "./Butterfly";

type Kind = "blush" | "ivory" | "gold" | "leaf";

// Fixed layout (no Math.random during render) so server and client agree.
// [left %, size px, fall s, delay s, drift vw, flutter s, kind]
// The first MOBILE_COUNT entries are the phone set, so keep a mix at the top.
const ELEMENTS: [number, number, number, number, number, number, Kind][] = [
  [9, 10, 26, 3, 5, 5.2, "blush"],
  [31, 9, 33, 17, -4, 6.4, "ivory"],
  [52, 4, 29, 9, 3, 4.1, "gold"],
  [73, 11, 36, 24, -6, 7.1, "leaf"],
  [88, 9, 28, 13, -3, 5.6, "blush"],
  [42, 8, 38, 30, 4, 6.8, "ivory"],
  [18, 4, 31, 21, 6, 3.8, "gold"],
  [64, 10, 34, 6, -5, 6.1, "blush"],
  [95, 8, 40, 35, -4, 7.4, "ivory"],
  [24, 10, 37, 12, 3, 6.6, "leaf"],
  [80, 3, 27, 27, 2, 4.4, "gold"],
  [4, 9, 39, 41, 5, 5.9, "blush"],
];
const MOBILE_COUNT = 6;

const PETAL = "M5 0C9 4 9 10 5 14 1 10 1 4 5 0z";
const ROUND_PETAL = "M6 0C11 2 12 9 6 14 0 9 1 2 6 0z";
const LEAF = "M0 7C3 1 10 0 14 1 13 6 7 11 0 7z";

function Shape({ kind, size }: { kind: Kind; size: number }) {
  if (kind === "gold") {
    return <span className="block rounded-full bg-gold-300 opacity-70" style={{ width: size, height: size }} />;
  }
  if (kind === "leaf") {
    return (
      <svg width={size * 1.3} height={size * 0.8} viewBox="0 0 14 9" className="block opacity-55">
        <path d={LEAF} fill="color-mix(in oklab, var(--color-gold-500) 50%, #6f7d58)" />
        <path d="M1 6.8C5 5 9 3 13 1.4" stroke="var(--color-parchment-100)" strokeWidth={0.5} fill="none" opacity={0.6} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 12 14" className="block">
      {kind === "blush" ? (
        <path d={ROUND_PETAL} fill="var(--color-maroon-300)" opacity={0.42} />
      ) : (
        <path d={PETAL} transform="translate(1 0)" fill="var(--color-parchment-50)" stroke="var(--color-gold-300)" strokeWidth={0.6} />
      )}
    </svg>
  );
}

/**
 * The drifting petals themselves. Fills the nearest positioned parent; give that parent
 * `overflow-hidden`. `--petal-fall` (default one viewport height) sets how far they travel.
 */
export function PetalField({ count = ELEMENTS.length }: { count?: number }) {
  return (
    <>
      {ELEMENTS.slice(0, count).map(([left, size, fall, delay, driftVw, flutter, kind], i) => (
        <span
          key={i}
          className={`absolute -top-6 ${i >= MOBILE_COUNT ? "max-md:hidden" : ""}`}
          style={
            {
              left: `${left}%`,
              "--petal-drift": `${driftVw}vw`,
              animation: `petal-fall ${fall}s linear -${delay}s infinite`,
            } as CSSProperties
          }
        >
          <span
            className="block"
            style={{ animation: `petal-flutter ${flutter}s ease-in-out -${delay % flutter}s infinite` }}
          >
            <Shape kind={kind} size={size} />
          </span>
        </span>
      ))}
    </>
  );
}

/**
 * A short fall of petals for a single section (e.g. one with an opaque background that
 * would hide the page-wide layer). Hidden for reduced motion.
 */
export function SectionPetals({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden select-none [container-type:size] [--petal-fall:108cqh] motion-reduce:hidden"
    >
      <PetalField count={count} />
    </div>
  );
}

/**
 * The atmosphere after the invitation opens: a sparse fall of petals, specks
 * and leaves, and an occasional butterfly. One fixed, click-through layer that
 * sits behind all content, so it never covers the date cards or any control.
 * Rendered only once the invitation is open; absent for reduced motion.
 */
export function AmbientWeddingEffects() {
  const drift = useRef<HTMLDivElement>(null);
  const nudge = useRef<((value: number) => void) | null>(null);

  // Petals lag gently against the scroll and settle back when it stops.
  useLenis(({ velocity }) => {
    if (!drift.current) return;
    nudge.current ??= gsap.quickTo(drift.current, "y", { duration: 1.4, ease: "power3.out" });
    nudge.current(gsap.utils.clamp(-36, 36, -velocity * 2.2));
  });

  // Rendered client-side after the guest's tap, so reading the preference here is safe.
  if (prefersReducedMotion()) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 animate-[ambient-in_3s_ease-out_both] overflow-hidden select-none"
    >
      <div ref={drift} className="absolute inset-0">
        <PetalField />
      </div>
      <Butterfly />
    </div>
  );
}
