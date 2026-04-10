import type { ArtEvent } from "../types";

/** Parse a YYYY-MM-DD string into a UTC Date */
export function parseDate(d: string): Date {
  const [y, m, dd] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, dd));
}

export function formatDay(d: Date): number {
  return d.getUTCDate();
}

export function formatMonth(d: Date): string {
  return d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
}

export function formatFullDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "UTC" });
}

export function formatFullDateWithYear(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function formatTimeRange(event: ArtEvent): string | null {
  if (!event.startTime) return null;
  return event.endTime
    ? `${event.startTime} – ${event.endTime}`
    : `From ${event.startTime}`;
}

export function mapsUrl(location: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

/** "Today", "Tomorrow", "3 days away", "Next week", etc. */
export function countdown(startDate: string, todayUTC: number): string {
  const start = parseDate(startDate).getTime();
  const days = Math.round((start - todayUTC) / (1000 * 60 * 60 * 24));
  if (days < 0) return "Happening now";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `${days} days away`;
  if (days < 14) return "Next week";
  const weeks = Math.round(days / 7);
  if (days < 30) return `${weeks} weeks away`;
  const months = Math.round(days / 30);
  return months === 1 ? "Next month" : `${months} months away`;
}

/** Generate an .ics calendar file and trigger download */
export function downloadIcs(event: ArtEvent): void {
  const dtstart = event.startDate.replace(/-/g, "");
  // iCal all-day DTEND is exclusive — add one day
  const [ey, em, ed] = (event.endDate ?? event.startDate).split("-").map(Number);
  const endPlusOne = new Date(Date.UTC(ey, em - 1, ed + 1));
  const dtend = endPlusOne.toISOString().slice(0, 10).replace(/-/g, "");

  const timeNote = formatTimeRange(event) ?? "";
  const desc = [event.description, timeNote].filter(Boolean).join("\\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mandy Dennis Art//Events//EN",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${dtstart}`,
    `DTEND;VALUE=DATE:${dtend}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${desc}`,
    ...(event.link ? [`URL:${event.link}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.slug}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
