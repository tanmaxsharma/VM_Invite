"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";

type Kind = "blush" | "ivory" | "maroon" | "flower" | "leaf" | "speck" | "sparkle" | "diamond";

/** A fixed mix, so every celebration has the same character: mostly petals and flowers, with gold dust between. */
const MIX: Kind[] = [
  "blush", "speck", "flower", "ivory", "sparkle", "leaf", "maroon", "speck", "diamond", "blush",
  "ivory", "sparkle", "flower", "speck", "leaf", "maroon", "diamond", "ivory", "speck", "blush",
];
/** The slower shower that follows the burst — only soft things. */
const SHOWER: Kind[] = ["blush", "ivory", "leaf", "maroon", "ivory", "blush"];

const petal = (fill: string, stroke?: string) => (
  <svg width="12" height="16" viewBox="0 0 12 14">
    <path d="M6 0C11 2 12 9 6 14 0 9 1 2 6 0z" fill={fill} stroke={stroke} strokeWidth={stroke ? 0.7 : 0} />
  </svg>
);

const SHAPES: Record<Kind, ReactNode> = {
  blush: petal("var(--color-maroon-300)"),
  ivory: petal("var(--color-parchment-50)", "var(--color-gold-300)"),
  maroon: petal("var(--color-maroon-500)"),
  flower: (
    <svg width="20" height="20" viewBox="-10 -10 20 20">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-4.6" rx="3.1" ry="4.8" transform={`rotate(${a})`} fill="var(--color-parchment-50)" stroke="var(--color-maroon-300)" strokeWidth={0.8} />
      ))}
      <circle r="2" fill="var(--color-gold-500)" />
    </svg>
  ),
  leaf: (
    <svg width="17" height="10" viewBox="0 0 14 9">
      <path d="M0 7C3 1 10 0 14 1 13 6 7 11 0 7z" fill="#8b9870" opacity={0.9} />
    </svg>
  ),
  speck: <span className="block size-1.5 rounded-full bg-gold-300" />,
  sparkle: (
    <svg width="13" height="13" viewBox="-6 -6 12 12">
      <path d="M0-5.5 1.1-1.1 5.5 0 1.1 1.1 0 5.5-1.1 1.1-5.5 0-1.1-1.1z" fill="var(--color-gold-300)" />
    </svg>
  ),
  diamond: <span className="block size-2 rotate-45 bg-gold-500/80" />,
};

const sizeFor = (vw: number) => (vw < 480 ? 1 : vw < 1024 ? 1.2 : 1.5);

type CelebrationProps = {
  /** Starts the celebration (once). */
  play: boolean;
  /** The burst leaves from the centre of this element. */
  originRef: RefObject<HTMLElement | null>;
};

/**
 * The date has been revealed: a short, full-viewport celebration (about three seconds).
 * Flowers, petals, leaves, gold dust and sparkles burst out from the cards and travel
 * across the whole screen, then settle in a soft shower that hands back to the normal
 * ambience. Rendered in a portal so no ancestor transform can trap it; click-through.
 * Reduced motion keeps only a brief glow.
 */
export function Celebration({ play, originRef }: CelebrationProps) {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  // Temporary by design: take every node out of the page once it has played.
  useEffect(() => {
    if (!play) return;
    const id = setTimeout(() => setDone(true), prefersReducedMotion() ? 1400 : 5800);
    return () => clearTimeout(id);
  }, [play]);

  useGsap(
    () => {
      if (!play) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rect = originRef.current?.getBoundingClientRect();
      const ox = rect ? rect.left + rect.width / 2 : vw / 2;
      const oy = rect ? rect.top + rect.height / 2 : vh / 2;
      const reduce = prefersReducedMotion();
      const random = gsap.utils.random;

      // the halo: a soft gold light and a thin ring that spread across the screen
      gsap.set("[data-ce=halo]", { x: ox, y: oy, xPercent: -50, yPercent: -50, scale: 0.05, autoAlpha: 0.9 });
      gsap.to("[data-ce=halo]", { scale: reduce ? 0.5 : 1, autoAlpha: 0, duration: reduce ? 0.9 : 1.6, ease: "power2.out" });
      if (reduce) return;
      gsap.set("[data-ce=ring]", { x: ox, y: oy, xPercent: -50, yPercent: -50, scale: 0.05, autoAlpha: 0.8 });
      gsap.to("[data-ce=ring]", { scale: 1, autoAlpha: 0, duration: 1.5, ease: "power2.out" });

      // the burst: out from the cards, then down and away
      const reach = Math.max(vw, vh) * 0.7;
      // the same pieces read smaller on a big screen, so they grow with it
      const grow = sizeFor(vw);
      const burst = gsap.utils.toArray<HTMLElement>("[data-ce=p]");
      burst.forEach((el, i) => {
        const angle = (i / burst.length) * Math.PI * 2 + random(-0.3, 0.3);
        const distance = random(0.28, 1) * reach;
        gsap.set(el, { x: ox, y: oy, scale: 0, autoAlpha: 0, rotation: random(0, 360) });
        gsap
          .timeline({ delay: random(0, 0.16) })
          .to(el, { autoAlpha: 1, duration: 0.05 }, 0)
          .to(
            el,
            {
              x: ox + Math.cos(angle) * distance,
              y: oy + Math.sin(angle) * distance * 0.8 - random(10, 60),
              scale: random(0.9, 1.7) * grow,
              rotation: `+=${random(-200, 200)}`,
              duration: random(0.85, 1.2),
              ease: ease.cinematicGsap,
            },
            0,
          )
          .to(el, {
            x: `+=${random(-70, 70)}`,
            y: `+=${random(vh * 0.22, vh * 0.55)}`,
            rotation: `+=${random(60, 220)}`,
            duration: random(1.2, 1.6),
            ease: "power1.in",
          })
          .to(el, { autoAlpha: 0, duration: 0.55, ease: "power1.in" }, ">-0.55");
      });

      // the shower: a few soft petals drifting down the whole screen as the burst settles
      gsap.utils.toArray<HTMLElement>("[data-ce=s]").forEach((el) => {
        const x = random(0, vw);
        gsap.set(el, { x, y: -30, autoAlpha: 0, rotation: random(0, 360), scale: random(0.9, 1.4) * grow });
        gsap
          .timeline({ delay: random(0.7, 1.7) })
          .to(el, { autoAlpha: 0.9, duration: 0.4 }, 0)
          .to(
            el,
            {
              y: vh + 40,
              x: x + random(-90, 90),
              rotation: `+=${random(120, 300)}`,
              duration: random(2.4, 3.2),
              ease: "sine.inOut",
            },
            0,
          )
          .to(el, { autoAlpha: 0, duration: 0.5 }, ">-0.5");
      });
    },
    root,
    [play],
  );

  if (!play || done || typeof document === "undefined") return null;

  const vw = window.innerWidth;
  const burstCount = vw < 480 ? 36 : vw < 1024 ? 60 : 84;
  const showerCount = vw < 480 ? 8 : vw < 1024 ? 14 : 22;

  return createPortal(
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <div
        data-ce="halo"
        className="absolute top-0 left-0 size-[150vmax] rounded-full opacity-0"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--color-gold-300) 60%, transparent) 0%, transparent 55%)" }}
      />
      <div
        data-ce="ring"
        className="absolute top-0 left-0 size-[110vmax] rounded-full border border-gold-300/70 opacity-0"
      />
      {Array.from({ length: burstCount }, (_, i) => (
        <span key={`p${i}`} data-ce="p" className="absolute top-0 left-0 opacity-0 will-change-transform">
          {SHAPES[MIX[i % MIX.length]]}
        </span>
      ))}
      {Array.from({ length: showerCount }, (_, i) => (
        <span key={`s${i}`} data-ce="s" className="absolute top-0 left-0 opacity-0 will-change-transform">
          {SHAPES[SHOWER[i % SHOWER.length]]}
        </span>
      ))}
    </div>,
    document.body,
  );
}
