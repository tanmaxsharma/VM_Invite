"use client";

import { useRef } from "react";
import type { ScheduleDay } from "@/data/types";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { Mandala } from "@/components/decorations/Mandala";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";

type ScheduleProps = {
  heading: string;
  intro?: string;
  days: ScheduleDay[];
};

const DAY_WORDS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"];

/** "14 November" → { day: "14", month: "November" } */
function splitDate(date: string) {
  const [day, ...month] = date.trim().split(/\s+/);
  return { day, month: month.join(" ") };
}

/** The celebration itinerary — one chapter per day, like a printed insert. */
export function Schedule({ heading, intro, days }: ScheduleProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;

    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: root.current, start: "top 70%" } })
      .from("[data-sc=heading]", { yPercent: 105, duration: 1.6 }, 0)
      .from("[data-sc=intro]", { autoAlpha: 0, y: 12, duration: 1.4, stagger: 0.15 }, 0.3);

    gsap.utils.toArray<HTMLElement>("[data-sc=chapter]").forEach((chapter) => {
      const q = gsap.utils.selector(chapter);
      gsap
        .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: chapter, start: "top 75%" } })
        .from(q("[data-sc=label]"), { autoAlpha: 0, duration: 1.2 }, 0)
        .from(q("[data-sc=motif]"), { autoAlpha: 0, rotate: -45, scale: 0.8, duration: 2 }, 0)
        .from(q("[data-sc=day]"), { yPercent: 105, duration: 1.6 }, 0.1)
        .from(q("[data-sc=month]"), { autoAlpha: 0, y: 10, duration: 1.3 }, 0.35)
        .fromTo(q("[data-sc=rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: ease.gentleGsap }, 0.4)
        .fromTo(q("[data-sc=line]"), { scaleY: 0 }, { scaleY: 1, duration: 1.8, ease: ease.gentleGsap }, 0.5)
        .from(q("[data-sc=node]"), { scale: 0, autoAlpha: 0, duration: 0.8, stagger: 0.3 }, 0.7)
        .from(q("[data-sc=time]"), { autoAlpha: 0, duration: 1.2, stagger: 0.3 }, 0.8)
        .from(q("[data-sc=title]"), { yPercent: 105, duration: 1.4, stagger: 0.3 }, 0.85)
        .from(q("[data-sc=venue]"), { autoAlpha: 0, y: 8, duration: 1.2, stagger: 0.3 }, 1.15);
    });
  }, root);

  return (
    <section
      ref={root}
      id="celebrations"
      aria-labelledby="schedule-heading"
      className="relative overflow-x-clip px-gutter pb-section"
    >
      <header className="text-center">
        <h2 id="schedule-heading" className="type-heading uppercase tracking-[0.12em] text-maroon-500">
          <Mask>
            <span data-sc="heading" className="block">
              {heading}
            </span>
          </Mask>
        </h2>
        {intro && (
          <p data-sc="intro" className="type-subheading mx-auto mt-3 max-w-[22rem] italic text-ink-soft md:max-w-none">
            {intro}
          </p>
        )}
        <div data-sc="intro">
          <OrnamentDivider className="mx-auto mt-7 w-40 text-gold-500" />
        </div>
      </header>

      <ol className="mx-auto mt-14 max-w-[56rem] md:mt-20">
        {days.map((day, i) => {
          const { day: dayNumber, month } = splitDate(day.date);
          return (
            <li
              key={day.date}
              data-sc="chapter"
              className={`md:grid md:grid-cols-12 md:gap-x-8 ${i > 0 ? "mt-16 md:mt-0 md:border-t md:border-line md:pt-14" : ""} md:pb-14`}
            >
              {/* the date, set like a chapter opener */}
              <div className="md:col-span-5">
                <p data-sc="label" className="type-meta flex items-center gap-2.5 text-gold-700">
                  <span data-sc="motif" aria-hidden className="text-gold-500">
                    <Mandala className="w-4" />
                  </span>
                  Day {DAY_WORDS[i] ?? i + 1}
                </p>
                <h3 className="mt-3 flex items-baseline gap-3 text-maroon-500 md:mt-4 md:flex-col md:items-start md:gap-1">
                  <Mask className="-ml-[0.12em]">
                    <span data-sc="day" className="type-display block leading-[0.9]!">
                      {dayNumber}
                    </span>
                  </Mask>
                  <span data-sc="month" className="type-subheading italic text-gold-700">
                    {month}
                  </span>
                </h3>
                <div data-sc="rule" aria-hidden className="mt-5 h-px w-24 origin-left bg-gold-500/70 md:mt-6 md:w-32" />
              </div>

              {/* events along a thin gold line */}
              <ol className="relative mt-8 space-y-9 pl-7 md:col-span-7 md:mt-2 md:space-y-10 md:pl-10">
                <span
                  data-sc="line"
                  aria-hidden
                  className="absolute top-1.5 bottom-1.5 left-0 w-px origin-top bg-gold-500/45"
                />
                {day.events.map((event, j) => (
                  <li key={`${event.title}-${j}`} className="relative">
                    <span
                      data-sc="node"
                      aria-hidden
                      className="absolute top-1.5 -left-7 size-2 -translate-x-1/2 rotate-45 border border-gold-500 bg-canvas md:-left-10"
                    />
                    {event.time && (
                      <p data-sc="time" className="type-meta text-gold-700">
                        {event.time}
                      </p>
                    )}
                    <Mask className={`-ml-[0.12em] ${event.time ? "mt-1.5" : ""}`}>
                      <span data-sc="title" className="type-heading block leading-[1.05]! text-maroon-500">
                        {event.title}
                      </span>
                    </Mask>
                    <p data-sc="venue" className="type-body mt-1.5 text-ink-soft">
                      {event.venue}
                      {event.mapsUrl && (
                        <a
                          href={event.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="type-button mt-3 flex w-fit items-center gap-2 border-b border-gold-500/60 pb-1 text-maroon-500 transition-colors hover:border-maroon-500"
                        >
                          Directions
                          <span aria-hidden>→</span>
                        </a>
                      )}
                    </p>
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
