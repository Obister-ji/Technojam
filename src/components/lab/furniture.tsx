import Link from "next/link";
import type { ReactNode } from "react";
import type { ImageAsset } from "@/lib/content/types";
import { cx } from "@/components/ui/primitives";

/** The honest placeholder. Never replaced by invented content. */
export function DataRequired({ what }: { what?: string }) {
  return (
    <span className="data-required" title={what ? `Needed: ${what}` : undefined}>
      [ REAL DATA REQUIRED ]{what ? <span className="sr-only"> — {what}</span> : null}
    </span>
  );
}

/** [ ENTER THE LAB → ] — the only CTA style on the homepage. */
export function BracketLink({
  href,
  children,
  tone = "ink",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "ink" | "paper";
  className?: string;
}) {
  const external = /^https?:/.test(href);
  const classes = cx(
    "group inline-flex min-h-12 items-center gap-2 font-mono text-sm font-bold tracking-[0.14em] uppercase transition-colors",
    tone === "ink" ? "text-fg hover:text-cyan" : "text-bg hover:text-phosphor",
    className,
  );
  const body = (
    <>
      <span aria-hidden>[</span>
      <span className="px-1.5 underline decoration-transparent underline-offset-[6px] transition-colors group-hover:decoration-current">
        {children}
      </span>
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
      <span aria-hidden>]</span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={classes}>
      {body}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} className={classes}>
      {body}
    </Link>
  );
}

/**
 * A documentary photo plate. Real photos render monochrome and reveal colour
 * on hover. Without one, the plate becomes a halftone shot-list card that
 * tells the club exactly which photo is needed.
 */
export function Plate({ image, shot, caption, className }: { image?: ImageAsset; shot: string; caption?: string; className?: string }) {
  return (
    <figure className={cx("plate", className)}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- Sanity CDN sizes via query params
        <img src={`${image.url}?w=1200&auto=format`} alt={image.alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="halftone grain flex h-full min-h-48 flex-col justify-between p-4" role="img" aria-label={`Photo needed: ${shot}`}>
          <span className="font-mono text-[0.68rem] tracking-[0.12em] text-fg-muted uppercase">Plate — photo needed</span>
          <span className="max-w-[16rem] bg-bg/90 px-2 py-1.5 text-[0.9rem] leading-snug">{shot}</span>
          <DataRequired />
        </div>
      )}
      {caption ? <figcaption className="mt-2 font-mono text-[0.7rem] tracking-wide text-fg-muted uppercase">{caption}</figcaption> : null}
    </figure>
  );
}
