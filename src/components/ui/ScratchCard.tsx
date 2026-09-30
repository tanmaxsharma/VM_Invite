"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type ScratchCardProps = {
  /** Hidden content, revealed by scratching */
  children: ReactNode;
  teaser: string;
  hint: string;
  /** Share of the surface (0–1) that must be cleared before it auto-reveals */
  threshold?: number;
  onReveal: () => void;
  /** Label for the keyboard / screen-reader alternative */
  revealLabel?: string;
  className?: string;
};

/** Sample every Nth pixel when measuring progress — plenty accurate, far cheaper. */
const SAMPLE_STRIDE = 8;
const CHECK_INTERVAL_MS = 200;

export function ScratchCard({
  children,
  teaser,
  hint,
  threshold = 0.6,
  onReveal,
  revealLabel = "Reveal",
  className = "",
}: ScratchCardProps) {
  const box = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const lastCheck = useRef(0);
  const done = useRef(false);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Paint the cover; repaint only if the width changes before it's revealed.
  useEffect(() => {
    const canvas = canvasRef.current!;
    const el = box.current!;
    let paintedWidth = 0;

    const paint = (force = false) => {
      if (done.current) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h || (!force && w === paintedWidth)) return;
      paintedWidth = w;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintCover(ctx, w, h, getComputedStyle(el), teaser, hint);
      ctxRef.current = ctx;
      setReady(true);
    };

    paint();
    // Repaint once web fonts are ready so the teaser uses Cormorant, not a fallback.
    document.fonts?.ready.then(() => paint(true));
    const observer = new ResizeObserver(() => paint());
    observer.observe(el);
    return () => observer.disconnect();
  }, [teaser, hint]);

  const reveal = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onReveal();
    gsap.to(canvasRef.current, {
      autoAlpha: 0,
      duration: 0.9,
      ease: "power2.out",
      onComplete: () => setRevealed(true),
    });
  }, [onReveal]);

  const measure = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || done.current) return;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * SAMPLE_STRIDE) {
      total++;
      if (data[i] < 128) cleared++;
    }
    if (cleared / total >= threshold) reveal();
  };

  const scratch = (to: { x: number; y: number }) => {
    const ctx = ctxRef.current;
    const from = last.current ?? to;
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(34, box.current!.clientWidth * 0.13);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x + 0.01, to.y);
    ctx.stroke();
    last.current = to;
  };

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (done.current) return;
    e.preventDefault();
    try {
      // Keep receiving moves if the finger drifts off the card.
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Capture is a nicety; scratching works without it.
    }
    last.current = null;
    scratch(point(e));
  };

  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!last.current || done.current) return;
    scratch(point(e));
    const now = performance.now();
    if (now - lastCheck.current > CHECK_INTERVAL_MS) {
      lastCheck.current = now;
      measure();
    }
  };

  const onPointerUp = () => {
    if (!last.current) return;
    last.current = null;
    measure();
  };

  return (
    <div ref={box} className={`relative isolate overflow-hidden ${className}`}>
      {/* Hidden until the cover is painted, so the answer never flashes. */}
      <div className={ready || revealed ? "" : "invisible"} aria-hidden={!revealed}>
        {children}
      </div>

      {!revealed && (
        <>
          <canvas
            ref={canvasRef}
            data-lenis-prevent
            aria-hidden
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="absolute inset-0 size-full cursor-grab touch-none select-none active:cursor-grabbing"
          />
          <button
            type="button"
            onClick={reveal}
            className="type-meta sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-3 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:text-parchment-50"
          >
            {revealLabel}
          </button>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function paintCover(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  style: CSSStyleDeclaration,
  teaser: string,
  hint: string,
) {
  const token = (name: string) => style.getPropertyValue(name).trim();
  const color = (name: string) => token(`--color-${name}`);

  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);

  // Deep maroon, lit softly from the top left.
  const base = ctx.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, color("maroon-500"));
  base.addColorStop(1, color("maroon-700"));
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  const sheen = ctx.createRadialGradient(w * 0.3, h * 0.2, 0, w * 0.3, h * 0.2, Math.max(w, h) * 0.8);
  sheen.addColorStop(0, "rgb(255 240 210 / 0.14)");
  sheen.addColorStop(1, "rgb(255 240 210 / 0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  // Jaali lattice in faint gold.
  ctx.save();
  ctx.strokeStyle = color("gold-300");
  ctx.globalAlpha = 0.13;
  ctx.lineWidth = 0.75;
  const step = 20;
  ctx.beginPath();
  for (let k = -h; k < w + h; k += step) {
    ctx.moveTo(k, 0);
    ctx.lineTo(k + h, h);
    ctx.moveTo(k, h);
    ctx.lineTo(k + h, 0);
  }
  ctx.stroke();
  ctx.restore();

  // Paper grain.
  const grain = document.createElement("canvas");
  grain.width = grain.height = 96;
  const g = grain.getContext("2d")!;
  const noise = g.createImageData(96, 96);
  for (let i = 0; i < noise.data.length; i += 4) {
    const v = Math.random() * 255;
    noise.data[i] = noise.data[i + 1] = noise.data[i + 2] = v;
    noise.data[i + 3] = 255;
  }
  g.putImageData(noise, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = ctx.createPattern(grain, "repeat")!;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // Double gold hairline border.
  ctx.save();
  ctx.strokeStyle = color("gold-300");
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.7;
  ctx.strokeRect(9.5, 9.5, w - 19, h - 19);
  ctx.globalAlpha = 0.35;
  ctx.strokeRect(14.5, 14.5, w - 29, h - 29);
  ctx.restore();

  // Teaser, a small ornament and the hint.
  const cx = w / 2;
  const cy = h / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = color("gold-300");
  diamond(ctx, cx, cy - 34, 3.5);
  ctx.fillRect(cx - 34, cy - 34.5, 24, 1);
  ctx.fillRect(cx + 10, cy - 34.5, 24, 1);

  const teaserSize = Math.round(Math.min(Math.max(w * 0.08, 20), 28));
  ctx.fillStyle = color("parchment-50");
  ctx.font = `italic 400 ${teaserSize}px ${token("--font-display")}`;
  ctx.fillText(teaser, cx, cy, w - 48);

  ctx.fillStyle = color("gold-300");
  ctx.font = `500 11px ${token("--font-sans")}`;
  spacedText(ctx, hint.toUpperCase(), cx, cy + teaserSize + 6, 3);
}

function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r, y);
  ctx.closePath();
  ctx.fill();
}

/** Letter-spaced text, centred on x (canvas letterSpacing isn't universal yet). */
function spacedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let cursor = x - total / 2;
  ctx.textAlign = "left";
  chars.forEach((c, i) => {
    ctx.fillText(c, cursor, y);
    cursor += widths[i] + spacing;
  });
  ctx.textAlign = "center";
}
