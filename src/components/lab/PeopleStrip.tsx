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
        <h2 id="people-title" className="font-pixel text-[clamp(1.8rem,4vw,3.4rem)] leading-[1.02] uppercase">
          People who
          <br />
          <span className="text-cyan">make things.</span>
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
        className="mt-14 flex cursor-grab [scrollbar-width:none] gap-4 overflow-x-auto px-(--gutter) pb-4 select-none active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {makers.map((m, i) => (
          <li key={m.key} className="w-[15rem] shrink-0 sm:w-[18rem]" style={{ transform: `rotate(${((i % 3) - 1) * 0.8}deg)` }}>
            <figure
              tabIndex={0}
              className="plate group relative aspect-[3/4] overflow-hidden border border-line-strong bg-bg-sunken transition-[border-color,box-shadow] hover:border-cyan hover:shadow-[0_0_30px_-6px_rgb(59_227_255/0.45)] focus-visible:outline-2"
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
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-[calc(100%-2.75rem)] bg-bg-raised px-4 py-3 transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-y-0 group-focus-visible:translate-y-0 [@media(hover:none)]:translate-y-0">
                <p className="font-pixel text-base uppercase">{m.name ?? <span className="data-required">[ NAME REQUIRED ]</span>}</p>
                <p className="mt-1 font-mono text-[0.78rem]">{m.builds}</p>
                <p className="mt-0.5 text-[0.9rem] text-fg-muted">{m.detail ?? "[ real detail required ]"}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
