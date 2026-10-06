import type { Person, RecruitmentCycle } from "@/lib/content/types";
import { formatStamp } from "@/lib/content/derive";
import type { ActivityLine } from "@/lib/github";
import { BuildArchive, type ArchiveYear } from "./Archive";
import { BracketLink, ChapterHead, DataRequired } from "./furniture";
import { TransmissionLog } from "./Transmission";

/* ------------------------------------------------------------------ */
/* CH.07 — TRANSMISSION                                                */
/* ------------------------------------------------------------------ */

export function Transmission({ lines, org, syncedAt }: { lines: ActivityLine[]; org: string; syncedAt: string }) {
  return (
    <section aria-labelledby="tx-title" className="container-site py-24 md:py-36">
      <ChapterHead n={7} title="Transmission" />
      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="tx-title" className="text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] font-black tracking-[-0.03em] uppercase font-wide">
            The lab is on.
          </h2>
          <p className="mt-5 max-w-sm font-serif text-lg leading-relaxed text-fg-muted">
            Real activity from our GitHub organisation — pushes, forks, stars, new repos. Refreshed every hour. No made-up names.
          </p>
        </div>
        <div className="lg:col-span-8">
          <TransmissionLog lines={lines} org={org} syncedAt={syncedAt} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CH.08 — BUILD ARCHIVE                                               */
/* ------------------------------------------------------------------ */

export function Archive({ years }: { years: ArchiveYear[] }) {
  return (
    <section aria-labelledby="archive-title" className="bg-bg-raised py-24 md:py-36">
      <div className="container-site">
        <ChapterHead n={8} title="Build archive" />
        <div className="mt-14 flex flex-wrap items-end justify-between gap-6">
          <h2 id="archive-title" className="text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] font-black tracking-[-0.03em] uppercase font-wide">
            The filing cabinet.
          </h2>
          <p className="max-w-sm font-serif text-lg text-fg-muted">Every drawer holds only what we can prove. Pull one open.</p>
        </div>
        <div className="mt-12">
          <BuildArchive years={years} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CH.09 — THE PEOPLE                                                  */
/* ------------------------------------------------------------------ */

function MakerCard({ person }: { person?: Person }) {
  const row = (label: string, value?: string) => (
    <div className="grid gap-x-3 gap-y-0.5 border-b border-dotted border-fg/30 py-2 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
      <dt className="text-fg-muted">{label}</dt>
      <dd>{value ?? <DataRequired />}</dd>
    </div>
  );
  return (
    <article className="border border-fg/25 bg-bg p-6 shadow-[3px_3px_0_rgb(28_27_24/0.12)]">
      <h3 className="text-3xl font-black tracking-tight uppercase font-wide">{person?.name ?? <DataRequired what="member name" />}</h3>
      <dl className="mt-5 font-mono text-[0.8rem]">
        {row("currently obsessed with", person?.obsession)}
        {row("last shipped", person?.lastShipped)}
        {row("ask me about", person?.askMeAbout)}
      </dl>
      {person?.github || person?.portfolio ? (
        <p className="mt-4 font-mono text-[0.8rem]">
          <a
            href={person.portfolio ?? person.github}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-pulse"
          >
            {(person.portfolio ?? person.github ?? "").replace(/^https?:\/\//, "")}
          </a>
        </p>
      ) : null}
    </article>
  );
}

export function People({ people }: { people: Person[] }) {
  return (
    <section aria-labelledby="people-title" className="container-site py-24 md:py-36">
      <ChapterHead n={9} title="The people" />
      <div className="mt-14 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="people-title" className="text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] font-black tracking-[-0.03em] uppercase font-wide">
            Makers, not job titles.
          </h2>
          <p className="mt-5 max-w-sm font-serif text-lg leading-relaxed text-fg-muted">
            {people.length
              ? "What they’re into, what they shipped, what to ask them."
              : "Each member fills in their own card — with their consent. Until then, the card stays honest."}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {people.length ? people.slice(0, 6).map((p) => <MakerCard key={p.slug} person={p} />) : <MakerCard />}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CH.10 — THE RELAY                                                   */
/* ------------------------------------------------------------------ */

export function Relay({ cycles }: { cycles: RecruitmentCycle[] }) {
  const chain = [...cycles].filter((c) => c.tasksRepository).sort((a, b) => a.year - b.year);
  return (
    <section aria-labelledby="relay-title" className="bg-bg-sunken py-24 md:py-36">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <ChapterHead n={10} title="The relay" />
        </div>
        <h2 id="relay-title" className="font-serif text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.15] lg:col-span-6">
          We inherit tools.
          <br />
          We inherit notes.
          <br />
          We inherit mistakes.
          <br />
          <span className="font-sans font-black tracking-[-0.02em] uppercase font-wide">
            Then we leave something better for the next batch.
          </span>
        </h2>

        {/* The real relay: the recruitment task repo, rewritten by each batch for the next */}
        <ol className="relative lg:col-span-5 lg:col-start-8" aria-label="Task repositories passed from batch to batch">
          {chain.map((c, i) => (
            <li
              key={c.slug}
              className="relative min-w-0 border border-fg/25 bg-bg px-5 py-4 font-mono text-[0.8rem] shadow-[3px_3px_0_rgb(28_27_24/0.12)] sm:ml-(--offset)"
              style={{
                ["--offset" as string]: `${i * 1.5}rem`,
                marginTop: i ? "-0.25rem" : undefined,
                transform: `rotate(${(i - 1) * 0.6}deg)`,
              }}
            >
              <p className="flex justify-between text-[0.68rem] tracking-[0.12em] text-fg-muted uppercase">
                <span>REV {c.year}</span>
                <span>{c.deadline ? `DUE ${formatStamp(c.deadline)}` : ""}</span>
              </p>
              <a
                href={c.tasksRepository}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block truncate text-base font-bold hover:text-pulse"
              >
                {c.tasksRepository?.split("/").pop()}
              </a>
              {i < chain.length - 1 ? (
                <p className="mt-2 font-serif text-[0.95rem] text-pulse italic">↳ handed to the batch of {chain[i + 1].year}</p>
              ) : (
                <p className="mt-2 font-serif text-[0.95rem] text-pulse italic">↳ next batch: you?</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FINAL                                                               */
/* ------------------------------------------------------------------ */

export function LabOpen() {
  return (
    <section aria-labelledby="open-title" className="container-site flex min-h-[80svh] flex-col justify-center py-24">
      <p className="font-mono text-[0.72rem] tracking-[0.14em] text-fg-muted uppercase">End of document · TJ-026</p>
      <h2
        id="open-title"
        data-reveal="lines"
        className="mt-6 text-[clamp(3.2rem,12vw,11rem)] leading-[0.85] font-black tracking-[-0.045em] uppercase font-wide"
      >
        <span className="line">
          <span>The lab</span>
        </span>
        <span className="line" style={{ ["--line-index" as string]: 1 }}>
          <span>
            is open<span className="text-pulse">.</span>
          </span>
        </span>
      </h2>
      <p className="mt-8 font-serif text-2xl italic">Bring something unfinished.</p>
      <div className="mt-10">
        <BracketLink href="/join">Join the next jam</BracketLink>
      </div>
    </section>
  );
}
