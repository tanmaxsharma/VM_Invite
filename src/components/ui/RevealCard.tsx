"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type RevealCardProps = {
  /** Printed on the cover, e.g. "Month". Also names the button: "Reveal month". */
  label: string;
  /** What a screen reader hears once the card is turned, e.g. "November" */
  spoken: string;
  /** The face that is revealed */
  children: ReactNode;
  /** The moment the card is first tapped, before it has finished turning */
  onTap?: () => void;
  /** Once the card has turned over */
  onReveal: () => void;
  /** The tap guidance is showing, so the ring on the cover begins to pulse */
  invite?: boolean;
  className?: string;
};

const FLIP_SECONDS = 0.9;

const hidden: CSSProperties = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };

/** Where the foil border's corners sit, so each diamond is centred on one. */
const CORNERS = [
  "top-[5px] left-[5px] -translate-x-1/2 -translate-y-1/2",
  "top-[5px] right-[5px] translate-x-1/2 -translate-y-1/2",
  "bottom-[5px] left-[5px] -translate-x-1/2 translate-y-1/2",
  "right-[5px] bottom-[5px] translate-x-1/2 translate-y-1/2",
];

/** The cover: deep maroon with a faint gold lattice, a foil border, and a medallion to tap. */
function Cover({ label }: { label: string }) {
  return (
    <span
      className="absolute inset-0 block overflow-hidden rounded-[10px]"
      style={{
        ...hidden,
        background:
          "radial-gradient(120% 90% at 30% 18%, rgb(255 240 210 / 0.16), transparent 60%), linear-gradient(135deg, var(--color-maroon-500), var(--color-maroon-700))",
      }}
    >
      {/* jaali lattice and paper grain */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 12px, rgb(216 192 138 / 0.14) 12px 12.8px), repeating-linear-gradient(-45deg, transparent 0 12px, rgb(216 192 138 / 0.14) 12px 12.8px)",
        }}
      />
      <span aria-hidden className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "var(--texture-paper)" }} />

      {/* gold-foil border and corner diamonds */}
      <span aria-hidden className="absolute inset-[5px] border border-gold-300/85" />
      <span aria-hidden className="absolute inset-[9px] border border-gold-300/40" />
      {CORNERS.map((at) => (
        <span key={at} aria-hidden className={`absolute ${at} size-[5px] rotate-45 bg-gold-300`} />
      ))}

      <span className="relative flex h-full flex-col items-center justify-center gap-1.5 sm:gap-2.5">
        {/* the medallion — the place to tap. A soft ring opens from it while the guidance is showing. */}
        <span className="relative grid size-8 place-items-center sm:size-11">
          <span aria-hidden className="tap-ring absolute inset-0 rounded-full border border-gold-300" />
          <svg viewBox="-16 -16 32 32" aria-hidden className="size-full text-gold-300" fill="none" stroke="currentColor" strokeWidth={0.9}>
            <circle r="14" />
            <circle r="7.7" />
            <path d="M0-7.7V-14M0 7.7V14M-7.7 0H-14M7.7 0H14M-5.4-5.4l-3.9-3.9M5.4 5.4l3.9 3.9M5.4-5.4l3.9-3.9M-5.4 5.4l-3.9 3.9" />
            <circle r="1.6" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span className="type-meta text-[0.75rem]! tracking-[0.14em]! text-parchment-50 sm:text-[0.8125rem]! sm:tracking-[0.2em]!">
          {label}
        </span>
        <span className="type-meta text-[0.6875rem]! tracking-[0.22em]! text-gold-300 sm:text-[0.75rem]!">Tap</span>
      </span>
    </span>
  );
}

/**
 * A card that turns over to show what is on its back when it is tapped, clicked, or activated
 * from the keyboard. A real button, so it works with a mouse, a finger, Enter / Space and a
 * screen reader — nothing to drag, swipe or draw. Each card turns on its own.
 */
export function RevealCard({ label, spoken, children, onTap, onReveal, invite = false, className = "" }: RevealCardProps) {
  const box = useRef<HTMLDivElement>(null);
  const turn = useRef<HTMLSpanElement>(null);
  const sheen = useRef<HTMLSpanElement>(null);
  const taken = useRef(false);
  const [phase, setPhase] = useState<"cover" | "turning" | "face">("cover");

  const flip = () => {
    if (taken.current) return;
    taken.current = true;
    setPhase("turning");
    onTap?.();

    const finish = () => {
      setPhase("face");
      onReveal();
    };

    // Reduced motion: no turning — the card simply fades to its face.
    if (prefersReducedMotion()) {
      gsap.set(turn.current, { rotateY: 180 });
      gsap.fromTo(turn.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, onComplete: finish });
      return;
    }

    gsap.to(turn.current, { rotateY: 180, duration: FLIP_SECONDS, ease: "power2.inOut", onComplete: finish });
    // a slight lift as it turns, and a soft gold glint once the face is showing
    gsap.fromTo(box.current, { scale: 1 }, { scale: 1.05, duration: FLIP_SECONDS / 2, ease: "sine.inOut", yoyo: true, repeat: 1 });
    gsap.fromTo(
      sheen.current,
      { xPercent: -130, autoAlpha: 1 },
      {
        xPercent: 130,
        duration: 0.95,
        delay: FLIP_SECONDS * 0.7,
        ease: "power2.inOut",
        onComplete: () => void gsap.set(sheen.current, { autoAlpha: 0 }),
      },
    );
  };

  const done = phase === "face";

  return (
    <div ref={box} data-invite={invite && phase === "cover"} className={`relative ${className}`}>
      <button
        type="button"
        onClick={flip}
        aria-label={done ? `${label}: ${spoken}` : `Reveal ${label.toLowerCase()}`}
        aria-disabled={phase !== "cover"}
        className={`absolute inset-0 block size-full touch-manipulation rounded-[10px] select-none ${
          phase === "cover"
            ? "cursor-pointer transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-gold active:translate-y-0 active:scale-[0.97]"
            : "cursor-default"
        }`}
        style={{ perspective: "900px" }}
      >
        <span ref={turn} className="absolute inset-0 block" style={{ transformStyle: "preserve-3d" }}>
          <Cover label={label} />
          <span
            className="absolute inset-0 block overflow-hidden rounded-[10px]"
            style={{ ...hidden, transform: "rotateY(180deg)" }}
          >
            {children}
            <span
              ref={sheen}
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0"
              style={{ background: "linear-gradient(105deg, transparent 38%, rgb(216 192 138 / 0.65) 50%, transparent 62%)" }}
            />
          </span>
        </span>
      </button>

      {/* announced when the card has turned */}
      <span role="status" className="sr-only">
        {done ? `${label}: ${spoken}` : ""}
      </span>
    </div>
  );
}
