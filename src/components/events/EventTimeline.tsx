"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { EventType, TJEvent } from "@/lib/content/types";
import { EVENT_TYPE_LABEL, formatDateRange } from "@/lib/content/derive";
import { cx } from "@/components/ui/primitives";
import { EventIcon } from "./EventIcon";
import { MODE_LABEL } from "./EventRow";

/**
 * Past events as a vertical timeline: a spine down the middle that draws itself as you scroll,
 * pixel year markers, and a node + dashed link + card for each event, alternating sides on
 * desktop and sitting to the right of the spine on phones. Years with no events are simply
 * left as empty space on the spine.
 */
export function EventTimeline({ events }: { events: TJEvent[] }) {
  const [type, setType] = useState<EventType | "all">("all");
  const types = [...new Set(events.map((e) => e.type))];
  const visible = events.filter((e) => type === "all" || e.type === type);
  const years = [...new Set(visible.map((e) => e.startDate.slice(0, 4)))];

  const box = useRef<HTMLDivElement>(null);

  // Scroll progress: fills the spine down to the middle of the screen and lights up each node it passes.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      const line = window.innerHeight * 0.6;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      el.style.setProperty("--tl", p.toFixed(4));
      el.querySelectorAll<HTMLElement>("[data-node]").forEach((n) => {
        n.dataset.lit = String(n.getBoundingClientRect().top + n.offsetHeight / 2 < line);
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [type]);

  // position of each event in the whole list, so cards keep alternating across years
  const order = new Map(visible.map((e, i) => [e.slug, i]));

  return (
    <>
      <div
        role="group"
        aria-label="Filter by type"
        className="-mx-(--gutter) flex [scrollbar-width:none] gap-2 overflow-x-auto px-(--gutter) pb-2 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {(["all", ...types] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={type === t}
            onClick={() => setType(t)}
            className={cx(
              "h-9 shrink-0 border px-3 label-mono transition-colors",
              type === t ? "border-cyan bg-cyan text-bg" : "border-line text-fg-muted hover:border-cyan hover:text-cyan",
            )}
          >
            {t === "all" ? `All · ${events.length}` : EVENT_TYPE_LABEL[t]}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} events shown
      </p>

      <div ref={box} className="timeline relative mt-16" style={{ ["--tl" as string]: 0 }}>
        {/* the spine: a faint full line, and a bright one that fills as you scroll */}
        <span aria-hidden className="tl-spine" />
        <span aria-hidden className="tl-spine tl-spine-fill" />

        <ol>
          {years.map((year, yi) => {
            const prev = yi ? Number(years[yi - 1]) : null;
            const missing = prev ? Math.max(0, prev - Number(year) - 1) : 0;
            return (
              <li
                key={year}
                aria-labelledby={`y-${year}`}
                // empty years show as plain space on the spine (a little per missing year, capped)
                style={{ marginTop: yi ? `${Math.min(missing, 3) * 3.5 + 5}rem` : 0 }}
              >
                <h3
                  id={`y-${year}`}
                  className="relative z-10 w-fit bg-bg py-2 pr-4 pl-12 font-pixel text-[clamp(2rem,5vw,3.6rem)] leading-none text-fg md:mx-auto md:px-6"
                >
                  {year}
                </h3>

                <ol className="mt-6 grid gap-y-10 md:gap-y-14">
                  {visible
                    .filter((e) => e.startDate.startsWith(year))
                    .map((e) => {
                      const right = (order.get(e.slug) ?? 0) % 2 === 0;
                      return (
                        <li key={e.slug} className="tl-row relative md:grid md:grid-cols-[1fr_3.5rem_1fr] md:items-center">
                          {/* node on the spine */}
                          <span
                            data-node
                            data-lit="false"
                            aria-hidden
                            className="tl-node absolute top-6 left-0 grid size-10 place-items-center md:static md:col-start-2 md:row-start-1 md:size-12 md:justify-self-center"
                          >
                            <EventIcon type={e.type} className="h-[1.1rem] w-[1.35rem]" />
                          </span>

                          <article
                            data-reveal
                            className={cx(
                              "group tl-card relative ml-14 md:row-start-1 md:ml-0",
                              right ? "md:col-start-3 md:pl-9" : "md:col-start-1 md:pr-9 md:text-right",
                            )}
                          >
                            {/* dashed link back to the node */}
                            <span aria-hidden className={cx("tl-link", right ? "tl-link-r" : "tl-link-l")} />
                            <div className="relative border border-line bg-bg-raised/60 p-5 transition-colors duration-300 group-hover:border-cyan md:p-6">
                              <p
                                className={cx(
                                  "flex flex-wrap items-center gap-x-3 gap-y-1 label-mono text-cyan",
                                  !right && "md:justify-end",
                                )}
                              >
                                <time dateTime={e.startDate}>{formatDateRange(e.startDate, e.endDate)}</time>
                                <span className="text-fg-subtle">
                                  {EVENT_TYPE_LABEL[e.type]} · {MODE_LABEL[e.mode]}
                                </span>
                              </p>
                              <h4 className="mt-3 font-pixel text-[clamp(1.05rem,1.8vw,1.5rem)] leading-[1.15] uppercase transition-colors group-hover:text-cyan">
                                <Link href={`/events/${e.slug}`} className="after:absolute after:inset-0">
                                  {e.title}
                                </Link>
                              </h4>
                              <p className="mt-3 line-clamp-2 text-[0.95rem] leading-relaxed text-fg-muted">{e.shortDescription}</p>
                            </div>
                          </article>
                        </li>
                      );
                    })}
                </ol>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
