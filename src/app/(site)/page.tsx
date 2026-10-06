import type { ArchiveYear, Artifact } from "@/components/lab/Archive";
import { JamNight, Shipped, TechnoJamChapter } from "@/components/lab/Club";
import { Archive, LabOpen, People, Relay, Transmission } from "@/components/lab/Epilogue";
import { Access, Boot, Connection, Infrastructure } from "@/components/lab/Prologue";
import { getEvents, getJamNight, getLabFacts, getProjects, getRecruitmentCycles, getSiteSettings, getTeamYears } from "@/lib/content";
import { formatDateRange, formatStamp } from "@/lib/content/derive";
import { getOrgActivity } from "@/lib/github";

export const revalidate = 3600;

/** Projects featured in CH.06, in this order when present. */
const SHIPPED = ["dexterix-5-0-platform", "techxpo-registration", "cryptic-hunt", "deepfake-detection"];
const ARCHIVE_YEARS = [2022, 2023, 2024, 2025, 2026];

export default async function HomePage() {
  const [settings, facts, ritual, projects, events, cycles, teams] = await Promise.all([
    getSiteSettings(),
    getLabFacts(),
    getJamNight(),
    getProjects(),
    getEvents(),
    getRecruitmentCycles(),
    getTeamYears(),
  ]);
  const activity = await getOrgActivity(settings.githubOrg);

  const timeline = facts.filter((f) => f.kind === "timeline");
  const stats = facts.filter((f) => f.kind === "stat");
  const accessFact = timeline.find((f) => f.when.includes("1995"));

  const shipped = SHIPPED.map((slug) => projects.find((p) => p.slug === slug)).filter((p) => p !== undefined);
  const people = (teams.find((t) => t.current) ?? teams[0])?.members.map((m) => m.person) ?? [];

  // CH.08 — only artifacts we can prove, filed by year
  const archive: ArchiveYear[] = ARCHIVE_YEARS.map((year) => {
    const artifacts: Artifact[] = [
      ...events
        .filter((e) => e.startDate.startsWith(String(year)))
        .map((e) => ({
          kind: e.type === "hackathon" ? ("HACKATHON" as const) : ("EVENT" as const),
          title: e.title,
          date: formatDateRange(e.startDate, e.endDate),
          href: `/events/${e.slug}`,
        })),
      ...projects
        .filter((p) => p.year === year)
        .map((p) => ({ kind: "PROJECT" as const, title: p.title, date: String(p.year), href: `/projects/${p.slug}` })),
      ...cycles
        .filter((c) => c.year === year && c.tasksRepository)
        .map((c) => ({
          kind: "RECRUITMENT" as const,
          title: c.title,
          date: c.deadline ? `deadline ${formatStamp(c.deadline)}` : String(c.year),
          href: c.tasksRepository!,
          external: true,
        })),
    ];
    return { year, artifacts };
  });

  const syncedAt = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  return (
    // Rotated paper (notices, relay sheets) must never widen the page on phones.
    <div className="overflow-x-clip">
      <Boot institution={settings.institution} />
      <Access fact={accessFact} />
      <Connection timeline={timeline} />
      <Infrastructure stats={stats} />
      <TechnoJamChapter />
      <JamNight ritual={ritual} />
      <Shipped projects={shipped} />
      <Transmission lines={activity} org={settings.githubOrg} syncedAt={syncedAt} />
      <Archive years={archive} />
      <People people={people} />
      <Relay cycles={cycles} />
      <LabOpen />
    </div>
  );
}
