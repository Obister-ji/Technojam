import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamRoster } from "@/components/team/TeamRoster";
import { EmptyState } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTeamYear, getTeamYears } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getTeamYears()).map((t) => ({ year: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/team/[year]">): Promise<Metadata> {
  const team = await getTeamYear((await params).year);
  if (!team) return {};
  return pageMetadata({ title: `Team ${team.label}`, description: `The TechnoJam team of ${team.label}.`, path: `/team/${team.slug}` });
}

export default async function TeamYearPage({ params }: PageProps<"/team/[year]">) {
  const team = await getTeamYear((await params).year);
  if (!team) notFound();
  return (
    <>
      <PageHeader
        crumbs={[{ label: "team", href: "/team" }, { label: team.slug, href: `/team/${team.slug}` }]}
        eyebrow={team.current ? "Current team" : "Past team"}
        title={`Team\n${team.label}`}
      />
      <section className="container-site">
        {team.members.length ? <TeamRoster team={team} /> : <EmptyState title="No members listed for this year yet." />}
      </section>
    </>
  );
}
