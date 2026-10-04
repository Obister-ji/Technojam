import {
  getCurrentRecruitment,
  getDexterixEditions,
  getDomains,
  getEvents,
  getProjects,
  getResources,
  getSiteSettings,
  getTeamYears,
} from "@/lib/content";
import { isPublishable } from "@/lib/content/derive";
import { ALL_PAGES } from "@/lib/nav";
import type { SearchItem } from "./types";

export async function buildSearchIndex(): Promise<SearchItem[]> {
  const [settings, projects, events, editions, domains, resources, teams, recruitment] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getEvents(),
    getDexterixEditions(),
    getDomains(),
    getResources(),
    getTeamYears(),
    getCurrentRecruitment(),
  ]);

  const latestEvent = events[0];
  const people = new Map<string, SearchItem>();
  for (const team of teams)
    for (const m of team.members)
      people.set(m.person.slug, {
        id: `person-${m.person.slug}`,
        group: "People",
        title: m.person.name,
        subtitle: `${m.role} · ${team.label}`,
        href: `/team/${team.slug}#${m.person.slug}`,
      });

  return [
    {
      id: "action-join",
      group: "Actions",
      title: recruitment?.status === "open" ? `Join TechnoJam — ${recruitment.title} is open` : "Join TechnoJam",
      href: "/join",
      keywords: "recruitment apply tasks member",
    },
    { id: "action-dexterix", group: "Actions", title: "Explore Dexterix", href: "/dexterix", keywords: "hackathon flagship" },
    ...(latestEvent
      ? [
          {
            id: "action-latest",
            group: "Actions" as const,
            title: "View latest event",
            subtitle: latestEvent.title,
            href: `/events/${latestEvent.slug}`,
          },
        ]
      : []),
    {
      id: "action-github",
      group: "Actions",
      title: "Open GitHub",
      subtitle: `github.com/${settings.githubOrg}`,
      href: `https://github.com/${settings.githubOrg}`,
      external: true,
      keywords: "code repositories open source",
    },
    {
      id: "action-collab",
      group: "Actions",
      title: "Partner with TechnoJam",
      href: "/collaborate",
      keywords: "sponsor mentor judge speak",
    },
    {
      id: "action-mail",
      group: "Actions",
      title: "Email TechnoJam",
      subtitle: settings.email,
      href: `mailto:${settings.email}`,
      external: true,
    },

    ...ALL_PAGES.map((p) => ({ id: `page-${p.href}`, group: "Pages" as const, title: p.label, subtitle: p.description, href: p.href })),

    ...projects.map((p) => ({
      id: `project-${p.slug}`,
      group: "Projects" as const,
      title: p.title,
      subtitle: `${p.year} · ${p.summary}`,
      href: `/projects/${p.slug}`,
      keywords: [...p.stack, p.language, p.status].filter(Boolean).join(" "),
    })),

    ...events.map((e) => ({
      id: `event-${e.slug}`,
      group: "Events" as const,
      title: e.title,
      subtitle: `${e.startDate.slice(0, 4)} · ${e.type}`,
      href: `/events/${e.slug}`,
      keywords: e.topics.join(" "),
    })),

    ...editions
      .filter((d) => isPublishable(d.verification))
      .map((d) => ({
        id: `dx-${d.slug}`,
        group: "Dexterix" as const,
        title: d.title,
        subtitle: String(d.year),
        href: `/dexterix/${d.slug}`,
        keywords: d.themes.join(" "),
      })),

    ...domains.map((d) => ({
      id: `domain-${d.slug}`,
      group: "Domains" as const,
      title: d.title,
      subtitle: d.summary,
      href: `/#explore-${d.slug}`,
      keywords: (d.keywords ?? []).join(" "),
    })),

    ...people.values(),

    ...resources.map((r) => ({
      id: `res-${r.slug}`,
      group: "Resources" as const,
      title: r.title,
      subtitle: r.description,
      href: r.url,
      external: true,
      keywords: r.domain?.title,
    })),
  ];
}
