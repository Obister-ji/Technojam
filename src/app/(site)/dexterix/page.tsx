import Link from "next/link";
import { DexterixFigure } from "@/components/dexterix/Figure";
import { DexterixTimeline } from "@/components/dexterix/DexterixTimeline";
import { ArrowRight } from "@/components/ui/Icon";
import { ButtonLink, Eyebrow } from "@/components/ui/primitives";
import { getDexterixEditions } from "@/lib/content";
import { formatDateRange, isPublishable } from "@/lib/content/derive";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Dexterix — TechnoJam's flagship hackathon",
  description: "Dexterix is TechnoJam and Galgotias University's flagship hackathon series — from 2018 to the 36-hour Dexterix 5.0 in 2026.",
  path: "/dexterix",
});

export default async function DexterixPage() {
  const editions = (await getDexterixEditions()).filter((e) => isPublishable(e.verification));
  const latest = editions[0];
  const first = Math.min(...editions.map((e) => e.year));

  return (
    <>
      <header className="relative isolate overflow-hidden bg-bg-sunken pt-[calc(var(--nav-h)+4rem)] pb-24 md:pb-32">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_85%_10%,color-mix(in_oklab,var(--color-violet)_26%,transparent),transparent_70%),radial-gradient(50%_50%_at_0%_100%,color-mix(in_oklab,var(--color-pulse)_18%,transparent),transparent_70%)]" />
        <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="container-site">
          <Eyebrow>TechnoJam × Galgotias University · since {first}</Eyebrow>
          <h1 className="rise-lines font-wide mt-8 text-[clamp(3rem,12.6vw,14rem)] leading-[0.8] font-black tracking-[-0.05em] uppercase">
            <span className="line">
              <span className="text-spectrum">Dexterix</span>
            </span>
          </h1>
          <div className="mt-12 grid gap-10 md:grid-cols-12">
            <p className="rise text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug font-medium md:col-span-7" style={{ ["--rise-delay" as string]: "200ms" }}>
              The flagship hackathon. Teams arrive with nothing but a problem statement and leave with something that runs — after 12, 24 or 36
              hours of building.
            </p>
            {latest ? (
              <div className="rise md:col-span-4 md:col-start-9" style={{ ["--rise-delay" as string]: "300ms" }}>
                <p className="label-mono text-fg-muted">Latest edition</p>
                <p className="font-wide mt-2 text-3xl font-extrabold uppercase">{latest.title}</p>
                <p className="mt-1 text-fg-muted">{latest.startDate ? formatDateRange(latest.startDate, latest.endDate) : latest.year}</p>
                <div className="mt-5">
                  <ButtonLink href={`/dexterix/${latest.slug}`}>See {latest.edition}</ButtonLink>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <section aria-labelledby="editions-title" className="container-site py-24">
        <h2 id="editions-title" className="label-mono text-fg-muted">
          The editions
        </h2>
        <div className="mt-10">
          <DexterixTimeline editions={editions} />
        </div>
      </section>

      <section aria-label="Edition ledger" className="container-site">
        <ol className="border-t border-line">
          {editions.map((e) => (
            <li key={e.slug} className="group relative grid gap-6 border-b border-line py-10 md:grid-cols-12">
              <p className="font-wide text-6xl font-black tracking-tight text-fg-subtle transition-colors group-hover:text-pulse md:col-span-2">
                {e.year}
              </p>
              <div className="md:col-span-5">
                <h3 className="text-2xl font-bold">
                  <Link href={`/dexterix/${e.slug}`} className="after:absolute after:inset-0">
                    {e.title}
                  </Link>
                </h3>
                <p className="mt-2 text-fg-muted">{e.summary}</p>
                {e.themes.length ? (
                  <p className="label-mono mt-4 text-fg-subtle normal-case tracking-normal">
                    {e.themes.length} {e.themes.length === 1 ? "theme" : "themes"}: {e.themes.slice(0, 4).join(" · ")}
                    {e.themes.length > 4 ? " …" : ""}
                  </p>
                ) : null}
              </div>
              <dl className="grid grid-cols-2 gap-6 md:col-span-4 md:col-start-9">
                <DexterixFigure label="Participants" actual={e.participantsActual} target={e.participantsTarget} />
                <DexterixFigure label="Institutions" actual={e.institutionsActual} target={e.institutionsTarget} />
              </dl>
              <ArrowRight aria-hidden className="absolute top-10 right-0 text-fg-subtle transition-transform group-hover:translate-x-1" />
            </li>
          ))}
        </ol>
        <p className="label-mono mt-8 max-w-2xl text-fg-subtle normal-case tracking-normal">
          Numbers are shown only with a source. “Reported” = published after the event; “Target” = announced before it. Missing numbers
          haven&apos;t been verified yet — not forgotten.
        </p>
      </section>

      <section aria-labelledby="dx-collab" className="container-site mt-32">
        <div className="grid gap-8 border border-line-strong p-6 sm:p-10 md:grid-cols-12 md:items-end md:p-16">
          <div className="md:col-span-7">
            <p className="label-mono text-pulse">Next edition</p>
            <h2 id="dx-collab" className="font-wide mt-4 text-headline font-black tracking-[-0.03em] uppercase">
              Mentor, judge or sponsor Dexterix.
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-lg text-fg-muted">
              Every edition runs on people who show up for the builders: mentors at 3 a.m., judges with sharp questions, partners who make it
              possible.
            </p>
            <div className="mt-6">
              <ButtonLink href="/collaborate?intent=sponsor-dexterix">Get involved</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
