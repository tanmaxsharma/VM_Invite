"use client";

import { useRef } from "react";
import type { MapLocation, Place } from "@/data/types";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { OrnateLink } from "@/components/ui/OrnateLink";
import { Mandala } from "@/components/decorations/Mandala";
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

/** Where the celebrations happen — a short, printed-insert style list. */
export function Locations({ heading, intro, places, map }: LocationsProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;

    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: root.current, start: "top 70%" } })
      .from("[data-l=heading]", { yPercent: 105, duration: 1.6 }, 0)
      .from("[data-l=intro]", { autoAlpha: 0, y: 12, duration: 1.4, stagger: 0.15 }, 0.3);

    gsap.utils.toArray<HTMLElement>("[data-l=place]").forEach((place) => {
      const q = gsap.utils.selector(place);
      gsap
        .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: place, start: "top 82%" } })
        .fromTo(q("[data-l=rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: ease.gentleGsap }, 0)
        .from(q("[data-l=numeral]"), { autoAlpha: 0, duration: 1.2 }, 0.2)
        .from(q("[data-l=name]"), { yPercent: 105, duration: 1.4 }, 0.25)
        .from(q("[data-l=detail]"), { autoAlpha: 0, y: 8, duration: 1.2, stagger: 0.1 }, 0.5);
    });

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

      <ul className="relative mx-auto mt-12 grid max-w-[52rem] md:mt-16 md:grid-cols-2 md:gap-x-16">
        {places.map((place, i) => (
          <li key={place.name} data-l="place" className="relative flex gap-5 py-8 md:py-10">
            <span data-l="rule" aria-hidden className="absolute top-0 left-0 h-px w-full origin-left bg-line" />
            <span data-l="numeral" aria-hidden className="type-subheading w-7 shrink-0 italic text-gold-500">
              {NUMERALS[i] ?? i + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-maroon-500">
                <Mask className="-ml-[0.12em]">
                  <span data-l="name" className="type-heading block leading-[1.1]!">
                    {place.name}
                  </span>
                </Mask>
              </h3>
              {place.occasions.length > 0 && (
                <ul data-l="detail" className="mt-3 space-y-1">
                  {place.occasions.map((occasion) => (
                    <li key={`${occasion.title}-${occasion.date}`} className="type-body text-ink-soft">
                      <span className="text-maroon-700">{occasion.title}</span>
                      <span className="mx-2 text-gold-500">·</span>
                      {occasion.date}
                    </li>
                  ))}
                </ul>
              )}
              {place.address && (
                <p data-l="detail" className="type-body mt-3 text-ink-soft">
                  {place.address}
                </p>
              )}
              {place.mapsUrl && (
                <a
                  data-l="detail"
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-button mt-5 flex w-fit items-center gap-2 border-b border-gold-500/60 pb-1 text-maroon-500 transition-colors hover:border-maroon-500"
                >
                  Get Directions
                  <span aria-hidden>→</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* one map — the primary venue — framed like an inset card */}
      <div data-l="map" className="relative mx-auto mt-14 max-w-[52rem] md:mt-20">
        {(map.name || map.address) && (
          <div className="mb-6 text-center">
            {map.name && (
              <p data-l="map-label" className="type-meta text-gold-700">
                {map.name}
              </p>
            )}
            {map.address && (
              <p data-l="map-label" className="type-body mt-2 text-ink-soft">
                {map.address}
              </p>
            )}
          </div>
        )}

        <div data-l="map-frame" className="paper rounded-[1.5rem] border border-gold-500/50 p-2 shadow-card md:p-3">
          <div className="relative aspect-square overflow-hidden rounded-[1.1rem] border border-gold-500/25 bg-parchment-100 sm:aspect-[4/3] md:aspect-[16/9]">
            {map.embedUrl ? (
              <iframe
                src={map.embedUrl}
                title={`Map showing ${map.name || "the celebration venue"}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 size-full border-0 [filter:sepia(0.12)_saturate(0.9)]"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                <Mandala aria-hidden className="w-16 text-gold-500 opacity-60 md:w-20" />
                <p className="type-subheading mt-6 max-w-[18rem] italic text-ink-soft">{map.pendingMessage}</p>
                <OrnamentDivider className="mt-6 w-28 text-gold-500" />
              </div>
            )}
          </div>
        </div>

        {map.directionsUrl && (
          <div data-l="map-cta" className="mt-8 text-center">
            <OrnateLink
              href={map.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${map.name || "the venue"} (opens in a new tab)`}
            >
              Get Directions
            </OrnateLink>
          </div>
        )}
      </div>
    </section>
  );
}
