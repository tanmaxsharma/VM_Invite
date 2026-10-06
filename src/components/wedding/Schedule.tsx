"use client";

import { useRef, type CSSProperties } from "react";
import type { EventMotif, ScheduleDay } from "@/data/types";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";
import { FloralSpray } from "@/components/decorations/FloralSpray";
import { EventArtwork } from "@/components/decorations/EventArtwork";

type ScheduleProps = {
  heading: string;
  intro?: string;
  days: ScheduleDay[];
};

type Theme = {
  dark?: boolean;
  paper: string;
  washA: string;
  washB: string;
  title: string;
  meta: string;
  text: string;
  line: string;
  art: [string, string, string];
  flower: "rose" | "marigold";
  bloom: [string, string];
};

/* One stationery suite, six cards: each keeps the frame and typography, and
   borrows its palette and motif from the celebration it announces. */
const THEMES: Record<EventMotif, Theme> = {
  haldi: {
    paper: "#fbf1d8", washA: "#f2c55c", washB: "#e4913a",
    title: "#97500f", meta: "#8a6a2a", text: "#6f5140", line: "rgb(176 141 69 / 0.55)",
    art: ["#f0a830", "#c8661c", "#b08d45"], flower: "marigold", bloom: ["#f2a93b", "#cf6a1d"],
  },
  sangeet: {
    paper: "#f4edf1", washA: "#b995b8", washB: "#6b4570",
    title: "#54304f", meta: "#7f642c", text: "#5b4652", line: "rgb(176 141 69 / 0.5)",
    art: ["#7b4f7a", "#4b2c4c", "#c9a45a"], flower: "rose", bloom: ["#c49bbf", "#7a4d78"],
  },
  reception: {
    paper: "#fbf4ea", washA: "#dca8ac", washB: "#b0636f",
    title: "#83323f", meta: "#7f642c", text: "#6f5140", line: "rgb(176 141 69 / 0.55)",
    art: ["#b9727a", "#5e1d28", "#b08d45"], flower: "rose", bloom: ["#c98a90", "#83323f"],
  },
  barat: {
    dark: true, paper: "#4a1620", washA: "#9a3a4a", washB: "#240a10",
    title: "#ecd49b", meta: "#d8c08a", text: "#f1e3c8", line: "rgb(216 192 138 / 0.55)",
    art: ["#b8434f", "#5e1d28", "#e0c486"], flower: "rose", bloom: ["#c96b77", "#e8cf94"],
  },
  rituals: {
    paper: "#fdf6e8", washA: "#f4cf8f", washB: "#e59a55",
    title: "#8a3b12", meta: "#7f642c", text: "#6f5140", line: "rgb(176 141 69 / 0.55)",
    art: ["#c27a3a", "#e8a33a", "#b08d45"], flower: "marigold", bloom: ["#f0b451", "#d4812f"],
  },
  afterparty: {
    dark: true, paper: "#261a23", washA: "#5d3b58", washB: "#120b10",
    title: "#ecd9ae", meta: "#d8c08a", text: "#eadfca", line: "rgb(216 192 138 / 0.5)",
    art: ["#b86b7a", "#f2c86b", "#e6cf92"], flower: "rose", bloom: ["#9c6b8f", "#d8c08a"],
  },
};

const mix = (c: string, pct: number) => `color-mix(in oklab, ${c} ${pct}%, transparent)`;

const wash = (t: Theme) =>
  [
    `radial-gradient(70% 55% at 16% 10%, ${mix(t.washA, t.dark ? 45 : 50)}, transparent 70%)`,
    `radial-gradient(60% 50% at 90% 28%, ${mix(t.washB, t.dark ? 55 : 28)}, transparent 72%)`,
    `radial-gradient(85% 60% at 50% 108%, ${mix(t.washA, t.dark ? 35 : 42)}, transparent 70%)`,
    "var(--texture-paper)",
    t.paper,
  ].join(",");

const windowWash = (t: Theme) =>
  [
    `radial-gradient(90% 70% at 50% 80%, ${mix(t.washA, t.dark ? 55 : 60)}, transparent 75%)`,
    `radial-gradient(60% 50% at 20% 20%, ${mix(t.washB, t.dark ? 40 : 22)}, transparent 70%)`,
    t.dark ? mix("#000000", 22) : mix("#ffffff", 55),
  ].join(",");

const ARCH = "50% 50% 14px 14px / 34% 34% 14px 14px";

function EventCard({ date, time, title, venue, motif }: { date: string; time?: string; title: string; venue: string; motif: EventMotif }) {
  const t = THEMES[motif];
  const vars = { "--art": t.art[0], "--art-2": t.art[1], "--art-3": t.art[2], "--leaf": "#8b9870" } as CSSProperties;
  const spray = { "--bloom": t.bloom[0], "--bloom-deep": t.bloom[1], "--leaf": t.dark ? "#a9ac85" : "#8b9870" };

  return (
    <article data-sc="card" className="relative mx-auto w-full max-w-[22rem]" style={vars}>
      <div
        className="relative rounded-[1.4rem] p-2 shadow-card"
        style={{ backgroundColor: t.dark ? "#f3e7cf" : "var(--color-parchment-50)", backgroundImage: "var(--texture-paper)" }}
      >
        <div
          className="relative overflow-hidden rounded-[1rem] border px-5 pt-6 pb-8 text-center"
          style={{ borderColor: t.line, background: wash(t) }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-1.5 rounded-[0.8rem] border" style={{ borderColor: t.line, opacity: 0.6 }} />
          <FloralSpray data-sc="spray" corner="top-left" flower={t.flower} palette={spray} className="pointer-events-none absolute -top-2 -left-2 w-32" />
          <FloralSpray data-sc="spray" corner="bottom-right" flower={t.flower} palette={spray} className="pointer-events-none absolute -right-2 -bottom-2 w-28 opacity-90" />

          <div
            data-sc="window"
            className="relative mx-auto aspect-[6/5] w-[76%]"
            style={{ borderRadius: ARCH, background: windowWash(t), boxShadow: `inset 0 0 0 1px ${t.line}` }}
          >
            <div aria-hidden className="absolute inset-[5px] border" style={{ borderRadius: ARCH, borderColor: t.line, opacity: 0.5 }} />
            <EventArtwork data-sc="art" motif={motif} className="absolute inset-x-[9%] bottom-[7%] w-[82%]" />
          </div>

          <p data-sc="detail" className="type-meta relative mt-6" style={{ color: t.meta }}>
            {date}
          </p>
          <h3 className="relative mt-2">
            <Mask>
              <span data-sc="title" className="type-heading block text-[1.875rem]! uppercase tracking-[0.14em]" style={{ color: t.title }}>
                {title}
              </span>
            </Mask>
          </h3>
          <div data-sc="detail" className="relative">
            <OrnamentDivider className="mx-auto mt-3 w-24" style={{ color: t.meta }} />
          </div>
          {time && (
            <p data-sc="detail" className="type-meta relative mt-4" style={{ color: t.meta }}>
              {time}
            </p>
          )}
          <p data-sc="detail" className={`type-subheading relative italic ${time ? "mt-1" : "mt-4"}`} style={{ color: t.text }}>
            {venue}
          </p>
        </div>
      </div>
    </article>
  );
}

/** The celebration itinerary — six cards from one stationery suite. */
export function Schedule({ heading, intro, days }: ScheduleProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;

    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: root.current, start: "top 70%" } })
      .from("[data-sc=heading]", { yPercent: 105, duration: 1.6 }, 0)
      .from("[data-sc=intro]", { autoAlpha: 0, y: 12, duration: 1.4, stagger: 0.15 }, 0.3);

    gsap.utils.toArray<HTMLElement>("[data-sc=card]").forEach((card) => {
      const q = gsap.utils.selector(card);
      gsap
        .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: card, start: "top 85%" } })
        .from(card, { autoAlpha: 0, y: 36, duration: 1.4 }, 0)
        .fromTo(
          q("[data-sc=window]"),
          { clipPath: "inset(100% 0% 0% 0% round 40% 40% 14px 14px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.6, ease: "expo.inOut" },
          0.2,
        )
        .from(q("[data-sc=art]"), { autoAlpha: 0, y: 10, scale: 0.94, duration: 1.6 }, 0.6)
        .from(q("[data-sc=spray]"), { autoAlpha: 0, rotate: -6, scale: 0.92, duration: 1.8, stagger: 0.15 }, 0.5)
        .from(q("[data-sc=title]"), { yPercent: 105, duration: 1.4 }, 0.8)
        .from(q("[data-sc=detail]"), { autoAlpha: 0, y: 8, duration: 1.2, stagger: 0.1 }, 1);
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

      {/* one row per day on wider screens */}
      <div className="mx-auto mt-12 grid max-w-[48rem] gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-16 md:gap-y-14">
        {days.flatMap((day) =>
          day.events.map((event) => (
            <EventCard key={`${day.date}-${event.title}`} date={day.date} time={event.time} title={event.title} venue={event.venue} motif={event.motif} />
          )),
        )}
      </div>
    </section>
  );
}
