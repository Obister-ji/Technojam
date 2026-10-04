import Link from "next/link";
import type { TJEvent } from "@/lib/content/types";
import { EVENT_TYPE_LABEL, eventPhase, formatDateRange, formatStamp } from "@/lib/content/derive";
import { ArrowRight } from "@/components/ui/Icon";
import { Status } from "@/components/ui/primitives";

const MODE_LABEL = { "in-person": "In person", online: "Online", hybrid: "Hybrid" } as const;

export function PhaseStatus({ event }: { event: TJEvent }) {
  const phase = eventPhase(event);
  if (phase === "live") return <Status tone="pulse" live>Happening now</Status>;
  if (phase === "upcoming") return <Status tone="volt">Upcoming</Status>;
  if (phase === "cancelled") return <Status tone="muted">Cancelled</Status>;
  if (phase === "postponed") return <Status tone="muted">Postponed</Status>;
  return <Status tone="muted">Past</Status>;
}

/** Editorial list row — compact on phones, a four-column ledger on desktop. */
export function EventRow({ event }: { event: TJEvent }) {
  return (
    <li className="group relative border-b border-line">
      <div className="grid gap-x-6 gap-y-2 py-6 md:grid-cols-12 md:items-baseline">
        <p className="label-mono text-fg-muted md:col-span-2">
          <time dateTime={event.startDate}>{formatStamp(event.startDate)}</time>
        </p>
        <div className="md:col-span-6">
          <h3 className="text-xl font-bold tracking-tight transition-colors group-hover:text-pulse md:text-2xl">
            <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0">
              {event.title}
            </Link>
          </h3>
          <p className="mt-1.5 max-w-xl text-fg-muted">{event.shortDescription}</p>
        </div>
        <p className="label-mono text-fg-subtle md:col-span-2">
          {EVENT_TYPE_LABEL[event.type]} · {MODE_LABEL[event.mode]}
        </p>
        <div className="flex items-center justify-between md:col-span-2 md:justify-end md:gap-4">
          <PhaseStatus event={event} />
          <ArrowRight className="text-fg-subtle transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg" />
        </div>
      </div>
    </li>
  );
}

/** Larger card used for upcoming/featured events. */
export function EventCard({ event }: { event: TJEvent }) {
  return (
    <article className="group relative flex h-full flex-col justify-between gap-10 border border-line bg-bg-raised p-6 transition-colors hover:border-line-strong md:p-8">
      <div className="flex items-center justify-between gap-4">
        <PhaseStatus event={event} />
        <span className="label-mono text-fg-subtle">{EVENT_TYPE_LABEL[event.type]}</span>
      </div>
      <div>
        <p className="label-mono text-fg-muted">
          <time dateTime={event.startDate}>{formatDateRange(event.startDate, event.endDate)}</time>
          {event.venue ? ` · ${event.venue}` : ` · ${MODE_LABEL[event.mode]}`}
        </p>
        <h3 className="font-wide mt-3 text-3xl leading-none font-extrabold tracking-tight uppercase md:text-4xl">
          <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0">
            {event.title}
          </Link>
        </h3>
        <p className="mt-4 max-w-md text-fg-muted">{event.shortDescription}</p>
      </div>
      <span className="label-mono inline-flex items-center gap-2 text-fg">
        Details <ArrowRight className="transition-transform group-hover:translate-x-1" />
      </span>
    </article>
  );
}

export { MODE_LABEL };
