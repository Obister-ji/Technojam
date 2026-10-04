import Link from "next/link";
import type { Project, ProjectStatus } from "@/lib/content/types";
import { ArrowRight } from "@/components/ui/Icon";
import { Status, cx } from "@/components/ui/primitives";

export const STATUS_META: Record<ProjectStatus, { label: string; tone: "pulse" | "volt" | "violet" | "muted"; live?: boolean }> = {
  active: { label: "Active", tone: "pulse", live: true },
  maintained: { label: "Maintained", tone: "volt" },
  experiment: { label: "Experiment", tone: "violet" },
  event: { label: "Event project", tone: "volt" },
  archived: { label: "Archived", tone: "muted" },
};

const LANG_COLOR: Record<string, string> = {
  TypeScript: "#4c7dff",
  JavaScript: "#e9c46a",
  CSS: "#9d74ff",
  HTML: "#ff7a59",
  "C++": "#f34b7d",
  Java: "#d9822b",
  Kotlin: "#a97bff",
  Python: "#4c9be8",
  Dart: "#3cc6c6",
  Markdown: "#a5a3ab",
};

/** Typographic cover — no fake screenshots. Real screenshots from the CMS take over when present. */
export function ProjectCover({ project, className }: { project: Project; className?: string }) {
  const shot = project.screenshots[0];
  const color = LANG_COLOR[project.language ?? ""] ?? "#a5a3ab";
  if (shot) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- Sanity CDN images, sized by the CMS
      <img
        src={`${shot.url}?w=960&auto=format`}
        alt={shot.alt}
        loading="lazy"
        className={cx("aspect-[16/10] w-full object-cover", className)}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={cx(
        "relative flex aspect-[16/10] w-full min-w-0 flex-col justify-between gap-3 overflow-hidden bg-bg-raised p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="min-w-0 truncate label-mono text-fg-subtle">{project.repoFullName ?? "technojam"}</span>
      </div>
      <p className="line-clamp-2 text-[clamp(1.4rem,3.4vw,2.2rem)] leading-[0.95] font-extrabold tracking-tight [overflow-wrap:anywhere] break-words uppercase font-wide opacity-90 transition-transform duration-700 ease-(--ease-out-expo) group-hover:-translate-y-1">
        {project.title}
      </p>
      <div className="flex items-center gap-2">
        <span className="h-1 flex-1" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
        {project.language ? <span className="label-mono text-fg-muted">{project.language}</span> : null}
      </div>
    </div>
  );
}

export function ProjectCard({ project, priority, compact }: { project: Project; priority?: boolean; compact?: boolean }) {
  const status = STATUS_META[project.status];
  return (
    <article
      className="group relative flex h-full min-w-0 flex-col border border-line bg-bg transition-colors duration-500 hover:border-line-strong"
      data-priority={priority || undefined}
    >
      <ProjectCover project={project} />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <Status tone={status.tone} live={status.live}>
            {status.label}
          </Status>
          <span className="label-mono text-fg-subtle">{project.year}</span>
        </div>
        <h3 className="text-xl font-bold tracking-tight">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="text-fg-muted">{project.summary}</p>
        {compact ? null : (
          <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-2" aria-label="Stack">
            {project.stack.slice(0, 4).map((s) => (
              <li key={s} className="label-mono tracking-normal text-fg-subtle normal-case">
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
      <ArrowRight
        aria-hidden
        className="absolute right-5 bottom-5 text-fg-subtle transition-all duration-300 group-hover:translate-x-1 group-hover:text-pulse"
      />
    </article>
  );
}
