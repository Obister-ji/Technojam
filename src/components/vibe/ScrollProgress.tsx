"use client";

import { useEffect, useRef } from "react";

/** A thin logo-ribbon bar along the top edge showing how far down the page you are. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const el = bar.current;
      const box = wrap.current;
      if (!el || !box) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.width = `${(p * 100).toFixed(2)}%`;
      // hidden until you've moved, and on pages too short to scroll
      box.style.opacity = max > 40 && p > 0.002 ? "1" : "0";
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // pages change height as content loads or the route changes
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] opacity-0 transition-opacity duration-300"
    >
      <div
        ref={bar}
        className="relative h-full w-0 bg-[linear-gradient(90deg,#3be3ff,#a46bff_55%,#ff4d9d)] bg-[length:100vw_100%] shadow-[0_0_10px_rgb(59_227_255/0.7)] transition-[width] duration-100 ease-out"
      >
        {/* a bright pixel at the leading edge */}
        <span className="absolute top-0 right-0 h-full w-1.5 bg-white" />
      </div>
    </div>
  );
}
