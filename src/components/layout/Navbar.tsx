"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mark, Wordmark } from "@/components/brand/Logo";
import { useChrome } from "@/components/command/ChromeProvider";
import { Search } from "@/components/ui/Icon";
import { cx } from "@/components/ui/primitives";
import { JOIN_NAV, PRIMARY_NAV } from "@/lib/nav";
import { MobileMenu } from "./MobileMenu";
import { ThrottleMeter } from "./ThrottleMeter";

export function Navbar({ recruitmentOpen }: { recruitmentOpen: boolean }) {
  const pathname = usePathname();
  const { openPalette } = useChrome();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent",
        )}
      >
        <nav aria-label="Primary" className="container-site flex h-(--nav-h) items-center gap-6">
          <Link href="/" className="mr-auto shrink-0" aria-label="TechnoJam — home">
            <Wordmark className="hidden sm:inline-flex" />
            <Mark className="h-9 sm:hidden" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {PRIMARY_NAV.map((item, i) => (
              // Mid-size screens show the first three; the rest live in the menu.
              <li key={item.href} className={i > 2 ? "hidden xl:block" : undefined}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cx(
                    "relative px-3 py-2 text-[0.92rem] transition-colors",
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

          <div className="flex items-center gap-2">
            {pathname === "/" ? (
              <ThrottleMeter className={cx("hidden transition-opacity duration-500 xl:flex", scrolled ? "opacity-100" : "opacity-0")} />
            ) : null}
            <button
              type="button"
              onClick={openPalette}
              aria-label="Search (Ctrl K)"
              className="group hidden h-10 items-center gap-2 px-3 text-sm text-fg-muted transition-colors hover:text-fg md:inline-flex"
            >
              <Search className="size-4" />
              <kbd className="hidden label-mono whitespace-nowrap text-fg-subtle xl:inline">Ctrl K</kbd>
            </button>
            <Link
              href={JOIN_NAV.href}
              aria-current={isActive(JOIN_NAV.href) ? "page" : undefined}
              className="hidden h-10 items-center gap-2 bg-fg px-4 text-sm font-semibold text-bg transition-colors hover:bg-pulse sm:inline-flex"
            >
              {recruitmentOpen ? <span aria-hidden className="pulse-dot size-1.5 rounded-full bg-pulse" /> : null}
              Join
              {recruitmentOpen ? <span className="sr-only">(recruitment open)</span> : null}
            </Link>
            <button
              type="button"
              onClick={openPalette}
              aria-label="Search"
              className="inline-flex size-11 items-center justify-center text-fg md:hidden"
            >
              <Search className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-11 items-center gap-2.5 pl-2 text-sm font-semibold xl:hidden"
            >
              <span aria-hidden className="grid gap-1.5">
                <span className="block h-px w-6 bg-fg" />
                <span className="block h-px w-4 justify-self-end bg-fg" />
              </span>
              Menu
            </button>
          </div>
        </nav>
      </header>
      {menuOpen ? <MobileMenu onClose={() => setMenuOpen(false)} recruitmentOpen={recruitmentOpen} /> : null}
    </>
  );
}
