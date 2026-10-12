"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { ScratchCard } from "@/components/ui/ScratchCard";
import { Countdown } from "@/components/ui/Countdown";
import { AddToCalendar } from "@/components/ui/AddToCalendar";
import type { CalendarAction } from "@/lib/calendar";
import { CornerOrnament } from "@/components/decorations/CornerOrnament";
import { Mandala } from "@/components/decorations/Mandala";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";
import { Celebration } from "@/components/decorations/Celebration";
import { FloralSpray } from "@/components/decorations/FloralSpray";

type SaveTheDateProps = {
  /** e.g. "Vishesh Jain & Mehak Jain" */
  couple: string;
  date: { weekday: string; day: string; month: string; year: string };
  /** e.g. "15th November 2026" — shown above the countdown */
  dateLine: string;
  /** UTC timestamp (ms) of the start of the wedding day in its time zone */
  target: number;
  instruction: string;
  labels: { month: string; day: string; year: string };
  completeMessage: string;
  continueLabel: string;
  /** The calendar event offered under the countdown */
  calendar: CalendarAction;
};

const CARDS = 3;
const corner = "absolute w-12 text-gold-500 md:w-16";

/** Hidden date, set on parchment inside a gold hairline. `size` is a fraction of the card's width. */
function DateFace({ children, size }: { children: string; size: number }) {
  return (
    <div data-std="face" className="frame grid h-full place-items-center rounded-[10px] bg-parchment-50">
      <span
        className="type-display block text-maroon-500"
        style={{ fontSize: `${size}cqw`, lineHeight: 1, letterSpacing: "0.02em", fontWeight: 400 } as CSSProperties}
      >
        {children}
      </span>
    </div>
  );
}

/**
 * The date gate. The page stops here until all three cards have been scratched:
 * month, day, year → celebration → countdown → the page is released.
 */
export function SaveTheDate({
  couple,
  date,
  dateLine,
  target,
  instruction,
  labels,
  completeMessage,
  continueLabel,
  calendar,
}: SaveTheDateProps) {
  const root = useRef<HTMLElement>(null);
  const gate = useRef<HTMLDivElement>(null);
  const cardsRow = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  /** armed → (page reaches the gate) → locked → (date revealed) → open */
  const phase = useRef<"armed" | "locking" | "locked" | "open">("armed");
  const [revealedCount, setRevealedCount] = useState(0);
  const [forceReveal, setForceReveal] = useState(false);
  const [released, setReleased] = useState(false);

  const complete = revealedCount >= CARDS;
  const onCardRevealed = useCallback(() => setRevealedCount((n) => n + 1), []);

  /* ---- scroll lock ------------------------------------------------------ */

  // While locked, single-finger drags must not move the page (the scratch canvas has touch-action: none).
  const blockTouchScroll = useRef((e: TouchEvent) => {
    if (e.touches.length < 2) e.preventDefault();
  });

  const lock = useCallback((lenis: Lenis, delta: number) => {
    phase.current = "locking";
    const settle = () => {
      if (phase.current !== "locking") return;
      lenis.stop();
      document.addEventListener("touchmove", blockTouchScroll.current, { passive: false });
      phase.current = "locked";
    };
    // A small overshoot glides back; a big jump (e.g. a keyboard shortcut) is corrected at once.
    if (Math.abs(delta) < 160 && !prefersReducedMotion()) {
      lenis.scrollTo(window.scrollY + delta, { duration: 0.6, force: true, lock: true, onComplete: settle });
    } else {
      lenis.scrollTo(window.scrollY + delta, { immediate: true, force: true });
      settle();
    }
  }, []);

  const release = useCallback(() => {
    if (phase.current === "open") return;
    phase.current = "open";
    document.removeEventListener("touchmove", blockTouchScroll.current);
    lenisRef.current?.start();
    setReleased(true);
  }, []);

  // Where the gate should rest: the whole card, centred — or, on a screen too short to hold it
  // (a phone on its side), just the scratch cards, so they are always fully in view.
  const measure = useCallback(() => {
    const card = gate.current;
    const cards = cardsRow.current;
    if (!card || !cards) return null;
    const vh = window.innerHeight;
    const el = card.getBoundingClientRect().height <= vh - 24 ? card : cards;
    const rect = el.getBoundingClientRect();
    return { top: rect.top, rest: Math.max(12, (vh - rect.height) / 2) };
  }, []);

  // Watch the scroll: once the gate has risen to its resting place, hold the page there.
  const lenis = useLenis((l) => {
    // Only while scrolling is live — during the opening the page is held still by the envelope.
    if (phase.current !== "armed" || l.isStopped) return;
    const m = measure();
    if (m && m.top <= m.rest) lock(l, m.top - m.rest);
  });
  useEffect(() => {
    lenisRef.current = lenis ?? null;
  }, [lenis]);

  // If the screen changes shape while locked (a rotated phone), bring the gate back into view.
  useEffect(() => {
    let frame = 0;
    const realign = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (phase.current !== "locked") return;
        const m = measure();
        // Ignore small shifts (e.g. a mobile address bar sliding away); fix real displacement.
        if (m && Math.abs(m.top - m.rest) > 24) {
          lenisRef.current?.scrollTo(window.scrollY + m.top - m.rest, { immediate: true, force: true });
        }
      });
    };
    window.addEventListener("resize", realign);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", realign);
    };
  }, [measure]);

  // Never leave the page locked behind us.
  useEffect(() => {
    const handler = blockTouchScroll.current;
    return () => {
      document.removeEventListener("touchmove", handler);
      if (phase.current === "locked" || phase.current === "locking") lenisRef.current?.start();
    };
  }, []);

  /* ---- animation -------------------------------------------------------- */

  // The page settles in as it scrolls into view.
  useGsap(() => {
    if (prefersReducedMotion()) return;
    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: root.current, start: "top 70%" } })
      .from("[data-std=page]", { autoAlpha: 0, y: 40, duration: 1.8 }, 0)
      .from("[data-std=intro]", { autoAlpha: 0, y: 10, duration: 1.2 }, 0.4)
      .from("[data-std=heading]", { yPercent: 105, duration: 1.6 }, 0.5)
      .fromTo(
        "[data-std=divider]",
        { clipPath: "inset(0% 50% 0% 50%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" },
        1,
      )
      .from("[data-std=instruction]", { autoAlpha: 0, y: 10, duration: 1.2 }, 1.1)
      .from("[data-std=card]", { autoAlpha: 0, y: 24, scale: 0.96, duration: 1.4, stagger: 0.14 }, 1.3);
  }, root);

  // Date complete → the cards settle, the countdown arrives, then the page is released.
  useGsap(
    () => {
      if (!complete) return;
      const reduce = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: ease.cinematicGsap } });

      if (!reduce) {
        tl.from("[data-std=countdown] > *", { autoAlpha: 0, y: 14, duration: 1.2, stagger: 0.15 }, 1.9);
      }
      tl.call(release, [], reduce ? 0.3 : 3.5);
      tl.fromTo("[data-std=cue]", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 1.2 }, reduce ? 0.3 : 3.5);
    },
    root,
    [complete],
  );

  const monthShort = date.month.slice(0, 3).toUpperCase();

  return (
    <section
      ref={root}
      id="save-the-date"
      aria-labelledby="std-heading"
      className="relative overflow-x-clip px-gutter py-[calc(var(--spacing-section)*0.5)]"
    >
      <div ref={gate} className="relative mx-auto max-w-[34rem]">
        <div
          data-std="page"
          className="paper frame relative rounded-card px-4 pt-12 pb-9 text-center shadow-card sm:px-10 md:pt-16 md:pb-12 [@media(max-height:640px)]:pt-9 [@media(max-height:640px)]:pb-6"
        >
          <FloralSpray corner="top-left" className="pointer-events-none absolute -top-7 -left-5 z-10 w-28 md:-top-10 md:-left-12 md:w-40" />
          <CornerOrnament corner="top-right" className={`${corner} top-3 right-3`} />
          <CornerOrnament corner="bottom-left" className={`${corner} bottom-3 left-3`} />
          <FloralSpray corner="bottom-right" className="pointer-events-none absolute -right-5 -bottom-7 z-10 w-28 md:-right-12 md:-bottom-10 md:w-40" />

          <p data-std="intro" className="type-meta text-gold-700">
            {couple}
          </p>

          <h2 id="std-heading" className="type-heading mt-3 text-[clamp(2.4rem,9vw,3.6rem)]! text-maroon-500">
            <Mask>
              <span data-std="heading" className="block">
                Save <span className="italic text-gold-500">the</span> Date
              </span>
            </Mask>
          </h2>

          <div data-std="divider" className="mt-3">
            <OrnamentDivider className="mx-auto w-32 text-gold-500" />
          </div>

          <p data-std="instruction" className="type-subheading mx-auto mt-3 max-w-[17rem] italic text-ink-soft sm:max-w-none [@media(max-height:640px)]:mt-2">
            {instruction}
          </p>

          {/* the three scratch cards — the heart of this page */}
          <div ref={cardsRow} className="relative mt-6 grid grid-cols-3 gap-2.5 sm:gap-4 md:mt-8 [@media(max-height:640px)]:mt-4">
            {(
              [
                [labels.month, monthShort, 30],
                [labels.day, date.day, 54],
                [labels.year, date.year, 26],
              ] as const
            ).map(([label, text, size]) => (
              <div key={label} data-std="card" className="[container-type:inline-size]">
                <ScratchCard
                  label={label}
                  onReveal={onCardRevealed}
                  forceReveal={forceReveal}
                  className="aspect-[3/4] rounded-[10px] shadow-soft"
                >
                  <DateFace size={size}>{text}</DateFace>
                </ScratchCard>
              </div>
            ))}
            <Celebration play={complete} originRef={cardsRow} />
          </div>

          {/* keyboard / screen-reader way through the gate */}
          {!complete && (
            <button
              type="button"
              onClick={() => setForceReveal(true)}
              className="type-meta sr-only focus-visible:not-sr-only focus-visible:mt-4 focus-visible:inline-block focus-visible:text-maroon-500"
            >
              Reveal the date
            </button>
          )}

          <div className="relative mt-8 md:mt-10 [@media(max-height:640px)]:mt-5">
            {/* until the date is revealed, a quiet ornament holds this space */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 grid place-items-center text-gold-500 transition-opacity duration-1000 ${complete ? "opacity-0" : "opacity-60"}`}
            >
              <Mandala className="w-20 md:w-24" />
            </div>
            <div data-std="countdown" aria-hidden={!complete} className={complete ? "" : "invisible"}>
              <p className="type-subheading text-maroon-500">{dateLine}</p>
              <div className="mt-4">
                <Countdown target={target} completeMessage={completeMessage} />
              </div>
              <div className="mt-6 md:mt-7 [@media(max-height:640px)]:mt-4">
                <AddToCalendar action={calendar} />
              </div>
            </div>
          </div>

          <p
            data-std="cue"
            aria-hidden={!released}
            className={`type-meta mt-6 [@media(max-height:640px)]:mt-4 flex items-center justify-center gap-2.5 whitespace-nowrap text-gold-700 max-[380px]:tracking-[0.18em]! min-[380px]:gap-3 ${released ? "" : "invisible"}`}
          >
            <span aria-hidden className="h-px w-4 shrink-0 bg-gold-500/60 min-[380px]:w-6" />
            {continueLabel}
            <span aria-hidden className="h-px w-4 shrink-0 bg-gold-500/60 min-[380px]:w-6" />
          </p>
        </div>
      </div>
    </section>
  );
}
