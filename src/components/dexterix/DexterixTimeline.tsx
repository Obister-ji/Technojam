import Link from "next/link";
import type { DexterixEdition } from "@/lib/content/types";
import { formatDateRange, isPublishable } from "@/lib/content/derive";
import { ArrowRight } from "@/components/ui/Icon";
import { DexterixFigure } from "./Figure";

/**
 * Horizontal edition rail. Scroll-snaps on touch, wraps into a grid on
 * wide screens. Oldest → newest so the story reads left to right.
 */
export function DexterixTimeline({ editions }: { editions: DexterixEdition[] }) {
  const ordered = editions.filter((e) => isPublishable(e.verification)).sort((a, b) => a.year - b.year);
  return (
    <div className="relative">
      <span aria-hidden className="absolute top-[0.6875rem] right-0 left-0 h-px bg-gradient-to-r from-volt via-violet to-pulse opacity-60" />
      <ol className="-mx-(--gutter) flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--gutter) pb-4 [scrollbar-width:thin] lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
        {ordered.map((e, i) => (
          <li key={e.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 90}ms` }} className="w-[80vw] max-w-sm shrink-0 snap-start sm:w-[22rem] lg:w-auto lg:max-w-none">
            <span aria-hidden className="relative z-10 block size-[1.375rem] rounded-full border border-line-strong bg-bg p-[5px]">
              <span className="block size-full rounded-full" style={{ background: i === ordered.length - 1 ? "var(--color-pulse)" : "var(--color-fg-muted)" }} />
            </span>
            <div className="group relative mt-6 border border-line bg-bg/60 p-6 transition-colors hover:border-line-strong">
              <p className="label-mono text-fg-muted">
                {e.startDate ? formatDateRange(e.startDate, e.endDate) : e.year}
              </p>
              <h3 className="font-wide mt-3 text-4xl font-black tracking-tight uppercase transition-colors group-hover:text-pulse">
                <Link href={`/dexterix/${e.slug}`} className="after:absolute after:inset-0">
                  {e.edition === "1.0" ? "Origin" : e.edition}
                  <span className="sr-only"> — {e.title}</span>
                </Link>
              </h3>
              <p className="mt-3 min-h-[3lh] text-fg-muted">{e.summary}</p>
              <dl className="mt-4 grid gap-4">
                <DexterixFigure label="Participants" actual={e.participantsActual} target={e.participantsTarget} />
                {e.durationHours ? (
                  <div className="border-t border-line pt-4">
                    <dt className="label-mono text-fg-muted">Format</dt>
                    <dd className="mt-1 text-lg font-semibold">
                      {e.durationHours} hours · {e.format === "hybrid" ? "hybrid" : e.format === "online" ? "online" : "on campus"}
                    </dd>
                  </div>
                ) : null}
              </dl>
              <span className="label-mono mt-6 inline-flex items-center gap-2">
                Edition details <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
