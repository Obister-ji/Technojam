import { ArchiveFlash, type Scrap } from "@/components/lab/ArchiveFlash";
import { PeopleStrip, type Maker } from "@/components/lab/PeopleStrip";
import { ProjectReel } from "@/components/lab/ProjectReel";
import { Final, JamNightScreen, Opening, Question, ThenNow } from "@/components/lab/Screens";
import { TransmissionLog } from "@/components/lab/Transmission";
import { getEvents, getJamNight, getLabFacts, getProjects, getRecruitmentCycles, getSiteSettings, getTeamYears } from "@/lib/content";
import { EVENT_TYPE_LABEL, formatStamp } from "@/lib/content/derive";
import { getOrgActivity } from "@/lib/github";

export const revalidate = 3600;

/** The reel, in order — real repositories with a true “built because”. */
const REEL = ["dexterix-5-0-platform", "techxpo-registration", "tj-tasks-2026", "cryptic-hunt", "deepfake-detection"];

/** Until members add themselves, the strip shows one honest frame per real 2026 track. */
const OPEN_FRAMES: Maker[] = [
  { key: "hardware", builds: "hardware / robotics & IoT" },
  { key: "web", builds: "web" },
  { key: "design", builds: "design / UI·UX" },
  { key: "ai", builds: "AI" },
  { key: "games", builds: "game dev" },
  { key: "dsa", builds: "DSA" },
];

const IST_TIME = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });

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

  const then = facts.find((f) => f.kind === "timeline" && f.when.includes("1995"));
  const now = facts.find((f) => f.kind === "stat");
  const reel = REEL.map((slug) => projects.find((p) => p.slug === slug)).filter((p) => p !== undefined);

  const members = (teams.find((t) => t.current) ?? teams[0])?.members ?? [];
  const makers: Maker[] = members.length
    ? members.map(({ person }) => ({
        key: person.slug,
        name: person.name,
        builds: person.domains[0]?.title ?? person.role ?? "",
        detail: person.obsession ? `currently obsessed with ${person.obsession}` : person.askMeAbout,
        image: person.image,
      }))
    : OPEN_FRAMES;

  // Archive flash: only real artifacts — event posters, GitHub slips, recruitment tags.
  const posters: Scrap[] = events.slice(0, 8).map((e) => ({
    kind: "poster",
    title: e.title,
    date: formatStamp(e.startDate),
    tag: EVENT_TYPE_LABEL[e.type],
    href: `/events/${e.slug}`,
  }));
  const slips: Scrap[] = activity
    .slice(0, 4)
    .map((a) => ({ kind: "slip", line: `${IST_TIME(a.at)}  ${a.who} ${a.verb} / ${a.repo}`, href: a.url }));
  const tags: Scrap[] = cycles
    .filter((c) => c.tasksRepository)
    .map((c) => ({
      kind: "tag",
      line: `${c.tasksRepository!.split("/").pop()}${c.deadline ? ` · due ${formatStamp(c.deadline)}` : ""}`,
      href: c.tasksRepository!,
    }));
  const scraps: Scrap[] = [];
  for (let i = 0; i < posters.length || slips.length || tags.length; i++) {
    const p = posters.shift();
    const s = i % 2 === 0 ? slips.shift() : undefined;
    const t = i % 3 === 1 ? tags.shift() : undefined;
    for (const x of [p, s, t]) if (x) scraps.push(x);
    if (!posters.length && i > 12) break;
  }

  const syncedAt = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  return (
    // Rotated paper must never widen the page on phones.
    <div className="overflow-x-clip">
      {/* quiet */}
      <Opening foundedYear={settings.foundedYear} />
      {/* visual moment */}
      <ThenNow then={then} now={now} />
      {/* quiet */}
      <Question />
      {/* real work */}
      <ProjectReel projects={reel} />
      {/* photograph */}
      <JamNightScreen ritual={ritual} />
      {/* people */}
      <PeopleStrip makers={makers} />
      {/* interactive moment */}
      <section aria-labelledby="live-title" className="container-site flex min-h-[90svh] flex-col justify-center gap-10 py-24">
        <h2 id="live-title" className="text-[clamp(2.4rem,6.5vw,6.5rem)] leading-[0.9] font-black tracking-[-0.04em] uppercase font-wide">
          The lab is alive.
        </h2>
        <TransmissionLog lines={activity} org={settings.githubOrg} syncedAt={syncedAt} />
      </section>
      {/* visual explosion */}
      <ArchiveFlash scraps={scraps} />
      {/* quiet ending */}
      <Final />
    </div>
  );
}
