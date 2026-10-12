"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { useBackgroundMusic } from "@/lib/useBackgroundMusic";
import { MusicControl } from "@/components/ui/MusicControl";
import { AmbientWeddingEffects } from "@/components/decorations/AmbientWeddingEffects";
import { OpeningScene } from "./OpeningScene";
import type { Artwork } from "@/data/types";
import { Hero, type HeroProps } from "./Hero";

type Stage = "sealed" | "revealing" | "open";

type InvitationExperienceProps = {
  /** The line above the couple's names */
  intro: string;
  /** The couple with their parents, in display order — for the hero */
  people: HeroProps["people"];
  /** First names for the envelope and card, in display order */
  shortNames: [string, string];
  place?: string;
  /** The couple's emblem for the wax seal */
  logo?: Artwork;
  musicSrc?: string;
};

/**
 * Owns the opening → hero hand-off and the background music.
 * Scrolling stays locked until the invitation has been opened and the
 * opening scene has fully dissolved.
 */
export function InvitationExperience({ intro, people, shortNames, place, logo, musicSrc }: InvitationExperienceProps) {
  const [stage, setStage] = useState<Stage>("sealed");
  const lenis = useLenis();
  const music = useBackgroundMusic(musicSrc);

  useEffect(() => {
    // Always start at the top, even on reload.
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (stage === "open") lenis?.start();
    else lenis?.stop();
  }, [lenis, stage]);

  return (
    <>
      {/* Page-wide atmosphere, only once the invitation is open. Rendered first so all content paints above it. */}
      {stage === "open" && <AmbientWeddingEffects />}
      <Hero intro={intro} people={people} place={place} play={stage !== "sealed"} inert={stage === "sealed"} />
      {stage !== "open" && (
        <OpeningScene
          names={shortNames}
          logo={logo}
          onOpen={music.play}
          onReveal={() => setStage("revealing")}
          onComplete={() => setStage("open")}
        />
      )}
      <MusicControl state={music.state} onToggle={music.toggle} />
      {/* Without JavaScript the invitation can't open, so show the hero directly. */}
      <noscript>
        <style>{"[data-opening]{display:none}"}</style>
      </noscript>
    </>
  );
}
