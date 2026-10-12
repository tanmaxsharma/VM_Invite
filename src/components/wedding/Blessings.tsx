"use client";

import { useRef } from "react";
import type { Parents } from "@/data/types";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { Mandala } from "@/components/decorations/Mandala";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";
import { FloralSpray } from "@/components/decorations/FloralSpray";
import { SectionPetals } from "@/components/decorations/AmbientWeddingEffects";

type BlessingsProps = {
  heading: string;
  blessingLead: string;
  grandfather: string;
  memoryLead: string;
  grandmother: string;
  /** The son's parents, introduced by their own "Son of" line */
  parents: Parents;
};

const name = "text-[clamp(1.75rem,7.2vw,3.25rem)] leading-[1.15] text-parchment-50";
const lead = "type-meta text-gold-300";

/**
 * The family page: the elders' blessings, then the parents — all in type, like a printed card.
 * Set on deep maroon, with scalloped edges into the parchment pages.
 */
export function Blessings({ heading, blessingLead, grandfather, memoryLead, grandmother, parents }: BlessingsProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;

    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: "[data-bl=head]", start: "top 80%" } })
      .from("[data-bl=mandala]", { autoAlpha: 0, scale: 0.94, duration: 2.6, ease: ease.gentleGsap }, 0)
      .from("[data-bl=heading]", { yPercent: 105, duration: 1.6, stagger: 0.16 }, 0.1)
      .fromTo("[data-bl=rule]", { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, 0.6)
      .from("[data-bl=spray]", { autoAlpha: 0, scale: 0.9, duration: 1.8, stagger: 0.15 }, 0.5);

    // each group of lines arrives on its own as it is reached
    gsap.utils.toArray<HTMLElement>("[data-bl=group]").forEach((group) => {
      gsap.from(group.querySelectorAll("[data-bl=line]"), {
        autoAlpha: 0,
        y: 14,
        duration: 1.3,
        stagger: 0.16,
        ease: ease.cinematicGsap,
        scrollTrigger: { trigger: group, start: "top 82%" },
      });
    });

  }, root);

  return (
    <section
      ref={root}
      id="blessings"
      aria-labelledby="blessings-heading"
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

      <div className="relative mx-auto max-w-[34rem]">
        {/* the blessing of the elders */}
        <header data-bl="head">
          <h2 id="blessings-heading" className="type-heading text-parchment-50">
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

        {/* the living grandfather, whose blessing is sought */}
        <div data-bl="group" className="mt-12 md:mt-16">
          <p data-bl="line" className={lead}>
            {blessingLead}
          </p>
          <p data-bl="line" className={`font-display mt-3 ${name}`}>
            {grandfather}
          </p>
        </div>

        {/* the grandmother, remembered */}
        <div data-bl="group" className="mt-8 md:mt-10">
          <span data-bl="line" aria-hidden className="mx-auto block size-1.5 rotate-45 bg-gold-300/80" />
          <p data-bl="line" className={`${lead} mt-6`}>
            {memoryLead}
          </p>
          {/* remembered gently: the same hand, a softer tone */}
          <p data-bl="line" className={`font-display mt-3 italic ${name} opacity-80`}>
            {grandmother}
          </p>
        </div>

        {/* the son's parents */}
        <div data-bl="group" className="mt-12 md:mt-16">
          <div data-bl="line" aria-hidden>
            <OrnamentDivider className="mx-auto w-32 text-gold-300/80" />
          </div>
          <p data-bl="line" className={`${lead} mt-8`}>
            Beloved {parents.lead.toLowerCase()}
          </p>
          <p data-bl="line" className={`font-display mt-3 ${name}`}>
            {parents.names[0]}
          </p>
          <p data-bl="line" aria-hidden className="type-subheading my-1 italic text-gold-300">
            &amp;
          </p>
          <p data-bl="line" className={`font-display ${name}`}>
            {parents.names[1]}
          </p>
        </div>
      </div>
    </section>
  );
}
