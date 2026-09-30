"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Photo } from "@/data/types";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { Mandala } from "@/components/decorations/Mandala";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";

type ClosingProps = {
  heading: string;
  /** First names, in display order */
  names: [string, string];
  /** e.g. "15th November 2026" */
  date: string;
  hashtag: string;
  photo: Photo;
};

/** The last page of the invitation. */
export function Closing({ heading, names: [first, second], date, hashtag, photo }: ClosingProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;
    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: root.current, start: "top 60%" } })
      .from("[data-c=mandala]", { autoAlpha: 0, scale: 0.94, duration: 2.6, ease: ease.gentleGsap }, 0)
      .from("[data-c=heading]", { autoAlpha: 0, y: 10, duration: 1.4 }, 0.2)
      .from("[data-c=name]", { yPercent: 105, duration: 1.8, stagger: 0.25 }, 0.4)
      .from("[data-c=amp]", { autoAlpha: 0, scale: 0.7, duration: 1.6 }, 0.7)
      // the photograph is unveiled from the bottom of its arch, then settles
      .from("[data-c=mount]", { autoAlpha: 0, y: 16, duration: 1.6 }, 1)
      .fromTo(
        "[data-c=photo]",
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 2, ease: "expo.inOut" },
        1.1,
      )
      .from("[data-c=photo-img]", { scale: 1.06, duration: 2.8, ease: ease.gentleGsap }, 1.1)
      .from("[data-c=date]", { autoAlpha: 0, y: 10, duration: 1.3 }, 2.4)
      .from("[data-c=hashtag]", { autoAlpha: 0, y: 8, duration: 1.3 }, 2.8);
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

      <div className="relative flex flex-col items-center text-center">
        <p id="closing-heading" data-c="heading" className="type-meta text-gold-700">
          {heading}
        </p>

        <p className="mt-6 text-maroon-500 md:mt-8">
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

        {/* photograph in a jharokha arch, mounted on paper with a gold hairline */}
        <figure
          data-c="mount"
          className="paper frame mt-8 w-[min(66vw,15.5rem)] rounded-arch p-2.5 shadow-soft md:mt-10 md:w-[17.5rem] md:p-3"
        >
          <div data-c="photo" className="relative aspect-[4/5] overflow-hidden rounded-arch bg-parchment-200">
            <Image
              data-c="photo-img"
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 17.5rem, 66vw"
              className="object-cover"
              style={{ objectPosition: photo.focus ?? "50% 30%" }}
            />
          </div>
        </figure>

        <OrnamentDivider className="mt-8 w-36 text-gold-500 md:mt-10" />

        <p data-c="date" className="type-subheading mt-6 text-ink">
          {date}
        </p>
        <p data-c="hashtag" className="type-subheading mt-2 italic text-gold-700">
          {hashtag}
        </p>
      </div>
    </section>
  );
}
