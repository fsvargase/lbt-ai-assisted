export const NY_TIME_ZONE = "America/New_York";

/**
 * Format a UTC-backed Date for display in New York time.
 */
export function formatInNY(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  },
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TIME_ZONE,
    ...options,
  }).format(date);
}

/**
 * Parse an ISO 8601 string into a Date. The input SHOULD include a timezone
 * offset (e.g. produced by a date/time picker) so the instant is unambiguous.
 * Returns null for invalid input.
 */
export function parseIso(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Offset (in ms) of America/New_York at the given instant. */
function etOffsetMs(date: Date): number {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TIME_ZONE,
    timeZoneName: "longOffset",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name ?? "");
  if (!match) return 0;
  const sign = match[1] === "+" ? 1 : -1;
  return sign * (Number(match[2]) * 60 + Number(match[3])) * 60_000;
}

/**
 * Convert a New York wall-clock value ("YYYY-MM-DDTHH:mm", as produced by a
 * datetime-local input) into a UTC ISO 8601 string, accounting for EST/EDT.
 */
export function nyLocalToIso(local: string): string {
  const [datePart, timePart] = local.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = (timePart ?? "00:00").split(":").map(Number);
  const utcGuess = Date.UTC(y, m - 1, d, hh, mm);
  // Two passes to settle DST boundaries.
  const offset = etOffsetMs(new Date(utcGuess - etOffsetMs(new Date(utcGuess))));
  return new Date(utcGuess - offset).toISOString();
}

/**
 * Two scheduled instants are considered conflicting when they fall within
 * `bufferMinutes` of each other (a trip occupies a driver/vehicle for a window).
 */
export function isWithinBuffer(
  a: Date,
  b: Date,
  bufferMinutes = 120,
): boolean {
  const diffMs = Math.abs(a.getTime() - b.getTime());
  return diffMs < bufferMinutes * 60_000;
}
