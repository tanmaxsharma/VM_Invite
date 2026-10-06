"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { Mandala } from "@/components/decorations/Mandala";
import { CornerOrnament } from "@/components/decorations/CornerOrnament";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";
import { FloralSpray } from "@/components/decorations/FloralSpray";

type InvitationProps = {
  invocation?: string;
  heading: [string, string];
  message: string[];
  /** Omitted when not provided */
  place?: string;
};

/** The blessing — one ornamental card, like the first inner page of a printed invitation. */
export function Invitation({ invocation, heading, message, place }: InvitationProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;

    // A thread continues down from the hero's scroll cue.
    gsap.fromTo(
      "[data-i=thread]",
      { scaleY: 0 },
      { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 30%", scrub: true } },
    );

    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: root.current, start: "top 55%" } })
      .fromTo(
        "[data-i=card]",
        { clipPath: "inset(0% 0% 100% 0% round 0.375rem)", y: 24 },
        { clipPath: "inset(0% 0% 0% 0% round 0.375rem)", y: 0, duration: 2, ease: "expo.inOut" },
        0,
      )
      .from("[data-i=spray]", { autoAlpha: 0, scale: 0.9, rotate: -6, duration: 1.8, stagger: 0.15 }, 0.6)
      .from("[data-i=crest]", { autoAlpha: 0, rotate: -30, duration: 1.6 }, 0.8)
      .from("[data-i=invocation]", { autoAlpha: 0, y: 8, duration: 1.2 }, 0.9)
      .from("[data-i=heading]", { yPercent: 105, duration: 1.6, stagger: 0.18 }, 1)
      .from("[data-i=line]", { autoAlpha: 0, y: 14, duration: 1.3, stagger: 0.14 }, 1.4)
      .from("[data-i=meta]", { autoAlpha: 0, duration: 1.2, stagger: 0.12 }, 1.9);
  }, root);

  return (
    <section
      ref={root}
      id="invitation"
      aria-labelledby="invitation-heading"
      className="relative overflow-x-clip px-gutter pb-section"
    >
      <div aria-hidden className="mx-auto h-[12svh] w-px md:h-[18svh]">
        <div data-i="thread" className="size-full origin-top bg-linear-to-b from-transparent to-gold-500/60" />
      </div>

      <div className="relative mx-auto mt-8 max-w-[34rem] md:mt-12">
        <FloralSpray data-i="spray" corner="top-left" className="pointer-events-none absolute -top-10 -left-6 z-10 w-36 md:-top-12 md:-left-16 md:w-52" />
        <FloralSpray data-i="spray" corner="bottom-right" className="pointer-events-none absolute -right-6 -bottom-10 z-10 w-32 md:-right-16 md:-bottom-12 md:w-48" />

        <div data-i="card" className="paper frame relative rounded-card px-7 py-14 text-center shadow-card sm:px-12 md:py-20">
          <CornerOrnament corner="top-right" className="absolute top-2.5 right-2.5 w-11 text-gold-500 md:w-14" />
          <CornerOrnament corner="bottom-left" className="absolute bottom-2.5 left-2.5 w-11 text-gold-500 md:w-14" />

          <div data-i="crest" aria-hidden className="mx-auto w-10 text-gold-500 md:w-12">
            <Mandala className="w-full" />
          </div>
          {invocation && (
            <p data-i="invocation" className="type-meta mt-4 text-gold-700">
              <span className="text-gold-500">॥</span> {invocation} <span className="text-gold-500">॥</span>
            </p>
          )}

          <h2 id="invitation-heading" className="type-heading mt-6 text-maroon-500 md:mt-8">
            <Mask>
              <span data-i="heading" className="block">
                {heading[0]}
              </span>
            </Mask>
            <Mask>
              <span data-i="heading" className="block italic">
                {heading[1]}
              </span>
            </Mask>
          </h2>

          <div data-i="meta">
            <OrnamentDivider className="mx-auto mt-6 w-36 text-gold-500 md:w-44" />
          </div>

          <p className="type-subheading mt-6 text-ink">
            {message.map((line) => (
              <span key={line} data-i="line" className="block">
                {line}
              </span>
            ))}
          </p>

          {place && (
            <p data-i="meta" className="type-meta mt-8 text-gold-700">
              {place}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
