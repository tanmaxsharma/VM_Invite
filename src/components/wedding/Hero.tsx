"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mandala } from "@/components/decorations/Mandala";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";
import { FloralSpray } from "@/components/decorations/FloralSpray";
import { Toran } from "@/components/decorations/Toran";
import { Mask } from "@/components/ui/Mask";

/** One family line under a name, e.g. lead "S/O", names "Mrs. Sapna & Dr. Rajneet Jain" */
export type HeroLine = { lead: string; names: string };

export type HeroPerson = {
  /** The name as printed large, e.g. "Vishesh" */
  name: string;
  /** Grandparents, then parents */
  lines: HeroLine[];
};

export type HeroProps = {
  /** Set first, in Devanagari */
  mantra?: string;
  /** The invitation lines above the first name */
  intro: string[];
  /** Between the two names, e.g. "With" */
  connector: string;
  /** The lines after the second name */
  closing: string[];
  /** The couple, in display order */
  people: [HeroPerson, HeroPerson];
  /** Full names, for the page heading read by screen readers */
  fullNames: [string, string];
  /** City / location line; omitted when not provided */
  place?: string;
  /** Arms the entrance animation (after the invitation is opened); it plays as the cover scrolls into view. */
  play: boolean;
  inert?: boolean;
};

/** A name set large, with the family quietly beneath it. */
function Person({ name, lines }: HeroPerson) {
  return (
    <div>
      <Mask>
        <span data-h="name" className="type-names block">
          {name}
        </span>
      </Mask>
      {lines.length > 0 && (
        <div data-h="parents" className="mx-auto mt-3 max-w-[18.5rem] space-y-1.5 md:mt-4 md:max-w-[30rem] md:space-y-2">
          {lines.map(({ lead, names }) => (
            <p
              key={lead}
              className="font-display text-[1.125rem] leading-[1.5] font-medium text-balance text-ink-strong italic md:text-[1.375rem]"
            >
              <span className="text-gold-700">{lead}</span> {names}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function Hero({ mantra, intro, connector, closing, people: [first, second], fullNames, place, play, inert }: HeroProps) {
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
        .from("[data-h=mantra]", { autoAlpha: 0, y: 10, duration: 1.4 }, 0.35)
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
      // The words drift up gently once the whole card has been read. They never fade: on a phone
      // the card is taller than the screen, and every line must stay at full strength to be read.
      gsap.to("[data-h=content]", {
        y: -70,
        ease: "none",
        scrollTrigger: { ...scrollTrigger, start: "bottom 50%" },
      });
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
        the content needs more. Its top padding is the clearance the opening lines need under the
        curve of the arch (the arch is narrowest there); the bottom padding keeps the last lines clear
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

        <div data-h="content" className="relative flex w-full flex-col items-center px-5 text-center sm:px-8">
          <h1 className="sr-only">
            {fullNames[0]} and {fullNames[1]}
          </h1>

          {/* Devanagari has tall vowel signs above and below the line: generous line height, never clipped */}
          {mantra && (
            <p data-h="mantra" lang="hi" className="font-mantra text-[1.375rem] leading-[1.75] text-maroon-500 md:text-[1.75rem]">
              {mantra}
            </p>
          )}

          {/* narrower on phones: these lines sit high, where the curve of the arch is tightest */}
          <div data-h="families" className="mt-3 max-w-[15.75rem] sm:max-w-[26rem] md:mt-4 md:max-w-[30rem]">
            {intro.map((line) => (
              <p key={line} className="font-display text-[1.125rem] leading-[1.55] font-medium text-balance text-ink-soft italic md:text-[1.375rem]">
                {line}
              </p>
            ))}
          </div>

          <div className="mt-6 text-maroon-500 md:mt-9">
            <Person {...first} />
            <span data-h="amp" className="type-heading my-3 block italic text-gold-600 md:my-4">
              {connector}
            </span>
            <Person {...second} />
          </div>

          <div data-h="divider" className="mt-7 md:mt-9">
            <OrnamentDivider className="w-44 text-gold-500 md:w-56" />
          </div>

          <div data-h="details" className="mt-5 max-w-[18.5rem] md:mt-6 md:max-w-[30rem]">
            {closing.map((line) => (
              <p key={line} className="font-display text-[1.1875rem] leading-[1.5] font-medium text-balance text-maroon-500 italic md:text-[1.4375rem]">
                {line}
              </p>
            ))}
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
