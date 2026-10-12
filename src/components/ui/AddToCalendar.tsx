"use client";

import { useState } from "react";
import { buildIcs, type CalendarEvent } from "@/lib/calendar";

type AddToCalendarProps = CalendarEvent & {
  label: string;
  /** Name of the downloaded file, without the extension */
  fileName: string;
};

/** Downloads the event as an .ics file — opens in Apple, Google, Outlook and Samsung calendars. */
export function AddToCalendar({ label, fileName, ...event }: AddToCalendarProps) {
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

  return (
    <>
      <button
        type="button"
        onClick={download}
        className="group relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-3 rounded-[2px] border border-gold-500/70 bg-parchment-50 px-6 text-maroon-500 transition-[background-color,border-color,box-shadow] duration-500 before:pointer-events-none before:absolute before:inset-[3px] before:border before:border-gold-300/60 before:transition-colors before:duration-500 hover:border-gold-500 hover:bg-parchment-100 hover:shadow-gold hover:before:border-gold-500/60 focus-visible:border-gold-500"
      >
        {/* a small calendar leaf with a gold diamond on the day */}
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.1}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 shrink-0 text-gold-700 transition-colors duration-500 group-hover:text-maroon-500"
        >
          <rect x="2.75" y="4" width="14.5" height="13" rx="1.5" />
          <path d="M2.75 8.25h14.5M6.75 2.5v3M13.25 2.5v3" />
          <path d="M10 10.4l1.6 1.6-1.6 1.6-1.6-1.6z" fill="currentColor" stroke="none" />
        </svg>
        <span className="type-button">{label}</span>
      </button>
      <span role="status" className="sr-only">
        {saved ? "Calendar file downloaded" : ""}
      </span>
    </>
  );
}
