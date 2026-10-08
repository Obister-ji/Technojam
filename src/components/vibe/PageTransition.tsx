"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const BARS = 14;
const COVER_MS = 480;

type Phase = "idle" | "cover" | "reveal";

/**
 * A pixel wipe between pages: columns of night-sky drop down over the old page, the route
 * changes underneath, then they lift off the new one. Internal link clicks are intercepted so
 * the cover plays first; everything else (new tabs, hash links, modifier clicks, external links)
 * behaves normally. Skipped entirely for people who prefer reduced motion.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const covering = useRef(false);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  // Intercept internal navigation.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (covering.current) {
        e.preventDefault();
        return;
      }
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // same page (or just a #hash on it): let the browser scroll as usual
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      e.preventDefault();
      covering.current = true;
      setPhase("cover");
      later(() => router.push(url.pathname + url.search + url.hash), COVER_MS);
      // if the route never changes (error, offline), don't leave the screen covered
      later(() => {
        if (covering.current) {
          covering.current = false;
          setPhase("reveal");
          later(() => setPhase("idle"), 700);
        }
      }, 5000);
    };

    document.addEventListener("click", onClick, true);
    const pending = timers.current;
    return () => {
      document.removeEventListener("click", onClick, true);
      pending.forEach(clearTimeout);
    };
  }, [router]);

  // The new route has rendered: lift the cover.
  useEffect(() => {
    if (!covering.current) return;
    covering.current = false;
    const raf = requestAnimationFrame(() => setPhase("reveal"));
    const done = window.setTimeout(() => setPhase("idle"), 900);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div aria-hidden className="pointer-events-auto fixed inset-0 z-[90] flex overflow-hidden">
      {Array.from({ length: BARS }, (_, i) => (
        <span
          key={i}
          className={`wipe-bar ${phase === "cover" ? "wipe-in" : "wipe-out"}`}
          // staggered from the left, with a little jitter so it reads as pixels, not a curtain
          style={{ ["--d" as string]: `${i * 22 + ((i * 37) % 5) * 12}ms` }}
        />
      ))}
    </div>
  );
}
