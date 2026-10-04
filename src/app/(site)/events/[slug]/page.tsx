import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MODE_LABEL, PhaseStatus } from "@/components/events/EventRow";
import { RegisterLink } from "@/components/events/RegisterLink";
import { Gallery } from "@/components/ui/Gallery";
import { ExternalLink } from "@/components/ui/primitives";
import { MoreDetails } from "@/components/ui/MoreDetails";
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
            {p.topic ? <p className="mt-1 label-mono tracking-normal text-fg-subtle normal-case">{p.topic}</p> : null}
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
        crumbs={[
          { label: "events", href: "/events" },
          { label: event.slug, href: `/events/${event.slug}` },
        ]}
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
          <img
            src={`${event.heroImage.url}?w=2000&auto=format`}
            alt={event.heroImage.alt}
            className="aspect-[21/9] w-full border border-line object-cover"
          />
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
                    <span aria-hidden className="text-pulse">
                      →
                    </span>
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
          <dl className="grid gap-4">
            {[
              ["When", formatDateRange(event.startDate, event.endDate)],
              ["Where", event.venue ?? MODE_LABEL[event.mode]],
              ...(event.venue ? [["Format", MODE_LABEL[event.mode]]] : []),
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-fg-subtle">{k}</dt>
                <dd className="mt-0.5 text-lg">{v}</dd>
              </div>
            ))}
          </dl>

          {event.externalLinks.length ? (
            <ul className="mt-8 grid gap-2">
              {event.externalLinks.map((l) => (
                <li key={l.url}>
                  <ExternalLink href={l.url}>{l.label}</ExternalLink>
                </li>
              ))}
            </ul>
          ) : null}

          <MoreDetails>
            {figures.length ? (
              <dl className="grid grid-cols-2 gap-6">
                {figures.map((f) => (
                  <div key={f.label}>
                    <dt className="text-sm text-fg-muted">
                      {f.label} <span className="text-fg-subtle">· {FIGURE_LABEL[f.kind]}</span>
                    </dt>
                    <dd className="mt-1 text-3xl font-extrabold font-wide">{f.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {event.topics.length ? <p className="text-fg-muted">Topics: {event.topics.join(" · ")}</p> : null}
            {event.partners.length ? <p className="text-fg-muted">With {event.partners.join(" · ")}</p> : null}
            {event.sponsors.length ? (
              <p className="text-fg-muted">
                Sponsors:{" "}
                {event.sponsors.map((s, i) => (
                  <span key={s.name}>
                    {i ? " · " : ""}
                    {s.url ? <ExternalLink href={s.url}>{s.name}</ExternalLink> : s.name}
                  </span>
                ))}
              </p>
            ) : null}
            {event.relatedProjects.length ? (
              <ul className="grid gap-1">
                {event.relatedProjects.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className="hover:text-pulse">
                      {p.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <div>
              <SourceNote verification={event.verification} />
              {event.verification?.notes ? <p className="mt-2 text-sm text-fg-subtle">{event.verification.notes}</p> : null}
            </div>
          </MoreDetails>
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
