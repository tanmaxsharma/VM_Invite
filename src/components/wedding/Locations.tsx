"use client";

import { useRef } from "react";
import type { MapLocation, Place } from "@/data/types";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { OrnateLink } from "@/components/ui/OrnateLink";
import { Mandala } from "@/components/decorations/Mandala";
import { CornerOrnament } from "@/components/decorations/CornerOrnament";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";

export type LocationEntry = Place & {
  /** Celebrations held here, taken from the schedule */
  occasions: { title: string; date: string }[];
};

type LocationsProps = {
  heading: string;
  intro?: string;
  places: LocationEntry[];
  map: MapLocation;
};

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const corner = "pointer-events-none absolute z-10 w-10 text-gold-500 md:w-14";

/** Where the celebrations happen — the map as an inset plate, then a short index of places. */
export function Locations({ heading, intro, places, map }: LocationsProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;

    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: root.current, start: "top 70%" } })
      .from("[data-l=heading]", { yPercent: 105, duration: 1.6 }, 0)
      .from("[data-l=intro]", { autoAlpha: 0, y: 12, duration: 1.4, stagger: 0.15 }, 0.3);

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

    gsap.utils.toArray<HTMLElement>("[data-l=place]").forEach((place) => {
      const q = gsap.utils.selector(place);
      gsap
        .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: place, start: "top 85%" } })
        .fromTo(q("[data-l=rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: ease.gentleGsap }, 0)
        .from(q("[data-l=numeral]"), { autoAlpha: 0, duration: 1.2 }, 0.2)
        .from(q("[data-l=name]"), { yPercent: 105, duration: 1.4 }, 0.25)
        .from(q("[data-l=detail]"), { autoAlpha: 0, y: 8, duration: 1.2 }, 0.5);
    });
  }, root);

  return (
    <section
      ref={root}
      id="locations"
      aria-labelledby="locations-heading"
      className="relative overflow-x-clip px-gutter pb-section"
    >
      {/* cropped mandala drifting off the left edge, echoing the invitation's */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[15%] -left-[50vw] w-[90vw] text-gold-500 opacity-[0.06] md:-left-[16vw] md:w-[40vw]"
      >
        <Mandala className="w-full animate-spin-slow" />
      </div>

      <header className="relative text-center">
        <h2 id="locations-heading" className="type-display italic text-maroon-500">
          <Mask>
            <span data-l="heading" className="block">
              {heading}
            </span>
          </Mask>
        </h2>
        {intro && (
          <p data-l="intro" className="type-subheading mx-auto mt-4 max-w-[24rem] italic text-ink-soft">
            {intro}
          </p>
        )}
        <div data-l="intro">
          <OrnamentDivider className="mx-auto mt-7 w-40 text-gold-500" />
        </div>
      </header>

      {map.embedUrl && (
        <div data-l="map" className="relative mx-auto mt-12 max-w-[56rem] md:mt-16">
          <div className="mb-6 text-center md:mb-8">
            <p data-l="map-label" className="type-meta text-gold-700">
              The Venue
            </p>
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
            <div className="relative aspect-[4/5] min-h-72 overflow-hidden rounded-[1.1rem] border border-gold-500/30 bg-parchment-100 sm:aspect-[4/3] md:aspect-[16/10] lg:aspect-[16/9]">
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

      {/* a short index of every place in the schedule */}
      <ul className="relative mx-auto mt-14 grid max-w-[52rem] sm:grid-cols-2 sm:gap-x-12 md:mt-20 md:gap-x-16">
        {places.map((place, i) => (
          <li key={place.name} data-l="place" className="relative flex gap-4 py-6 md:py-8">
            <span data-l="rule" aria-hidden className="absolute top-0 left-0 h-px w-full origin-left bg-line" />
            <span data-l="numeral" aria-hidden className="type-subheading w-7 shrink-0 italic text-gold-500">
              {NUMERALS[i] ?? i + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-maroon-500">
                <Mask className="-ml-[0.12em]">
                  <span data-l="name" className="type-subheading block not-italic!">
                    {place.name}
                  </span>
                </Mask>
              </h3>
              {place.occasions.length > 0 && (
                <p data-l="detail" className="type-body mt-1.5 text-ink-soft">
                  {place.occasions.map((occasion) => (
                    <span key={`${occasion.title}-${occasion.date}`} className="block">
                      <span className="text-maroon-700">{occasion.title}</span>
                      <span className="mx-2 text-gold-500">·</span>
                      {occasion.date}
                    </span>
                  ))}
                </p>
              )}
              {place.address && (
                <p data-l="detail" className="type-body mt-2 text-ink-soft">
                  {place.address}
                </p>
              )}
              {place.mapsUrl && (
                <a
                  data-l="detail"
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Get directions to ${place.name} (opens in a new tab)`}
                  className="type-button mt-4 flex w-fit items-center gap-2 border-b border-gold-500/60 pb-1 text-maroon-500 transition-colors hover:border-maroon-500"
                >
                  Get Directions
                  <span aria-hidden>→</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
