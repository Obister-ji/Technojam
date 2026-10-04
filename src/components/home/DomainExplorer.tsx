"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { DomainNode } from "@/lib/content/relations";
import { ArrowRight, ArrowUpRight, Plus } from "@/components/ui/Icon";
import { cx } from "@/components/ui/primitives";

/**
 * EXPLORE // — one list, two behaviours: a sticky detail panel on
 * desktop, an accordion on phones. Rows are real buttons; deep links
 * (#explore-ai) open the matching domain.
 */
export function DomainExplorer({ domains }: { domains: DomainNode[] }) {
  const baseId = useId();
  const active = domains.filter((d) => d.active);
  const historical = domains.filter((d) => !d.active);
  const [selected, setSelected] = useState(active[0]?.slug ?? "");

  useEffect(() => {
    const fromHash = () => {
      const slug = window.location.hash.replace("#explore-", "");
      if (domains.some((d) => d.slug === slug)) setSelected(slug);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [domains]);

  const current = domains.find((d) => d.slug === selected);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <ol className="lg:col-span-7">
        {active.map((d, i) => {
          const isOpen = d.slug === selected;
          const panelId = `${baseId}-${d.slug}`;
          return (
            <li key={d.slug} id={`explore-${d.slug}`} className="scroll-mt-28 border-b border-line">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setSelected(isOpen ? "" : d.slug)}
                onMouseEnter={() => window.matchMedia("(min-width: 64rem)").matches && setSelected(d.slug)}
                className="group flex w-full items-baseline gap-4 py-3.5 text-left md:gap-6 md:py-4"
              >
                <span className={cx("w-7 shrink-0 label-mono transition-colors", isOpen ? "text-fg" : "text-fg-subtle")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cx(
                    "flex-1 text-[clamp(1.2rem,2.2vw,1.6rem)] font-semibold tracking-tight transition-[color,transform] duration-500 ease-(--ease-out-expo)",
                    isOpen ? "translate-x-1 text-fg" : "text-fg-muted group-hover:text-fg",
                  )}
                >
                  {d.title}
                </span>
                <Plus className={cx("size-5 shrink-0 transition-transform duration-500 lg:hidden", isOpen && "rotate-45")} />
              </button>
              {/* Mobile accordion panel */}
              <div
                id={panelId}
                className={cx(
                  "grid transition-[grid-template-rows] duration-500 ease-(--ease-out-expo) lg:hidden",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="pb-6 pl-11">
                    <DomainDetail domain={d} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        {historical.length ? (
          <li className="pt-6">
            <p className="label-mono text-fg-subtle">Also part of our history:</p>
            <p className="mt-2 text-fg-muted">{historical.map((d) => d.title).join(" · ")}</p>
          </li>
        ) : null}
      </ol>

      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 bg-bg-raised p-8 md:p-10" aria-live="polite">
          {current ? (
            <>
              <p className="text-2xl font-bold">{current.title}</p>
              <div className="mt-5">
                <DomainDetail domain={current} />
              </div>
            </>
          ) : (
            <p className="text-fg-muted">Pick a domain to see what we build, run and read in it.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DomainDetail({ domain }: { domain: DomainNode }) {
  return (
    <div className="grid gap-6">
      <p className="text-lg leading-relaxed text-fg">{domain.summary}</p>
      {domain.projects.length ? (
        <Related title="Projects">
          {domain.projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} className="group inline-flex items-center gap-2 hover:text-pulse">
                {p.title} <span className="label-mono text-fg-subtle">{p.year}</span>
                <ArrowRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </Related>
      ) : null}
      {domain.events.length ? (
        <Related title="Events">
          {domain.events.map((e) => (
            <li key={e.slug}>
              <Link href={`/events/${e.slug}`} className="hover:text-pulse">
                {e.title} <span className="label-mono text-fg-subtle">{e.date.slice(0, 4)}</span>
              </Link>
            </li>
          ))}
        </Related>
      ) : null}
      {domain.resources.length ? (
        <Related title="Start here">
          {domain.resources.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-pulse">
                {r.title} <ArrowUpRight className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </Related>
      ) : null}
    </div>
  );
}

function Related({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label-mono text-fg-subtle">{title}</p>
      <ul className="mt-2 grid gap-1.5">{children}</ul>
    </div>
  );
}
