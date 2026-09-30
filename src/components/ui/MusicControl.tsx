"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MusicState } from "@/lib/useBackgroundMusic";
import { duration, ease } from "@/lib/motion";

type MusicControlProps = {
  state: MusicState;
  onToggle: () => void;
};

const BARS = [0, 0.35, 0.15, 0.5];

/** Small floating play/pause control. Hidden until music has been attempted, and if it can't load. */
export function MusicControl({ state, onToggle }: MusicControlProps) {
  const visible = state === "playing" || state === "paused";
  const playing = state === "playing";

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={onToggle}
          aria-pressed={playing}
          aria-label={playing ? "Pause music" : "Play music"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.base, ease: ease.cinematic, delay: 1 }}
          className="fixed right-4 bottom-4 z-40 grid size-11 place-items-center rounded-full border border-gold-500/60 bg-parchment-50/85 text-maroon-500 shadow-soft backdrop-blur-sm transition-colors hover:border-maroon-500 md:right-8 md:bottom-8"
        >
          <span aria-hidden className="flex h-3.5 items-end gap-[3px]">
            {BARS.map((delay, i) => (
              <span
                key={i}
                className={`h-full w-px origin-bottom bg-current ${playing ? "animate-music-bar" : "scale-y-[0.3]"}`}
                style={{ animationDelay: `${-delay}s` }}
              />
            ))}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
