import type { StatFigure, TJEvent, Verification } from "./types";

export type EventPhase = "upcoming" | "live" | "past" | "cancelled" | "postponed";

/** Dates are stored as YYYY-MM-DD in IST; compare as calendar days. */
function dayKey(date: Date) {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

export function eventPhase(event: Pick<TJEvent, "startDate" | "endDate" | "statusOverride">, now = new Date()): EventPhase {
  if (event.statusOverride) return event.statusOverride;
  const today = dayKey(now);
  const end = event.endDate ?? event.startDate;
  if (today < event.startDate) return "upcoming";
  if (today > end) return "past";
  return "live";
}

/** Pending facts stay in the CMS for editors; they never render publicly. */
export function isPublishable(v?: Verification) {
  return !v || v.status !== "pending";
}

export function publishableFigure(f?: StatFigure): StatFigure | undefined {
  return f && isPublishable(f.verification) ? f : undefined;
}

export function formatFigure(f: StatFigure) {
  return `${f.value.toLocaleString("en-IN")}${f.suffix ?? ""}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
}

/** "26 Apr 2025" or "13–14 Apr 2024" or "22 Dec 2024 – 12 Jan 2025" */
export function formatDateRange(start: string, end?: string) {
  const a = parts(start);
  if (!end || end === start) return `${a.d} ${MONTHS[a.m]} ${a.y}`;
  const b = parts(end);
  if (a.y === b.y && a.m === b.m) return `${a.d}–${b.d} ${MONTHS[a.m]} ${a.y}`;
  if (a.y === b.y) return `${a.d} ${MONTHS[a.m]} – ${b.d} ${MONTHS[b.m]} ${a.y}`;
  return `${a.d} ${MONTHS[a.m]} ${a.y} – ${b.d} ${MONTHS[b.m]} ${b.y}`;
}

/** Compact mono stamp: "26.04.2025" */
export function formatStamp(iso: string) {
  const { y, m, d } = parts(iso);
  return `${String(d).padStart(2, "0")}.${String(m + 1).padStart(2, "0")}.${y}`;
}

export function formatMonthYear(iso: string) {
  const { y, m } = parts(iso);
  return `${MONTHS[m]} ${y}`;
}

export const EVENT_TYPE_LABEL: Record<TJEvent["type"], string> = {
  hackathon: "Hackathon",
  workshop: "Workshop",
  meetup: "Meetup",
  competition: "Competition",
  session: "Session",
  collaboration: "Collaboration",
  recruitment: "Recruitment",
};
