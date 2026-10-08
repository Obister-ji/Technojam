"use client";

import { useEffect, useState } from "react";
import { useChrome } from "@/components/command/ChromeProvider";

const HINTS = ["projects", "hackathons", "dexterix", "events", "people", "how to join"];

/** 9×9 pixel magnifying glass. */
export function PixelGlass({ className }: { className?: string }) {
  const px = ["011110000", "100001000", "100001000", "100001000", "100001000", "011111000", "000001100", "000000110", "000000011"];
  return (
    <svg viewBox="0 0 9 9" className={className} aria-hidden shapeRendering="crispEdges" fill="currentColor">
      {px.flatMap((row, y) => [...row].map((b, x) => (b === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)))}
    </svg>
  );
}

/** Cycles through things you could search for, typed like a terminal prompt. */
function useTypedHint() {
  const [text, setText] = useState(HINTS[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let word = 0;
    let len = HINTS[0].length;
    let deleting = true;
    let timer = window.setTimeout(function tick() {
      if (deleting) {
        len -= 1;
        if (len === 0) {
          deleting = false;
          word = (word + 1) % HINTS.length;
        }
      } else len += 1;
      setText(HINTS[word].slice(0, len));
      const done = !deleting && len === HINTS[word].length;
      if (done) deleting = true;
      timer = window.setTimeout(tick, done ? 2400 : deleting ? 40 : 90);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return text;
}

/**
 * The navbar search, styled as a terminal prompt: `> find projects▌ [^K]`.
 * Phones get a compact pixel-glass button instead.
 */
export function SearchTrigger() {
  const { openPalette } = useChrome();
  const hint = useTypedHint();

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        aria-label="Search (Ctrl K)"
        className="group relative hidden h-10 w-56 items-center gap-2 overflow-hidden border-2 border-line-strong bg-bg-raised/70 pr-1.5 pl-2.5 font-mono text-[0.78rem] transition-[border-color,box-shadow] duration-300 hover:border-cyan hover:shadow-[0_0_24px_-6px_rgb(59_227_255/0.7)] md:inline-flex xl:w-64"
      >
        {/* scanlines */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/0.035)_0_1px,transparent_1px_3px)]"
        />
        <PixelGlass className="size-3.5 shrink-0 text-cyan transition-transform duration-300 group-hover:scale-110" />
        <span aria-hidden className="text-pulse">
          find
        </span>
        <span
          aria-hidden
          className="min-w-0 flex-1 overflow-hidden text-left whitespace-nowrap text-fg-muted transition-colors group-hover:text-fg"
        >
          {hint}
          <span className="caret ml-px inline-block h-3 w-1.5 translate-y-0.5 bg-cyan" />
        </span>
        <kbd
          aria-hidden
          className="shrink-0 border border-b-[3px] border-line-strong bg-bg px-1.5 py-px font-pixel text-[0.58rem] leading-tight text-fg-muted transition-colors group-hover:border-cyan group-hover:text-cyan"
        >
          ctrl k
        </kbd>
      </button>

      <button
        type="button"
        onClick={openPalette}
        aria-label="Search"
        className="inline-flex size-10 items-center justify-center border-2 border-line-strong text-cyan transition-colors hover:border-cyan md:hidden"
      >
        <PixelGlass className="size-4" />
      </button>
    </>
  );
}
