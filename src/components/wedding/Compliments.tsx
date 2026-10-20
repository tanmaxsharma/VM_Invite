"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { Mandala } from "@/components/decorations/Mandala";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";
import { FloralSpray } from "@/components/decorations/FloralSpray";
import { SectionPetals } from "@/components/decorations/AmbientWeddingEffects";

type ComplimentsProps = {
  heading: string;
  /** In the order printed */
  entries: { names: string; relation: string }[];
};

/**
 * "With Best Compliments": the relatives who send their regards, set in type as on the printed
 * card. Deep maroon, with scalloped edges into the parchment pages. One column on phones, two on
 * wider screens (reading across, so the printed order is kept).
 */
export function Compliments({ heading, entries }: ComplimentsProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;

    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: "[data-bl=head]", start: "top 80%" } })
      .from("[data-bl=mandala]", { autoAlpha: 0, scale: 0.94, duration: 2.6, ease: ease.gentleGsap }, 0)
      .from("[data-bl=heading]", { yPercent: 105, duration: 1.6, stagger: 0.16 }, 0.1)
      .fromTo("[data-bl=rule]", { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, 0.6)
      .from("[data-bl=spray]", { autoAlpha: 0, scale: 0.9, duration: 1.8, stagger: 0.15 }, 0.5);

    gsap.from("[data-bl=line]", {
      autoAlpha: 0,
      y: 14,
      duration: 1.3,
      stagger: 0.16,
      ease: ease.cinematicGsap,
      scrollTrigger: { trigger: "[data-bl=list]", start: "top 82%" },
    });
  }, root);

  return (
    <section
      ref={root}
      id="compliments"
      aria-labelledby="compliments-heading"
      className="scallop-top scallop-bottom relative isolate overflow-x-clip px-gutter py-section text-center"
      style={{
        backgroundColor: "var(--color-maroon-700)",
        backgroundImage:
          "radial-gradient(70% 38% at 50% 18%, color-mix(in oklab, var(--color-maroon-500) 75%, transparent), transparent 75%), var(--texture-paper)",
      }}
    >
      <div
        data-bl="mandala"
        aria-hidden
        className="pointer-events-none absolute top-[24%] left-1/2 -z-10 w-[170vw] -translate-x-1/2 text-gold-300 opacity-[0.07] md:w-[80vmin]"
      >
        <Mandala className="w-full animate-spin-slow" />
      </div>
      <SectionPetals count={5} />

      {/* restrained floral corners */}
      <FloralSpray
        data-bl="spray"
        corner="top-right"
        className="pointer-events-none absolute top-0 right-0 w-20 sm:w-28 xl:w-40"
      />
      <FloralSpray
        data-bl="spray"
        corner="bottom-left"
        className="pointer-events-none absolute bottom-0 left-0 w-20 sm:w-28 xl:w-40"
      />

      <div className="relative mx-auto max-w-[52rem] lg:max-w-[62rem]">
        <header data-bl="head" className="mx-auto max-w-[34rem]">
          <h2 id="compliments-heading" className="type-heading text-parchment-50">
            <Mask>
              <span data-bl="heading" className="block">
                {heading}
              </span>
            </Mask>
          </h2>
          <div data-bl="rule" aria-hidden className="mt-5">
            <OrnamentDivider className="mx-auto w-40 text-gold-300" />
          </div>
        </header>

        <ul data-bl="list" className="mt-12 grid gap-y-9 md:mt-16 md:grid-cols-2 md:gap-x-12 md:gap-y-12 lg:gap-x-16">
          {entries.map(({ names, relation }, i) => (
            <li key={names} data-bl="line">
              {/* a small diamond between entries on phones, where they stack */}
              {i > 0 && <span aria-hidden className="mx-auto mb-9 block size-1.5 rotate-45 bg-gold-300/70 md:hidden" />}
              <p className="font-display text-[clamp(1.375rem,5.6vw,1.75rem)] leading-[1.25] text-balance text-parchment-50">
                {names}
              </p>
              <p className="font-display mt-2 text-[1.0625rem] italic text-gold-300 md:text-[1.1875rem]">({relation})</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
