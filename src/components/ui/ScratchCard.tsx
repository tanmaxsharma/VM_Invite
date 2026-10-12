"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { ease } from "@/lib/motion";

type ScratchCardProps = {
  /** Hidden content, revealed by scratching */
  children: ReactNode;
  /** Printed on the scratch surface, e.g. "Month" */
  label: string;
  /** Share of the surface (0–1) that must be scratched before the rest dissolves. A few natural strokes is enough. */
  threshold?: number;
  onReveal: () => void;
  /** Reveals the card from outside (e.g. a single keyboard-accessible "reveal" button) */
  forceReveal?: boolean;
  className?: string;
};

/** Sample every Nth pixel when measuring progress — plenty accurate, far cheaper. */
const SAMPLE_STRIDE = 8;
const CHECK_INTERVAL_MS = 90;

export function ScratchCard({
  children,
  label,
  threshold = 0.22,
  onReveal,
  forceReveal = false,
  className = "",
}: ScratchCardProps) {
  const box = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLSpanElement>(null);
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
      paintCover(ctx, w, h, getComputedStyle(el), label);
      ctxRef.current = ctx;
      setReady(true);
    };

    paint();
    // Repaint once web fonts are ready so the label uses Jost, not a fallback.
    document.fonts?.ready.then(() => paint(true));
    const observer = new ResizeObserver(() => paint());
    observer.observe(el);
    return () => observer.disconnect();
  }, [label]);

  const reveal = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onReveal();
    // The rest of the cover dissolves as the value settles into place, with a soft gold glint.
    gsap.to(canvasRef.current, {
      autoAlpha: 0,
      duration: 0.75,
      ease: "power2.out",
      onComplete: () => setRevealed(true),
    });
    if (!prefersReducedMotion()) {
      gsap.fromTo(faceRef.current, { scale: 0.93 }, { scale: 1, duration: 1, ease: ease.cinematicGsap });
      gsap.fromTo(
        sheenRef.current,
        { xPercent: -130, autoAlpha: 1 },
        { xPercent: 130, duration: 0.95, ease: "power2.inOut", onComplete: () => void gsap.set(sheenRef.current, { autoAlpha: 0 }) },
      );
    }
  }, [onReveal]);

  useEffect(() => {
    if (forceReveal) reveal();
  }, [forceReveal, reveal]);

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
    ctx.lineWidth = Math.max(26, Math.min(42, box.current!.clientWidth * 0.28));
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
      <div ref={faceRef} className={`h-full ${ready || revealed ? "" : "invisible"}`} aria-hidden={!revealed}>
        {children}
      </div>
      <span
        ref={sheenRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background: "linear-gradient(105deg, transparent 38%, rgb(216 192 138 / 0.65) 50%, transparent 62%)",
        }}
      />

      {!revealed && (
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
  label: string,
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

  const sheen = ctx.createRadialGradient(w * 0.3, h * 0.18, 0, w * 0.3, h * 0.18, Math.max(w, h) * 0.9);
  sheen.addColorStop(0, "rgb(255 240 210 / 0.16)");
  sheen.addColorStop(1, "rgb(255 240 210 / 0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  // Jaali lattice in faint gold.
  ctx.save();
  ctx.strokeStyle = color("gold-300");
  ctx.globalAlpha = 0.14;
  ctx.lineWidth = 0.7;
  const step = Math.max(12, Math.round(w / 6));
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
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = ctx.createPattern(grain, "repeat")!;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // Gold-foil border: a bright outer hairline and a softer inner one.
  const foil = ctx.createLinearGradient(0, 0, w, h);
  foil.addColorStop(0, color("gold-300"));
  foil.addColorStop(0.5, color("gold-500"));
  foil.addColorStop(1, color("gold-300"));
  ctx.save();
  ctx.strokeStyle = foil;
  ctx.lineWidth = 1.25;
  ctx.globalAlpha = 0.85;
  ctx.strokeRect(5.5, 5.5, w - 11, h - 11);
  ctx.lineWidth = 0.75;
  ctx.globalAlpha = 0.4;
  ctx.strokeRect(9.5, 9.5, w - 19, h - 19);
  ctx.restore();

  // Small diamonds at the corners.
  ctx.fillStyle = color("gold-300");
  for (const [x, y] of [[5.5, 5.5], [w - 5.5, 5.5], [5.5, h - 5.5], [w - 5.5, h - 5.5]]) diamond(ctx, x, y, 2.6);

  // A tiny mandala medallion above the label.
  const cx = w / 2;
  const cy = h / 2 - 8;
  const r = Math.min(w * 0.17, 15);
  ctx.save();
  ctx.strokeStyle = color("gold-300");
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55);
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = color("gold-300");
  ctx.beginPath();
  ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // The label, set in spaced capitals.
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color("parchment-50");
  ctx.font = `500 ${w < 110 ? 10 : 11}px ${token("--font-sans")}`;
  spacedText(ctx, label.toUpperCase(), cx, cy + r + 15, w < 110 ? 2.4 : 3);
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
