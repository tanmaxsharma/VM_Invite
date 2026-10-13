import type { ComponentProps } from "react";

type TapHandProps = Omit<ComponentProps<"svg">, "children"> & {
  /** Which way the finger points. "down" turns the whole drawing over. */
  direction?: "up" | "down";
  /** Starts the three gentle taps (the animation lives in globals.css and stops under reduced motion). */
  play?: boolean;
};

/* The hand is drawn as overlapping shapes, stroked once and then filled once on top, so only the
   outline of the whole hand shows and the joins between fingers stay clean. */
const SHAPES = (
  <>
    <rect x="22" y="4" width="13" height="52" rx="6.5" /> {/* the pointing finger */}
    <rect x="14" y="40" width="40" height="36" rx="13" /> {/* the palm */}
    <rect x="33" y="35" width="10" height="26" rx="5" /> {/* three folded fingers */}
    <rect x="41" y="39" width="9.5" height="24" rx="4.75" />
    <rect x="48" y="44" width="8" height="20" rx="4" />
    <rect x="8" y="48" width="26" height="12" rx="6" transform="rotate(-24 21 54)" /> {/* the thumb */}
  </>
);

/**
 * A small illustrated hand tapping toward whatever it points at — antique-gold line work on
 * parchment with a maroon cuff. Used to guide guests to the date cards and to the RSVP button.
 * Decorative: the controls it points at carry their own accessible names.
 */
export function TapHand({ direction = "up", play = false, className = "", ...props }: TapHandProps) {
  return (
    <svg
      viewBox="0 0 64 108"
      aria-hidden
      focusable="false"
      data-play={play}
      className={`tap-hand ${direction === "down" ? "rotate-180" : ""} ${className}`}
      {...props}
    >
      {/* the ring that opens where the fingertip lands */}
      <g className="tap-ripple">
        <circle cx="28.5" cy="15" r="8" fill="none" stroke="var(--color-gold-500)" strokeWidth={1.2} />
      </g>

      <g transform="translate(0 18)">
        <g className="tap-finger">
          <g fill="none" stroke="var(--color-gold-500)" strokeWidth={2.6} strokeLinejoin="round">
            {SHAPES}
          </g>
          <g fill="var(--color-parchment-50)">{SHAPES}</g>

          {/* where the fingers fold */}
          <path
            d="M35.3 41v14M43 45v13M49 50v10"
            fill="none"
            stroke="var(--color-gold-500)"
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0.55}
          />

          {/* the cuff, with a gold band */}
          <path
            d="M19 72h30l-2.5 14h-25z"
            fill="var(--color-maroon-500)"
            stroke="var(--color-gold-500)"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
          <path d="M20.2 79h27.6" stroke="var(--color-gold-300)" strokeWidth={1} />
          <path d="M34 80.6l1.5 1.5-1.5 1.5-1.5-1.5z" fill="var(--color-gold-300)" />
        </g>
      </g>
    </svg>
  );
}
