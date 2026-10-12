import type { ComponentProps } from "react";

const MARIGOLDS: [number, number][] = [
  [45, 56.5], [51, 58.5], [57, 56.5],
  [103, 56.5], [109, 58.5], [115, 56.5],
  [64, 54], [72, 55.5], [80, 56], [88, 55.5], [96, 54],
];

/**
 * A small line-and-colour drawing of a wedding mandap: four pillars, a domed canopy with
 * a kalash finial, and swags of marigolds. Colour comes from `text-*` (the linework).
 */
export function Mandap(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 160 118" fill="none" aria-hidden focusable="false" {...props}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.1}>
        {/* platform */}
        <path d="M18 108h124M26 108v-5h108v5" />
        <path d="M34 103h92" strokeOpacity={0.5} />

        {/* pillars: the two at the back are slimmer */}
        <path d="M40 103V50M122 103V50" strokeWidth={2.2} />
        <path d="M64 100V52M98 100V52" strokeWidth={1.4} strokeOpacity={0.8} />

        {/* the canopy */}
        <path d="M30 50h100" />
        <path d="M36 50Q46 26 80 17Q114 26 124 50Z" fill="var(--color-maroon-500)" fillOpacity={0.9} stroke="currentColor" />
        <path d="M52 50Q58 31 80 22Q102 31 108 50" strokeOpacity={0.55} />
        <path d="M80 17V50" strokeOpacity={0.35} />
        {/* scalloped eave */}
        <path d="M30 50q5 6 10 0t10 0 10 0 10 0 10 0 10 0 10 0 10 0 10 0 10 0" fill="var(--color-gold-300)" fillOpacity={0.3} />

        {/* kalash finial */}
        <path d="M80 17v-4" />
        <path d="M76.5 13c0-3 7-3 7 0 0 2-1.5 3-3.5 3s-3.5-1-3.5-3z" fill="currentColor" fillOpacity={0.35} />
        <path d="M80 7.5v2.5" />
        <circle cx="80" cy="6" r="1.2" fill="currentColor" />
      </g>

      {/* swags of marigolds between the pillars */}
      <g stroke="var(--color-gold-500)" strokeLinecap="round" strokeWidth={0.9}>
        <path d="M40 52Q51 66 64 53M98 53Q111 66 122 52" />
        <path d="M64 53Q80 63 98 53" />
      </g>
      <g>
        {MARIGOLDS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill="var(--color-saffron-500)" />
        ))}
      </g>

      {/* the lit lamps at the foot of the pillars */}
      {[48, 112].map((x) => (
        <g key={x}>
          <path d={`M${x - 5} 108c0-3.5 10-3.5 10 0z`} fill="var(--color-gold-300)" />
          <path d={`M${x} 104c-2-2.5-1.5-5 0-7 1.5 2 2 4.5 0 7z`} fill="var(--color-saffron-500)" />
        </g>
      ))}
    </svg>
  );
}
