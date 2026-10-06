import Image from "next/image";
import type { Project, Ritual } from "@/lib/content/types";
import logo from "../../../public/brand/tj-logo.webp";
import { BracketLink, ChapterHead, DataRequired, Plate } from "./furniture";

/* ------------------------------------------------------------------ */
/* CH.04 — TECHNOJAM                                                   */
/* ------------------------------------------------------------------ */

/** Tracks derived from the real 2026 recruitment domains. */
const TRACKS = [
  { name: "Code", from: "web · app · DSA · DevOps · system design · blockchain" },
  { name: "Hardware", from: "robotics & IoT" },
  { name: "Design", from: "UI / UX" },
  { name: "AI", from: "AI · vibe coding" },
  { name: "Games", from: "game development" },
];

export function TechnoJamChapter() {
  return (
    <section aria-labelledby="tj-title" className="container-site py-24 md:py-36">
      <ChapterHead n={4} title="TechnoJam" />

      <div className="mt-14 flex items-end gap-5">
        <Image src={logo} alt="" aria-hidden className="h-[clamp(2.6rem,8vw,8rem)] w-auto shrink-0" />
        <h2
          id="tj-title"
          data-reveal="lines"
          className="min-w-0 text-[clamp(2.2rem,10vw,10.5rem)] leading-[0.8] font-black tracking-[-0.05em] uppercase font-wide"
        >
          <span className="line">
            <span>TechnoJam</span>
          </span>
        </h2>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p data-reveal className="font-serif text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.15]">
            A student-run laboratory for people who cannot leave things unopened.
          </p>
          <p data-reveal className="mt-6 max-w-md font-serif text-lg leading-relaxed text-fg-muted">
            Jam, as in musicians: people with different instruments improvising in the same room until something works. Since 2015, out of
            the School of Computing Science &amp; Engineering.
          </p>

          <dl data-reveal className="mt-12 border-t border-fg">
            {TRACKS.map((t) => (
              <div key={t.name} className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="text-2xl font-black tracking-tight uppercase font-wide">{t.name}</dt>
                <dd className="text-right font-mono text-[0.7rem] tracking-wide text-fg-muted uppercase">{t.from}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 font-mono text-[0.75rem] tracking-[0.14em] uppercase">Different tracks. One session.</p>
        </div>

        {/* Real people building — the shot list until photos exist */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-6 lg:col-start-7">
          <Plate
            className="col-span-2 aspect-[16/10]"
            shot="Hands on a breadboard, late, under lab tube-lights"
            caption="FIG. 1 — Hardware track"
          />
          <Plate className="aspect-square" shot="A whiteboard after a system-design argument" caption="FIG. 2" />
          <Plate className="aspect-square" shot="Laptop stickers + a half-eaten samosa" caption="FIG. 3" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CH.05 — JAM NIGHT                                                   */
/* ------------------------------------------------------------------ */

export function JamNight({ ritual }: { ritual: Ritual }) {
  const scheduled = Boolean(ritual.day && ritual.startTime);
  return (
    <section aria-labelledby="jam-title" className="bg-bg-sunken py-24 md:py-36">
      <div className="container-site">
        <ChapterHead n={5} title="Jam night" />

        {/* A notice pinned to the department board */}
        <article className="grain relative mx-auto mt-16 max-w-3xl rotate-[-0.6deg] border border-fg/25 bg-bg px-6 pt-12 pb-10 shadow-[0_1px_0_rgb(28_27_24/0.15),0_18px_40px_-24px_rgb(28_27_24/0.45)] sm:px-12">
          <span
            aria-hidden
            className="absolute -top-3 left-1/2 size-6 -translate-x-1/2 rounded-full border border-fg/30 bg-pulse shadow-[inset_-3px_-3px_0_rgb(0_0_0/0.18)]"
          />

          <div className="flex flex-wrap items-start justify-between gap-4 font-mono text-[0.72rem] tracking-[0.12em] uppercase">
            <span>Notice no. TJ/JN/01</span>
            <span className="text-fg-muted">SCSE — Technical society</span>
          </div>

          <div className="mt-10 font-mono text-[clamp(1.1rem,2.6vw,1.6rem)] leading-tight font-bold tracking-[0.04em] uppercase">
            {scheduled ? (
              <>
                <p>{ritual.day}</p>
                <p>
                  {ritual.startTime} → {ritual.endTime ?? "until we're done"}
                </p>
              </>
            ) : (
              <>
                <p>
                  Day: <DataRequired what="Jam Night day" />
                </p>
                <p>
                  Time: <DataRequired what="Jam Night start time" />
                </p>
              </>
            )}
          </div>

          <h2 id="jam-title" className="mt-6 text-[clamp(4rem,15vw,10rem)] leading-[0.8] font-black tracking-[-0.05em] uppercase font-wide">
            Jam
            <br />
            night
          </h2>

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <div className="font-mono text-[0.95rem]">
              <p className="mb-3 text-[0.72rem] tracking-[0.14em] text-fg-muted uppercase">Bring:</p>
              <ul className="grid gap-1.5">
                {ritual.bring.map((b) => (
                  <li key={b}>
                    <span aria-hidden className="text-pulse">
                      [x]
                    </span>{" "}
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-6 mb-2 text-[0.72rem] tracking-[0.14em] text-fg-muted uppercase">Experience required:</p>
              <p>
                <span aria-hidden>[ ]</span> {ritual.experience ?? "none"}
              </p>
            </div>
            <div className="flex flex-col justify-between gap-8">
              <p className="font-mono text-[0.85rem]">
                <span className="text-[0.72rem] tracking-[0.14em] text-fg-muted uppercase">Where: </span>
                {ritual.venue ?? <DataRequired what="Jam Night venue" />}
              </p>
              {/* The one Hindi moment on the page */}
              <p lang="hi" className="-rotate-3 self-start font-serif text-3xl text-pulse italic">
                कुछ बनाते हैं?
              </p>
              <BracketLink href={ritual.signupUrl ?? "/join#follow"}>Come build</BracketLink>
            </div>
          </div>

          {!scheduled ? <span className="stamp stamp-in absolute top-24 right-6 sm:right-12">Schedule pending</span> : null}
        </article>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CH.06 — THINGS THAT ESCAPED THE LAB                                 */
/* ------------------------------------------------------------------ */

function statusLine(p: Project) {
  if (p.statusNote) return p.statusNote;
  switch (p.status) {
    case "event":
      return p.relatedEvent ? `SHIPPED FOR ${p.relatedEvent.title}` : `SHIPPED, ${p.year}`;
    case "maintained":
      return "LIVE";
    case "active":
      return "WORKS";
    case "experiment":
      return "EXPERIMENT";
    default:
      return "ARCHIVED";
  }
}

export function Shipped({ projects }: { projects: Project[] }) {
  return (
    <section aria-labelledby="shipped-title" className="container-site py-24 md:py-36">
      <ChapterHead n={6} title="Proof of work" />
      <h2
        id="shipped-title"
        data-reveal="lines"
        className="mt-14 text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-black tracking-[-0.035em] uppercase font-wide"
      >
        <span className="line">
          <span>Things that escaped</span>
        </span>
        <span className="line" style={{ ["--line-index" as string]: 1 }}>
          <span>the lab.</span>
        </span>
      </h2>

      <ol className="mt-20 grid gap-24">
        {projects.map((p, i) => {
          const makers = [...p.maintainers, ...p.contributors].map((m) => m.name);
          return (
            <li key={p.slug} className="grid items-center gap-8 lg:grid-cols-12">
              <Plate
                image={p.screenshots[0]}
                shot={`Screenshot of ${p.title}`}
                className={`aspect-[16/10] lg:col-span-7 ${i % 2 ? "lg:order-2 lg:col-start-6" : ""}`}
              />
              <div className={`lg:col-span-5 ${i % 2 ? "lg:order-1 lg:col-start-1 lg:row-start-1" : ""}`}>
                <p className="font-mono text-[0.72rem] tracking-[0.12em] text-fg-muted uppercase">
                  {String(i + 1).padStart(3, "0")} · {p.year}
                </p>
                <h3 className="mt-3 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-none font-black tracking-tight uppercase font-wide">
                  {p.title}
                </h3>
                <p className="mt-5 font-serif text-xl leading-snug">{p.summary}</p>
                <dl className="mt-6 grid grid-cols-[6rem_1fr] gap-x-4 gap-y-2 font-mono text-[0.78rem]">
                  <dt className="text-fg-muted uppercase">Makers</dt>
                  <dd>{makers.length ? makers.join(", ") : <DataRequired what={`makers of ${p.title}`} />}</dd>
                  <dt className="text-fg-muted uppercase">Source</dt>
                  <dd>
                    {p.repository ? (
                      <a href={p.repository} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-pulse">
                        {p.repoFullName ?? "repository"}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                  <dt className="text-fg-muted uppercase">Demo</dt>
                  <dd>
                    {p.liveUrl ? (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-pulse">
                        {p.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </dl>
                <p className="stamp mt-8">STATUS: {statusLine(p)}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-20">
        <BracketLink href="/projects">Open the full logbook</BracketLink>
      </div>
    </section>
  );
}
