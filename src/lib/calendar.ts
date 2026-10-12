/** A single calendar event with a start time and no end (nothing is invented). */
export type CalendarEvent = {
  title: string;
  description?: string;
  /** UTC timestamp (ms) of the start */
  start: number;
  /** Stable id, so adding the event twice updates it rather than duplicating it */
  uid: string;
};

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

/** A valid iCalendar (.ics) document: UTC start time, CRLF line endings, escaped text. */
export function buildIcs({ title, description, start, uid }: CalendarEvent, now = Date.now()) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VM Invite//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${icsUtc(now)}`,
    `DTSTART:${icsUtc(start)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    ...(description ? [`DESCRIPTION:${escapeIcsText(description)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
