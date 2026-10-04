import { EventList } from "@/components/events/EventList";
import { EventCard } from "@/components/events/EventRow";
import { EmptyState, ExternalLink } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/PageHeader";
import { getEventsByPhase, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Events",
  description:
    "TechnoJam hackathons, workshops, sessions and community collaborations — upcoming and past, from Dexterix to Build With AI.",
  path: "/events",
});

export default async function EventsPage() {
  const [{ upcoming, past }, settings] = await Promise.all([getEventsByPhase(), getSiteSettings()]);
  const commudle = settings.socials.find((s) => s.platform === "commudle");
  const instagram = settings.socials.find((s) => s.platform === "instagram");

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title={"Show up.\nBuild."}
        intro={<p>Hackathons, workshops, talks and collaborations — run by students, open to anyone curious enough to turn up.</p>}
      />

      <section aria-labelledby="upcoming-title" className="container-site">
        <h2 id="upcoming-title" className="label-mono text-fg-muted">
          Upcoming
        </h2>
        <div className="mt-6">
          {upcoming.length ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {upcoming.map((e) => (
                <li key={e.slug}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No upcoming events are announced right now.">
              Events are announced first on {commudle ? <ExternalLink href={commudle.url}>Commudle</ExternalLink> : "Commudle"}
              {instagram ? (
                <>
                  {" "}
                  and <ExternalLink href={instagram.url}>Instagram</ExternalLink>
                </>
              ) : null}
              , and appear here once they&apos;re confirmed.
            </EmptyState>
          )}
        </div>
      </section>

      <section aria-labelledby="past-title" className="container-site mt-28">
        <h2 id="past-title" className="text-headline font-black tracking-[-0.03em] uppercase font-wide">
          Past events
        </h2>
        <div className="mt-8">
          <EventList events={past} />
        </div>
      </section>
    </>
  );
}
