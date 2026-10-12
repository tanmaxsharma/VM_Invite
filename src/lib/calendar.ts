import { zonedLocal } from "./format";

/** A calendar event. `end` is left out when it isn't known — nothing is invented. */
export type CalendarEvent = {
  title: string;
  description?: string;
  location?: string;
  /** UTC timestamp (ms) of the start */
  start: number;
  /** UTC timestamp (ms) of the end, when known */
  end?: number;
  /** Stable id, so adding the event twice updates it rather than duplicating it */
  uid: string;
};

/** Everything a calendar button needs, ready to hand to a client component. */
export type CalendarAction = {
  label: string;
  /** What the button is for, used in accessible names, e.g. "Sangeet" */
  subject: string;
  /** Name of the downloaded .ics file, without the extension */
  fileName: string;
  /** Google Calendar "create event" link — only when the event has an end time */
  googleUrl?: string;
  event: CalendarEvent;
};

/* ---- Google Calendar ------------------------------------------------------ */

/** "2026-11-15T23:00" → "20261115T230000": the wall-clock time, read by Google in `ctz`. */
const googleStamp = (local: string) => `${local.replace(/[-:]/g, "")}00`;

/**
 * Google Calendar's event template. Times are written as local wall-clock times with the zone in
 * `ctz`, so they are never shifted by the guest's own time zone. Needs both a start and an end.
 */
export function googleCalendarUrl({
  title,
  description,
  location,
  start,
  end,
  timeZone,
}: {
  title: string;
  description?: string;
  location?: string;
  /** Local "YYYY-MM-DDTHH:mm" in `timeZone` */
  start: string;
  end: string;
  timeZone: string;
}) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${googleStamp(start)}/${googleStamp(end)}`,
    ctz: timeZone,
  });
  if (description) params.set("details", description);
  if (location) params.set("location", location);
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Builds one calendar button's data from local times in the wedding's time zone. */
export function calendarAction({
  label,
  subject,
  fileName,
  uid,
  title,
  description,
  location,
  start,
  end,
  timeZone,
}: {
  label: string;
  subject: string;
  fileName: string;
  uid: string;
  title: string;
  description?: string;
  location?: string;
  /** Local "YYYY-MM-DDTHH:mm" in `timeZone` */
  start: string;
  end?: string;
  timeZone: string;
}): CalendarAction {
  const startMs = zonedLocal(start, timeZone);
  const endMs = end ? zonedLocal(end, timeZone) : undefined;
  if (endMs !== undefined && endMs <= startMs) {
    throw new Error(`Calendar event "${title}" ends (${end}) at or before it starts (${start}).`);
  }
  return {
    label,
    subject,
    fileName,
    googleUrl: end ? googleCalendarUrl({ title, description, location, start, end, timeZone }) : undefined,
    event: { title, description, location, start: startMs, end: endMs, uid },
  };
}

/* ---- iCalendar (.ics) ----------------------------------------------------- */

/** RFC 5545 text escaping: backslash, semicolon, comma, and line breaks. */
export function escapeIcsText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/** "20261115T133000Z" */
export function icsUtc(ts: number) {
  return new Date(ts).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

const encoder = new TextEncoder();

/** Folds a content line to 75 octets (counting UTF-8 bytes, never splitting a character). */
function fold(line: string) {
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    // a continuation line starts with one space, which counts toward its 75 octets
    if (bytes + size > 75) {
      out.push(current);
      current = " ";
      bytes = 1;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join("\r\n");
}

/** A valid iCalendar (.ics) document: UTC times, CRLF line endings, escaped text, no invented end. */
export function buildIcs({ title, description, location, start, end, uid }: CalendarEvent, now = Date.now()) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VM Invite//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${icsUtc(now)}`,
    `DTSTART:${icsUtc(start)}`,
    ...(end !== undefined ? [`DTEND:${icsUtc(end)}`] : []),
    `SUMMARY:${escapeIcsText(title)}`,
    ...(description ? [`DESCRIPTION:${escapeIcsText(description)}`] : []),
    ...(location ? [`LOCATION:${escapeIcsText(location)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
