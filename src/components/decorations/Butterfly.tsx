"use client";

import { useRef } from "react";
import { gsap, useGsap } from "@/lib/gsap";

const TONES = ["text-gold-500", "text-maroon-300"];

/**
 * A single small butterfly that crosses the viewport now and then on a
 * gently curving path, rests off-screen for a while, then returns from a
 * random side in an alternating tone — so it never reads as a loop.
 * Motion runs on GSAP's ticker; wings beat with a CSS animation.
 */
export function Butterfly() {
  const root = useRef<HTMLDivElement>(null);

  useGsap((self) => {
    const el = root.current!;
    const random = gsap.utils.random;
    let flight = 0;

    const fly = () =>
      self.add(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const size = el.offsetWidth;
        const ltr = Math.random() < 0.5;
        const x0 = ltr ? -size * 2 : vw + size;
        const x3 = ltr ? vw + size : -size * 2;
        const span = x3 - x0;
        // start low-ish, drift upward in two soft arcs
        const y0 = random(vh * 0.45, vh * 0.8);
        const y1 = y0 - random(vh * 0.06, vh * 0.18);
        const y2 = y1 + random(-vh * 0.08, vh * 0.1);
        const y3 = y2 - random(vh * 0.12, vh * 0.28);
        const heading = ltr ? 90 : -90;

        el.classList.remove(...TONES);
        el.classList.add(TONES[flight++ % TONES.length]);

        gsap.set(el, { x: x0, y: y0, rotation: heading, autoAlpha: 0 });
        const duration = random(15, 21);
        gsap
          .timeline({ onComplete: () => self.add(() => gsap.delayedCall(random(10, 20), fly)) })
          .to(el, { autoAlpha: random(0.5, 0.68), duration: 1.6, ease: "sine.out" }, 0)
          .to(
            el,
            {
              keyframes: {
                x: [x0, x0 + span * 0.32, x0 + span * 0.66, x3],
                y: [y0, y1, y2, y3],
                rotation: [heading, heading - 14, heading + 10, heading - 8],
                easeEach: "sine.inOut",
              },
              duration,
              ease: "none",
            },
            0,
          )
          .to(el, { autoAlpha: 0, duration: 1.6, ease: "sine.in" }, duration - 1.6);
      });

    gsap.delayedCall(random(4, 8), fly);
  }, root);

  return (
    <div ref={root} className="absolute top-0 left-0 w-5 opacity-0 md:w-6">
      <svg viewBox="-12 -11 24 22" className="block w-full overflow-visible">
        <g className="animate-[wing-flap_0.5s_ease-in-out_infinite]" style={{ transformOrigin: "0 0", transformBox: "view-box" }}>
          {[1, -1].map((side) => (
            <g key={side} transform={`scale(${side} 1)`} fill="currentColor" stroke="currentColor" strokeWidth={0.4}>
              <path d="M0 -1C-3 -9-11-10.5-11-4.5-11-.5-5 .8 0 0z" fillOpacity={0.5} />
              <path d="M0 .5C-4 1.5-9 4.5-7.2 8.2-5.4 10.4-1.2 5.6 0 1.2z" fillOpacity={0.4} />
              <path d="M-2 -1.4C-4.5-5.5-8.2-7-9.4-5.3" fill="none" strokeOpacity={0.5} />
            </g>
          ))}
        </g>
        <g stroke="currentColor" strokeLinecap="round" fill="none">
          <path d="M0 -4.5V6" strokeWidth={1.1} />
          <path d="M0 -4.5C-.6-7-1.6-8.5-2.8-9.2M0 -4.5C.6-7 1.6-8.5 2.8-9.2" strokeWidth={0.45} />
        </g>
      </svg>
    </div>
  );
}
