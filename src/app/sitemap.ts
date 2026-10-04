import type { MetadataRoute } from "next";
import { getDexterixEditions, getEvents, getProjects, getTeamYears } from "@/lib/content";
import { isPublishable } from "@/lib/content/derive";
import { ALL_PAGES } from "@/lib/nav";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, events, editions, teams] = await Promise.all([getProjects(), getEvents(), getDexterixEditions(), getTeamYears()]);
  const url = (path: string) => `${SITE_URL}${path}`;
  return [
    ...ALL_PAGES.map((p) => ({ url: url(p.href), changeFrequency: "weekly" as const, priority: p.href === "/" ? 1 : 0.8 })),
    ...projects.map((p) => ({ url: url(`/projects/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...events.map((e) => ({
      url: url(`/events/${e.slug}`),
      lastModified: e.endDate ?? e.startDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...editions
      .filter((e) => isPublishable(e.verification))
      .map((e) => ({ url: url(`/dexterix/${e.slug}`), changeFrequency: "yearly" as const, priority: 0.7 })),
    ...teams.map((t) => ({ url: url(`/team/${t.slug}`), changeFrequency: "yearly" as const, priority: 0.4 })),
  ];
}
