import { getActiveAnnouncements, getCurrentRecruitment, getDexterixEditions, getEventsByPhase } from "./index";
import { formatDateRange, formatStamp } from "./derive";

export interface NowItem {
  key: string;
  label: string;
  title: string;
  detail: string;
  href: string;
  tone: "pulse" | "volt" | "violet" | "muted";
  live?: boolean;
  external?: boolean;
}

/**
 * “Now at TechnoJam” — never frozen in time. Priority:
 * announcements → open/upcoming recruitment → live/upcoming events →
 * latest past event → latest Dexterix → closed recruitment.
 */
export async function getNowItems(now = new Date(), limit = 3): Promise<NowItem[]> {
  const [announcements, recruitment, { upcoming, past }, editions] = await Promise.all([
    getActiveAnnouncements(now),
    getCurrentRecruitment(),
    getEventsByPhase(now),
    getDexterixEditions(),
  ]);
  const items: NowItem[] = [];

  for (const a of announcements)
    items.push({
      key: `a-${a.slug}`,
      label: a.label,
      title: a.title,
      detail: a.summary,
      href: a.cta?.url ?? "/",
      tone: "pulse",
      live: true,
      external: a.cta ? /^https?:/.test(a.cta.url) : false,
    });

  if (recruitment && (recruitment.status === "open" || recruitment.status === "upcoming"))
    items.push({
      key: "recruitment",
      label: recruitment.status === "open" ? "Recruitment open" : "Recruitment soon",
      title: recruitment.title,
      detail: recruitment.deadline ? `Tasks due ${formatDateRange(recruitment.deadline)}` : recruitment.summary,
      href: "/join",
      tone: "pulse",
      live: recruitment.status === "open",
    });

  for (const e of upcoming.slice(0, 2))
    items.push({
      key: `e-${e.slug}`,
      label: "Next up",
      title: e.title,
      detail: formatDateRange(e.startDate, e.endDate),
      href: `/events/${e.slug}`,
      tone: "volt",
      live: true,
    });

  if (past[0])
    items.push({
      key: `latest-${past[0].slug}`,
      label: "Latest event",
      title: past[0].title,
      detail: formatStamp(past[0].startDate),
      href: `/events/${past[0].slug}`,
      tone: "muted",
    });

  const dx = editions.find((d) => d.startDate);
  if (dx)
    items.push({
      key: `dx-${dx.slug}`,
      label: "Flagship",
      title: dx.title,
      detail: dx.startDate ? formatDateRange(dx.startDate, dx.endDate) : String(dx.year),
      href: `/dexterix/${dx.slug}`,
      tone: "violet",
    });

  if (recruitment && (recruitment.status === "closed" || recruitment.status === "evaluating"))
    items.push({
      key: "recruitment",
      label: recruitment.status === "evaluating" ? "Recruitment · interviews" : "Recruitment closed",
      title: recruitment.title,
      detail: recruitment.deadline ? `Submissions closed ${formatStamp(recruitment.deadline)}` : "Next cycle not announced yet",
      href: "/join",
      tone: "muted",
    });

  return items.slice(0, limit);
}
