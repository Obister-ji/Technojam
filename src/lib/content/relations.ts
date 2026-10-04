import type { Domain, Project, RecruitmentCycle, Resource, TJEvent } from "./types";

export interface DomainNode {
  slug: string;
  title: string;
  order: number;
  summary: string;
  active: boolean;
  projects: { slug: string; title: string; year: number }[];
  events: { slug: string; title: string; date: string }[];
  resources: { title: string; url: string }[];
  task?: { description?: string; url?: string };
}

/** Events don't reference domains directly; match on the domain's keywords. */
function eventMatches(domain: Domain, event: TJEvent) {
  const hay = `${event.title} ${event.topics.join(" ")} ${event.shortDescription}`.toLowerCase();
  const terms = [domain.title, domain.shortTitle, ...(domain.keywords ?? [])].filter(Boolean).map((t) => t!.toLowerCase());
  return terms.some((t) => t.length > 2 && new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(hay));
}

export function buildDomainGraph(
  domains: Domain[],
  projects: Project[],
  events: TJEvent[],
  resources: Resource[],
  recruitment?: RecruitmentCycle,
): DomainNode[] {
  return domains.map((d) => {
    const track = recruitment?.tracks.find((t) => t.domainSlug === d.slug);
    return {
      slug: d.slug,
      title: d.title,
      order: d.order,
      summary: d.summary,
      active: d.active,
      projects: projects
        .filter((p) => p.domains.some((pd) => pd.slug === d.slug))
        .slice(0, 4)
        .map((p) => ({ slug: p.slug, title: p.title, year: p.year })),
      events: events
        .filter((e) => eventMatches(d, e))
        .slice(0, 3)
        .map((e) => ({ slug: e.slug, title: e.title, date: e.startDate })),
      resources: resources
        .filter((r) => r.domain?.slug === d.slug)
        .slice(0, 3)
        .map((r) => ({ title: r.title, url: r.url })),
      task: track ? { description: track.description, url: track.tasksUrl } : undefined,
    };
  });
}
