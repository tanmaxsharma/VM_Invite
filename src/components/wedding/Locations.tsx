"use client";

import { useRef } from "react";
import type { MapLocation } from "@/data/types";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { OrnateLink } from "@/components/ui/OrnateLink";
import { Mandala } from "@/components/decorations/Mandala";
import { Mandap } from "@/components/decorations/Mandap";
import { CornerOrnament } from "@/components/decorations/CornerOrnament";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";

type LocationsProps = {
  heading: string;
  map: MapLocation;
};

const corner = "pointer-events-none absolute z-10 w-10 text-gold-500 md:w-14";

/** Where we celebrate: the venue, its map as an inset plate, and the way there. */
export function Locations({ heading, map }: LocationsProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;

    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: root.current, start: "top 70%" } })
      .from("[data-l=mandap]", { autoAlpha: 0, y: 14, duration: 1.6 }, 0)
      .from("[data-l=heading]", { yPercent: 105, duration: 1.6 }, 0.2)
      .from("[data-l=rule]", { autoAlpha: 0, duration: 1.2 }, 0.5);

    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: "[data-l=map]", start: "top 80%" } })
      .from("[data-l=map-label]", { autoAlpha: 0, y: 10, duration: 1.2, stagger: 0.12 }, 0)
      .fromTo(
        "[data-l=map-frame]",
        { clipPath: "inset(0% 0% 100% 0% round 1.5rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", duration: 1.8, ease: "expo.inOut" },
        0.15,
      )
      .from("[data-l=map-cta]", { autoAlpha: 0, y: 10, duration: 1.2 }, 1.1);
  }, root);

  return (
    <section
      ref={root}
      id="locations"
      aria-labelledby="locations-heading"
      className="relative overflow-x-clip px-gutter pb-section"
    >
      {/* cropped mandala drifting off the left edge, echoing the earlier pages */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[10%] -left-[50vw] w-[90vw] text-gold-500 opacity-[0.06] md:-left-[16vw] md:w-[40vw]"
      >
        <Mandala className="w-full animate-spin-slow" />
      </div>

      <header className="relative text-center">
        <Mandap data-l="mandap" className="mx-auto w-28 text-gold-700 md:w-36" />
        <h2 id="locations-heading" className="type-display mt-5 italic text-maroon-500">
          <Mask>
            <span data-l="heading" className="block">
              {heading}
            </span>
          </Mask>
        </h2>
        <div data-l="rule">
          <OrnamentDivider className="mx-auto mt-6 w-40 text-gold-500" />
        </div>
      </header>

      {map.embedUrl && (
        <div data-l="map" className="relative mx-auto mt-10 max-w-[56rem] md:mt-14">
          <div className="mb-6 text-center md:mb-8">
            {map.caption && (
              <p data-l="map-label" className="type-meta text-gold-700">
                {map.caption}
              </p>
            )}
            <p data-l="map-label" className="type-heading mt-2 text-maroon-500">
              {map.name}
            </p>
            {map.address && (
              <p data-l="map-label" className="type-body mt-2 text-ink-soft">
                {map.address}
              </p>
            )}
          </div>

          {/* the map, mounted like an inset plate: paper border, gold hairlines, corner ornaments */}
          <div
            data-l="map-frame"
            className="paper relative rounded-[1.5rem] border border-gold-500/55 p-2.5 shadow-card md:p-3.5"
          >
            <CornerOrnament corner="top-left" className={`${corner} -top-1 -left-1`} />
            <CornerOrnament corner="top-right" className={`${corner} -top-1 -right-1`} />
            <CornerOrnament corner="bottom-left" className={`${corner} -bottom-1 -left-1`} />
            <CornerOrnament corner="bottom-right" className={`${corner} -right-1 -bottom-1`} />
            <div className="relative aspect-square min-h-72 overflow-hidden rounded-[1.1rem] border border-gold-500/30 bg-parchment-100 sm:aspect-[4/3] md:aspect-[16/10] lg:aspect-[16/9]">
              <iframe
                src={map.embedUrl}
                title={`${map.name} location`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 size-full border-0 [filter:sepia(0.12)_saturate(0.9)]"
              />
            </div>
          </div>

          {map.directionsUrl && (
            <div data-l="map-cta" className="mt-8 text-center">
              <OrnateLink
                href={map.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get directions to ${map.name} (opens in a new tab)`}
              >
                Get Directions
              </OrnateLink>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
