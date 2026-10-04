import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCover, STATUS_META } from "@/components/projects/ProjectCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { RepoLink } from "@/components/projects/RepoLink";
import { ButtonLink, Status } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/PageHeader";
import { RichText } from "@/components/ui/RichText";
import { SourceNote } from "@/components/ui/SourceNote";
import { MoreDetails } from "@/components/ui/MoreDetails";
import { getProject, getProjects } from "@/lib/content";
import { getRepoMeta } from "@/lib/github";
import { JsonLd, breadcrumbJsonLd, pageMetadata, projectJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({ title: project.title, description: project.summary, path: `/projects/${project.slug}` });
}

const relative = (iso: string) => {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 45) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 18) return `${months} months ago`;
  return `${Math.round(days / 365)} years ago`;
};

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();
  const meta = await getRepoMeta(project.repoFullName);
  const status = STATUS_META[project.status];
  const related = all
    .filter((p) => p.slug !== project.slug && p.domains.some((d) => project.domains.some((pd) => pd.slug === d.slug)))
    .slice(0, 3);

  const facts: [string, React.ReactNode][] = [
    [
      "Status",
      <Status key="s" tone={status.tone} live={status.live}>
        {status.label}
      </Status>,
    ],
    ["Year", project.year],
    ["Language", meta?.language ?? project.language ?? "—"],
    ...(meta
      ? ([
          [
            "Last commit",
            <time key="t" dateTime={meta.pushedAt}>
              {relative(meta.pushedAt)}
            </time>,
          ],
        ] as [string, React.ReactNode][])
      : []),
    ...(meta?.license ? ([["License", meta.license]] as [string, React.ReactNode][]) : []),
    ...(meta?.archived ? ([["GitHub", "Archived repository"]] as [string, React.ReactNode][]) : []),
  ];

  return (
    <article>
      <PageHeader
        crumbs={[
          { label: "projects", href: "/projects" },
          { label: project.slug, href: `/projects/${project.slug}` },
        ]}
        eyebrow={project.repoFullName ?? "Project"}
        title={project.title}
        intro={<p>{project.summary}</p>}
        aside={
          <div className="flex flex-wrap gap-3">
            {project.repository ? <RepoLink href={project.repository} slug={project.slug} /> : null}
            {project.liveUrl ? (
              <ButtonLink href={project.liveUrl} variant="secondary">
                Live site
              </ButtonLink>
            ) : null}
          </div>
        }
      />

      <div className="container-site grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="border border-line">
            <ProjectCover project={project} />
          </div>
          <div className="mt-12">
            {project.description ? <RichText value={project.description} /> : <p className="text-lg text-fg-muted">{project.summary}</p>}
          </div>
          {project.screenshots.length > 1 ? (
            <ul className="mt-12 grid gap-4 sm:grid-cols-2">
              {project.screenshots.slice(1).map((s) => (
                <li key={s.url}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- Sanity CDN */}
                  <img src={`${s.url}?w=900&auto=format`} alt={s.alt} loading="lazy" className="w-full border border-line" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <aside className="lg:col-span-4">
          <dl className="grid gap-4">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-fg-subtle">{k}</dt>
                <dd className="mt-0.5 text-lg">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-fg-muted">{project.stack.join(" · ")}</p>
          {project.relatedEvent ? (
            <Link href={`/events/${project.relatedEvent.slug}`} className="mt-6 inline-block hover:text-pulse">
              Built for {project.relatedEvent.title} →
            </Link>
          ) : null}
          <MoreDetails>
            {project.domains.length ? (
              <p className="text-fg-muted">
                Domains:{" "}
                {project.domains.map((d, i) => (
                  <span key={d.slug}>
                    {i ? " · " : ""}
                    <Link href={`/#explore-${d.slug}`} className="hover:text-pulse">
                      {d.title}
                    </Link>
                  </span>
                ))}
              </p>
            ) : null}
            {project.maintainers.length || project.contributors.length ? (
              <p className="text-fg-muted">People: {[...project.maintainers, ...project.contributors].map((x) => x.name).join(" · ")}</p>
            ) : null}
            <div>
              <SourceNote verification={project.verification} />
              {meta ? <p className="mt-2 text-sm text-fg-subtle">Repository details from the GitHub API, refreshed daily.</p> : null}
            </div>
          </MoreDetails>
        </aside>
      </div>

      {related.length ? (
        <section aria-labelledby="related-title" className="container-site mt-32 border-t border-line pt-16">
          <h2 id="related-title" className="label-mono text-fg-muted">
            Related projects
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <JsonLd data={projectJsonLd(project)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />
    </article>
  );
}
