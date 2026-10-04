"use client";

import { useEffect, useState } from "react";

const SEGMENTS = 10;

/** Scroll progress as a throttle gauge — a quiet nod to the tagline. */
export function ThrottleMeter({ className = "" }: { className?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const lit = Math.round(progress * SEGMENTS);
  return (
    <div className={`items-center gap-2 pr-2 label-mono text-fg-subtle ${className}`} aria-hidden>
      <span>THR</span>
      <span className="flex gap-[3px]">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span
            key={i}
            className="h-2.5 w-1 transition-colors duration-200"
            style={{
              background:
                i < lit
                  ? `color-mix(in oklab, var(--color-cyan), var(--color-pulse) ${(i / SEGMENTS) * 100}%)`
                  : "var(--color-line-strong)",
            }}
          />
        ))}
      </span>
      <span className="w-9 tabular-nums">{String(Math.round(progress * 100)).padStart(3, "0")}%</span>
    </div>
  );
}
