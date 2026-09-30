/** Offset (ms) between `timeZone` wall-clock time and UTC at instant `ts`. */
function zoneOffset(ts: number, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(ts)
      .map((p) => [p.type, Number(p.value)]),
  );
  const wallClockAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return wallClockAsUtc - ts;
}

/**
 * UTC timestamp of a wall-clock time ("YYYY-MM-DD" + "HH:mm") in an IANA zone,
 * e.g. zonedTime("2026-11-15", "Asia/Kolkata") → 2026-11-14T18:30:00Z.
 */
export function zonedTime(date: string, timeZone: string, time = "00:00") {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  // Second pass settles days where the offset changes (DST).
  return guess - zoneOffset(guess - zoneOffset(guess, timeZone), timeZone);
}

const formatter = (timeZone: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-IN", { timeZone, ...options });

/** Separate date parts for typographic layouts. */
export function weddingDateParts(date: string, timeZone: string) {
  const parts = Object.fromEntries(
    formatter(timeZone, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      .formatToParts(zonedTime(date, timeZone, "12:00"))
      .map((p) => [p.type, p.value]),
  );
  return { weekday: parts.weekday, day: parts.day, month: parts.month, year: parts.year };
}

const SUFFIX: Record<Intl.LDMLPluralRule, string> = { one: "st", two: "nd", few: "rd", other: "th", zero: "th", many: "th" };

/** "15th November 2026" */
export function ordinalDate(date: string, timeZone: string) {
  const { day, month, year } = weddingDateParts(date, timeZone);
  const suffix = SUFFIX[new Intl.PluralRules("en", { type: "ordinal" }).select(Number(day))];
  return `${day}${suffix} ${month} ${year}`;
}
