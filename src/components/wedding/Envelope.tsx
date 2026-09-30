import { useId, type CSSProperties } from "react";
import { Mandala } from "@/components/decorations/Mandala";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";

const maroonPaper = (tone: "500" | "700"): CSSProperties => ({
  backgroundColor: `var(--color-maroon-${tone})`,
  backgroundImage: "var(--texture-paper)",
});

const FLAP_DEPTH = "55%";

/** Wax-seal outline: a circle with soft, uneven lobes where the wax spread. */
const SEAL_PATH = (() => {
  const steps = 72;
  const points = Array.from({ length: steps }, (_, i) => {
    const t = (i / steps) * Math.PI * 2;
    const r = 45 + 2.2 * Math.sin(t * 7) + 1.2 * Math.sin(t * 13 + 1.3);
    return `${(Math.cos(t) * r).toFixed(2)} ${(Math.sin(t) * r).toFixed(2)}`;
  });
  return `M${points.join("L")}Z`;
})();

type EnvelopeProps = {
  /** First names, in display order */
  names: [string, string];
};

/**
 * Maroon envelope with a gold seal and an invitation card inside.
 * Pure markup: layers are tagged with `data-o` for OpeningScene's GSAP timeline.
 * Layer order: back (1) → card (2) → front pocket (3) → flap (4) → seal (5).
 */
export function Envelope({ names: [first, second] }: EnvelopeProps) {
  const sealGradient = useId();

  return (
    <div
      data-o="envelope"
      className="relative aspect-[5/6] w-[min(84vw,23rem,calc((100svh-17rem)*0.83))] opacity-0 md:aspect-[3/2] md:w-[min(34rem,calc((100svh-17rem)*1.5))]"
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

      {/* wax seal */}
      <div
        data-o="seal"
        className="absolute left-1/2 z-[5] grid size-[4.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center md:size-20"
        style={{ top: FLAP_DEPTH }}
      >
        <svg
          aria-hidden
          viewBox="-50 -50 100 100"
          className="absolute inset-0 size-full drop-shadow-[0_6px_10px_rgb(46_32_25/0.35)]"
        >
          <defs>
            <radialGradient id={sealGradient} cx="38%" cy="32%" r="75%">
              <stop offset="0" style={{ stopColor: "var(--color-gold-300)" }} />
              <stop offset="0.55" style={{ stopColor: "var(--color-gold-500)" }} />
              <stop offset="1" style={{ stopColor: "var(--color-gold-700)" }} />
            </radialGradient>
          </defs>
          <path d={SEAL_PATH} fill={`url(#${sealGradient})`} />
          <g fill="none" style={{ stroke: "var(--color-gold-700)" }}>
            <circle r="33" strokeOpacity={0.55} />
            <circle r="29" strokeOpacity={0.35} strokeDasharray="0.6 2.4" strokeLinecap="round" />
          </g>
        </svg>
        <span className="relative font-display text-2xl italic leading-none text-maroon-700 md:text-[1.7rem]">
          {first[0]}
          <span className="mx-0.5 text-gold-700">·</span>
          {second[0]}
        </span>
      </div>
    </div>
  );
}
