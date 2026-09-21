/** Date/time formatting for the workspace — en-GB, Europe/London, no third-party dates library. */

const TZ = "Europe/London";

const f = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: TZ, ...opts });

const DATE = f({ weekday: "short", day: "numeric", month: "short" });
const DATE_LONG = f({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
const DATE_NUM = f({ day: "numeric", month: "short", year: "numeric" });
const DAY_MONTH = f({ day: "numeric", month: "short" });
const TIME = f({ hour: "2-digit", minute: "2-digit", hour12: false });
const WEEKDAY = f({ weekday: "long" });

const toDate = (iso: string) => new Date(iso);

/** "Tue 14 Oct" */
export const fmtDate = (iso: string) => DATE.format(toDate(iso));
/** "Tuesday 14 October 2026" */
export const fmtDateLong = (iso: string) => DATE_LONG.format(toDate(iso));
/** "14 Oct 2026" */
export const fmtDateNum = (iso: string) => DATE_NUM.format(toDate(iso));
/** "14 Oct" */
export const fmtDayMonth = (iso: string) => DAY_MONTH.format(toDate(iso));
/** "14:30" */
export const fmtTime = (iso: string) => TIME.format(toDate(iso));
/** "Tue 14 Oct, 14:30" */
export const fmtDateTime = (iso: string) => `${fmtDate(iso)}, ${fmtTime(iso)}`;
/** "Tuesday" */
export const fmtWeekday = (iso: string) => WEEKDAY.format(toDate(iso));
/** "Week of 12 Oct" */
export const fmtWeekOf = (iso: string) => `Week of ${DAY_MONTH.format(toDate(iso))}`;
/** "w/c 12 Oct" */
export const fmtWc = (iso: string) => `w/c ${DAY_MONTH.format(toDate(iso))}`;

/** YYYY-MM-DD in London time, for grouping by day. */
export function dayKey(iso: string): string {
  const parts = f({ year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(toDate(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export const isSameDay = (a: string, b: string) => dayKey(a) === dayKey(b);

const DAY_MS = 86_400_000;

/** Whole calendar days from `now` to `iso` (negative in the past). */
export function daysBetween(now: string, iso: string): number {
  const a = new Date(dayKey(now) + "T00:00:00Z").getTime();
  const b = new Date(dayKey(iso) + "T00:00:00Z").getTime();
  return Math.round((b - a) / DAY_MS);
}

/** "today", "tomorrow", "yesterday", "in 3 days", "4 days ago" — or null beyond a week either way. */
export function relativeDayOrNull(iso: string, now: string): string | null {
  const d = daysBetween(now, iso);
  if (d === 0) return "today";
  if (d === 1) return "tomorrow";
  if (d === -1) return "yesterday";
  if (d > 1 && d <= 6) return `in ${d} days`;
  if (d < -1 && d >= -6) return `${-d} days ago`;
  return null;
}

/** relativeDayOrNull, falling back to "Tue 14 Oct". */
export function relativeDay(iso: string, now: string): string {
  return relativeDayOrNull(iso, now) ?? fmtDate(iso);
}

/** Day heading for feeds: "Today · Wednesday 14 October 2026" or just the long date when older than a week. */
export function dayHeading(iso: string, now: string): { relative: string | null; long: string } {
  const rel = relativeDayOrNull(iso, now);
  return { relative: rel ? rel.charAt(0).toUpperCase() + rel.slice(1) : null, long: fmtDateLong(iso) };
}

/** Short relative time for feeds: "just now", "35 min ago", "3 h ago", "yesterday", "Tue 14 Oct". */
export function relativeTime(iso: string, now: string): string {
  const diffMin = Math.round((new Date(now).getTime() - new Date(iso).getTime()) / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const h = Math.round(diffMin / 60);
  if (h < 24 && isSameDay(iso, now)) return `${h} h ago`;
  return relativeDay(iso, now);
}

/** Due-date label with tone for task rows. */
export function dueLabel(dueAt: string, now: string): { label: string; tone: "overdue" | "today" | "soon" | "later" } {
  const d = daysBetween(now, dueAt);
  if (d < 0) return { label: `Overdue · ${fmtDate(dueAt)}`, tone: "overdue" };
  if (d === 0) return { label: "Due today", tone: "today" };
  if (d === 1) return { label: "Due tomorrow", tone: "soon" };
  if (d <= 6) return { label: `Due ${fmtWeekday(dueAt)}`, tone: "soon" };
  return { label: `Due ${fmtDate(dueAt)}`, tone: "later" };
}

export function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
}

/** Builds a minimal RFC 5545 calendar file for an interview. */
export function buildIcs(ev: { uid: string; title: string; start: string; durationMinutes: number; where: string; description: string }): string {
  const stamp = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VisLuck//Candidate Workspace//EN",
    "BEGIN:VEVENT",
    `UID:${ev.uid}@visluck.com`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(ev.start)}`,
    `DTEND:${stamp(addMinutes(ev.start, ev.durationMinutes))}`,
    `SUMMARY:${esc(ev.title)}`,
    `LOCATION:${esc(ev.where)}`,
    `DESCRIPTION:${esc(ev.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadTextFile(name: string, content: string, type = "text/calendar") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** First name + surname initial, e.g. "Amelia R." */
export const shortName = (first: string, last: string) => `${first} ${last.charAt(0)}.`;
