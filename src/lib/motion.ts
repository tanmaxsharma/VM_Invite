/** Shared easing so GSAP and Framer Motion feel like one system.
 *  Mirrors --ease-cinematic / --ease-gentle in src/styles/globals.css. */
export const ease = {
  /** cubic-bezier for Framer Motion */
  cinematic: [0.22, 1, 0.36, 1] as const,
  /** equivalent GSAP ease strings */
  cinematicGsap: "expo.out",
  gentleGsap: "power2.inOut",
};

export const duration = {
  fast: 0.4,
  base: 0.8,
  slow: 1.4,
};
