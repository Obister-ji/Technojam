"use client";

import { useRef, useState } from "react";
import type { Project } from "@/lib/content/types";
import { Plate } from "./furniture";

function status(p: Project) {
  if (p.statusNote) return p.statusNote;
  if (p.status === "event") return p.relatedEvent ? `SHIPPED FOR ${p.relatedEvent.title}` : `SHIPPED ${p.year}`;
  if (p.status === "maintained") return "LIVE";
  if (p.status === "active") return "WORKS";
  if (p.status === "experiment") return "EXPERIMENT";
  return "ARCHIVED";
}

/** One project per screen. Swipe, scroll sideways or use the arrows. */
export function ProjectReel({ projects }: { projects: Project[] }) {
  const track = useRef<HTMLOListElement>(null);
  const [index, setIndex] = useState(0);

  const go = (i: number) => {
    const el = track.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  const onScroll = () => {
    const t = track.current;
    if (!t) return;
    setIndex(Math.round(t.scrollLeft / t.clientWidth));
  };

  return (
    <section aria-labelledby="reel-title" aria-roledescription="carousel" className="py-16">
      <div className="container-site flex items-end justify-between gap-6">
        <h2 id="reel-title" className="font-mono text-[0.75rem] tracking-[0.14em] uppercase">
          Things we shipped <span className="text-fg-muted">/ {String(projects.length).padStart(2, "0")}</span>
        </h2>
        <div className="flex gap-2 font-mono text-sm">
          <button
            type="button"
            onClick={() => go(Math.max(0, index - 1))}
            disabled={index === 0}
            className="size-11 border border-fg/30 hover:border-fg disabled:opacity-30"
            aria-label="Previous project"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(Math.min(projects.length - 1, index + 1))}
            disabled={index >= projects.length - 1}
            className="size-11 border border-fg/30 hover:border-fg disabled:opacity-30"
            aria-label="Next project"
          >
            →
          </button>
        </div>
      </div>

      <ol
        ref={track}
        onScroll={onScroll}
        tabIndex={0}
        aria-label="Projects"
        className="mt-6 flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain focus-visible:outline-offset-[-4px] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((p, i) => (
          <li
            key={p.slug}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${projects.length}: ${p.title}`}
            className="w-full shrink-0 snap-start"
          >
            <div className="container-site grid min-h-[78svh] items-center gap-8 lg:grid-cols-12">
              <Plate
                image={p.screenshots[0]}
                shot={`Screenshot or prototype photo of ${p.title}`}
                className="aspect-[16/10] lg:col-span-7"
              />
              <div className="lg:col-span-5">
                <p className="font-mono text-sm tracking-[0.1em] text-fg-muted">
                  {String(i + 1).padStart(2, "0")} / {p.year}
                </p>
                <h3 className="mt-3 text-[clamp(1.75rem,3.2vw,3rem)] leading-[0.9] font-black tracking-[-0.03em] uppercase font-wide">
                  {p.title}
                </h3>
                <p className="mt-6 max-w-md font-serif text-[clamp(1.25rem,2vw,1.6rem)] leading-snug">
                  “Built because {p.builtBecause ?? <span className="data-required">[ REAL DATA REQUIRED ]</span>}”
                </p>
                <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm tracking-[0.1em] uppercase">
                  {p.repository ? (
                    <a href={p.repository} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-pulse">
                      Source ↗
                    </a>
                  ) : null}
                  {p.liveUrl ? (
                    <a href={p.liveUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-pulse">
                      Demo ↗
                    </a>
                  ) : null}
                </p>
                <p className="stamp mt-8">{status(p)}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
