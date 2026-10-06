import type { LabFact } from "@/lib/content/types";
import { BracketLink, ChapterHead, Cite, DOC_ID } from "./furniture";

/* ------------------------------------------------------------------ */
/* CH.00 — BOOT                                                        */
/* ------------------------------------------------------------------ */

export function Boot({ institution }: { institution: string }) {
  return (
    <section aria-labelledby="boot-title" className="container-site flex min-h-[100svh] flex-col pt-[calc(var(--nav-h)+1.5rem)] pb-10">
      <dl className="grid grid-cols-2 gap-x-8 gap-y-1 font-mono text-[0.72rem] tracking-[0.12em] uppercase sm:flex sm:flex-wrap sm:gap-x-10">
        {[
          ["", "TechnoJam — technical society, SCSE"],
          ["", `${institution} / NCR`],
          ["DOC", DOC_ID],
          ["STATUS", "ACTIVE"],
        ].map(([k, v]) => (
          <div key={v} className="flex gap-2">
            {k ? <dt className="text-fg-muted">{k}:</dt> : null}
            <dd className={v === "ACTIVE" ? "text-volt" : undefined}>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-1 flex-col justify-center gap-14 py-16 lg:flex-row lg:items-center lg:justify-between">
        <h1
          id="boot-title"
          className="rise-lines max-w-[19ch] text-[clamp(2.3rem,5.4vw,5.6rem)] leading-[0.94] font-black tracking-[-0.035em] uppercase font-wide"
        >
          <span className="sr-only">TechnoJam: </span>
          <span className="line" style={{ ["--line-index" as string]: 0 }}>
            <span>Every generation</span>
          </span>
          <span className="line" style={{ ["--line-index" as string]: 1 }}>
            <span>gets a machine.</span>
          </span>
          <span className="line mt-[0.18em] text-fg-muted" style={{ ["--line-index" as string]: 2 }}>
            <span>What will ours</span>
          </span>
          <span className="line text-fg-muted" style={{ ["--line-index" as string]: 3 }}>
            <span>
              do with it?
              <span aria-hidden className="caret ml-[0.08em] inline-block h-[0.82em] w-[0.42em] translate-y-[0.06em] bg-pulse" />
            </span>
          </span>
        </h1>

        <Crt />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <BracketLink href="#ch-01">Enter the lab</BracketLink>
        <p className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-muted uppercase">28.4° N · 77.5° E — scroll ↓</p>
      </div>
    </section>
  );
}

/** A beige workstation drawn in CSS. Powers on once. */
function Crt() {
  return (
    <div aria-hidden className="mx-auto w-full max-w-[19rem] shrink-0 lg:mx-0">
      <div className="rounded-[14px] border border-fg/25 bg-bg-sunken p-4 shadow-[inset_0_-6px_0_rgb(28_27_24/0.08)]">
        <div className="crt crt-on relative aspect-[4/3] overflow-hidden rounded-[22px/18px] p-4 font-mono text-[0.72rem] leading-relaxed shadow-[inset_0_0_40px_rgb(0_0_0/0.6)]">
          <p className="text-phosphor">TECHNOJAM BIOS v2.026</p>
          <p className="text-fg-muted">MEM CHECK ........ OK</p>
          <p className="text-fg-muted">PEOPLE ........... FOUND</p>
          <p className="text-fg-muted">IDEAS ............ UNFINISHED</p>
          <p className="mt-2 text-phosphor">
            C:\LAB&gt; build
            <span className="caret ml-0.5 inline-block h-3 w-2 translate-y-0.5 bg-phosphor" />
          </p>
          <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/0.035)_0_1px,transparent_1px_3px)]" />
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

/* ------------------------------------------------------------------ */
/* CH.01 — ACCESS                                                      */
/* ------------------------------------------------------------------ */

export function Access({ fact }: { fact?: LabFact }) {
  return (
    <section id="ch-01" aria-labelledby="access-title" className="container-site scroll-mt-(--nav-h) py-24 md:py-36">
      <ChapterHead n={1} title="Access" />
      <div className="mt-14 grid items-center gap-14 lg:grid-cols-12">
        <h2
          id="access-title"
          data-reveal="lines"
          className="text-[clamp(2rem,4.6vw,4.25rem)] leading-[0.98] font-black tracking-[-0.03em] uppercase font-wide lg:col-span-7"
        >
          <span className="line" style={{ ["--line-index" as string]: 0 }}>
            <span>There was a time</span>
          </span>
          <span className="line" style={{ ["--line-index" as string]: 1 }}>
            <span>when computer time</span>
          </span>
          <span className="line" style={{ ["--line-index" as string]: 2 }}>
            <span>was something</span>
          </span>
          <span className="line text-pulse" style={{ ["--line-index" as string]: 3 }}>
            <span>you waited for.</span>
          </span>
        </h2>

        {/* A dot-matrix lab register — an illustration of the era, not a real record */}
        <figure data-reveal className="lg:col-span-5">
          <div className="perforated greenbar border border-fg/20 bg-bg py-6 font-mono text-[0.78rem]">
            <p className="text-center tracking-[0.2em]">COMPUTER LAB — MACHINE TIME REGISTER</p>
            <p className="mt-1 text-center text-[0.68rem] text-fg-muted">ONE MACHINE · ONE SLOT · SIGN BEFORE USE</p>
            <table className="mt-5 w-full">
              <thead>
                <tr className="text-left text-fg-muted">
                  <th className="pb-1 font-normal">SLOT</th>
                  <th className="pb-1 font-normal">PC</th>
                  <th className="pb-1 font-normal">NAME</th>
                </tr>
              </thead>
              <tbody>
                {["09:00", "09:45", "10:30", "11:15", "12:00"].map((t, i) => (
                  <tr key={t}>
                    <td className="py-[0.42rem]">{t}</td>
                    <td>0{(i % 4) + 1}</td>
                    <td className="w-1/2 border-b border-dotted border-fg/40" />
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-center text-[0.62rem] tracking-[0.14em] text-fg-subtle">ILLUSTRATION — AN ERA, NOT A RECORD</p>
          </div>
          {fact ? (
            <figcaption className="mt-4 max-w-md">
              <p className="font-serif text-lg leading-snug">
                <span className="font-mono text-[0.75rem] tracking-[0.1em] text-fg-muted">{fact.when} — </span>
                {fact.detail}
              </p>
              <p className="mt-1">
                <Cite name={fact.verification.sourceName ?? "source"} url={fact.verification.sourceUrl} />
              </p>
            </figcaption>
          ) : null}
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CH.02 — CONNECTION                                                  */
/* ------------------------------------------------------------------ */

export function Connection({ timeline }: { timeline: LabFact[] }) {
  return (
    <section aria-labelledby="connection-title" className="bg-bg-raised py-24 md:py-36">
      <div className="container-site">
        <ChapterHead n={2} title="Connection" />
        <h2 id="connection-title" className="sr-only">
          Connection: from computer labs to a connected India
        </h2>
      </div>

      <div className="mt-16 [scrollbar-width:thin] overflow-x-auto pb-6">
        <ol className="relative container-site grid min-w-[52rem] auto-cols-fr grid-flow-col gap-8">
          {/* The cable — draws itself as you scroll */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-x-(--gutter) top-[2.15rem] h-6 w-[calc(100%-2*var(--gutter))]"
            viewBox="0 0 1000 24"
            preserveAspectRatio="none"
          >
            <path
              className="cable-path"
              pathLength={1}
              d="M0 12 C 120 2, 200 22, 330 12 S 560 2, 670 12 S 880 22, 1000 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {timeline.map((t) => (
            <li key={t.when} className="relative">
              <p className={`font-mono text-[0.75rem] tracking-[0.12em] uppercase ${t.ours ? "text-pulse" : "text-fg-muted"}`}>{t.when}</p>
              <span
                aria-hidden
                className={`relative z-10 mt-3 block size-3.5 rounded-full border-2 ${t.ours ? "border-pulse bg-pulse" : "border-fg bg-bg-raised"}`}
              />
              <h3 className="mt-6 text-lg font-bold">
                {t.label}
                {t.ours ? <span className="stamp ml-3 align-middle text-[0.62rem]">TJ</span> : null}
              </h3>
              <p className="mt-2 max-w-[22rem] font-serif text-[1.05rem] leading-snug text-fg-muted">{t.detail}</p>
              <p className="mt-2">
                <Cite name={t.verification.sourceName ?? "source"} url={t.verification.sourceUrl} />
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="container-site mt-16">
        <p
          data-reveal="lines"
          className="max-w-[24ch] text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.02] font-black tracking-[-0.02em] uppercase font-wide"
        >
          <span className="line" style={{ ["--line-index" as string]: 0 }}>
            <span>A network once felt like the future.</span>
          </span>
          <span className="line text-fg-muted" style={{ ["--line-index" as string]: 1 }}>
            <span>Now it is the background of daily life.</span>
          </span>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CH.03 — INFRASTRUCTURE                                              */
/* ------------------------------------------------------------------ */

export function Infrastructure({ stats }: { stats: LabFact[] }) {
  return (
    <section aria-labelledby="infra-title" className="container-site py-24 md:py-36">
      <ChapterHead n={3} title="Infrastructure" />

      {/* CRT → cable → phone: the same signal, a different object */}
      <svg aria-hidden viewBox="0 0 900 180" className="mt-14 h-auto w-full max-w-4xl text-fg">
        <rect x="10" y="30" width="170" height="125" rx="14" fill="var(--color-bg-sunken)" stroke="currentColor" strokeOpacity="0.4" />
        <rect x="28" y="46" width="134" height="90" rx="16" fill="var(--color-crt)" />
        <text x="40" y="78" fill="var(--color-phosphor)" fontFamily="var(--font-mono)" fontSize="11">
          C:\&gt; dial
        </text>
        <text x="40" y="96" fill="var(--color-phosphor)" fontFamily="var(--font-mono)" fontSize="11" opacity="0.7">
          9.6 kbit/s
        </text>
        <path
          className="cable-path"
          pathLength={1}
          d="M180 110 C 300 170, 380 30, 500 95 S 650 160, 735 95"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect x="738" y="10" width="92" height="165" rx="16" fill="var(--color-bg)" stroke="currentColor" strokeWidth="2" />
        <rect x="750" y="28" width="68" height="120" rx="6" fill="var(--color-bg-raised)" />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={758 + (i % 2) * 30}
            y={40 + Math.floor(i / 2) * 32}
            width="22"
            height="22"
            rx="5"
            fill="currentColor"
            opacity={i === 3 ? 0.9 : 0.25}
          />
        ))}
        <rect x="758" y="110" width="52" height="8" rx="4" fill="var(--color-pulse)" />
      </svg>

      <dl className="mt-16 grid gap-12 md:grid-cols-2">
        {stats.slice(0, 2).map((s) => (
          <div key={s.label} data-reveal className="border-t border-fg pt-4">
            <dt className="font-mono text-[0.72rem] tracking-[0.12em] text-fg-muted uppercase">{s.when}</dt>
            <dd>
              <span className="block text-[clamp(2.6rem,6.4vw,5.75rem)] leading-none font-black tracking-[-0.04em] whitespace-nowrap font-wide">
                {s.value}
              </span>
              <span className="mt-2 block font-serif text-xl">{s.label}</span>
              <span className="mt-1 block text-fg-muted">{s.detail}</span>
              <span className="mt-2 block">
                <Cite name={s.verification.sourceName ?? "source"} url={s.verification.sourceUrl} />
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <h2
        id="infra-title"
        data-reveal="lines"
        className="mt-28 max-w-[22ch] text-[clamp(1.45rem,5vw,4.75rem)] leading-[0.95] font-black tracking-[-0.03em] uppercase font-wide"
      >
        <span className="line" style={{ ["--line-index" as string]: 0 }}>
          <span>When technology becomes ordinary,</span>
        </span>
        <span className="line text-pulse" style={{ ["--line-index" as string]: 1 }}>
          <span>understanding it becomes extraordinary.</span>
        </span>
      </h2>
    </section>
  );
}
