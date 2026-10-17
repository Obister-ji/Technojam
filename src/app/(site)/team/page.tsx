import Link from "next/link";
import { PixelSquad } from "@/components/team/PixelSquad";
import { TeamRoster } from "@/components/team/TeamRoster";
import { ArrowRight } from "@/components/ui/Icon";
import { EmptyState, ExternalLink } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTeamYears } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Team",
  description: "The people who run TechnoJam now, and every generation before them.",
  path: "/team",
});

export default async function TeamPage() {
  const teams = await getTeamYears();
  const current = teams.find((t) => t.current) ?? teams[0];
  const past = teams.filter((t) => t.slug !== current?.slug);

  return (
    <>
      <PageHeader
        eyebrow="Team"
        title={"The people\nbehind it."}
        intro={
          <p>
            TechnoJam is run by students, and every year a new team takes the throttle. We keep every generation here — leaving the club
            shouldn&apos;t mean disappearing from it.
          </p>
        }
      />

      <PixelSquad />

      <section aria-labelledby="current-title" className="container-site mt-28">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <h2 id="current-title" className="text-title font-extrabold uppercase font-wide">
            Current team{current ? ` · ${current.label}` : ""}
          </h2>
        </div>
        <div className="mt-10">
          {current?.members.length ? (
            <TeamRoster team={current} />
          ) : (
            <EmptyState title="The roster is being rebuilt — properly.">
              <p>
                Our previous site showed placeholder profiles, so we&apos;re starting clean: every person listed here will have a confirmed
                role and has agreed to appear. Until then, the university keeps the{" "}
                <ExternalLink href="https://www.galgotiasuniversity.edu.in/p/TechnoJam">official TechnoJam page</ExternalLink> with current
                student leads.
              </p>
              <p className="mt-3">Team lead? Add members in the Studio — they appear here automatically.</p>
            </EmptyState>
          )}
        </div>
      </section>

      <section aria-labelledby="past-title" className="container-site mt-28">
        <h2 id="past-title" className="text-title font-extrabold uppercase font-wide">
          Alumni &amp; past teams
        </h2>
        <p className="mt-4 max-w-2xl text-fg-muted">Find your batch. Each year keeps its own permanent page.</p>
        <div className="mt-8">
          {past.length ? (
            <ul className="border-t border-line">
              {past.map((t) => (
                <li key={t.slug}>
                  <Link href={`/team/${t.slug}`} className="group flex items-baseline justify-between gap-4 border-b border-line py-6">
                    <span className="text-4xl font-black tracking-tight font-wide group-hover:text-pulse">{t.label}</span>
                    <span className="flex items-center gap-2 label-mono text-fg-muted">
                      {t.members.length} people <ArrowRight className="size-3.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No past teams archived yet.">
              Alumni: if you were part of TechnoJam, reach out — we&apos;d like to put every generation back on the record, from 2015
              onwards.
            </EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
