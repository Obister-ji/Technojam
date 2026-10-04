"use client";

import { useState } from "react";
import type { EventType, TJEvent } from "@/lib/content/types";
import { EVENT_TYPE_LABEL } from "@/lib/content/derive";
import { cx } from "@/components/ui/primitives";
import { EventRow } from "./EventRow";

/** Past events, grouped by year, filterable by type. */
export function EventList({ events }: { events: TJEvent[] }) {
  const [type, setType] = useState<EventType | "all">("all");
  const types = [...new Set(events.map((e) => e.type))];
  const visible = events.filter((e) => type === "all" || e.type === type);
  const years = [...new Set(visible.map((e) => e.startDate.slice(0, 4)))];

  return (
    <>
      <div role="group" aria-label="Filter by type" className="-mx-(--gutter) flex gap-2 overflow-x-auto border-y border-line px-(--gutter) py-5 lg:mx-0 lg:px-0">
        {(["all", ...types] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={type === t}
            onClick={() => setType(t)}
            className={cx(
              "label-mono h-9 shrink-0 border px-3 transition-colors",
              type === t ? "border-fg bg-fg text-bg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
            )}
          >
            {t === "all" ? `All · ${events.length}` : EVENT_TYPE_LABEL[t]}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} events shown
      </p>
      {years.map((year) => (
        <section key={year} aria-labelledby={`y-${year}`} className="mt-16 grid gap-6 lg:grid-cols-12">
          <h3 id={`y-${year}`} className="font-wide text-5xl font-black tracking-tight text-fg-subtle lg:col-span-2 lg:text-6xl">
            {year}
          </h3>
          <ul className="border-t border-line lg:col-span-10">
            {visible
              .filter((e) => e.startDate.startsWith(year))
              .map((e) => (
                <EventRow key={e.slug} event={e} />
              ))}
          </ul>
        </section>
      ))}
    </>
  );
}
