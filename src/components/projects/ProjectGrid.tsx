"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectStatus } from "@/lib/content/types";
import { cx } from "@/components/ui/primitives";
import { ProjectCard, STATUS_META } from "./ProjectCard";

type Filter = { kind: "all" } | { kind: "status"; value: ProjectStatus } | { kind: "domain"; value: string };

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>({ kind: "all" });

  const statuses = useMemo(() => [...new Set(projects.map((p) => p.status))], [projects]);
  const domains = useMemo(() => {
    const m = new Map<string, string>();
    projects.forEach((p) => p.domains.forEach((d) => m.set(d.slug, d.title)));
    return [...m];
  }, [projects]);

  const visible = projects.filter((p) =>
    filter.kind === "all" ? true : filter.kind === "status" ? p.status === filter.value : p.domains.some((d) => d.slug === filter.value),
  );

  const chip = (active: boolean) =>
    cx(
      "label-mono h-9 border px-3 transition-colors",
      active ? "border-cyan bg-cyan text-bg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
    );

  return (
    <>
      <div className="flex flex-col gap-4 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by status" className="-mx-(--gutter) flex gap-2 overflow-x-auto px-(--gutter) lg:mx-0 lg:px-0">
          <button
            type="button"
            aria-pressed={filter.kind === "all"}
            onClick={() => setFilter({ kind: "all" })}
            className={chip(filter.kind === "all")}
          >
            All · {projects.length}
          </button>
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={filter.kind === "status" && filter.value === s}
              onClick={() => setFilter({ kind: "status", value: s })}
              className={cx(chip(filter.kind === "status" && filter.value === s), "shrink-0")}
            >
              {STATUS_META[s].label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3">
          <span className="label-mono text-fg-subtle">Domain</span>
          <select
            value={filter.kind === "domain" ? filter.value : ""}
            onChange={(e) => setFilter(e.target.value ? { kind: "domain", value: e.target.value } : { kind: "all" })}
            className="h-9 border border-line bg-bg px-3 text-sm text-fg"
          >
            <option value="">Any</option>
            {domains.map(([slug, title]) => (
              <option key={slug} value={slug}>
                {title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} projects shown
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <li key={p.slug}>
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
