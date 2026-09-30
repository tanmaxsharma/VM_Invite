"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mandala } from "@/components/decorations/Mandala";
import { CornerOrnament } from "@/components/decorations/CornerOrnament";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";
import { FloralSprig } from "@/components/decorations/FloralSprig";
import { Petals } from "@/components/decorations/Petals";
import { Mask } from "@/components/ui/Mask";

export type HeroProps = {
  /** Full names, in display order */
  names: [string, string];
  /** City / location line; omitted when not provided */
  place?: string;
  /** Starts the entrance animation (after the invitation is opened). */
  play: boolean;
  inert?: boolean;
};

const corner = "absolute w-12 text-gold-500 opacity-70 md:w-20 lg:w-24";

export function Hero({ names: [first, second], place, play, inert }: HeroProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(
    () => {
      if (!play) return;

      if (prefersReducedMotion()) {
        gsap.from("[data-h]", { autoAlpha: 0, duration: 0.8 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: ease.cinematicGsap } })
        .from("[data-h=mandala]", { autoAlpha: 0, scale: 0.92, duration: 3, ease: ease.gentleGsap }, 0)
        .fromTo("[data-h=arch]", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 2.2, ease: "expo.inOut" }, 0.1)
        .from("[data-h=families]", { autoAlpha: 0, y: 14, duration: 1.4 }, 0.5)
        .from("[data-h=name]", { yPercent: 110, duration: 1.8, stagger: 0.25 }, 0.7)
        .from("[data-h=amp]", { autoAlpha: 0, scale: 0.7, duration: 1.6 }, 1)
        .fromTo("[data-h=divider]", { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }, 1.3)
        .from("[data-h=details]", { autoAlpha: 0, y: 12, duration: 1.2, stagger: 0.12 }, 1.6)
        .from("[data-h=decor]", { autoAlpha: 0, duration: 2, stagger: 0.1, ease: "power1.out" }, 0.9)
        .from("[data-h=cue]", { autoAlpha: 0, y: -8, duration: 1.2 }, 2.6);

      // Soft parallax as the hero scrolls away: background slower, foreground faster.
      const scrollTrigger = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-h=mandala]", { yPercent: 16, ease: "none", scrollTrigger });
      gsap.to("[data-h=content]", { y: -70, opacity: 0.2, ease: "none", scrollTrigger });
      gsap.to("[data-h=sprig]", { yPercent: -30, ease: "none", scrollTrigger });
      gsap.to("[data-h=cue-fade]", {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { ...scrollTrigger, end: "15% top" },
      });
    },
    root,
    [play],
  );

  return (
    <section
      ref={root}
      inert={inert}
      aria-label="Wedding announcement"
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-gutter py-28"
    >
      {/* background ornament */}
      <div
        data-h="mandala"
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[190vw] -translate-x-1/2 -translate-y-1/2 text-gold-500 opacity-[0.09] md:w-[115vmin]"
      >
        <Mandala className="w-full animate-spin-slow" />
      </div>

      {/* jharokha arch framing the names */}
      <div
        data-h="arch"
        aria-hidden
        className="frame pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[min(84svh,46rem)] w-[min(88vw,36rem)] -translate-x-1/2 -translate-y-1/2 rounded-arch"
      />

      <CornerOrnament data-h="decor" corner="top-left" className={`${corner} top-4 left-4 md:top-8 md:left-8`} />
      <CornerOrnament data-h="decor" corner="top-right" className={`${corner} top-4 right-4 md:top-8 md:right-8`} />

      {/* foreground sprigs */}
      <div data-h="sprig" aria-hidden className="pointer-events-none absolute -bottom-4 left-[2%] md:left-[6%]">
        <FloralSprig data-h="decor" className="h-28 -rotate-12 text-brown-300 md:h-56 lg:h-72" />
      </div>
      <div data-h="sprig" aria-hidden className="pointer-events-none absolute right-[2%] -bottom-4 md:right-[6%]">
        <FloralSprig data-h="decor" className="h-28 rotate-12 -scale-x-100 text-brown-300 md:h-56 lg:h-72" />
      </div>

      {play && <Petals />}

      <div data-h="content" className="relative flex flex-col items-center text-center">
        <p data-h="families" className="type-meta max-w-[15em] text-gold-700 sm:max-w-none">
          Together with their families
        </p>

        <h1 className="mt-7 text-maroon-500 md:mt-10">
          <span className="sr-only">
            {first} and {second}
          </span>
          <span aria-hidden className="block">
            <Mask>
              <span data-h="name" className="type-names block">
                {first}
              </span>
            </Mask>
            <span data-h="amp" className="type-heading block italic text-gold-500">
              &amp;
            </span>
            <Mask>
              <span data-h="name" className="type-names block">
                {second}
              </span>
            </Mask>
          </span>
        </h1>

        <div data-h="divider" className="mt-7 md:mt-9">
          <OrnamentDivider className="w-44 text-gold-500 md:w-56" />
        </div>

        {place && (
          <p data-h="details" className="type-subheading mt-6 text-ink-soft md:mt-8">
            {place}
          </p>
        )}
      </div>

      {/* outer wrapper fades on scroll; inner link plays the entrance */}
      <div data-h="cue-fade" className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-10">
        <a href="#invitation" data-h="cue" className="flex flex-col items-center gap-3 text-gold-700">
          <span className="type-meta">Scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-gold-500/25 md:h-14">
            <span className="absolute inset-x-0 top-0 h-1/3 animate-scroll-cue bg-gold-500" />
          </span>
        </a>
      </div>
    </section>
  );
}
