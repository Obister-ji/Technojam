import type { LabFact, Ritual } from "@/lib/content/types";
import { BracketLink, DataRequired, Plate } from "./furniture";

/** Shared CRT drawing — the visual memory that opens the site. */
export function CrtMonitor({ lines, prompt, powerOn }: { lines: string[]; prompt: string; powerOn?: boolean }) {
  return (
    <div aria-hidden className="w-full max-w-[22rem]">
      <div className="rounded-[16px] border border-fg/25 bg-bg-sunken p-4 shadow-[inset_0_-6px_0_rgb(28_27_24/0.08)]">
        <div
          className={`crt ${powerOn ? "crt-on" : ""} relative aspect-[4/3] overflow-hidden rounded-[22px/18px] p-5 font-mono text-[0.78rem] leading-relaxed shadow-[inset_0_0_40px_rgb(0_0_0/0.6)]`}
        >
          {lines.map((l, i) => (
            <p key={l} className={i === 0 ? "text-phosphor" : "text-fg-muted"}>
              {l}
            </p>
          ))}
          <p className="mt-2 text-phosphor">
            {prompt}
            <span className="caret ml-0.5 inline-block h-3 w-2 translate-y-0.5 bg-phosphor" />
          </p>
          <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/0.04)_0_1px,transparent_1px_3px)]" />
        </div>
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="font-mono text-[0.6rem] tracking-[0.2em] text-fg-muted">TJ-CRT 14&quot;</span>
          <span className="size-2 rounded-full bg-volt" />
        </div>
      </div>
      <div className="mx-auto h-5 w-24 border-x border-fg/25 bg-bg-sunken" />
      <div className="mx-auto h-2 w-40 rounded-t border border-fg/25 bg-bg-sunken" />
    </div>
  );
}

const screen = "container-site flex min-h-[100svh] flex-col justify-center py-24";
const giant = "font-black uppercase tracking-[-0.04em] font-wide leading-[0.9]";

/* 01 — OPENING ------------------------------------------------------ */

export function Opening({ foundedYear }: { foundedYear: number }) {
  return (
    <section aria-labelledby="open-title" className="container-site flex min-h-[100svh] flex-col pt-[calc(var(--nav-h)+1.25rem)] pb-10">
      <p className="flex justify-between font-mono text-[0.72rem] tracking-[0.14em] text-fg-muted uppercase">
        <span>TechnoJam / NCR</span>
        <span>Est. {foundedYear}</span>
      </p>

      <div className="flex flex-1 flex-col items-start justify-center gap-14 py-12 lg:flex-row lg:items-center lg:justify-between">
        <h1 id="open-title" className={`${giant} text-[clamp(2rem,4.4vw,4.4rem)]`}>
          <span className="rise block">We don&apos;t just use technology.</span>
          <span className="reveal-late mt-4 block text-pulse">We open it.</span>
        </h1>
        <CrtMonitor powerOn lines={["TECHNOJAM BIOS v2.026", "CASE SCREWS ..... 4/4 REMOVED"]} prompt="C:\LAB> open" />
      </div>

      <BracketLink href="#then-now">Enter lab</BracketLink>
    </section>
  );
}

/* 02 — THEN / NOW -------------------------------------------------- */

export function ThenNow({ then, now }: { then?: LabFact; now?: LabFact }) {
  return (
    <section id="then-now" aria-label="Then and now" className="then-now scroll-mt-(--nav-h) bg-bg-raised">
      <div className="tn-sticky container-site flex flex-col justify-center gap-12 py-20">
        <div className="tn-stage">
          <div className="tn-old flex w-full flex-col items-center gap-8 text-center">
            <p className={`${giant} text-[clamp(1.7rem,3.6vw,3.4rem)]`}>Computers used to be rare.</p>
            <CrtMonitor lines={["LAB 2 — ONE MACHINE", "NEXT SLOT ....... 45 MIN"]} prompt="C:\> wait" />
            {then ? <Meta fact={then} /> : null}
          </div>
          <div className="tn-new flex w-full flex-col items-center gap-8 text-center">
            <p className={`${giant} text-[clamp(1.7rem,3.6vw,3.4rem)]`}>
              Now there&apos;s one in <span className="text-pulse">every pocket.</span>
            </p>
            <Phone />
            {now ? <Meta fact={now} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Tiny sourced metadata under a visual — the only “fact” on the screen. */
function Meta({ fact }: { fact: LabFact }) {
  return (
    <p className="font-mono text-[0.72rem] tracking-[0.12em] text-fg-muted uppercase">
      {fact.when} ·{" "}
      {fact.verification.sourceUrl ? (
        <a
          href={fact.verification.sourceUrl}
          target="_blank"
          rel="noreferrer"
          title={fact.verification.sourceName}
          className="underline underline-offset-2 hover:text-fg"
        >
          {fact.value ? `${fact.value} ${fact.label}` : fact.detail.replace(/\.$/, "")}
          <span className="sr-only"> — source: {fact.verification.sourceName} (opens in a new tab)</span>
        </a>
      ) : (
        fact.detail
      )}
    </p>
  );
}

function Phone() {
  return (
    <div aria-hidden className="relative h-[19rem] w-[10rem] rounded-[1.6rem] border-2 border-fg bg-bg p-2.5">
      <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-fg/80" />
      <div className="grid h-[calc(100%-1.5rem)] grid-cols-3 content-start gap-2 rounded-[1rem] bg-bg-sunken p-3">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={`aspect-square rounded-[0.55rem] ${i === 4 ? "bg-pulse" : i % 3 === 0 ? "bg-fg/80" : "bg-fg/25"}`} />
        ))}
      </div>
    </div>
  );
}

/* 03 — QUESTION ---------------------------------------------------- */

export function Question() {
  return (
    <section aria-labelledby="q-title" className={screen}>
      <h2 id="q-title" data-reveal="lines" className={`${giant} text-[clamp(2.4rem,6.2vw,6rem)]`}>
        <span className="line">
          <span>So what</span>
        </span>
        <span className="line" style={{ ["--line-index" as string]: 1 }}>
          <span>are you</span>
        </span>
        <span className="line" style={{ ["--line-index" as string]: 2 }}>
          <span>
            building?
            <span aria-hidden className="caret ml-[0.06em] inline-block h-[0.8em] w-[0.4em] translate-y-[0.05em] bg-pulse" />
          </span>
        </span>
      </h2>
    </section>
  );
}

/* 05 — JAM NIGHT --------------------------------------------------- */

export function JamNightScreen({ ritual }: { ritual: Ritual }) {
  const when = ritual.day && ritual.startTime ? `${ritual.day} / ${ritual.startTime}` : null;
  return (
    <section aria-labelledby="jam-title" className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      {/* Full-bleed documentary photo — or the shot list until one exists */}
      <Plate
        className="absolute inset-0 -z-10 [&>div]:h-full [&>div]:items-end [&>div]:justify-start [&>div]:p-6 [&>div]:pt-24"
        shot="Students building together at Jam Night — wide, real light"
      />
      <div className="container-site pt-40 pb-16">
        <div className="max-w-max bg-bg px-6 py-8 shadow-[0_18px_40px_-24px_rgb(28_27_24/0.5)] sm:px-10">
          <p className="font-mono text-[clamp(1rem,2.4vw,1.5rem)] font-bold tracking-[0.06em] uppercase">
            {when ?? (
              <>
                Day / time: <DataRequired what="Jam Night day and time" />
              </>
            )}
          </p>
          <h2 id="jam-title" className={`${giant} mt-3 text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.82]`}>
            Jam night
          </h2>
          <p className="mt-5 font-serif text-2xl italic">Bring something unfinished.</p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <BracketLink href={ritual.signupUrl ?? "/join#follow"}>Come build</BracketLink>
            {!when ? <span className="stamp stamp-in">Schedule pending</span> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 09 — FINAL ------------------------------------------------------- */

export function Final() {
  return (
    <section aria-labelledby="final-title" className={screen}>
      <h2 id="final-title" data-reveal="lines" className={`${giant} text-[clamp(2.1rem,5.4vw,5.25rem)]`}>
        <span className="line">
          <span>Make something</span>
        </span>
        <span className="line" style={{ ["--line-index" as string]: 1 }}>
          <span>
            worth remembering<span className="text-pulse">.</span>
          </span>
        </span>
      </h2>
      <p className="mt-8 font-mono text-sm tracking-[0.14em] text-fg-muted uppercase">The lab is open.</p>
      <div className="mt-8">
        <BracketLink href="/join">Join TechnoJam</BracketLink>
      </div>
    </section>
  );
}
