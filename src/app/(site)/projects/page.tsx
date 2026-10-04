import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ExternalLink } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProjects, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "What TechnoJam members build and ship: event platforms, apps, open-source repositories and experiments — with honest status labels.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  const years = projects.map((p) => p.year);
  return (
    <>
      <PageHeader
        eyebrow="Projects / open source"
        title={"We ship\nthings."}
        intro={
          <p>
            {projects.length} projects from {Math.min(...years)} to {Math.max(...years)} — the platforms behind our events, recruitment in
            the open, apps, and experiments. Status labels are honest: archived means archived.
          </p>
        }
        aside={
          <div className="border-l border-line pl-5">
            <p className="label-mono text-fg-subtle">Source of truth</p>
            <p className="mt-2 text-fg-muted">
              Everything here lives on{" "}
              <ExternalLink href={`https://github.com/${settings.githubOrg}`}>github.com/{settings.githubOrg}</ExternalLink>. Want your
              project featured? Open a PR or tell a lead.
            </p>
          </div>
        }
      />
      <section aria-labelledby="all-projects" className="container-site">
        <h2 id="all-projects" className="sr-only">
          All projects
        </h2>
        <ProjectGrid projects={projects} />
      </section>
    </>
  );
}
