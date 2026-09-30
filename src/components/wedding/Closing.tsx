"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { Mandala } from "@/components/decorations/Mandala";
import { Bouquet } from "@/components/decorations/Bouquet";
import { Petals } from "@/components/decorations/Petals";

type ClosingProps = {
  heading: string;
  /** First names, in display order */
  names: [string, string];
  /** e.g. "15th November 2026" */
  date: string;
  hashtag: string;
};

/** The last page of the invitation. */
export function Closing({ heading, names: [first, second], date, hashtag }: ClosingProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;
    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: root.current, start: "top 55%" } })
      .from("[data-c=mandala]", { autoAlpha: 0, scale: 0.94, duration: 2.6, ease: ease.gentleGsap }, 0)
      .fromTo(
        "[data-c=arch]",
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 2.2, ease: "expo.inOut" },
        0.1,
      )
      .from("[data-c=heading]", { autoAlpha: 0, y: 10, duration: 1.4 }, 0.5)
      .from("[data-c=name]", { yPercent: 105, duration: 1.8, stagger: 0.25 }, 0.7)
      .from("[data-c=amp]", { autoAlpha: 0, scale: 0.7, duration: 1.6 }, 1)
      .from("[data-c=bouquet]", { autoAlpha: 0, y: 12, scale: 0.92, duration: 1.8 }, 1.3)
      .from("[data-c=detail]", { autoAlpha: 0, y: 10, duration: 1.3, stagger: 0.18 }, 1.7);
  }, root);

  return (
    <section
      ref={root}
      aria-labelledby="closing-heading"
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-gutter py-section"
    >
      <div
        data-c="mandala"
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[190vw] -translate-x-1/2 -translate-y-1/2 text-gold-500 opacity-[0.07] md:w-[110vmin]"
      >
        <Mandala className="w-full animate-spin-slow" />
      </div>

      {/* the same jharokha arch as the hero, closing the book */}
      <div
        data-c="arch"
        aria-hidden
        className="frame pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[min(80svh,44rem)] w-[min(86vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-arch"
      />

      <Petals />

      <div className="relative flex flex-col items-center text-center">
        <p id="closing-heading" data-c="heading" className="type-meta text-gold-700">
          {heading}
        </p>

        <p className="mt-8 text-maroon-500 md:mt-10">
          <span className="sr-only">
            {first} and {second}
          </span>
          <span aria-hidden className="block">
            <Mask>
              <span data-c="name" className="type-names block">
                {first}
              </span>
            </Mask>
            <span data-c="amp" className="type-heading block italic text-gold-500">
              &amp;
            </span>
            <Mask>
              <span data-c="name" className="type-names block">
                {second}
              </span>
            </Mask>
          </span>
        </p>

        <div data-c="bouquet" className="mt-7 md:mt-9">
          <Bouquet className="w-20 text-gold-500 md:w-24" />
        </div>

        <p data-c="detail" className="type-subheading mt-7 text-ink md:mt-9">
          {date}
        </p>
        <p data-c="detail" className="type-subheading mt-3 italic text-gold-700">
          {hashtag}
        </p>
      </div>
    </section>
  );
}
