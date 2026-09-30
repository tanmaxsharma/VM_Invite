"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";

const COUNT = 18;
const COLOURS = ["text-saffron-300", "text-maroon-300", "text-gold-300", "text-saffron-500"];

/**
 * One short burst of petals and gold specks with a soft glow (~1.6s).
 * Rendered only while `play` is true; reduced motion keeps just the glow.
 */
export function PetalBurst({ play }: { play: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      if (!play) return;
      const reduce = prefersReducedMotion();

      gsap.fromTo(
        "[data-b=glow]",
        { scale: 0.3, autoAlpha: 0.8 },
        { scale: reduce ? 1 : 2.6, autoAlpha: 0, duration: reduce ? 0.8 : 1.5, ease: "power2.out" },
      );
      if (reduce) return;

      const random = gsap.utils.random;
      gsap.utils.toArray<HTMLElement>("[data-b=p]").forEach((el) => {
        const angle = random(0, Math.PI * 2);
        const distance = random(80, 180);
        gsap.fromTo(
          el,
          { x: 0, y: 0, scale: 0, rotation: random(0, 360), autoAlpha: 1 },
          {
            x: Math.cos(angle) * distance,
            // a little gravity: everything settles slightly downward
            y: Math.sin(angle) * distance * 0.75 + 36,
            scale: random(0.7, 1.2),
            rotation: `+=${random(90, 240)}`,
            duration: random(1.2, 1.7),
            ease: "power3.out",
          },
        );
        gsap.to(el, { autoAlpha: 0, duration: 0.5, delay: random(0.9, 1.2), ease: "power1.in" });
      });
    },
    root,
    [play],
  );

  if (!play) return null;

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div
        data-b="glow"
        className="absolute size-44 rounded-full"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--color-gold-300) 70%, transparent), transparent 70%)" }}
      />
      {Array.from({ length: COUNT }, (_, i) => (
        <span key={i} data-b="p" className={`absolute ${COLOURS[i % COLOURS.length]}`}>
          {i % 3 === 2 ? (
            <span className="block size-1.5 rounded-full bg-gold-300" />
          ) : (
            <svg width="9" height="13" viewBox="0 0 10 14">
              <path d="M5 0C9 4 9 10 5 14 1 10 1 4 5 0z" fill="currentColor" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}
