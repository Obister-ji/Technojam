"use client";

import Link from "next/link";
import { useId, useState, type KeyboardEvent } from "react";
import { cx } from "@/components/ui/primitives";

export interface Artifact {
  kind: "EVENT" | "PROJECT" | "RECRUITMENT" | "MILESTONE" | "HACKATHON";
  title: string;
  date: string;
  href: string;
  external?: boolean;
}

export interface ArchiveYear {
  year: number;
  artifacts: Artifact[];
}

/** A filing cabinet: one drawer (tab) per year, index cards inside. */
export function BuildArchive({ years }: { years: ArchiveYear[] }) {
  const id = useId();
  const [open, setOpen] = useState(years[years.length - 1]?.year);
  const current = years.find((y) => y.year === open);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const y = years[(next + years.length) % years.length];
    setOpen(y.year);
    document.getElementById(`${id}-tab-${y.year}`)?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Archive by year" className="flex items-end gap-1 overflow-x-auto">
        {years.map((y, i) => {
          const selected = y.year === open;
          return (
            <button
              key={y.year}
              id={`${id}-tab-${y.year}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setOpen(y.year)}
              onKeyDown={(e) => onKey(e, i)}
              className={cx(
                "shrink-0 rounded-t-md border border-b-0 px-5 font-mono text-sm font-bold tracking-[0.12em] transition-[padding,background-color] duration-300",
                selected ? "border-fg/40 bg-bg pt-3 pb-3" : "border-fg/20 bg-bg-sunken pt-2 pb-2 text-fg-muted hover:pt-3",
              )}
            >
              {y.year}
            </button>
          );
        })}
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={open ? `${id}-tab-${open}` : undefined}
        className="relative min-h-[22rem] border border-fg/40 bg-bg p-5 sm:p-8"
      >
        {current ? (
          <>
            <span key={current.year} className="stamp stamp-in is-open absolute top-6 right-6">
              Filed {current.year}
            </span>
            <p className="font-mono text-[0.72rem] tracking-[0.12em] text-fg-muted uppercase">
              Drawer {current.year} · {current.artifacts.length} {current.artifacts.length === 1 ? "item" : "items"}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {current.artifacts.map((a, i) => {
                const body = (
                  <>
                    <span className="flex justify-between font-mono text-[0.68rem] tracking-[0.12em] text-fg-muted uppercase">
                      <span>{a.kind}</span>
                      <span>
                        TJ-{current.year}-{String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="mt-3 block text-lg leading-tight font-bold group-hover:text-pulse">{a.title}</span>
                    <span className="mt-2 block font-mono text-[0.72rem] text-fg-muted">{a.date}</span>
                  </>
                );
                const cls =
                  "group block h-full border border-fg/20 bg-bg-raised p-4 shadow-[2px_2px_0_rgb(28_27_24/0.12)] transition-transform hover:-translate-y-0.5";
                return (
                  <li key={`${a.kind}-${a.title}`}>
                    {a.external ? (
                      <a href={a.href} target="_blank" rel="noreferrer" className={cls}>
                        {body}
                      </a>
                    ) : (
                      <Link href={a.href} className={cls}>
                        {body}
                      </Link>
                    )}
                  </li>
                );
              })}
              <li className="border border-dashed border-fg/30 p-4 font-mono text-[0.72rem] leading-relaxed text-fg-muted">
                PHOTOS · POSTERS · NOTES · QUOTES
                <br />
                <span className="data-required">[ REAL DATA REQUIRED ]</span>
              </li>
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
