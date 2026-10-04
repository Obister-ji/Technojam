import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DexterixFigure } from "@/components/dexterix/Figure";
import { EmptyState, ExternalLink, Tag } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/PageHeader";
import { SourceNote } from "@/components/ui/SourceNote";
import { getDexterixEdition, getDexterixEditions } from "@/lib/content";
import { formatDateRange, isPublishable } from "@/lib/content/derive";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getDexterixEditions()).filter((e) => isPublishable(e.verification)).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/dexterix/[slug]">): Promise<Metadata> {
  const e = await getDexterixEdition((await params).slug);
  if (!e) return {};
  return pageMetadata({ title: e.title, description: e.summary, path: `/dexterix/${e.slug}` });
}

const FORMAT = { "in-person": "On campus", online: "Online", hybrid: "Hybrid — on campus & online" } as const;

export default async function EditionPage({ params }: PageProps<"/dexterix/[slug]">) {
  const { slug } = await params;
  const [e, all] = await Promise.all([getDexterixEdition(slug), getDexterixEditions()]);
  if (!e || !isPublishable(e.verification)) notFound();
  const published = all.filter((x) => isPublishable(x.verification)).sort((a, b) => a.year - b.year);
  const idx = published.findIndex((x) => x.slug === e.slug);
  const prev = published[idx - 1];
  const next = published[idx + 1];

  return (
    <article>
      <PageHeader
        crumbs={[{ label: "dexterix", href: "/dexterix" }, { label: e.slug, href: `/dexterix/${e.slug}` }]}
        eyebrow={`Dexterix · ${e.startDate ? formatDateRange(e.startDate, e.endDate) : e.year}`}
        title={e.edition === "1.0" ? "Dexterix\nthe origin" : e.title}
        intro={
          <>
            {e.tagline ? <p className="font-semibold text-fg">“{e.tagline}”</p> : null}
            <p className={e.tagline ? "mt-3" : ""}>{e.summary}</p>
          </>
        }
        aside={
          e.microsite ? (
            <p>
              <ExternalLink href={e.microsite}>Edition microsite</ExternalLink>
            </p>
          ) : null
        }
      />

      <div className="container-site grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
            <DexterixFigure size="lg" label="Participants" actual={e.participantsActual} target={e.participantsTarget} />
            <DexterixFigure size="lg" label="Institutions" actual={e.institutionsActual} target={e.institutionsTarget} />
            {e.durationHours ? (
              <div className="border-t border-line pt-4">
                <dt className="label-mono text-fg-muted">Duration</dt>
                <dd className="font-wide mt-2 text-5xl font-extrabold md:text-6xl">{e.durationHours}h</dd>
                {e.durationNote ? <p className="mt-1 text-sm text-fg-subtle">{e.durationNote}</p> : null}
              </div>
            ) : null}
            {e.themes.length > 1 ? (
              <div className="border-t border-line pt-4">
                <dt className="label-mono text-fg-muted">Domains</dt>
                <dd className="font-wide mt-2 text-5xl font-extrabold md:text-6xl">{e.themes.length}</dd>
              </div>
            ) : null}
          </dl>

          {e.themes.length ? (
            <section aria-label="Themes" className="mt-16 border-t border-line pt-8">
              <h2 className="label-mono text-fg-muted">{e.themes.length > 1 ? "Domains & themes" : "Theme"}</h2>
              <ol className="mt-6 grid gap-x-8 sm:grid-cols-2">
                {e.themes.map((t, i) => (
                  <li key={t} className="flex gap-4 border-b border-line py-3">
                    <span className="label-mono w-6 text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {e.prizes.length ? (
            <section aria-label="Prizes" className="mt-16 border-t border-line pt-8">
              <h2 className="label-mono text-fg-muted">Prizes</h2>
              <ul className="mt-6 grid gap-px bg-line sm:grid-cols-2">
                {e.prizes.map((p) => (
                  <li key={p.label} className="flex items-baseline justify-between gap-4 bg-bg py-4 pr-4">
                    <span className="text-fg-muted">{p.label}</span>
                    <span className="font-wide text-2xl font-extrabold">{p.amount}</span>
                  </li>
                ))}
              </ul>
              {e.prizeNote ? <p className="mt-3 text-sm text-fg-subtle">{e.prizeNote}</p> : null}
            </section>
          ) : null}

          <section aria-label="Results" className="mt-16 border-t border-line pt-8">
            <h2 className="label-mono text-fg-muted">Winners</h2>
            <div className="mt-6">
              {e.winners.length ? (
                <ol className="grid gap-4">
                  {e.winners.map((w) => (
                    <li key={w.team} className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
                      <span className="text-xl font-semibold">{w.url ? <ExternalLink href={w.url}>{w.team}</ExternalLink> : w.team}</span>
                      <span className="text-fg-muted">
                        {w.project}
                        {w.prize ? ` · ${w.prize}` : ""}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <EmptyState title="Results haven't been published in a source we can verify.">
                  If you were there — or have the official results post — send it to the team and it&apos;ll go up here with its source.
                </EmptyState>
              )}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <dl className="grid gap-px border border-line bg-line">
            {[
              ["Edition", e.edition],
              ["Year", String(e.year)],
              ...(e.startDate ? [["Dates", formatDateRange(e.startDate, e.endDate)]] : []),
              ...(e.format ? [["Format", FORMAT[e.format]]] : []),
              ...(e.venue ? [["Venue", e.venue]] : []),
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 bg-bg px-5 py-4">
                <dt className="label-mono text-fg-subtle">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>

          {e.tracks.length ? (
            <div className="mt-8">
              <p className="label-mono text-fg-subtle">Tracks</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {e.tracks.map((t) => (
                  <li key={t}>
                    <Tag>{t}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {e.judgesNote ? <p className="mt-8 text-fg-muted">{e.judgesNote}</p> : null}

          {e.links.length || e.event ? (
            <div className="mt-8">
              <p className="label-mono text-fg-subtle">Links</p>
              <ul className="mt-3 grid gap-2">
                {e.event ? (
                  <li>
                    <Link href={`/events/${e.event.slug}`} className="underline decoration-line-strong underline-offset-4 hover:decoration-pulse">
                      Event page
                    </Link>
                  </li>
                ) : null}
                {e.links.map((l) => (
                  <li key={l.url}>
                    <ExternalLink href={l.url}>{l.label}</ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <SourceNote verification={e.verification} className="mt-10" />
          {e.verification?.notes ? <p className="mt-2 text-sm text-fg-subtle">{e.verification.notes}</p> : null}
        </aside>
      </div>

      <nav aria-label="Editions" className="container-site mt-24 grid grid-cols-2 gap-4 border-t border-line pt-8">
        {prev ? (
          <Link href={`/dexterix/${prev.slug}`} className="group">
            <span className="label-mono text-fg-subtle">← Previous</span>
            <span className="font-wide mt-2 block text-2xl font-extrabold uppercase group-hover:text-pulse">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/dexterix/${next.slug}`} className="group text-right">
            <span className="label-mono text-fg-subtle">Next →</span>
            <span className="font-wide mt-2 block text-2xl font-extrabold uppercase group-hover:text-pulse">{next.title}</span>
          </Link>
        ) : null}
      </nav>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Dexterix", path: "/dexterix" },
          { name: e.title, path: `/dexterix/${e.slug}` },
        ])}
      />
    </article>
  );
}
