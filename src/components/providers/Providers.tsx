"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * The single global client boundary.
 * - Lenis smooth scroll, driven by GSAP's ticker (one shared rAF loop)
 * - ScrollTrigger kept in sync with Lenis
 * - Framer Motion honours the user's reduced-motion preference
 */
export function Providers({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, smoothWheel: !reduceMotion, anchors: true }}
    >
      <ScrollTriggerSync />
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}

function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}
