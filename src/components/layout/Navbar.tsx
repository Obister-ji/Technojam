"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark, Wordmark } from "@/components/brand/Logo";
import { AchievementBadge } from "@/components/vibe/Achievements";
import { cx } from "@/components/ui/primitives";
import { JOIN_NAV, PRIMARY_NAV } from "@/lib/nav";

/**
 * Logo, the five main pages, badges and Join — sitting straight on the sky
 * with no bar behind it. It scrolls away with the page rather than floating
 * over content it would no longer have a background to separate from.
 */
export function Navbar({ recruitmentOpen }: { recruitmentOpen: boolean }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Primary" className="container-site flex h-(--nav-h) items-center gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6">
        <Link href="/" className="logo-sky relative mr-auto shrink-0 md:mr-0 md:justify-self-start" aria-label="TechnoJam — home">
          <Wordmark className="hidden lg:inline-flex" />
          <Mark className="h-9 lg:hidden" />
          {/* shooting stars streaking past the name */}
          <span aria-hidden className="sky-shot" />
          <span aria-hidden className="sky-shot sky-shot-2" />
          <span aria-hidden className="sky-shot sky-shot-3" />
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex lg:gap-1">
          {PRIMARY_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cx(
                  "relative px-2.5 py-2 font-mono text-[0.75rem] tracking-[0.08em] uppercase transition-colors lg:px-3 lg:text-[0.78rem]",
                  isActive(item.href) ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cx(
                    "absolute inset-x-3 -bottom-px h-px origin-left bg-pulse transition-transform duration-500 ease-(--ease-out-expo)",
                    isActive(item.href) ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:justify-self-end">
          <AchievementBadge />
          <Link
            href={JOIN_NAV.href}
            aria-current={isActive(JOIN_NAV.href) ? "page" : undefined}
            className="group inline-flex h-10 items-center gap-2 border-2 border-line-strong px-2.5 font-pixel text-[0.7rem] text-fg uppercase transition-colors hover:border-cyan hover:text-cyan"
          >
            {recruitmentOpen ? (
              <span aria-hidden className="pulse-dot size-1.5 bg-phosphor" />
            ) : (
              <span aria-hidden className="text-[0.6rem] text-cyan transition-transform group-hover:translate-x-0.5">
                ▶
              </span>
            )}
            Join
            {recruitmentOpen ? <span className="sr-only">(recruitment open)</span> : null}
          </Link>
        </div>
      </nav>
    </header>
  );
}
