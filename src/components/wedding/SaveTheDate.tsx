"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { ScratchCard } from "@/components/ui/ScratchCard";
import { Countdown } from "@/components/ui/Countdown";
import { CornerOrnament } from "@/components/decorations/CornerOrnament";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";
import { PetalBurst } from "@/components/decorations/PetalBurst";

type SaveTheDateProps = {
  couple: string;
  date: { weekday: string; day: string; month: string; year: string };
  /** UTC timestamp (ms) of the start of the wedding day in its time zone */
  target: number;
  teaser: string;
  hint: string;
  countdownLabel: string;
  completeMessage: string;
};

const corner = "absolute w-12 text-gold-500 md:w-16";

/** A second page of the invitation: scratch to reveal the date, then a countdown. */
export function SaveTheDate({ couple, date, target, teaser, hint, countdownLabel, completeMessage }: SaveTheDateProps) {
  const root = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const onReveal = useCallback(() => setRevealed(true), []);

  // The page settles in as it scrolls into view.
  useGsap(() => {
    if (prefersReducedMotion()) return;
    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: root.current, start: "top 65%" } })
      .from("[data-std=page]", { autoAlpha: 0, y: 40, duration: 1.8 }, 0)
      .from("[data-std=intro]", { autoAlpha: 0, y: 10, duration: 1.2 }, 0.4)
      .from("[data-std=heading]", { yPercent: 105, duration: 1.6, stagger: 0.18 }, 0.5)
      .fromTo(
        "[data-std=divider]",
        { clipPath: "inset(0% 50% 0% 50%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" },
        1,
      )
      .from("[data-std=card]", { autoAlpha: 0, y: 24, scale: 0.97, duration: 1.6 }, 1.1);
  }, root);

  // After the reveal: the date settles, then the countdown arrives.
  useGsap(
    () => {
      if (!revealed || prefersReducedMotion()) return;
      gsap.fromTo("[data-std=face]", { scale: 0.96 }, { scale: 1, duration: 1.4, ease: ease.cinematicGsap });
      gsap.fromTo(
        "[data-std=countdown] > *",
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.15, delay: 0.9, ease: ease.cinematicGsap },
      );
    },
    root,
    [revealed],
  );

  return (
    <section
      ref={root}
      id="save-the-date"
      aria-labelledby="std-heading"
      className="relative overflow-x-clip px-gutter pt-[calc(var(--spacing-section)*0.5)] pb-section"
    >
      <div
        data-std="page"
        className="paper frame relative mx-auto max-w-[34rem] rounded-card px-5 pt-16 pb-14 text-center shadow-card sm:px-10 md:pt-20 md:pb-16"
      >
        <CornerOrnament corner="top-left" className={`${corner} top-3 left-3`} />
        <CornerOrnament corner="top-right" className={`${corner} top-3 right-3`} />
        <CornerOrnament corner="bottom-left" className={`${corner} bottom-3 left-3`} />
        <CornerOrnament corner="bottom-right" className={`${corner} right-3 bottom-3`} />

        <p data-std="intro" className="type-meta text-gold-700">
          {couple}
        </p>

        <h2 id="std-heading" className="type-display mt-5 text-maroon-500">
          <Mask>
            <span data-std="heading" className="block">
              Save
            </span>
          </Mask>
          <Mask>
            <span data-std="heading" className="block">
              <span className="italic text-gold-500">the</span> Date
            </span>
          </Mask>
        </h2>

        <div data-std="divider" className="mt-6">
          <OrnamentDivider className="mx-auto w-40 text-gold-500" />
        </div>

        <div data-std="card" className="relative mx-auto mt-10 w-full max-w-[19rem] md:mt-12 md:max-w-[21rem]">
          <ScratchCard
            teaser={teaser}
            hint={hint}
            onReveal={onReveal}
            revealLabel="Reveal the date"
            className="rounded-card shadow-soft"
          >
            <div data-std="face" className="frame flex flex-col items-center rounded-card bg-parchment-50 px-6 py-8">
              <p className="type-meta text-gold-700">{date.weekday}</p>
              <p className="type-display mt-3 text-[5.5rem]! leading-[0.85]! text-maroon-500 md:text-[6.5rem]!">
                {date.day}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span aria-hidden className="h-px w-6 bg-gold-500" />
                <p className="type-meta text-sm! tracking-[0.4em]! text-maroon-700">{date.month}</p>
                <span aria-hidden className="h-px w-6 bg-gold-500" />
              </div>
              <p className="type-subheading mt-2 italic text-gold-700">{date.year}</p>
            </div>
          </ScratchCard>
          <PetalBurst play={revealed} />
        </div>

        <div data-std="countdown" aria-hidden={!revealed} className={`mt-12 md:mt-14 ${revealed ? "" : "invisible"}`}>
          <p className="type-meta text-gold-700">{countdownLabel}</p>
          <div className="mt-6">
            <Countdown target={target} completeMessage={completeMessage} />
          </div>
          <OrnamentDivider className="mx-auto mt-8 w-32 text-gold-500" />
        </div>
      </div>
    </section>
  );
}
