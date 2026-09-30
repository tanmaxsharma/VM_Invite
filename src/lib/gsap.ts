// Client-only: import from "use client" components only.
import { useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins once, in a single place.
gsap.registerPlugin(ScrollTrigger);
// Sections have optional content (e.g. no city yet), so an empty selector is expected.
gsap.config({ nullTargetWarn: false });

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Runs GSAP setup scoped to `scope` and reverts every tween / ScrollTrigger
 * it created on unmount or when `deps` change.
 * Selector strings inside `setup` resolve within `scope` only.
 * Returns the live context so event handlers can `ctx.current?.add(() => …)`
 * animations that are cleaned up the same way.
 */
export function useGsap(
  setup: (context: gsap.Context) => void,
  scope: RefObject<Element | null>,
  deps: DependencyList = [],
) {
  const ctx = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    ctx.current = gsap.context(setup, scope.current ?? undefined);
    return () => ctx.current?.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ctx;
}
