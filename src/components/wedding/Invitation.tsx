"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { Mandala } from "@/components/decorations/Mandala";
import { CornerOrnament } from "@/components/decorations/CornerOrnament";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";

type Family = { name: string; parents?: string; role: string };

type InvitationProps = {
  invocation?: string;
  heading: [string, string];
  message: string[];
  families: [Family, Family];
  /** Omitted when not provided */
  place?: string;
};

/** The written invitation — reads like the inside of a printed card. */
export function Invitation({ invocation, heading, message, families, place }: InvitationProps) {
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
      .timeline({
        defaults: { ease: ease.cinematicGsap },
        scrollTrigger: { trigger: root.current, start: "top 45%" },
      })
      .from("[data-i=invocation]", { autoAlpha: 0, y: 10, duration: 1.2 }, 0)
      .from("[data-i=heading]", { yPercent: 105, duration: 1.8, stagger: 0.2 }, 0.1)
      .fromTo("[data-i=rule]", { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: ease.gentleGsap }, 0.5)
      .fromTo(
        "[data-i=frame]",
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 2.2, ease: "expo.inOut" },
        0.6,
      )
      .from("[data-i=line]", { autoAlpha: 0, y: 18, duration: 1.4, stagger: 0.15 }, 1)
      .from("[data-i=family]", { autoAlpha: 0, y: 14, duration: 1.3, stagger: 0.15 }, 1.3)
      .from("[data-i=meta]", { autoAlpha: 0, duration: 1.4, stagger: 0.15 }, 1.9);
  }, root);

  return (
    <section
      ref={root}
      id="invitation"
      aria-labelledby="invitation-heading"
      className="relative overflow-x-clip px-gutter pb-section"
    >
      <div aria-hidden className="mx-auto h-[14svh] w-px md:h-[22svh]">
        <div data-i="thread" className="size-full origin-top bg-linear-to-b from-transparent to-gold-500/60" />
      </div>

      {/* cropped mandala drifting off the right edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[30%] -right-[45vw] w-[90vw] text-gold-500 opacity-[0.07] md:-right-[14vw] md:w-[44vw]"
      >
        <Mandala className="w-full animate-spin-slow" />
      </div>

      <div className="relative mx-auto mt-10 max-w-content md:mt-16">
        {invocation && (
          <p data-i="invocation" className="type-meta text-gold-700">
            <span className="text-gold-500">॥</span> {invocation} <span className="text-gold-500">॥</span>
          </p>
        )}

        <h2 id="invitation-heading" className="type-display -ml-[0.12em] mt-6 text-maroon-500 md:mt-8">
          <Mask>
            <span data-i="heading" className="block">
              {heading[0]}
            </span>
          </Mask>
          <Mask className="pl-[6%] md:pl-[22%]">
            <span data-i="heading" className="block italic">
              {heading[1]}
            </span>
          </Mask>
        </h2>

        <div data-i="rule" aria-hidden className="mt-8 h-px w-40 origin-left bg-gold-500/70 md:mt-10 md:ml-[22%] md:w-72" />

        <div className="mt-14 grid gap-14 md:mt-20 md:grid-cols-12 md:gap-8">
          {/* message, framed like the inner card */}
          <div className="relative md:col-span-7 md:col-start-6 md:row-start-1">
            <div data-i="frame" aria-hidden className="frame absolute inset-0 rounded-card">
              <CornerOrnament corner="top-left" className="absolute top-2 left-2 w-12 text-gold-500 md:w-16" />
              <CornerOrnament corner="bottom-right" className="absolute right-2 bottom-2 w-12 text-gold-500 md:w-16" />
            </div>
            <div className="relative px-7 py-14 sm:px-12 md:px-16 md:py-20">
              <p className="type-subheading text-ink">
                {message.map((line) => (
                  <span key={line} data-i="line" className="block">
                    {line}
                  </span>
                ))}
              </p>
              <div data-i="meta">
                <OrnamentDivider className="mt-10 w-36 text-gold-500 md:w-44" />
              </div>
              {place && (
                <p data-i="meta" className="type-meta mt-6 text-gold-700">
                  {place}
                </p>
              )}
            </div>
          </div>

          {/* the two families */}
          <div className="flex flex-col gap-8 border-l border-line pl-6 md:col-span-4 md:row-start-1 md:mt-24 md:gap-10 md:pl-8">
            {families.map((family, i) => (
              <div key={family.role} data-i="family">
                {i > 0 && (
                  <p aria-hidden className="type-subheading -mt-2 mb-6 text-gold-500 md:mb-8">
                    &amp;
                  </p>
                )}
                <p className="type-meta text-gold-700">{family.role}</p>
                <p className="type-heading mt-2 text-maroon-500">{family.name}</p>
                {family.parents && <p className="type-body mt-1 text-ink-soft">{family.parents}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
