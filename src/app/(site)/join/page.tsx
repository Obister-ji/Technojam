import { RECRUITMENT_STATE, RecruitmentStatus } from "@/components/join/RecruitmentStatus";
import { TrackView, TrackedButton } from "@/components/join/TrackedLinks";
import { ArrowUpRight, Plus } from "@/components/ui/Icon";
import { ButtonLink, Eyebrow, ExternalLink, Lines } from "@/components/ui/primitives";
import { SourceNote } from "@/components/ui/SourceNote";
import { getCurrentRecruitment, getDomains, getRecruitmentCycles, getResources, getSiteSettings } from "@/lib/content";
import { formatDateRange, formatStamp } from "@/lib/content/derive";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Join TechnoJam",
  description: "How TechnoJam recruits: domains, tasks published on GitHub, the process, current status, and how to prepare — even when recruitment is closed.",
  path: "/join",
});

const WHY = [
  ["Build real things", "Event platforms, apps, tools — projects with users, deadlines and a repository with your name on it."],
  ["Learn from people a year ahead", "Seniors run sessions, review code and answer the questions you're embarrassed to ask."],
  ["Run the big stuff", "Dexterix, workshops, talks with industry speakers — you'll be on the organising side, not just the audience."],
  ["Find your domain", "Eleven tracks in 2026, from DSA to robotics to vibe coding. Try one, switch, go deep."],
] as const;

const LOOK_FOR = [
  ["Curiosity", "You poke at things until you understand them."],
  ["Consistency", "You finish what you start — even the boring 20%."],
  ["Clear thinking", "You can explain your approach, not just paste the output."],
  ["Willingness to learn", "Prior expertise is a bonus, not a requirement."],
] as const;

export default async function JoinPage() {
  const [cycle, cycles, domains, resources, settings] = await Promise.all([
    getCurrentRecruitment(),
    getRecruitmentCycles(),
    getDomains(),
    getResources(),
    getSiteSettings(),
  ]);
  const open = cycle?.status === "open";
  const state = cycle ? RECRUITMENT_STATE[cycle.status] : undefined;
  const prep = resources.filter((r) => r.forRecruitment);
  const follow = settings.socials.filter((s) => ["instagram", "linkedin", "discord", "commudle"].includes(s.platform));
  const past = cycles.filter((c) => c.slug !== cycle?.slug);
  const activeDomains = domains.filter((d) => d.active);

  return (
    <>
      <TrackView cycle={cycle?.slug} />

      <header className="container-site pt-[calc(var(--nav-h)+3rem)] pb-20 md:pt-[calc(var(--nav-h)+5rem)]">
        <RecruitmentStatus cycle={cycle} />
        <h1 className="rise-lines font-wide mt-8 text-display-xl font-black tracking-[-0.045em] uppercase">
          <Lines text={"Build\nwith us."} />
        </h1>
        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <p className="rise text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug font-medium md:col-span-7" style={{ ["--rise-delay" as string]: "200ms" }}>
            TechnoJam values curiosity, consistency and a willingness to learn — not only prior expertise. You don&apos;t need to arrive able
            to build an app. You need to want to leave able to teach someone else how.
          </p>
          <div className="rise flex flex-wrap content-start gap-3 md:col-span-4 md:col-start-9" style={{ ["--rise-delay" as string]: "300ms" }}>
            {open && cycle?.tasksRepository ? (
              <>
                <TrackedButton event="recruitment_tasks_click" href={cycle.tasksRepository}>
                  View tasks
                </TrackedButton>
                {cycle.applicationUrl ? (
                  <TrackedButton event="recruitment_apply_click" href={cycle.applicationUrl} variant="secondary">
                    Submit application
                  </TrackedButton>
                ) : null}
              </>
            ) : (
              <>
                <ButtonLink href="#follow">Follow announcements</ButtonLink>
                <ButtonLink href="/community" variant="secondary">
                  Explore the community
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ---------- Current status ---------- */}
      {cycle ? (
        <section aria-labelledby="status-title" className="container-site">
          <div className="relative border border-line-strong">
            <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: open ? "var(--spectrum)" : "var(--color-line-strong)" }} />
            <div className="grid gap-px bg-line lg:grid-cols-12">
              <div className="bg-bg p-6 sm:p-10 lg:col-span-7">
                <Eyebrow>Current status</Eyebrow>
                <h2 id="status-title" className="font-wide mt-5 text-title font-extrabold uppercase">
                  {state?.headline}
                </h2>
                <p className="mt-4 text-lg text-fg-muted">{cycle.summary}</p>

                {cycle.instructions.length ? (
                  <div className="mt-10">
                    <p className="label-mono text-fg-subtle">{open ? "How to apply" : `How ${cycle.title} worked`}</p>
                    <ol className="mt-4 grid gap-3">
                      {cycle.instructions.map((step, i) => (
                        <li key={step} className="grid grid-cols-[2rem_1fr] gap-2">
                          <span className="label-mono pt-1 text-pulse">{String(i + 1).padStart(2, "0")}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}

                {cycle.eligibility.length ? (
                  <div className="mt-10">
                    <p className="label-mono text-fg-subtle">Eligibility</p>
                    <ul className="mt-3 grid gap-2 text-fg-muted">
                      {cycle.eligibility.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="bg-bg-raised p-6 sm:p-10 lg:col-span-5">
                <p className="label-mono text-fg-subtle">{cycle.title} · timeline</p>
                <ol className="relative mt-6 grid gap-6 border-l border-line-strong pl-6">
                  {cycle.timeline.map((t) => (
                    <li key={t.label} className="relative">
                      <span aria-hidden className="absolute top-1.5 -left-[1.72rem] size-2.5 rounded-full border border-line-strong bg-bg" />
                      <p className="font-semibold">{t.label}</p>
                      <p className="label-mono mt-1 text-fg-muted">{t.date ? formatStamp(t.date) : t.note}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-10 grid gap-3">
                  {cycle.tasksRepository ? (
                    <ExternalLink href={cycle.tasksRepository}>{open ? "Task repository" : "Browse the tasks (still public)"}</ExternalLink>
                  ) : null}
                  {cycle.contact ? <ExternalLink href={cycle.contact.url}>Questions? {cycle.contact.label}</ExternalLink> : null}
                </div>
                <SourceNote verification={cycle.verification} className="mt-8" />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------- What we look for / why ---------- */}
      <section aria-labelledby="look-title" className="container-site py-28 md:py-36">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Eyebrow index="01">What we look for</Eyebrow>
            <h2 id="look-title" className="sr-only">
              What we look for
            </h2>
            <dl className="mt-10 grid gap-8">
              {LOOK_FOR.map(([t, d]) => (
                <div key={t} data-reveal className="border-t border-line pt-5">
                  <dt className="font-wide text-2xl font-extrabold uppercase">{t}</dt>
                  <dd className="mt-2 text-fg-muted">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <Eyebrow index="02">Why join</Eyebrow>
            <dl className="mt-10 grid gap-8">
              {WHY.map(([t, d]) => (
                <div key={t} data-reveal className="border-t border-line pt-5">
                  <dt className="text-xl font-bold">{t}</dt>
                  <dd className="mt-2 text-fg-muted">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------- Domains ---------- */}
      <section aria-labelledby="domains-title" className="cv-auto border-y border-line bg-bg-raised py-28 md:py-36">
        <div className="container-site">
          <Eyebrow index="03">What you&apos;ll work on</Eyebrow>
          <h2 id="domains-title" data-reveal="lines" className="font-wide mt-6 text-headline font-black tracking-[-0.03em] uppercase">
            <Lines text={`${activeDomains.length} domains.\nOne of them is yours.`} />
          </h2>
          <ul className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {activeDomains.map((d, i) => {
              const track = cycle?.tracks.find((t) => t.domainSlug === d.slug);
              return (
                <li key={d.slug} className="flex flex-col bg-bg-raised p-6">
                  <p className="label-mono text-fg-subtle">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-xl font-bold">{d.title}</h3>
                  <p className="mt-2 flex-1 text-fg-muted">{d.summary}</p>
                  {track?.description ? (
                    <p className="mt-4 border-t border-line pt-3 font-mono text-[0.8rem] leading-relaxed text-fg-muted">{track.description}</p>
                  ) : null}
                  {track?.tasksUrl ? (
                    <a
                      href={track.tasksUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="label-mono mt-4 inline-flex items-center gap-1.5 text-fg hover:text-pulse"
                    >
                      {cycle?.year} tasks <ArrowUpRight className="size-3.5" />
                      <span className="sr-only">for {d.title} (opens in a new tab)</span>
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section aria-labelledby="process-title" className="cv-auto container-site py-28 md:py-36">
        <Eyebrow index="04">The process</Eyebrow>
        <h2 id="process-title" className="font-wide mt-6 text-headline font-black tracking-[-0.03em] uppercase">
          Recruitment is open source.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-fg-muted">
          Every year the tasks are published in a public GitHub repository. You build in the open, explain your thinking, and talk it through
          with us.
        </p>
        <ol className="mt-14 grid gap-px bg-line md:grid-cols-4">
          {[
            ["Tasks go public", "A TJ-TASKS repository opens with levelled tasks for every domain."],
            ["You build", "Pick a domain and level. Ship it in your own GitHub repository."],
            ["You explain", "A README with your approach, algorithm and screenshots is compulsory."],
            ["We talk", "Shortlisted candidates are interviewed about what they built."],
          ].map(([t, d], i) => (
            <li key={t} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} className="bg-bg p-6">
              <p className="font-wide text-5xl font-black text-fg-subtle">{i + 1}</p>
              <h3 className="mt-4 text-xl font-bold">{t}</h3>
              <p className="mt-2 text-fg-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Prep + FAQ ---------- */}
      <section aria-labelledby="prep-title" className="cv-auto container-site grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow index="05">Prepare</Eyebrow>
          <h2 id="prep-title" className="font-wide mt-6 text-title font-extrabold uppercase">
            Start before it opens.
          </h2>
          <ul className="mt-8 border-t border-line">
            {prep.map((r) => (
              <li key={r.slug} className="border-b border-line">
                <a href={r.url} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-4 py-4">
                  <span>
                    <span className="font-semibold group-hover:text-pulse">{r.title}</span>
                    <span className="mt-1 block text-sm text-fg-muted">{r.description}</span>
                  </span>
                  <ArrowUpRight className="mt-1 shrink-0 text-fg-subtle" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Eyebrow index="06">FAQ</Eyebrow>
          <div className="mt-8 border-t border-line">
            {(cycle?.faq ?? []).map((f) => (
              <details key={f.question} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <Plus className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="pb-6 text-fg-muted">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Follow ---------- */}
      <section id="follow" aria-labelledby="follow-title" className="container-site mt-28 scroll-mt-28">
        <div className="grid gap-10 border border-line-strong p-6 sm:p-10 md:grid-cols-12 md:p-14">
          <div className="md:col-span-6">
            <p className="label-mono text-pulse">{open ? "Stay in the loop" : "Be first to know"}</p>
            <h2 id="follow-title" className="font-wide mt-4 text-title font-extrabold uppercase">
              Recruitment is announced here first:
            </h2>
          </div>
          <ul className="grid gap-3 md:col-span-5 md:col-start-8">
            {follow.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-line py-3">
                  <span className="text-lg font-semibold group-hover:text-pulse">{s.label}</span>
                  <span className="label-mono text-fg-subtle">{s.handle ?? "→"}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {past.length ? (
        <section aria-labelledby="archive-title" className="cv-auto container-site mt-28">
          <h2 id="archive-title" className="label-mono text-fg-muted">
            Previous cycles
          </h2>
          <ul className="mt-6 border-t border-line">
            {past.map((c) => (
              <li key={c.slug} className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line py-4">
                <span className="font-semibold">{c.title}</span>
                <span className="label-mono text-fg-subtle">
                  {c.deadline ? `deadline ${formatDateRange(c.deadline)}` : c.year}
                  {c.tasksRepository ? (
                    <>
                      {" · "}
                      <ExternalLink href={c.tasksRepository}>tasks</ExternalLink>
                    </>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
