"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mandala } from "@/components/decorations/Mandala";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";
import { FloralSpray } from "@/components/decorations/FloralSpray";
import { Toran } from "@/components/decorations/Toran";
import { Mask } from "@/components/ui/Mask";

export type HeroPerson = {
  /** Full name */
  name: string;
  /** e.g. "Son of" */
  lead?: string;
  /** e.g. "Smt. Sapna Jain & Dr. Rajneet Jain " */
  parents?: string;
};

export type HeroProps = {
  /** The short line above the names, e.g. "With the blessings of our families" */
  intro: string;
  /** The couple, in display order */
  people: [HeroPerson, HeroPerson];
  /** City / location line; omitted when not provided */
  place?: string;
  /** Arms the entrance animation (after the invitation is opened); it plays as the cover scrolls into view. */
  play: boolean;
  inert?: boolean;
};

/** A name set large, with the parents quietly beneath it. */
function Person({ name, lead, parents }: HeroPerson) {
  return (
    <div>
      <Mask>
        <span data-h="name" aria-hidden className="type-names block">
          {name}
        </span>
      </Mask>
      {parents && (
        <p data-h="parents" className="mx-auto mt-2 max-w-[17rem] text-center md:mt-3 md:max-w-[26rem]">
          {lead && <span className="type-meta block text-[0.6875rem]! text-gold-700">{lead}</span>}
          <span className="mt-1.5 block font-display text-[1.0625rem] leading-[1.35] text-balance text-ink-soft italic md:text-[1.3125rem]">
            {parents}
          </span>
        </p>
      )}
    </div>
  );
}

export function Hero({ intro, people: [first, second], place, play, inert }: HeroProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(
    () => {
      if (!play) return;

      if (prefersReducedMotion()) {
        gsap.from("[data-h]", { autoAlpha: 0, duration: 0.8 });
        return;
      }

      gsap
        .timeline({
          defaults: { ease: ease.cinematicGsap },
          scrollTrigger: { trigger: root.current, start: "top 60%", once: true },
        })
        .from("[data-h=mandala]", { autoAlpha: 0, scale: 0.92, duration: 3, ease: ease.gentleGsap }, 0)
        .fromTo("[data-h=arch]", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 2.2, ease: "expo.inOut" }, 0.1)
        .from("[data-h=families]", { autoAlpha: 0, y: 14, duration: 1.4 }, 0.5)
        .from("[data-h=name]", { yPercent: 110, duration: 1.8, stagger: 0.25 }, 0.7)
        .from("[data-h=parents]", { autoAlpha: 0, y: 10, duration: 1.3, stagger: 0.45 }, 1.5)
        .from("[data-h=amp]", { autoAlpha: 0, scale: 0.7, duration: 1.6 }, 1.2)
        .fromTo("[data-h=divider]", { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }, 2.1)
        .from("[data-h=details]", { autoAlpha: 0, y: 12, duration: 1.2, stagger: 0.12 }, 2.4)
        .from("[data-h=decor]", { autoAlpha: 0, scale: 0.94, duration: 2, stagger: 0.12, ease: "power1.out" }, 0.9)
        .from("[data-h=toran]", { yPercent: -110, duration: 1.8, ease: ease.cinematicGsap }, 0.4)
        .from("[data-h=cue]", { autoAlpha: 0, y: -8, duration: 1.2 }, 3);

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
      id="cover"
      inert={inert}
      aria-label="Wedding announcement"
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-gutter pt-[max(8svh,3.5rem)] pb-[8svh] md:pt-[max(8svh,5rem)]"
    >
      {/* background ornament */}
      <div
        data-h="mandala"
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[190vw] -translate-x-1/2 -translate-y-1/2 text-gold-500 opacity-[0.09] md:w-[115vmin]"
      >
        <Mandala className="w-full animate-spin-slow" />
      </div>

      {/* soft watercolour light behind the arch */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(45% 35% at 50% 40%, color-mix(in oklab, var(--color-gold-300) 22%, transparent), transparent 75%), radial-gradient(40% 30% at 30% 75%, color-mix(in oklab, var(--color-maroon-300) 12%, transparent), transparent 75%), radial-gradient(40% 30% at 72% 70%, color-mix(in oklab, var(--color-saffron-300) 14%, transparent), transparent 75%)",
        }}
      />

      {/* marigold toran across the top of the cover */}
      <div data-h="toran" className="pointer-events-none absolute inset-x-0 top-0 h-12 md:h-16">
        <Toran className="h-full" />
      </div>

      {/*
        The stage. The jharokha arch is drawn around the content, not beside it, so it can never fall
        short of what it frames. It keeps its usual height (84svh, at most 46rem) and grows only when
        the content needs more. Its top padding is the clearance the blessing line needs under the
        curve of the arch (the arch is narrowest there); the bottom padding keeps the ornament clear
        of the scroll cue (which reaches about 6rem on phones / 8rem from md up, measured from the
        section edge, less the 8svh section padding).
      */}
      <div className="relative flex min-h-[min(84svh,46rem)] w-[min(88vw,36rem)] items-center justify-center pt-12 pb-[max(2rem,calc(7.25rem-8svh))] sm:pt-14 md:pt-[5.5rem] md:pb-[max(2.5rem,calc(9.5rem-8svh))]">
        {/* jharokha arch */}
        <div data-h="arch" aria-hidden className="frame pointer-events-none absolute inset-0 -z-10 rounded-arch" />

        {/* floral sprays anchoring the base of the arch (parallax wrappers) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div data-h="sprig" className="absolute -bottom-6 -left-8 md:-bottom-8 md:-left-24">
            <FloralSpray data-h="decor" corner="bottom-left" className="w-36 md:w-64" />
          </div>
          <div data-h="sprig" className="absolute -right-8 -bottom-6 md:-right-24 md:-bottom-8">
            <FloralSpray data-h="decor" corner="bottom-right" className="w-36 md:w-64" />
          </div>
        </div>

        <div data-h="content" className="relative flex w-full flex-col items-center text-center">
          {/* two short lines on phones, where the arch is narrow; one line from sm up */}
          <p data-h="families" className="type-subheading max-w-[12rem] italic text-gold-700 text-balance sm:max-w-none">
            {intro}
          </p>

          <h1 className="sr-only">
            {first.name} and {second.name}
          </h1>

          <div className="mt-7 text-maroon-500 md:mt-10">
            <Person {...first} />
            <span data-h="amp" aria-hidden className="type-heading my-1 block italic text-gold-500 md:my-2">
              &amp;
            </span>
            <Person {...second} />
          </div>

          <div data-h="divider" className="mt-7 md:mt-9">
            <OrnamentDivider className="w-44 text-gold-500 md:w-56" />
          </div>

          {place && (
            <p data-h="details" className="type-subheading mt-6 text-ink-soft md:mt-8">
              {place}
            </p>
          )}
        </div>
      </div>

      {/* outer wrapper fades on scroll; inner link plays the entrance */}
      <div data-h="cue-fade" className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-10">
        <a href="#save-the-date" data-h="cue" className="flex flex-col items-center gap-3 text-gold-700">
          <span className="type-meta">Scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-gold-500/25 md:h-14">
            <span className="absolute inset-x-0 top-0 h-1/3 animate-scroll-cue bg-gold-500" />
          </span>
        </a>
      </div>
    </section>
  );
}
