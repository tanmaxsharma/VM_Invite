"use client";

import { useState } from "react";
import { buildIcs, type CalendarAction } from "@/lib/calendar";

type Variant = "plate" | "card";

/*
  "plate": the ivory button under the countdown.
  "card":  the same shape in the colours of the event card it sits on — the card sets `color`
          (text and icon), `--cal-line` (hairlines) and `--cal-bg` (the card's paper).
*/
const PRIMARY: Record<Variant, string> = {
  plate:
    "group relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-3 rounded-[2px] border border-gold-500/70 bg-parchment-50 px-6 text-maroon-500 transition-[background-color,border-color,box-shadow] duration-500 before:pointer-events-none before:absolute before:inset-[3px] before:border before:border-gold-300/60 before:transition-colors before:duration-500 hover:border-gold-500 hover:bg-parchment-100 hover:shadow-gold hover:before:border-gold-500/60 focus-visible:border-gold-500",
  card: "group relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2.5 rounded-[2px] border border-[var(--cal-line)] bg-[color-mix(in_oklab,var(--cal-bg)_88%,transparent)] px-5 transition-[background-color,box-shadow] duration-500 before:pointer-events-none before:absolute before:inset-[3px] before:border before:border-[var(--cal-line)] before:opacity-60 hover:bg-[var(--cal-bg)] hover:shadow-soft",
};

const ICON: Record<Variant, string> = {
  plate: "size-4 shrink-0 text-gold-700 transition-colors duration-500 group-hover:text-maroon-500",
  card: "size-4 shrink-0 opacity-80",
};

/** The quiet second choice, set like the italic venue lines: a small underlined phrase. */
const SECONDARY: Record<Variant, string> = {
  plate:
    "inline-flex min-h-8 cursor-pointer items-center px-2 font-display text-[0.9375rem] leading-none text-gold-700 italic underline decoration-gold-500/50 underline-offset-4 transition-colors duration-500 hover:text-maroon-500 hover:decoration-maroon-500/60",
  card: "inline-flex min-h-8 cursor-pointer items-center px-2 font-display text-[0.9375rem] leading-none italic underline decoration-current/40 underline-offset-4 opacity-80 transition-opacity duration-500 hover:opacity-100",
};

type AddToCalendarProps = {
  action: CalendarAction;
  variant?: Variant;
};

/**
 * Adds one event to a guest's calendar.
 *
 * With an end time, the main button is a plain link that opens Google Calendar's "new event" page
 * already filled in (the guest reviews it and presses Save — a website cannot save into someone's
 * calendar for them), and an .ics file is offered for Apple and Outlook. Without an end time,
 * Google's link would need an invented one, so the button downloads an .ics instead — it has a
 * start and no end.
 */
export function AddToCalendar({ action, variant = "plate" }: AddToCalendarProps) {
  const { label, subject, fileName, googleUrl, event } = action;
  const [saved, setSaved] = useState(false);

  const download = () => {
    const url = URL.createObjectURL(new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    // keep the object URL alive long enough for slow mobile browsers to pick the file up
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    setSaved(true);
  };

  const face = (
    <>
      {/* a small calendar leaf with a diamond on the day */}
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={ICON[variant]}
      >
        <rect x="2.75" y="4" width="14.5" height="13" rx="1.5" />
        <path d="M2.75 8.25h14.5M6.75 2.5v3M13.25 2.5v3" />
        <path d="M10 10.4l1.6 1.6-1.6 1.6-1.6-1.6z" fill="currentColor" stroke="none" />
      </svg>
      <span className="type-button">{label}</span>
    </>
  );

  return (
    <div className="flex flex-col items-center gap-1.5">
      {googleUrl ? (
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label}: ${subject}, on Google Calendar (opens in a new tab)`}
          className={PRIMARY[variant]}
        >
          {face}
        </a>
      ) : (
        <button
          type="button"
          onClick={download}
          aria-label={`${label}: ${subject} (downloads a calendar file)`}
          className={PRIMARY[variant]}
        >
          {face}
        </button>
      )}

      {/* {googleUrl && (
        <button
          type="button"
          onClick={download}
          aria-label={`Apple & Outlook (.ics): download the calendar file for ${subject}`}
          className={SECONDARY[variant]}
        >
          Apple &amp; Outlook (.ics)
        </button>
      )} */}

      <span role="status" className="sr-only">
        {saved ? "Calendar file downloaded" : ""}
      </span>
    </div>
  );
}
