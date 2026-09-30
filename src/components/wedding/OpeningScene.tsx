"use client";

import { useRef, useState } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mandala } from "@/components/decorations/Mandala";
import { CornerOrnament } from "@/components/decorations/CornerOrnament";
import { Envelope } from "./Envelope";

type OpeningSceneProps = {
  /** First names, in display order */
  names: [string, string];
  /** Fires synchronously inside the guest's tap — safe place to start audio. */
  onOpen: () => void;
  /** Fires as the scene starts dissolving — the hero should begin its entrance. */
  onReveal: () => void;
  /** Fires once the scene is fully gone and can be unmounted. */
  onComplete: () => void;
};

const corner = "absolute w-14 text-gold-500 opacity-0 md:w-24 lg:w-32";

export function OpeningScene({ names, onOpen, onReveal, onComplete }: OpeningSceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const [opening, setOpening] = useState(false);

  // Entrance: background → ornaments → envelope → text → call to action.
  const ctx = useGsap(() => {
    const tl = gsap.timeline({ defaults: { ease: ease.cinematicGsap } });
    tl.fromTo("[data-o=bg-mandala]", { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 0.1, scale: 1, duration: 2.6, ease: ease.gentleGsap }, 0)
      .fromTo("[data-o=corner]", { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 1.8, stagger: 0.12, ease: "power1.out" }, 0.3)
      .fromTo("[data-o=crest]", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 1.4 }, 0.6)
      .fromTo("[data-o=envelope]", { autoAlpha: 0, y: 36, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 2 }, 0.7)
      .fromTo(
        "[data-o=invited]",
        { autoAlpha: 0, y: 18, clipPath: "inset(0% 0% 100% 0%)" },
        { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.6 },
        1.2,
      )
      .fromTo("[data-o=cta]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 1.4 }, 1.9)
      .fromTo("[data-o=cta-line]", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: ease.gentleGsap }, 2);

    if (prefersReducedMotion()) tl.progress(1);
  }, root);

  const open = () => {
    if (opening) return;
    setOpening(true);
    onOpen();

    ctx.current?.add(() => {
      if (prefersReducedMotion()) {
        onReveal();
        gsap.to(root.current, { autoAlpha: 0, duration: 0.6, onComplete });
        return;
      }

      const q = gsap.utils.selector(root);
      const envelope = q("[data-o=envelope]")[0] as HTMLElement;
      const card = q("[data-o=card]")[0] as HTMLElement;
      const flap = q("[data-o=flap]")[0] as HTMLElement;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Resting position of the envelope, even if its entrance is still settling.
      const envTop = envelope.getBoundingClientRect().top - Number(gsap.getProperty(envelope, "y"));

      // --- geometry (layout sizes, unaffected by transforms) ---
      const cardH = card.offsetHeight;
      const LIFT_SCALE = 1.04;
      // Distance the card travels up (inside the envelope's own coordinates) until
      // its bottom edge has fully cleared the pocket's top edge.
      const rise = card.offsetTop + cardH * (1 + (LIFT_SCALE - 1) / 2) + 6;
      // The envelope eases down just enough to keep the whole card on screen as it
      // comes out. On tall screens this is 0 and the envelope doesn't move.
      const edge = vh * 0.05;
      const settle = Math.max(0, edge + cardH * LIFT_SCALE + 6 - envTop);
      // Where the card's centre sits once it has cleared the pocket…
      const clearedCentre = envTop + settle + card.offsetTop - rise + cardH / 2;
      // …and how far it then travels to the viewport centre, growing into the page.
      const toCentre = vh / 2 - clearedCentre;
      const cover = Math.max(vw / card.offsetWidth, vh / cardH) * 1.08;

      // One continuous timeline. Times are in seconds.
      const PULL = 2; // card slides out of the pocket
      const pullAt = 1.95;
      const clearedAt = pullAt + PULL;

      gsap
        .timeline({ defaults: { ease: ease.cinematicGsap } })

        // 1 — prepare: the call to action and heading step back, the room dims a touch
        .to(["[data-o=invited]", "[data-o=cta]", "[data-o=crest]"], { autoAlpha: 0, y: -8, duration: 0.9, ease: "power2.out", overwrite: "auto" }, 0)
        .to("[data-o=dim]", { autoAlpha: 0.12, duration: 1.8, ease: ease.gentleGsap }, 0.1)

        // 2 — the seal lifts away
        .to("[data-o=seal]", { y: -18, scale: 0.94, autoAlpha: 0, duration: 1.1, ease: "power2.out" }, 0.35)

        // 3 — the flap folds back on its crease; it passes behind the card when edge-on
        .to(flap, { rotateX: 180, duration: 1.5, ease: ease.gentleGsap }, 0.85)
        .call(
          () => {
            flap.style.zIndex = "1";
            flap.style.backgroundColor = "var(--color-maroon-700)";
          },
          [],
          0.85 + 1.5 / 2,
        )

        // 4 — the card is drawn up out of the pocket (still behind the pocket front),
        //     while the envelope lowers to make room
        .to(card, { y: -rise, scale: LIFT_SCALE, duration: PULL, ease: "power2.inOut" }, pullAt)
        .to(envelope, { y: settle, duration: PULL, ease: "power2.inOut", overwrite: "auto" }, pullAt)

        // …only once it is completely clear does it move in front of everything
        .set(card, { zIndex: 6 }, clearedAt)

        // 5 — the card comes forward and becomes the page; the envelope falls away
        .to("[data-o=card-content]", { autoAlpha: 0, duration: 0.9, ease: "power1.inOut" }, clearedAt - 0.1)
        .to(["[data-o=env-back]", "[data-o=env-front]", flap], { y: "+=40", autoAlpha: 0, duration: 1.3, ease: "power2.in" }, clearedAt)
        .to(["[data-o=bg-mandala]", "[data-o=corner]", "[data-o=dim]"], { autoAlpha: 0, duration: 1.3, ease: "power1.inOut" }, clearedAt)
        .to(card, { y: `+=${toCentre}`, scale: cover, duration: 1.9, ease: "power3.inOut" }, clearedAt + 0.1)
        .call(onReveal, [], clearedAt + 1)
        .to(root.current, { autoAlpha: 0, duration: 1.1, ease: "power1.inOut", onComplete }, clearedAt + 1);
    });
  };

  return (
    <div
      ref={root}
      data-opening
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-canvas px-gutter"
      style={{ backgroundImage: "var(--texture-paper)" }}
    >
      <div
        data-o="bg-mandala"
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 w-[210vw] -translate-x-1/2 -translate-y-1/2 text-gold-500 opacity-0 md:w-[125vmin]"
      >
        <Mandala className="w-full animate-spin-slow" />
      </div>

      <CornerOrnament data-o="corner" corner="top-left" className={`${corner} top-4 left-4 md:top-8 md:left-8`} />
      <CornerOrnament data-o="corner" corner="top-right" className={`${corner} top-4 right-4 md:top-8 md:right-8`} />
      <CornerOrnament data-o="corner" corner="bottom-left" className={`${corner} bottom-4 left-4 md:bottom-8 md:left-8`} />
      <CornerOrnament data-o="corner" corner="bottom-right" className={`${corner} right-4 bottom-4 md:right-8 md:bottom-8`} />

      <div data-o="dim" aria-hidden className="pointer-events-none absolute inset-0 bg-brown-900 opacity-0" />

      <div data-o="crest" aria-hidden className="relative flex items-center gap-3 text-gold-500 opacity-0">
        <span className="h-px w-8 bg-current" />
        <Mandala className="w-7" />
        <span className="h-px w-8 bg-current" />
      </div>

      <p data-o="invited" className="type-heading relative mt-3 italic text-maroon-500 opacity-0 md:mt-4">
        You&rsquo;re Invited
      </p>

      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={open}
        className="relative mt-6 cursor-pointer md:mt-9"
      >
        <Envelope names={names} />
      </button>

      <div data-o="cta" className="relative mt-5 opacity-0 md:mt-10">
        <button
          type="button"
          onClick={open}
          disabled={opening}
          className="group flex min-h-12 flex-col items-center justify-center px-4 text-maroon-500"
        >
          <span className="flex items-center gap-3">
            <span aria-hidden className="size-1.5 rotate-45 border border-gold-500 transition-colors duration-500 group-hover:bg-gold-500" />
            <span className="type-button">Open Invitation</span>
            <span aria-hidden className="size-1.5 rotate-45 border border-gold-500 transition-colors duration-500 group-hover:bg-gold-500" />
          </span>
          <span
            data-o="cta-line"
            aria-hidden
            className="mt-2.5 h-px w-full bg-linear-to-r from-transparent via-gold-500 to-transparent transition-transform duration-700 ease-cinematic group-hover:scale-x-110"
          />
        </button>
      </div>
    </div>
  );
}
