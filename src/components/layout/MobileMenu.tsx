"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Wordmark } from "@/components/brand/Logo";
import { useChrome } from "@/components/command/ChromeProvider";
import { useModalDialog } from "@/components/command/useModalDialog";
import { ArrowRight, Close, Search, Terminal } from "@/components/ui/Icon";
import { JOIN_NAV, PRIMARY_NAV, SECONDARY_NAV } from "@/lib/nav";

export function MobileMenu({ onClose, recruitmentOpen }: { onClose: () => void; recruitmentOpen: boolean }) {
  const ref = useModalDialog(onClose);
  const pathname = usePathname();
  const { openPalette, openConsole } = useChrome();
  const firstPath = useRef(pathname);

  // Close once navigation lands on a new route.
  useEffect(() => {
    if (pathname !== firstPath.current) onClose();
  }, [pathname, onClose]);

  const items = [...PRIMARY_NAV, JOIN_NAV];

  return (
    <dialog
      ref={ref}
      id="mobile-menu"
      aria-label="Site menu"
      className="mobile-menu m-0 h-dvh max-h-none w-screen max-w-none bg-bg p-0 text-fg backdrop:bg-transparent"
    >
      <div className="container-site flex h-full flex-col">
        <div className="flex h-(--nav-h) shrink-0 items-center justify-between">
          <Wordmark />
          <button type="button" onClick={onClose} className="inline-flex h-11 items-center gap-2 text-sm font-semibold" autoFocus>
            Close <Close className="size-5" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto py-6">
          <ol className="grid">
            {items.map((item, i) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href} className="menu-item border-b border-line" style={{ ["--i" as string]: i }}>
                  <Link
                    href={item.href}
                    onClick={() => item.href === pathname && onClose()}
                    aria-current={active ? "page" : undefined}
                    className="group flex items-baseline gap-4 py-4"
                  >
                    <span className="w-6 label-mono text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">
                      <span className={`block text-3xl font-extrabold uppercase font-wide ${active ? "text-pulse" : ""}`}>
                        {item.label}
                        {item.href === JOIN_NAV.href && recruitmentOpen ? (
                          <span className="ml-3 align-middle label-mono text-pulse">● open</span>
                        ) : null}
                      </span>
                      <span className="mt-1 block text-sm text-fg-muted">{item.description}</span>
                    </span>
                    <ArrowRight className="size-5 text-fg-subtle transition-transform group-active:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ol>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {SECONDARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-fg-muted underline underline-offset-4">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-line py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => {
              onClose();
              setTimeout(openPalette, 0);
            }}
            className="inline-flex h-12 items-center justify-center gap-2 border border-line-strong text-sm"
          >
            <Search className="size-4" /> Search
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              setTimeout(openConsole, 0);
            }}
            className="inline-flex h-12 items-center justify-center gap-2 border border-line-strong font-mono text-sm"
          >
            <Terminal className="size-4" /> Console
          </button>
        </div>
      </div>
    </dialog>
  );
}
