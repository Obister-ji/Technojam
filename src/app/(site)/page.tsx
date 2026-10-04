import Link from "next/link";
import { EventCard, EventRow } from "@/components/events/EventRow";
import { HistoryGraph } from "@/components/history/HistoryGraph";
import { DexterixFeature } from "@/components/home/DexterixFeature";
import { DomainExplorer } from "@/components/home/DomainExplorer";
import { Hero } from "@/components/home/Hero";
import { Identity, type Aspect } from "@/components/home/Identity";
import { JoinCta } from "@/components/home/JoinCta";
import { NowStrip } from "@/components/home/NowStrip";
import { Signal } from "@/components/home/Signal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ArrowRight } from "@/components/ui/Icon";
import { ButtonLink, EmptyState, SectionHeading } from "@/components/ui/primitives";
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

export default async function HomePage() {
  const [settings, now, metrics, domains, projects, { upcoming, past }, editions, milestones, recruitment, resources] =
    await Promise.all([
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

  const years = new Date().getFullYear() - settings.foundedYear;
  const featured = projects.filter((p) => p.featured).slice(0, 6);
  const allEvents = [...upcoming, ...past];
  const domainGraph = buildDomainGraph(domains, projects, allEvents, resources, recruitment);
  const commudle = metrics.find((m) => m.label.toLowerCase().includes("commudle"));
  const repos = metrics.find((m) => m.label.toLowerCase().includes("repositor"));

  const aspects: Aspect[] = [
    {
      key: "community",
      title: "Community",
      body: "Students teaching students. Seniors mentor freshers; everyone gets a turn at the front of the room.",
      evidence: commudle ? `${commudle.value.toLocaleString("en-IN")} on Commudle` : "Meet the community",
      href: "/community",
    },
    {
      key: "engineering",
      title: "Engineering",
      body: "Event platforms, apps, experiments and tools — built by members, published on GitHub.",
      evidence: repos ? `${repos.value} public repositories` : "See the projects",
      href: "/projects",
    },
    {
      key: "learning",
      title: "Learning",
      body: "Workshops and sessions on what's actually changing — from cloud basics to agents and MCP.",
      evidence: "Recent sessions",
      href: "/events",
    },
    {
      key: "events",
      title: "Events",
      body: "Hackathons, talks, competitions and collaborations with communities beyond campus.",
      evidence: "Dexterix since 2018",
      href: "/dexterix",
    },
    {
      key: "opportunity",
      title: "Opportunity",
      body: "Recruitment, mentorship, partners, stages to speak on, and projects worth putting your name on.",
      evidence: "Join or collaborate",
      href: "/join",
    },
  ];

  const yearsMetric = {
    label: "Years of building",
    value: years,
    detail: `Since ${settings.foundedYear}`,
    verification: settings.verification ?? { status: "verified" as const, sourceName: "TechnoJam" },
  };

  return (
    <>
      <Hero settings={settings} />
      <NowStrip items={now} />
      <Identity aspects={aspects} />
      <Signal metrics={[yearsMetric, ...metrics]} />

      <section aria-labelledby="explore-title" className="cv-auto container-site py-28 md:py-40">
        <SectionHeading
          index="03"
          eyebrow="Explore //"
          title={"Pick a\ndomain."}
          intro="Domains change as technology does. These are the tracks we recruited for in 2026 — each with real projects, events and a task ladder."
        />
        <div className="mt-16">
          <DomainExplorer domains={domainGraph} />
        </div>
      </section>

      <section aria-labelledby="ship-title" className="cv-auto border-t border-line py-28 md:py-40">
        <div className="container-site">
          <SectionHeading
            index="04"
            eyebrow="Projects"
            title={"We ship\nthings."}
            intro="Selected work from our GitHub organisation — event platforms, recruitment in the open, experiments that worked and some that didn't."
          />
          <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <li key={p.slug} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink href="/projects" variant="secondary">
              All {projects.length} projects
            </ButtonLink>
          </div>
        </div>
      </section>

      <DexterixFeature editions={editions} />

      <section aria-labelledby="events-title" className="cv-auto container-site py-28 md:py-40">
        <SectionHeading index="06" eyebrow="Events" title={"Show up.\nBuild."} intro="Workshops, talks, collaborations and hackathons." />
        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label-mono text-fg-muted">Upcoming</p>
            <div className="mt-4">
              {upcoming.length ? (
                <ul className="grid gap-4">
                  {upcoming.slice(0, 2).map((e) => (
                    <li key={e.slug}>
                      <EventCard event={e} />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="Nothing announced yet.">
                  New events land on Commudle and Instagram first — and here the moment they&apos;re confirmed.
                </EmptyState>
              )}
            </div>
          </div>
          <div className="lg:col-span-8">
            <p className="label-mono text-fg-muted">Recently</p>
            <ul className="mt-4 border-t border-line">
              {past.slice(0, 4).map((e) => (
                <EventRow key={e.slug} event={e} />
              ))}
            </ul>
            <Link href="/events" className="label-mono mt-6 inline-flex items-center gap-2 hover:text-pulse">
              Every event <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="history-title" className="cv-auto border-t border-line bg-bg-raised py-28 md:py-40">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading index="07" eyebrow="git log --since=2015" title={"How we\ngot here."} className="md:grid-cols-1" />
              <p data-reveal className="mt-6 max-w-md text-lg text-fg-muted">
                {years} years, one trunk, and a long-running Dexterix branch. Every entry here has a source behind it.
              </p>
              <div className="mt-8">
                <ButtonLink href="/about" variant="ghost">
                  The full story
                </ButtonLink>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <HistoryGraph milestones={milestones} compact />
          </div>
        </div>
      </section>

      <JoinCta cycle={recruitment} />

      <section aria-labelledby="collab-title" className="cv-auto container-site pb-8">
        <div className="grid gap-8 border-t border-line pt-16 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="label-mono text-fg-muted">For organisations</p>
            <h2 id="collab-title" className="font-wide mt-4 text-headline font-black tracking-[-0.03em] uppercase">
              Partner with the builders.
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-lg text-fg-muted">
              Sponsor Dexterix, host a workshop, mentor or judge, or bring a problem worth solving. We&apos;ll take it seriously.
            </p>
            <div className="mt-6">
              <ButtonLink href="/collaborate">Collaborate with TechnoJam</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
