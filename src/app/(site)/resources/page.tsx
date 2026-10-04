import { ArrowUpRight } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/PageHeader";
import { getResources } from "@/lib/content";
import type { Resource } from "@/lib/content/types";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Resources",
  description: "Starting points for every TechnoJam domain — our own repositories first, then the best official documentation.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const resources = await getResources();
  const groups = new Map<string, Resource[]>();
  for (const r of resources) {
    const key = r.domain?.title ?? "TechnoJam & general";
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  const ordered = [...groups].sort(([a], [b]) => (a.startsWith("TechnoJam") ? -1 : b.startsWith("TechnoJam") ? 1 : a.localeCompare(b)));

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title={"Start\nsomewhere."}
        intro={<p>Our own repositories first, then the official docs we&apos;d point a friend to. No paywalls, no affiliate links.</p>}
      />
      <div className="container-site grid gap-16">
        {ordered.map(([group, items]) => (
          <section key={group} aria-labelledby={`g-${group}`} className="grid gap-6 lg:grid-cols-12">
            <h2 id={`g-${group}`} className="font-wide text-2xl font-extrabold uppercase lg:col-span-4">
              {group}
            </h2>
            <ul className="border-t border-line lg:col-span-8">
              {items.map((r) => (
                <li key={r.slug} className="border-b border-line">
                  <a href={r.url} target="_blank" rel="noreferrer" className="group grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                    <span>
                      <span className="text-lg font-semibold group-hover:text-pulse">{r.title}</span>
                      <span className="mt-1 block text-fg-muted">{r.description}</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <Tag>{r.kind}</Tag>
                      {r.forRecruitment ? <Tag>recruitment prep</Tag> : null}
                      <ArrowUpRight className="text-fg-subtle" />
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
