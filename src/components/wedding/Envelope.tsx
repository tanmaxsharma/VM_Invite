import { useId, type CSSProperties } from "react";
import Image from "next/image";
import type { Artwork } from "@/data/types";
import { Mandala } from "@/components/decorations/Mandala";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";

const maroonPaper = (tone: "500" | "700"): CSSProperties => ({
  backgroundColor: `var(--color-maroon-${tone})`,
  backgroundImage: "var(--texture-paper)",
});

const FLAP_DEPTH = "55%";

/** Wax-seal outline: an oval with soft, uneven lobes where the wax spread. */
const SEAL_PATH = (() => {
  const steps = 96;
  const points = Array.from({ length: steps }, (_, i) => {
    const t = (i / steps) * Math.PI * 2;
    const wobble = 1.5 * Math.sin(t * 7) + 0.9 * Math.sin(t * 13 + 1.3);
    return `${(Math.cos(t) * (56 + wobble)).toFixed(2)} ${(Math.sin(t) * (32 + wobble * 0.6)).toFixed(2)}`;
  });
  return `M${points.join("L")}Z`;
})();

type EnvelopeProps = {
  /** First names, in display order */
  names: [string, string];
  /** The couple's emblem, pressed into the seal exactly as supplied. Falls back to initials. */
  logo?: Artwork;
};

/**
 * Maroon envelope with a gold seal and an invitation card inside.
 * Pure markup: layers are tagged with `data-o` for OpeningScene's GSAP timeline.
 * Layer order: back (1) → card (2) → front pocket (3) → flap (4) → seal (5).
 */
export function Envelope({ names: [first, second], logo }: EnvelopeProps) {
  const sealGradient = useId();

  return (
    <div
      data-o="envelope"
      className="relative aspect-[5/6] w-[min(84vw,23rem,calc((100svh-17rem)*0.83))] opacity-0 md:aspect-[3/2] md:w-[min(34rem,calc((100svh-17rem)*1.5))] [@media(max-height:520px)]:aspect-[3/2]! [@media(max-height:520px)]:w-[min(80vw,30rem,calc((100svh-10.5rem)*1.5))]!"
      style={{ perspective: "1400px" }}
    >
      {/* back, with a printed mandala liner that shows once the flap opens */}
      <div
        data-o="env-back"
        className="absolute inset-0 z-[1] overflow-hidden rounded-[3px] shadow-card"
        style={maroonPaper("700")}
      >
        <Mandala className="absolute top-[-20%] left-1/2 w-[90%] -translate-x-1/2 text-gold-500 opacity-25" />
      </div>

      {/* invitation card */}
      <div
        data-o="card"
        className="paper frame absolute inset-x-[6%] top-[6%] bottom-[5%] z-[2] flex items-center justify-center rounded-[2px] text-center shadow-soft"
      >
        <div data-o="card-content" className="flex flex-col items-center px-4">
          <Mandala className="w-9 text-gold-500 md:w-11" />
          <p className="type-meta mt-3 text-gold-700">Shubh Vivah</p>
          <p className="type-subheading mt-1 text-maroon-500">
            {first} &amp; {second}
          </p>
          <OrnamentDivider className="mt-3 w-24 text-gold-500" />
        </div>
      </div>

      {/* front pocket */}
      <div
        data-o="env-front"
        className="absolute inset-0 z-[3] rounded-[3px]"
        style={{
          ...maroonPaper("500"),
          clipPath: `polygon(0 0, 50% ${FLAP_DEPTH}, 100% 0, 100% 100%, 0 100%)`,
        }}
      >
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full text-gold-500"
          fill="none"
          stroke="currentColor"
        >
          <path d="M0 0L50 55 100 0" vectorEffect="non-scaling-stroke" strokeOpacity={0.7} />
          <path d="M0 100L40 64M100 100L60 64" vectorEffect="non-scaling-stroke" strokeOpacity={0.3} />
        </svg>
        <div className="absolute inset-x-0 bottom-[8%] flex flex-col items-center">
          <p className="type-meta text-gold-300">
            {first} &amp; {second}
          </p>
          <OrnamentDivider className="mt-2 w-20 text-gold-500/80" />
        </div>
      </div>

      {/* flap */}
      <div
        data-o="flap"
        className="absolute inset-x-0 top-0 z-[4] origin-top rounded-t-[3px]"
        style={{
          ...maroonPaper("500"),
          height: FLAP_DEPTH,
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
        }}
      >
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full text-gold-500"
          fill="none"
          stroke="currentColor"
        >
          <path d="M0 0L50 100 100 0" vectorEffect="non-scaling-stroke" />
          <path d="M9 0L50 86 91 0" vectorEffect="non-scaling-stroke" strokeOpacity={0.4} />
        </svg>
      </div>

      {/* wax seal — deep wine wax, foil-stamped with the couple's emblem */}
      <div
        data-o="seal"
        className="absolute left-1/2 z-[5] aspect-[124/76] w-[8rem] -translate-x-1/2 -translate-y-1/2 md:w-[9.25rem]"
        style={{ top: FLAP_DEPTH }}
      >
        <svg
          aria-hidden
          viewBox="-62 -38 124 76"
          className="absolute inset-0 size-full drop-shadow-[0_7px_10px_rgb(46_32_25/0.4)]"
        >
          <defs>
            <radialGradient id={sealGradient} cx="36%" cy="28%" r="85%">
              <stop offset="0" style={{ stopColor: "var(--color-maroon-500)" }} />
              <stop offset="0.6" style={{ stopColor: "var(--color-maroon-700)" }} />
              <stop offset="1" style={{ stopColor: "#3f1019" }} />
            </radialGradient>
          </defs>
          <path d={SEAL_PATH} fill={`url(#${sealGradient})`} />
          {/* the stamped rim */}
          <ellipse rx="51" ry="28" fill="none" strokeWidth={0.9} style={{ stroke: "var(--color-gold-500)" }} strokeOpacity={0.85} />
          <ellipse rx="48.3" ry="25.6" fill="none" strokeWidth={0.5} strokeDasharray="0.7 2.2" strokeLinecap="round" style={{ stroke: "var(--color-gold-300)" }} strokeOpacity={0.7} />
        </svg>
        {logo ? (
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            priority
            sizes="(min-width: 768px) 96px, 80px"
            // The emblem is widest at its base, so it is sized to sit inside the seal's inner rim (with a
            // margin) and lifted slightly toward the wider middle of the oval. Both scale with the seal.
            className="absolute top-[45.4%] left-1/2 h-auto w-[58%] -translate-x-1/2 -translate-y-1/2"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-display text-2xl italic text-gold-300">
            {first[0]}
            {second[0]}
          </span>
        )}
      </div>
    </div>
  );
}
