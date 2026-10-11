import Link from "next/link";
import type { ReactNode } from "react";
import { Lines } from "./primitives";

/** Shared page opener: breadcrumb, oversized title, intro, optional aside. */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  intro,
  aside,
}: {
  crumbs?: { label: string; href: string }[];
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="container-site pt-[calc(var(--nav-h)+3rem)] pb-16 md:pt-[calc(var(--nav-h)+5rem)] md:pb-24">
      {crumbs?.length ? (
        <nav aria-label="Breadcrumb" className="mb-10 label-mono text-fg-subtle">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="inline-flex min-h-11 min-w-6 items-center hover:text-fg md:min-h-0">
                ~
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <Link href={c.href} className="inline-flex min-h-11 items-center hover:text-fg md:min-h-0">
                  {c.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <p className="label-mono text-fg-subtle">{eyebrow}</p>
      <h1 className="rise-lines mt-5 text-display font-black tracking-[-0.04em] break-words uppercase font-wide">
        <Lines text={title} />
      </h1>
      {intro || aside ? (
        <div className="mt-10 grid gap-8 md:grid-cols-12">
          {intro ? (
            <div className="rise text-[clamp(1.1rem,1.8vw,1.35rem)] leading-relaxed text-fg-muted md:col-span-7">{intro}</div>
          ) : null}
          {aside ? (
            <div className="rise md:col-span-4 md:col-start-9" style={{ ["--rise-delay" as string]: "200ms" }}>
              {aside}
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
