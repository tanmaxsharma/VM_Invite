"use client";

import { useSyncExternalStore } from "react";

const UNITS = [
  ["Days", 86_400_000],
  ["Hours", 3_600_000],
  ["Minutes", 60_000],
  ["Seconds", 1_000],
] as const;

// A shared one-second clock. The server snapshot is null so the first client
// render matches the server HTML; real values appear right after hydration.
const subscribe = (tick: () => void) => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
};
const nowInSeconds = () => Math.floor(Date.now() / 1000);
const serverSnapshot = () => null;

function split(ms: number) {
  let rest = Math.max(0, ms);
  return UNITS.map(([label, size]) => {
    const value = Math.floor(rest / size);
    rest -= value * size;
    return [label, value] as const;
  });
}

type CountdownProps = {
  /** UTC timestamp (ms) to count down to */
  target: number;
  /** Shown instead of the numbers once the target has passed */
  completeMessage: string;
};

export function Countdown({ target, completeMessage }: CountdownProps) {
  const now = useSyncExternalStore(subscribe, nowInSeconds, serverSnapshot);
  const remaining = now === null ? null : target - now * 1000;

  if (remaining !== null && remaining <= 0) {
    return <p className="type-subheading text-maroon-500">{completeMessage}</p>;
  }

  return (
    <dl className="mx-auto grid max-w-[22rem] grid-cols-4 md:max-w-[28rem]">
      {split(remaining ?? 0).map(([label, value], i) => (
        <div key={label} className={`flex flex-col-reverse items-center gap-2 ${i > 0 ? "border-l border-gold-500/35" : ""}`}>
          {/* 12px labels, tracked tight so "SECONDS" still fits its column at 320px */}
          <dt className="type-meta pl-[0.06em] text-[0.75rem]! tracking-[0.06em]! text-gold-700 md:pl-[0.14em] md:text-[0.8125rem]! md:tracking-[0.14em]!">{label}</dt>
          {/* clean lining figures — calm and readable, not a clock face */}
          <dd className="font-display text-[clamp(1.75rem,8vw,2.375rem)] leading-none font-medium text-maroon-500 lining-nums tabular-nums">
            {remaining === null ? "–" : i === 0 ? value : String(value).padStart(2, "0")}
          </dd>
        </div>
      ))}
    </dl>
  );
}
