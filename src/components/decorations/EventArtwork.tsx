import type { ComponentProps, ReactNode } from "react";
import type { EventMotif as Motif } from "@/data/types";

/*
 * Small hand-drawn motif plates for each celebration. Colours come from the
 * card's CSS variables: --art (main), --art-2 (secondary), --art-3 (highlight), --leaf.
 */

const MANGO_LEAF = "M0 0c4-6 4-16 0-24-4 8-4 18 0 24z";

function scallops(cx: number, cy: number, r: number, n = 12) {
  const pts = Array.from({ length: n * 4 }, (_, i) => {
    const t = (i / (n * 4)) * Math.PI * 2;
    const rr = r * (0.84 + 0.16 * Math.abs(Math.cos(t * (n / 2))));
    return `${(cx + Math.cos(t) * rr).toFixed(2)} ${(cy + Math.sin(t) * rr).toFixed(2)}`;
  });
  return `M${pts.join("L")}Z`;
}

function Marigold({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <path d={scallops(x, y, r)} fill="var(--art)" />
      <path d={scallops(x, y, r * 0.62, 9)} fill="var(--art-2)" opacity={0.7} />
      <circle cx={x} cy={y} r={r * 0.24} fill="var(--art-2)" />
    </g>
  );
}

function Sparkle({ x, y, s = 3 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x} ${y - s}L${x + s * 0.3} ${y}L${x} ${y + s}L${x - s * 0.3} ${y}z M${x - s} ${y}L${x} ${y + s * 0.3}L${x + s} ${y}L${x} ${y - s * 0.3}z`} fill="var(--art-3)" />;
}

const ART: Record<Motif, ReactNode> = {
  haldi: (
    <>
      <path d="M18 58h84c-3 18-20 28-42 28S21 76 18 58z" fill="var(--art-3)" />
      <ellipse cx={60} cy={58} rx={42} ry={5} fill="var(--art-3)" />
      <path d="M26 58c8-14 22-20 34-20s26 6 34 20z" fill="#e8b54a" />
      <path d="M30 70h60" stroke="var(--art-2)" strokeOpacity={0.35} strokeWidth={1.2} />
      <g fill="var(--leaf)">
        <path d={MANGO_LEAF} transform="translate(20 60) rotate(-62)" />
        <path d={MANGO_LEAF} transform="translate(100 60) rotate(62)" />
      </g>
      <Marigold x={40} y={50} r={8} />
      <Marigold x={80} y={50} r={8} />
      <Marigold x={60} y={41} r={9.5} />
      <Sparkle x={18} y={24} />
      <Sparkle x={100} y={30} s={2.5} />
    </>
  ),
  sangeet: (
    <>
      <path d="M26 46c0-9 68-9 68 0v24c0 9-68 9-68 0z" fill="var(--art)" />
      <ellipse cx={26} cy={58} rx={6} ry={12} fill="var(--art-3)" />
      <ellipse cx={94} cy={58} rx={6} ry={12} fill="var(--art-3)" />
      <path d="M32 46l8 24 8-24 8 24 8-24 8 24 8-24 8 24" fill="none" stroke="var(--art-3)" strokeWidth={1.1} opacity={0.9} />
      <path d="M26 46h68M26 70h68" stroke="var(--art-2)" strokeWidth={1.4} opacity={0.6} />
      <g fill="var(--art-2)" stroke="var(--art-2)" strokeWidth={1.4}>
        <circle cx={30} cy={30} r={3.2} stroke="none" />
        <path d="M33 30V14l9-3v14" fill="none" />
        <circle cx={39} cy={25} r={3.2} stroke="none" />
        <circle cx={86} cy={26} r={2.8} stroke="none" />
        <path d="M88.6 26V12" fill="none" />
      </g>
      <Sparkle x={62} y={20} />
      <Sparkle x={104} y={40} s={2.2} />
    </>
  ),
  reception: (
    <>
      <g fill="none" stroke="var(--art-3)" strokeWidth={3.4}>
        <circle cx={52} cy={62} r={15} />
        <circle cx={70} cy={62} r={15} />
      </g>
      <path d="M52 44l-4-4 4-4 4 4z" fill="var(--art-3)" />
      <g fill="var(--leaf)">
        <path d={MANGO_LEAF} transform="translate(56 30) rotate(-58)" />
        <path d={MANGO_LEAF} transform="translate(66 30) rotate(58)" />
      </g>
      <circle cx={61} cy={26} r={10} fill="var(--art)" />
      <g fill="none" stroke="var(--art-2)" strokeWidth={1.2} strokeLinecap="round" opacity={0.8}>
        <path d="M54 25c2-6 11-7 13-1" />
        <path d="M53 29c3 5 12 6 15-1" />
        <path d="M58 26c0-3 5-3 5 0s-3 3-4 1" />
      </g>
      <Sparkle x={24} y={40} />
      <Sparkle x={98} y={46} s={2.5} />
    </>
  ),
  barat: (
    <>
      <path d="M60 28V92" stroke="var(--art-3)" strokeWidth={2} />
      <circle cx={60} cy={24} r={3} fill="var(--art-3)" />
      <path d="M22 52C30 34 90 34 98 52z" fill="var(--art)" />
      <path
        d="M22 52q4.75 6 9.5 0t9.5 0 9.5 0 9.5 0 9.5 0 9.5 0 9.5 0 9.5 0"
        fill="var(--art)"
        stroke="var(--art-3)"
        strokeWidth={1}
      />
      <path d="M30 44c10-8 50-8 60 0" fill="none" stroke="var(--art-3)" strokeWidth={1} opacity={0.8} />
      <g stroke="var(--art-3)" strokeWidth={0.9}>
        {[22, 41, 60, 79, 98].map((x) => (
          <g key={x}>
            <path d={`M${x} 53v9`} />
            <circle cx={x} cy={64} r={2} fill="var(--art-3)" stroke="none" />
          </g>
        ))}
      </g>
      <Sparkle x={18} y={24} />
      <Sparkle x={102} y={20} s={2.6} />
      <Sparkle x={96} y={80} s={2} />
    </>
  ),
  rituals: (
    <>
      <path d="M44 56c-10 2-14 10-14 18 0 10 12 16 30 16s30-6 30-16c0-8-4-16-14-18z" fill="var(--art)" />
      <rect x={46} y={50} width={28} height={8} rx={2} fill="var(--art)" />
      <path d="M34 72h52" stroke="var(--art-3)" strokeWidth={1.6} />
      <circle cx={60} cy={80} r={3} fill="var(--art-3)" />
      <g fill="var(--leaf)">
        {[-60, -30, 0, 30, 60].map((r) => (
          <path key={r} d={MANGO_LEAF} transform={`translate(60 48) rotate(${r})`} />
        ))}
      </g>
      <ellipse cx={60} cy={38} rx={9} ry={10} fill="#8a5a36" />
      <path d="M53 32c3-3 11-3 14 0" stroke="#5e3b22" strokeWidth={1} fill="none" />
      {[16, 104].map((x) => (
        <g key={x}>
          <path d={`M${x - 7} 84c0 5 14 5 14 0z`} fill="var(--art-3)" />
          <path d={`M${x} 82c-3-3-2-7 0-10 2 3 3 7 0 10z`} fill="var(--art-2)" />
        </g>
      ))}
    </>
  ),
  afterparty: (
    <>
      <path d="M82 12a22 22 0 1 0 14 40 18 18 0 0 1-14-40z" fill="var(--art-3)" />
      {[
        [30, 34],
        [52, 50],
      ].map(([x, len]) => (
        <g key={x}>
          <path d={`M${x} 0V${len}`} stroke="var(--art-3)" strokeWidth={0.8} opacity={0.7} />
          <path d={`M${x - 7} ${len + 4}h14l-3 16h-8z`} fill="var(--art)" />
          <rect x={x - 8} y={len} width={16} height={4} rx={1} fill="var(--art-3)" />
          <circle cx={x} cy={len + 12} r={4} fill="var(--art-3)" opacity={0.55} />
        </g>
      ))}
      <Sparkle x={100} y={70} />
      <Sparkle x={70} y={84} s={2.4} />
      <Sparkle x={14} y={70} s={2} />
      <Sparkle x={108} y={16} s={2} />
    </>
  ),
};

export function EventArtwork({ motif, ...props }: ComponentProps<"svg"> & { motif: Motif }) {
  return (
    <svg viewBox="0 0 120 100" aria-hidden focusable="false" {...props}>
      {ART[motif]}
    </svg>
  );
}
