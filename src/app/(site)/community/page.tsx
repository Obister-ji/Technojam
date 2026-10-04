import Link from "next/link";
import { SOCIAL_ICON } from "@/components/ui/Icon";
import { ArrowRight } from "@/components/ui/Icon";
import { EmptyState, Eyebrow, ExternalLink, Lines } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/PageHeader";
import { getEvents, getMetrics, getPartners, getProjects, getSiteSettings } from "@/lib/content";
import { isPublishable } from "@/lib/content/derive";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Community",
  description: "Peer learning, open source, collaborations and the channels where the TechnoJam community actually talks.",
  path: "/community",
});

export default async function CommunityPage() {
  const [settings, events, projects, partners, metrics] = await Promise.all([
    getSiteSettings(),
    getEvents(),
    getProjects(),
    getPartners(),
    getMetrics(),
  ]);
  const sessions = events.filter((e) => ["session", "workshop"].includes(e.type)).slice(0, 4);
  const collabs = events.filter((e) => e.type === "collaboration" || e.partners.length).slice(0, 4);
  const openSource = projects.filter((p) => /hacktoberfest|algorithms|roadmap|tasks/i.test(`${p.title} ${p.summary}`)).slice(0, 4);
  const commudle = metrics.find((m) => m.label.toLowerCase().includes("commudle"));

  const pillars = [
    {
      title: "Peer learning",
      body: "Sessions run by members for members, plus speakers from industry and communities when we can get them.",
      items: sessions.map((e) => ({ label: e.title, href: `/events/${e.slug}`, meta: e.startDate.slice(0, 4) })),
    },
    {
      title: "Open source",
      body: "Hacktoberfest on-ramps, a community algorithms repo, roadmaps — and recruitment tasks published in the open.",
      items: openSource.map((p) => ({ label: p.title, href: `/projects/${p.slug}`, meta: String(p.year) })),
    },
    {
      title: "Collaboration",
      body: "We build with other communities and clubs — on campus and well beyond it.",
      items: collabs.map((e) => ({ label: e.title, href: `/events/${e.slug}`, meta: e.partners[0] ?? e.startDate.slice(0, 4) })),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title={"Built by students.\nPowered by curiosity."}
        intro={
          <p>
            The best part of TechnoJam isn&apos;t a workshop or a hackathon. It&apos;s the person a year ahead of you who explains the thing
            you were stuck on — and the moment a year later when you do it for someone else.
          </p>
        }
        aside={
          commudle ? (
            <div className="border-l border-line pl-5">
              <p className="font-wide text-5xl font-extrabold">{commudle.value.toLocaleString("en-IN")}</p>
              <p className="mt-1 text-fg-muted">members on Commudle</p>
              <p className="label-mono mt-2 text-fg-subtle normal-case tracking-normal">as of {commudle.asOf}</p>
            </div>
          ) : null
        }
      />

      <section aria-label="Pillars" className="container-site">
        <ol className="grid gap-px bg-line lg:grid-cols-3">
          {pillars.map((p, i) => (
            <li key={p.title} className="flex flex-col bg-bg p-6 md:p-8">
              <p className="label-mono text-pulse">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="font-wide mt-6 text-3xl font-extrabold uppercase">{p.title}</h2>
              <p className="mt-3 text-fg-muted">{p.body}</p>
              <ul className="mt-8 border-t border-line">
                {p.items.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} className="group flex items-baseline justify-between gap-4 border-b border-line py-3">
                      <span className="group-hover:text-pulse">{it.label}</span>
                      <span className="label-mono shrink-0 text-fg-subtle">{it.meta}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="partners-title" className="container-site py-28 md:py-36">
        <Eyebrow index="01">Partners & platforms</Eyebrow>
        <h2 id="partners-title" data-reveal="lines" className="font-wide mt-6 text-headline font-black tracking-[-0.03em] uppercase">
          <Lines text={"Who we've\nbuilt with."} />
        </h2>
        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {partners
            .filter((p) => isPublishable(p.verification))
            .map((p) => (
              <li key={p.name} className="bg-bg p-6">
                <p className="label-mono text-fg-subtle">{p.kind}</p>
                <p className="mt-3 text-xl font-bold">{p.url ? <ExternalLink href={p.url}>{p.name}</ExternalLink> : p.name}</p>
                {p.description ? <p className="mt-2 text-fg-muted">{p.description}</p> : null}
              </li>
            ))}
        </ul>
      </section>

      <section aria-labelledby="stories-title" className="container-site">
        <Eyebrow index="02">Member stories</Eyebrow>
        <h2 id="stories-title" className="sr-only">
          Member stories
        </h2>
        <div className="mt-8">
          <EmptyState title="Stories are on their way — real ones.">
            We won&apos;t publish invented testimonials. If TechnoJam changed how you learn or what you build, tell us; with your permission
            your story goes here.
          </EmptyState>
        </div>
        <div className="mt-6">
          <EmptyState title="Photography coming soon.">
            Event galleries appear here once photos are approved and the people in them have agreed to be shown.
          </EmptyState>
        </div>
      </section>

      <section aria-labelledby="channels-title" className="container-site mt-28">
        <Eyebrow index="03">Where we talk</Eyebrow>
        <h2 id="channels-title" className="font-wide mt-6 text-headline font-black tracking-[-0.03em] uppercase">
          Pick a channel.
        </h2>
        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {settings.socials.map((s) => {
            const Icon = SOCIAL_ICON[s.platform];
            return (
              <li key={s.url}>
                <a
                  href={s.url}
                  target={s.platform === "email" ? undefined : "_blank"}
                  rel="noreferrer"
                  className="group flex h-full items-center justify-between gap-4 bg-bg p-6 transition-colors hover:bg-bg-raised"
                >
                  <span className="flex items-center gap-4">
                    <Icon className="size-6 text-fg-muted group-hover:text-pulse" />
                    <span>
                      <span className="block text-lg font-semibold">{s.label}</span>
                      {s.handle ? <span className="label-mono block break-all text-fg-subtle normal-case tracking-normal">{s.handle}</span> : null}
                    </span>
                  </span>
                  <ArrowRight className="shrink-0 text-fg-subtle transition-transform group-hover:translate-x-1" />
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
