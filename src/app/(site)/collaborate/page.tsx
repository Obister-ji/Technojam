import Link from "next/link";
import { CollaborateForm } from "@/components/collaborate/CollaborateForm";
import { Eyebrow } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/PageHeader";
import { getDexterixEditions, getDomains, getMetrics, getSiteSettings } from "@/lib/content";
import { formatFigure, publishableFigure } from "@/lib/content/derive";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Collaborate",
  description: "Sponsor Dexterix, host a workshop, mentor, judge or speak — how organisations work with TechnoJam.",
  path: "/collaborate",
});

export default async function CollaboratePage() {
  const [settings, editions, metrics, domains] = await Promise.all([getSiteSettings(), getDexterixEditions(), getMetrics(), getDomains()]);
  const latest = editions.find((e) => e.startDate);
  const reach = latest && (publishableFigure(latest.participantsActual) ?? publishableFigure(latest.participantsTarget));
  const reachIsTarget = latest && !publishableFigure(latest.participantsActual);
  const commudle = metrics.find((m) => m.label.toLowerCase().includes("commudle"));

  const proof = [
    ...(commudle ? [[commudle.value.toLocaleString("en-IN"), `members on Commudle (as of ${commudle.asOf})`]] : []),
    ["Since 2018", "running Dexterix, from campus to international hybrid"],
    ...(latest && reach ? [[formatFigure(reach), `${reachIsTarget ? "participant target for" : "participants at"} ${latest.title}`]] : []),
    [`${domains.filter((d) => d.active).length} domains`, "of student talent, from DSA to robotics"],
  ];

  return (
    <>
      <PageHeader
        eyebrow="Collaborate · for organisations"
        title={"Work with\nthe builders."}
        intro={
          <p>
            Sponsorship, workshops, mentoring, judging, talks and partnerships — this page is for organisations and professionals. Students
            looking to join, head to{" "}
            <Link href="/join" className="text-fg underline underline-offset-4">
              Join
            </Link>
            .
          </p>
        }
      />

      <section aria-label="Why partner" className="container-site">
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {proof.map(([v, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd>
                <span className="block text-4xl font-extrabold font-wide">{v}</span>
                <span className="mt-2 block text-fg-muted">{l}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="form-title" className="container-site mt-28 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow>Start a conversation</Eyebrow>
            <h2 id="form-title" className="mt-6 text-title font-extrabold uppercase font-wide">
              Tell us what you have in mind.
            </h2>
            <p className="mt-4 text-fg-muted">
              A TechnoJam lead reads every inquiry. Include dates, audience and what success looks like for you — it helps us respond with
              something concrete.
            </p>
            <div className="mt-8 border-t border-line pt-6">
              <p className="label-mono text-fg-subtle">Or write directly</p>
              <a
                href={`mailto:${settings.email}`}
                className="mt-2 inline-block text-lg break-all underline decoration-line-strong underline-offset-4 hover:decoration-pulse"
              >
                {settings.email}
              </a>
              <p className="mt-4 text-sm text-fg-subtle">
                {settings.school}, {settings.institution}, {settings.location}
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <CollaborateForm email={settings.email} />
        </div>
      </section>
    </>
  );
}
