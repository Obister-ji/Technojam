import Link from "next/link";
import { EventCard, EventRow } from "@/components/events/EventRow";
import { HistoryGraph } from "@/components/history/HistoryGraph";
import { DexterixFeature } from "@/components/home/DexterixFeature";
import { DomainExplorer } from "@/components/home/DomainExplorer";
import { Hero } from "@/components/home/Hero";
import { Identity, type Aspect } from "@/components/home/Identity";
import { JoinCta } from "@/components/home/JoinCta";
import { NowStrip } from "@/components/home/NowStrip";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ArrowRight } from "@/components/ui/Icon";
import { ButtonLink, SectionHeading } from "@/components/ui/primitives";
import {
  getCurrentRecruitment,
  getDexterixEditions,
  getDomains,
  getEventsByPhase,
  getMetrics,
  getMilestones,
  getProjects,
  getResources,
  getSiteSettings,
} from "@/lib/content";
import { getNowItems } from "@/lib/content/now";
import { buildDomainGraph } from "@/lib/content/relations";

export const revalidate = 3600;

const ASPECTS: Aspect[] = [
  { key: "community", title: "Community", href: "/community" },
  { key: "engineering", title: "Engineering", href: "/projects" },
  { key: "learning", title: "Learning", href: "/events" },
  { key: "events", title: "Events", href: "/dexterix" },
  { key: "opportunity", title: "Opportunity", href: "/join" },
];

export default async function HomePage() {
  const [settings, now, metrics, domains, projects, { upcoming, past }, editions, milestones, recruitment, resources] = await Promise.all([
    getSiteSettings(),
    getNowItems(),
    getMetrics(),
    getDomains(),
    getProjects(),
    getEventsByPhase(),
    getDexterixEditions(),
    getMilestones(),
    getCurrentRecruitment(),
    getResources(),
  ]);

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const domainGraph = buildDomainGraph(domains, projects, [...upcoming, ...past], resources, recruitment);
  const years = new Date().getFullYear() - settings.foundedYear;
  // A quiet line of numbers inside the identity section — the big ones only.
  const numbers = [
    {
      label: "years of building",
      value: years,
      detail: "",
      verification: settings.verification ?? { status: "verified" as const, sourceName: "TechnoJam" },
    },
    ...metrics.filter((m) => /commudle|repositor|dexterix/i.test(m.label)).map((m) => ({ ...m, label: m.label.toLowerCase() })),
  ];
  const keyMilestones = milestones.filter((m) => ["origin", "dexterix", "event"].includes(m.kind)).slice(-4);

  return (
    <>
      <Hero settings={settings} />
      <NowStrip items={now} />
      <Identity aspects={ASPECTS} metrics={numbers} />

      <section aria-labelledby="explore-title" className="container-site py-20 cv-auto md:py-32">
        <SectionHeading
          id="explore-title"
          eyebrow="Domains"
          title="Pick a domain."
          intro="The tracks we recruited for in 2026 — each with real projects and a place to start."
        />
        <div className="mt-12">
          <DomainExplorer domains={domainGraph} />
        </div>
      </section>

      <section aria-labelledby="ship-title" className="py-20 cv-auto md:py-32">
        <div className="container-site">
          <SectionHeading id="ship-title" eyebrow="Projects" title="We ship things." />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <li key={p.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
                <ProjectCard project={p} compact />
              </li>
            ))}
          </ul>
          <Link href="/projects" className="mt-10 inline-flex items-center gap-2 text-fg-muted hover:text-fg">
            All {projects.length} projects <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <DexterixFeature editions={editions} />

      <section aria-labelledby="events-title" className="container-site py-20 cv-auto md:py-32">
        <SectionHeading id="events-title" eyebrow="Events" title="Recently." />
        <div className="mt-12">
          {upcoming.length ? (
            <ul className="mb-12 grid gap-6 md:grid-cols-2">
              {upcoming.slice(0, 2).map((e) => (
                <li key={e.slug}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="border-t border-line">
            {past.slice(0, 3).map((e) => (
              <EventRow key={e.slug} event={e} />
            ))}
          </ul>
          <Link href="/events" className="mt-8 inline-flex items-center gap-2 text-fg-muted hover:text-fg">
            Every event <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="history-title" className="bg-bg-raised py-20 cv-auto md:py-32">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="history-title"
              eyebrow={`Since ${settings.foundedYear}`}
              title="How we got here."
              className="md:grid-cols-1"
            />
            <div className="mt-8">
              <ButtonLink href="/about" variant="ghost">
                The full story
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-7">
            <HistoryGraph milestones={keyMilestones} compact />
          </div>
        </div>
      </section>

      <JoinCta cycle={recruitment} />
    </>
  );
}
