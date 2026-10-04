import { HistoryGraph } from "@/components/history/HistoryGraph";
import { ButtonLink, Eyebrow, ExternalLink, Lines } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAchievements, getMilestones, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "About",
  description: "TechnoJam's story since 2015: what it is, how it works, and the history from the first Dexterix to today.",
  path: "/about",
});

const LOOP = ["Learn.", "Build.", "Break.", "Improve.", "Repeat."];

const PRINCIPLES = [
  ["Build to learn", "We don't stop at tutorials. If you learned it, you can ship something with it."],
  ["Teach what you know", "The fastest way to understand something is to explain it to the room. Everyone gets a turn."],
  ["Work in the open", "Event platforms, recruitment tasks and experiments live on GitHub, for anyone to read or fork."],
  ["Earn the numbers", "We don't round up. If we can't point to where a number came from, we don't publish it."],
] as const;

export default async function AboutPage() {
  const [settings, milestones, achievements] = await Promise.all([getSiteSettings(), getMilestones(), getAchievements()]);
  const years = new Date().getFullYear() - settings.foundedYear;

  return (
    <>
      <PageHeader
        eyebrow={`About · est. ${settings.foundedYear}`}
        title={"Throttle\nto learn."}
        intro={
          <p>
            {settings.name} is the student-led technical community of the {settings.school} at {settings.institution}, {settings.location}.
            For {years} years it has been where curious students become builders.
          </p>
        }
      />

      <section aria-label="The loop" className="overflow-hidden border-y border-line bg-bg-sunken py-6">
        <div className="marquee-track flex w-max gap-12 whitespace-nowrap" aria-hidden>
          {[...LOOP, ...LOOP, ...LOOP, ...LOOP].map((w, i) => (
            <span
              key={i}
              className="text-5xl font-black uppercase font-wide md:text-7xl"
              style={{ color: i % 5 === 2 ? "var(--color-pulse)" : undefined }}
            >
              {w}
            </span>
          ))}
        </div>
        <p className="sr-only">{LOOP.join(" ")}</p>
      </section>

      <section aria-labelledby="what-title" className="container-site grid gap-16 py-20 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow index="01">What it is</Eyebrow>
          <h2 id="what-title" data-reveal="lines" className="mt-6 text-headline font-black tracking-[-0.03em] uppercase font-wide">
            <Lines text={"A club that\nships."} />
          </h2>
        </div>
        <div className="grid gap-6 text-lg leading-relaxed text-fg-muted lg:col-span-6 lg:col-start-7">
          <p data-reveal>
            The university describes TechnoJam as its technical society, “focused on building a practical and collaborative tech culture on
            campus.” In practice that means workshops and sessions, a flagship hackathon, recruitment through public task repositories, and
            a GitHub organisation going back to 2018.
          </p>
          <p data-reveal>
            The domains change with the industry. Web, app, AI, competitive programming and gaming have been on the list for years; cloud
            and cyber security had their own tracks; the 2026 tasks add blockchain, system design, robotics and vibe coding.
          </p>
          <p data-reveal>
            What doesn&apos;t change is the habit: learn something, build something with it, break it, fix it, and teach the next person.
          </p>
          <p data-reveal className="label-mono tracking-normal text-fg-subtle normal-case">
            Quote: <ExternalLink href="https://www.galgotiasuniversity.edu.in/p/TechnoJam">Galgotias University — TechnoJam</ExternalLink>
          </p>
        </div>
      </section>

      <section aria-labelledby="how-title" className="border-y border-line bg-bg-raised py-20 md:py-32">
        <div className="container-site">
          <Eyebrow index="02">How we work</Eyebrow>
          <h2 id="how-title" className="sr-only">
            How we work
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map(([t, d], i) => (
              <li key={t} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
                <p className="label-mono text-fg-subtle">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 text-xl font-extrabold uppercase font-wide">{t}</h3>
                <p className="mt-3 text-fg-muted">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="history-title" className="container-site grid gap-16 py-20 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow index="03">History</Eyebrow>
            <h2 id="history-title" data-reveal="lines" className="mt-6 text-headline font-black tracking-[-0.03em] uppercase font-wide">
              <Lines text={"git log\n--reverse"} />
            </h2>
            <p className="mt-6 text-fg-muted">
              Every entry is backed by a first-party record or press coverage. Gaps are gaps we&apos;re still filling — if you have records
              from 2015–2021, we want them.
            </p>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <HistoryGraph milestones={milestones} />
        </div>
      </section>

      {achievements.length ? (
        <section aria-labelledby="ach-title" className="container-site">
          <h2 id="ach-title" className="label-mono text-fg-muted">
            Achievements
          </h2>
          <ul className="mt-6 border-t border-line">
            {achievements.map((a) => (
              <li key={a.title} className="border-b border-line py-5">
                <p className="text-xl font-semibold">{a.url ? <ExternalLink href={a.url}>{a.title}</ExternalLink> : a.title}</p>
                <p className="mt-1 text-fg-muted">{a.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="facts-title" className="container-site">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="facts-title" className="text-title font-extrabold uppercase font-wide md:col-span-4">
            The short version
          </h2>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 md:col-span-8">
            {[
              ["Name", settings.name],
              ["Tagline", settings.tagline],
              ["Established", String(settings.foundedYear)],
              ["Home", `${settings.school}, ${settings.institution}`],
              ["Location", settings.location],
              ["Contact", settings.email],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label-mono text-fg-subtle">{k}</dt>
                <dd className="mt-1 break-words">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-3 md:col-span-8 md:col-start-5">
            <ButtonLink href="/join">Join</ButtonLink>
            <ButtonLink href="/collaborate" variant="secondary">
              Collaborate
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
