// Client-only: import from "use client" components only.
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/** idle: not started yet · unavailable: missing file or no src */
export type MusicState = "idle" | "playing" | "paused" | "unavailable";

const VOLUME = 0.5;

/**
 * Looping background track that only ever starts from a user gesture.
 * `play()` must be called synchronously inside a click/tap handler —
 * browsers block audio started any other way.
 * Fails quietly: a missing file just leaves the state "unavailable".
 */
export function useBackgroundMusic(src?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<MusicState>(src ? "idle" : "unavailable");

  const play = useCallback(() => {
    if (!src) return;

    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(src);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0;
      audio.addEventListener("error", () => setState("unavailable"));
      audioRef.current = audio;
    }

    audio
      .play()
      .then(() => {
        setState("playing");
        gsap.to(audio, { volume: VOLUME, duration: 2.5, ease: "power1.out" });
      })
      .catch((error: DOMException) => {
        // NotAllowedError: blocked by the browser, the guest can still press play.
        setState(error.name === "NotAllowedError" ? "paused" : "unavailable");
      });
  }, [src]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setState("paused");
    gsap.to(audio, { volume: 0, duration: 0.6, ease: "power1.in", onComplete: () => audio.pause() });
  }, []);

  const toggle = useCallback(() => {
    if (state === "playing") pause();
    else play();
  }, [state, pause, play]);

  // Pause while the tab is hidden; resume on return if it was playing.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio || state !== "playing") return;
      if (document.hidden) audio.pause();
      else audio.play().catch(() => setState("paused"));
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [state]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  return { state, play, toggle };
}
