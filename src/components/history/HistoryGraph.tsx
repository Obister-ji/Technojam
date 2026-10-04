import Link from "next/link";
import type { Milestone } from "@/lib/content/types";
import { formatMonthYear } from "@/lib/content/derive";
import { cx } from "@/components/ui/primitives";

const KIND: Record<Milestone["kind"], { color: string; branch: string }> = {
  origin: { color: "var(--color-fg)", branch: "main" },
  dexterix: { color: "var(--color-pulse)", branch: "dexterix" },
  event: { color: "var(--color-volt)", branch: "events" },
  community: { color: "var(--color-violet)", branch: "community" },
  recruitment: { color: "var(--color-fg)", branch: "recruitment" },
  "open-source": { color: "var(--color-volt)", branch: "open-source" },
};

/**
 * History rendered as a git graph: one trunk, Dexterix on its own branch.
 * Purely CSS — extends automatically as milestones are added in the CMS.
 */
export function HistoryGraph({ milestones, compact }: { milestones: Milestone[]; compact?: boolean }) {
  return (
    <ol className="relative">
      {/* trunk */}
      <span aria-hidden className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-line-strong" />
      {/* dexterix branch */}
      <span aria-hidden className="absolute top-10 bottom-10 left-[2.1875rem] w-px bg-pulse/40" />
      {milestones.map((m, i) => {
        const k = KIND[m.kind];
        const onBranch = m.kind === "dexterix";
        const content = (
          <>
            <p className="flex flex-wrap items-center gap-x-3 label-mono text-fg-subtle">
              <span className="text-fg">{m.date ? formatMonthYear(m.date) : m.year}</span>
              <span style={{ color: k.color }}>
                {onBranch ? "◆" : "●"} {k.branch}
              </span>
            </p>
            <h3 className={cx("mt-2 font-bold tracking-tight", compact ? "text-lg" : "text-xl md:text-2xl")}>{m.title}</h3>
            <p className="mt-1.5 max-w-xl text-fg-muted">{m.description}</p>
          </>
        );
        return (
          <li
            key={`${m.year}-${m.title}`}
            data-reveal
            style={{ ["--reveal-delay" as string]: `${Math.min(i, 6) * 60}ms` }}
            className="relative pb-10 pl-16 last:pb-0"
          >
            {/* node on trunk or branch */}
            <span
              aria-hidden
              className={cx(
                "absolute top-1.5 size-[0.6875rem] rounded-full ring-4 ring-bg",
                onBranch ? "left-[1.875rem]" : "left-[0.375rem]",
              )}
              style={{ background: k.color }}
            />
            {onBranch ? <span aria-hidden className="absolute top-[0.6rem] left-3 h-px w-5 bg-pulse/40" /> : null}
            {m.href ? (
              <Link href={m.href} className="group block hover:[&_h3]:text-pulse">
                {content}
              </Link>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ol>
  );
}
