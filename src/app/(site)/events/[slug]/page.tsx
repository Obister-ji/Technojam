import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MODE_LABEL, PhaseStatus } from "@/components/events/EventRow";
import { RegisterLink } from "@/components/events/RegisterLink";
import { Gallery } from "@/components/ui/Gallery";
import { ExternalLink, Tag } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/PageHeader";
import { RichText } from "@/components/ui/RichText";
import { SourceNote } from "@/components/ui/SourceNote";
import { getEvent, getEvents } from "@/lib/content";
import { EVENT_TYPE_LABEL, eventPhase, formatDateRange, isPublishable } from "@/lib/content/derive";
import type { EventFigure, Speaker } from "@/lib/content/types";
import { JsonLd, breadcrumbJsonLd, eventJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  if (!event) return {};
  return pageMetadata({ title: event.title, description: event.shortDescription, path: `/events/${event.slug}` });
}

const FIGURE_LABEL: Record<EventFigure["kind"], string> = {
  actual: "Reported",
  target: "Target",
  registered: "Registered",
  reach: "Reach",
};

function People({ title, people }: { title: string; people: Speaker[] }) {
  if (!people.length) return null;
  return (
    <section aria-label={title} className="border-t border-line pt-8">
      <h2 className="label-mono text-fg-muted">{title}</h2>
      <ul className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {people.map((p) => (
          <li key={p.name}>
            <p className="text-xl font-semibold">{p.url ? <ExternalLink href={p.url}>{p.name}</ExternalLink> : p.name}</p>
            {p.affiliation ? <p className="text-fg-muted">{p.affiliation}</p> : null}
            {p.topic ? <p className="label-mono mt-1 text-fg-subtle normal-case tracking-normal">{p.topic}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  const phase = eventPhase(event);
  const figures = event.figures.filter((f) => isPublishable(f.verification));

  return (
    <article>
      <PageHeader
        crumbs={[{ label: "events", href: "/events" }, { label: event.slug, href: `/events/${event.slug}` }]}
        eyebrow={`${EVENT_TYPE_LABEL[event.type]} · ${formatDateRange(event.startDate, event.endDate)}`}
        title={event.title}
        intro={<p>{event.shortDescription}</p>}
        aside={
          <div className="grid gap-4">
            <PhaseStatus event={event} />
            {event.registrationUrl && (phase === "upcoming" || phase === "live") ? (
              <RegisterLink href={event.registrationUrl} slug={event.slug} />
            ) : null}
            {event.dexterixEdition ? (
              <Link href={`/dexterix/${event.dexterixEdition.slug}`} className="label-mono text-fg hover:text-pulse">
                Part of Dexterix → edition {event.dexterixEdition.edition}
              </Link>
            ) : null}
          </div>
        }
      />

      {event.heroImage ? (
        <div className="container-site">
          {/* eslint-disable-next-line @next/next/no-img-element -- Sanity CDN */}
          <img src={`${event.heroImage.url}?w=2000&auto=format`} alt={event.heroImage.alt} className="aspect-[21/9] w-full border border-line object-cover" />
        </div>
      ) : null}

      <div className="container-site grid gap-16 lg:grid-cols-12">
        <div className="grid gap-12 lg:col-span-8">
          <RichText value={event.body} />

          {event.highlights.length ? (
            <section aria-label="Highlights" className="border-t border-line pt-8">
              <h2 className="label-mono text-fg-muted">Highlights</h2>
              <ul className="mt-6 grid gap-3">
                {event.highlights.map((h) => (
                  <li key={h} className="flex gap-4 text-lg">
                    <span aria-hidden className="text-pulse">→</span>
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {event.agenda.length ? (
            <section aria-label="Agenda" className="border-t border-line pt-8">
              <h2 className="label-mono text-fg-muted">Agenda</h2>
              <ol className="mt-6 border-t border-line">
                {event.agenda.map((a, i) => (
                  <li key={i} className="grid grid-cols-[5rem_1fr] gap-4 border-b border-line py-4">
                    <span className="label-mono text-fg-subtle">{a.time ?? "—"}</span>
                    <span>
                      <span className="font-semibold">{a.title}</span>
                      {a.speaker ? <span className="text-fg-muted"> · {a.speaker}</span> : null}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <People title="Speakers" people={event.speakers} />
          <People title="Mentors" people={event.mentors} />
          <People title="Judges" people={event.judges} />

          {event.gallery?.images.length ? <Gallery gallery={event.gallery} /> : null}
        </div>

        <aside className="lg:col-span-4">
          <dl className="grid gap-px border border-line bg-line">
            {[
              ["When", formatDateRange(event.startDate, event.endDate)],
              ["Format", MODE_LABEL[event.mode]],
              ...(event.venue ? [["Where", event.venue]] : []),
              ["Type", EVENT_TYPE_LABEL[event.type]],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 bg-bg px-5 py-4">
                <dt className="label-mono text-fg-subtle">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>

          {figures.length ? (
            <dl className="mt-8 grid grid-cols-2 gap-6">
              {figures.map((f) => (
                <div key={f.label} className="border-t border-line pt-4">
                  <dt className="label-mono text-fg-muted">
                    {f.label}{" "}
                    <span className={f.kind === "target" ? "text-violet" : f.kind === "actual" ? "text-pulse" : "text-volt"}>
                      · {FIGURE_LABEL[f.kind]}
                    </span>
                  </dt>
                  <dd className="font-wide mt-2 text-4xl font-extrabold">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {event.topics.length ? (
            <div className="mt-8">
              <p className="label-mono text-fg-subtle">Topics</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {event.topics.map((t) => (
                  <li key={t}>
                    <Tag>{t}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {event.partners.length ? (
            <div className="mt-8">
              <p className="label-mono text-fg-subtle">With</p>
              <p className="mt-2 text-lg">{event.partners.join(" · ")}</p>
            </div>
          ) : null}

          {event.sponsors.length ? (
            <div className="mt-8">
              <p className="label-mono text-fg-subtle">Sponsors</p>
              <ul className="mt-2 grid gap-1">
                {event.sponsors.map((s) => (
                  <li key={s.name}>{s.url ? <ExternalLink href={s.url}>{s.name}</ExternalLink> : s.name}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {event.externalLinks.length ? (
            <div className="mt-8">
              <p className="label-mono text-fg-subtle">Links</p>
              <ul className="mt-3 grid gap-2">
                {event.externalLinks.map((l) => (
                  <li key={l.url}>
                    <ExternalLink href={l.url}>{l.label}</ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {event.relatedProjects.length ? (
            <div className="mt-8">
              <p className="label-mono text-fg-subtle">Related projects</p>
              <ul className="mt-3 grid gap-1">
                {event.relatedProjects.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className="hover:text-pulse">
                      {p.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <SourceNote verification={event.verification} className="mt-10" />
          {event.verification?.notes ? <p className="mt-2 text-sm text-fg-subtle">{event.verification.notes}</p> : null}
        </aside>
      </div>

      <JsonLd data={eventJsonLd(event)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Events", path: "/events" },
          { name: event.title, path: `/events/${event.slug}` },
        ])}
      />
    </article>
  );
}
