"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Mark, Wordmark } from "@/components/brand/Logo";
import { AchievementBadge } from "@/components/vibe/Achievements";
import { cx } from "@/components/ui/primitives";
import { JOIN_NAV, PRIMARY_NAV } from "@/lib/nav";
import { MobileMenu } from "./MobileMenu";

/** Three pixel bars: the menu icon. */
function Bars({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 9 7" className={className} aria-hidden shapeRendering="crispEdges" fill="currentColor">
      <rect x="0" y="0" width="9" height="1" />
      <rect x="0" y="3" width="9" height="1" />
      <rect x="0" y="6" width="9" height="1" />
    </svg>
  );
}

/**
 * Logo, the five main pages, badges and Join — sitting straight on the sky
 * with no bar behind it. It scrolls away with the page rather than floating
 * over content it would no longer have a background to separate from.
 *
 * On phones there's no room for the page links, so a Menu button opens the full-screen
 * menu (pages, search, console). A second, floating Menu button appears once you've scrolled,
 * because the bar itself is no longer on screen by then.
 */
export function Navbar({ recruitmentOpen }: { recruitmentOpen: boolean }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // stable, so the menu's dialog isn't torn down and reopened on every render
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 160);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Primary"
          className="container-site flex h-(--nav-h) items-center gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6"
        >
          <Link href="/" className="logo-sky relative mr-auto shrink-0 md:mr-0 md:justify-self-start" aria-label="TechnoJam — home">
            {/* phones and desktops show the name; the in-between width only has room for the icon */}
            <Wordmark className="inline-flex md:hidden lg:inline-flex" />
            <Mark className="hidden h-9 md:block lg:hidden" />
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
            {/* on phones the trophy lives inside the menu, to keep this bar to two things */}
            <div className="hidden md:block">
              <AchievementBadge />
            </div>
            <Link
              href={JOIN_NAV.href}
              aria-current={isActive(JOIN_NAV.href) ? "page" : undefined}
              className="group inline-flex h-11 items-center gap-2 border-2 border-line-strong px-2.5 font-pixel text-[0.7rem] text-fg uppercase transition-colors hover:border-cyan hover:text-cyan md:h-10"
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
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="grid size-11 place-items-center border-2 border-line-strong text-cyan transition-colors hover:border-cyan md:hidden"
            >
              <Bars className="h-3.5 w-[1.15rem]" />
            </button>
          </div>
        </nav>
      </header>

      {/* phones only: stays reachable after the bar has scrolled away */}
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        aria-controls="mobile-menu"
        tabIndex={scrolled && !menuOpen ? 0 : -1}
        className={cx(
          "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-[70] grid size-12 place-items-center border-2 border-cyan/60 bg-bg/90 text-cyan shadow-[0_0_20px_-6px_rgb(59_227_255/0.6)] backdrop-blur-sm transition-[opacity,transform] duration-300 md:hidden",
          scrolled && !menuOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <Bars className="h-3.5 w-[1.15rem]" />
      </button>

      {menuOpen ? <MobileMenu onClose={closeMenu} recruitmentOpen={recruitmentOpen} /> : null}
    </>
  );
}
