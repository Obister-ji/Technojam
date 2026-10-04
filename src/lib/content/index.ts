/**
 * The only module pages talk to for content.
 *
 * - With NEXT_PUBLIC_SANITY_PROJECT_ID set, everything comes from Sanity
 *   (draft content when draft mode is on).
 * - Without it, the site renders from the verified seed in src/content/seed —
 *   the same documents `npm run seed:export` imports into Sanity.
 */
import { cache } from "react";
import { draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import * as Q from "@/sanity/queries";
import * as seed from "@/content/seed";
import { eventPhase, isPublishable } from "./derive";
import type {
  Achievement,
  Announcement,
  DexterixEdition,
  Domain,
  Metric,
  Milestone,
  Partner,
  Project,
  RecruitmentCycle,
  Resource,
  SiteSettings,
  SocialLink,
  TeamYear,
  TJEvent,
} from "./types";

export const REVALIDATE_SECONDS = 3600;

async function isDraft() {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    // Called outside a request (e.g. generateStaticParams)
    return false;
  }
}

async function sanityFetch<T>(query: string, tags: string[], params: QueryParams = {}): Promise<T> {
  if (await isDraft()) {
    return client.fetch<T>(query, params, {
      perspective: "drafts",
      useCdn: false,
      stega: true,
      token: process.env.SANITY_API_READ_TOKEN,
      cache: "no-store",
    });
  }
  return client.fetch<T>(query, params, {
    stega: false,
    next: { revalidate: REVALIDATE_SECONDS, tags: ["sanity", ...tags] },
  });
}

/** Choose source once per request. */
function source<T>(fromSanity: () => Promise<T>, fromSeed: () => T) {
  return cache(async (): Promise<T> => (isSanityConfigured ? fromSanity() : fromSeed()));
}

/* ------------------------------------------------------------------ */

export const getSiteSettings = source<SiteSettings>(
  async () => {
    const res = await sanityFetch<{ settings: SiteSettings | null; socials: SocialLink[] }>(Q.settingsQuery, [
      "siteSettings",
      "socialLink",
    ]);
    // Fall back field-by-field so a half-filled Studio never breaks the layout.
    return {
      ...seed.siteSettings,
      ...stripNulls(res.settings ?? {}),
      socials: res.socials.length ? res.socials : seed.siteSettings.socials,
    };
  },
  () => seed.siteSettings,
);

export const getDomains = source<Domain[]>(
  () => sanityFetch(Q.domainsQuery, ["domain"]),
  () => seed.domains,
);

export const getProjects = source<Project[]>(
  () => sanityFetch(Q.projectsQuery, ["project"]),
  () => seed.projects,
);

export const getEvents = source<TJEvent[]>(
  () => sanityFetch(Q.eventsQuery, ["event"]),
  () => [...seed.events].sort((a, b) => b.startDate.localeCompare(a.startDate)),
);

export const getDexterixEditions = source<DexterixEdition[]>(
  () => sanityFetch(Q.dexterixQuery, ["dexterixEdition"]),
  () => [...seed.dexterixEditions].sort((a, b) => b.year - a.year),
);

export const getTeamYears = source<TeamYear[]>(
  () => sanityFetch(Q.teamYearsQuery, ["teamYear", "person"]),
  () => seed.teamYears,
);

export const getRecruitmentCycles = source<RecruitmentCycle[]>(
  () => sanityFetch(Q.recruitmentQuery, ["recruitmentCycle"]),
  () => seed.recruitmentCycles,
);

export const getMilestones = source<Milestone[]>(
  async () => (await sanityFetch<Milestone[]>(Q.milestonesQuery, ["milestone"])).filter((m) => isPublishable(m.verification)),
  () => seed.milestones.filter((m) => isPublishable(m.verification)),
);

export const getResources = source<Resource[]>(
  () => sanityFetch(Q.resourcesQuery, ["resource"]),
  () => seed.resources,
);

export const getAnnouncements = source<Announcement[]>(
  () => sanityFetch(Q.announcementsQuery, ["announcement"]),
  () => seed.announcements,
);

export const getPartners = source<Partner[]>(
  () => sanityFetch(Q.partnersQuery, ["partner"]),
  () => seed.partners,
);

export const getAchievements = source<Achievement[]>(
  async () => (await sanityFetch<Achievement[]>(Q.achievementsQuery, ["achievement"])).filter((a) => isPublishable(a.verification)),
  () => seed.achievements,
);

export const getMetrics = source<Metric[]>(
  async () => (await sanityFetch<Metric[]>(Q.metricsQuery, ["metric"])).filter((m) => isPublishable(m.verification)),
  () => seed.metrics.filter((m) => isPublishable(m.verification)),
);

/* ---------------- Derived lookups ---------------- */

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}

export async function getEvent(slug: string) {
  return (await getEvents()).find((e) => e.slug === slug);
}

export async function getDexterixEdition(slug: string) {
  return (await getDexterixEditions()).find((e) => e.slug === slug);
}

export async function getTeamYear(slug: string) {
  return (await getTeamYears()).find((t) => t.slug === slug);
}

export async function getCurrentRecruitment() {
  const cycles = await getRecruitmentCycles();
  return cycles.find((c) => c.status === "open") ?? cycles.find((c) => c.status === "upcoming") ?? cycles[0];
}

export async function getEventsByPhase(now = new Date()) {
  const events = await getEvents();
  const upcoming = events
    .filter((e) => ["upcoming", "live"].includes(eventPhase(e, now)))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = events.filter((e) => eventPhase(e, now) === "past");
  return { upcoming, past };
}

export async function getActiveAnnouncements(now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return (await getAnnouncements()).filter((a) => (!a.activeFrom || a.activeFrom <= today) && (!a.activeUntil || a.activeUntil >= today));
}

function stripNulls<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined)) as Partial<T>;
}
