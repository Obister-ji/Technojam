"use client";

import { useRef, type PointerEvent } from "react";
import type { ImageAsset } from "@/lib/content/types";

export interface Maker {
  key: string;
  name?: string;
  builds: string;
  detail?: string;
  image?: ImageAsset;
}

/**
 * Drag (or swipe) sideways through real members. Hover/focus reveals
 * three lines only: name, what they build, one human detail.
 */
export function PeopleStrip({ makers }: { makers: Maker[] }) {
  const strip = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  const down = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !strip.current) return;
    drag.current = { x: e.clientX, left: strip.current.scrollLeft };
  };
  const move = (e: PointerEvent) => {
    if (!drag.current || !strip.current) return;
    strip.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const up = () => (drag.current = null);

  return (
    <section aria-labelledby="people-title" className="py-24">
      <div className="container-site">
        <h2 id="people-title" className="text-[clamp(1.9rem,4.2vw,4rem)] leading-[0.9] font-black tracking-[-0.04em] uppercase font-wide">
          People who
          <br />
          make things.
        </h2>
      </div>

      <ul
        ref={strip}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        tabIndex={0}
        aria-label="Members — drag or scroll sideways"
        className="mt-14 flex cursor-grab [scrollbar-width:thin] gap-4 overflow-x-auto px-(--gutter) pb-4 select-none active:cursor-grabbing"
      >
        {makers.map((m, i) => (
          <li key={m.key} className="w-[15rem] shrink-0 sm:w-[18rem]" style={{ transform: `rotate(${((i % 3) - 1) * 0.8}deg)` }}>
            <figure
              tabIndex={0}
              className="plate group relative aspect-[3/4] overflow-hidden border border-fg/25 bg-bg-sunken focus-visible:outline-2"
            >
              {m.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- Sanity CDN
                <img
                  src={`${m.image.url}?w=600&h=800&fit=crop&auto=format`}
                  alt={m.image.alt || m.name || ""}
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="halftone grain flex h-full items-start p-4" aria-hidden>
                  <span className="font-mono text-[0.68rem] tracking-[0.12em] text-fg-muted uppercase">Photo needed</span>
                </div>
              )}
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-[calc(100%-2.75rem)] bg-bg px-4 py-3 transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-y-0 group-focus-visible:translate-y-0">
                <p className="text-lg font-black tracking-tight uppercase font-wide">
                  {m.name ?? <span className="data-required">[ NAME REQUIRED ]</span>}
                </p>
                <p className="mt-1 font-mono text-[0.78rem]">{m.builds}</p>
                <p className="mt-0.5 font-serif text-[0.95rem] text-fg-muted italic">{m.detail ?? "[ real detail required ]"}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
