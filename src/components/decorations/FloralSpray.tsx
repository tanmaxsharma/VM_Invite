import type { ComponentProps, CSSProperties } from "react";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type Flower = "rose" | "marigold";

const flip: Record<Corner, string> = {
  "top-left": "",
  "top-right": "-scale-x-100",
  "bottom-left": "-scale-y-100",
  "bottom-right": "rotate-180",
};

const LEAF = "M0 0c7-9 22-11 30-4-7 9-22 11-30 4z";
// [x, y, rotation] along the three stems
const LEAVES: [number, number, number][] = [
  [42, 18, -12], [72, 21, 8], [106, 19, -14], [134, 15, 12],
  [18, 44, 78], [25, 74, 96], [24, 104, 80],
  [44, 34, 34], [64, 49, 24], [86, 60, 36],
];
const FLORETS: [number, number][] = [[62, 32], [44, 62], [124, 30], [16, 88]];

/** Scalloped marigold outline for radius r (deterministic, so server and client agree). */
function marigoldPath(r: number) {
  const n = 64;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    const rr = r * (0.86 + 0.14 * Math.abs(Math.cos(t * 7)));
    return `${(Math.cos(t) * rr).toFixed(2)} ${(Math.sin(t) * rr).toFixed(2)}`;
  });
  return `M${pts.join("L")}Z`;
}

function Bloom({ x, y, r, flower }: { x: number; y: number; r: number; flower: Flower }) {
  if (flower === "marigold") {
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d={marigoldPath(r)} fill="var(--bloom)" />
        <path d={marigoldPath(r * 0.68)} fill="var(--bloom-deep)" opacity={0.55} />
        <circle r={r * 0.28} fill="var(--bloom-deep)" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="var(--bloom)" />
      <g fill="none" stroke="var(--bloom-deep)" strokeLinecap="round" strokeWidth={Math.max(0.8, r * 0.08)} opacity={0.75}>
        <path d={`M${-r * 0.7} ${-r * 0.1}c${r * 0.2} ${-r * 0.6} ${r * 1} ${-r * 0.7} ${r * 1.2} ${-r * 0.1}`} />
        <path d={`M${-r * 0.85} ${r * 0.25}c${r * 0.3} ${r * 0.7} ${r * 1.2} ${r * 0.8} ${r * 1.55} ${r * 0.1}`} />
        <path d={`M${-r * 0.3} 0c0 ${-r * 0.35} ${r * 0.55} ${-r * 0.4} ${r * 0.6} 0s${-r * 0.35} ${r * 0.35} ${-r * 0.45} ${r * 0.1}`} />
      </g>
    </g>
  );
}

type FloralSprayProps = ComponentProps<"svg"> & {
  corner?: Corner;
  flower?: Flower;
  /** Override the palette, e.g. { "--bloom": "#f0a830" } */
  palette?: Partial<Record<"--bloom" | "--bloom-deep" | "--leaf" | "--floret", string>>;
};

/**
 * A hand-drawn botanical corner spray — leaves, two blooms and a bud with tiny
 * gold florets. Drawn for the top-left corner and mirrored for the others.
 */
export function FloralSpray({ corner = "top-left", flower = "rose", palette, className = "", style, ...props }: FloralSprayProps) {
  const colours = {
    "--bloom": "var(--color-maroon-300)",
    "--bloom-deep": "var(--color-maroon-500)",
    "--leaf": "#8b9870",
    "--floret": "var(--color-gold-300)",
    ...palette,
  } as CSSProperties;

  return (
    <svg
      viewBox="0 0 170 140"
      aria-hidden
      focusable="false"
      className={`${flip[corner]} ${className}`}
      style={{ ...colours, ...style }}
      {...props}
    >
      <g fill="none" stroke="var(--leaf)" strokeWidth={1.2} strokeLinecap="round" opacity={0.9}>
        <path d="M4 6C40 20 90 22 152 14" />
        <path d="M6 4C22 40 30 80 26 132" />
        <path d="M10 10C44 42 70 58 106 70" />
      </g>
      <g fill="var(--leaf)" opacity={0.82}>
        {LEAVES.map(([x, y, r], i) => (
          <path key={i} d={LEAF} transform={`translate(${x} ${y}) rotate(${r})${i % 2 ? " scale(1 -1)" : ""}`} />
        ))}
      </g>
      <g fill="var(--floret)">
        {FLORETS.map(([x, y]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} r={2} cx={Math.cos((a * Math.PI) / 180) * 2.6} cy={Math.sin((a * Math.PI) / 180) * 2.6} />
            ))}
          </g>
        ))}
      </g>
      <Bloom x={24} y={24} r={17} flower={flower} />
      <Bloom x={106} y={70} r={11} flower={flower} />
      <Bloom x={152} y={14} r={7} flower={flower} />
      <Bloom x={26} y={130} r={7} flower={flower} />
    </svg>
  );
}
