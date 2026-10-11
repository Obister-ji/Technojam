"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "@/components/ui/Icon";
import { useAchievements } from "./Achievements";

/** A cat, seen from behind, looking up at the sky. c = fur, p = inner ear, d = shade. */
const CAT = [
  "..cc....cc..",
  "..cpc..cpc..",
  "..cccccccc..",
  "..cccccccc..",
  "...cccccc...",
  "..cccccccc..",
  ".cccccccccc.",
  ".cccccccccc.",
  ".cccccccccc.",
  ".ccccdcccccc",
  ".ccccdccccdc",
  ".cccccccccdc",
  "..dddddddd.c",
];
const FUR: Record<string, string> = { c: "#e9d2b8", p: "#d98aa3", d: "#a98266" };

/** The ledge it sits on: [row, x where the rock starts]; everything to the right is rock. */
const LEDGE: [number, number][] = [
  [0, 60],
  [1, 54],
  [2, 50],
  [3, 44],
  [4, 40],
  [5, 33],
  [6, 29],
  [7, 21],
  [8, 17],
  [9, 9],
  [10, 5],
  [11, 0],
  [12, 0],
  [13, 0],
];

function CatOnRock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 -14 120 28" className={className} aria-hidden shapeRendering="crispEdges">
      {/* rock */}
      {LEDGE.map(([y, x]) => (
        <rect key={y} x={x} y={y} width={120 - x} height={1} fill={y === 0 ? "#2a2f55" : y === 1 ? "#171a35" : "#0a0b17"} />
      ))}
      {[
        [78, 3],
        [92, 4],
        [66, 5],
        [104, 6],
        [48, 8],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={2} height={1} fill="#151831" />
      ))}
      {/* cat, sitting on the top edge */}
      <g transform="translate(88 -13)">
        {CAT.flatMap((row, y) =>
          [...row].map((c, x) => (c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={FUR[c]} />)),
        )}
      </g>
    </svg>
  );
}

/** A 4-point pixel sparkle, centred on its position. */
function Sparkle({ x, y, size = 1, delay = 0 }: { x: string; y: string; size?: number; delay?: number }) {
  return (
    <svg
      viewBox="0 0 7 7"
      aria-hidden
      shapeRendering="crispEdges"
      className="finale-sparkle pointer-events-none absolute text-[#cfe2ff]"
      style={{ left: x, top: y, width: `${size * 1.1}rem`, height: `${size * 1.1}rem`, animationDelay: `${delay}s` }}
      fill="currentColor"
    >
      <rect x="3" y="0" width="1" height="7" opacity="0.55" />
      <rect x="0" y="3" width="7" height="1" opacity="0.55" />
      <rect x="2" y="2" width="3" height="3" />
    </svg>
  );
}

const SPARKLES = [
  { x: "10%", y: "29%", size: 1, delay: 0 },
  { x: "85%", y: "13%", size: 1.3, delay: 1.2 },
  { x: "6%", y: "71%", size: 1.2, delay: 2.1 },
  { x: "96%", y: "50%", size: 0.9, delay: 0.6 },
  { x: "34%", y: "9%", size: 0.8, delay: 1.8 },
  { x: "70%", y: "22%", size: 0.7, delay: 2.7 },
];

/**
 * The last screen: one line, one sentence, two buttons, a cat watching the stars. Reaching the
 * buttons unlocks the scroller badge. Jam night is a single quiet line underneath.
 */
export function Finale({ jam }: { jam: { when?: string; href: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const { unlock } = useAchievements();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && unlock("scroller"), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [unlock]);

  return (
    <section
      aria-labelledby="final-title"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-(--gutter) py-[14svh] text-center"
    >
      {SPARKLES.map((s) => (
        <Sparkle key={s.x + s.y} {...s} />
      ))}

      <h2
        id="final-title"
        className="flex flex-wrap justify-center gap-x-[0.9em] gap-y-3 font-pixel text-[clamp(2.2rem,8vw,6.5rem)] leading-none tracking-[0.16em] text-white uppercase glow sm:tracking-[0.28em]"
      >
        <span>Be</span>
        <span>kind</span>
        <span className="text-pulse">fr</span>
      </h2>

      <p className="mt-[clamp(2rem,6svh,3.5rem)] font-mono text-[clamp(0.8rem,1.4vw,1rem)] tracking-[0.4em] text-fg-muted lowercase">
        <span className="text-pulse">worth</span> remembering
      </p>

      <div ref={ref} className="mt-[clamp(2.5rem,8svh,4.5rem)] flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
        <Link href="/join" className="btn-corner btn-corner-pink">
          Join TechnoJam <ArrowRight className="size-3" />
        </Link>
        <Link href="/projects" className="btn-corner btn-corner-ghost">
          See what we built <ArrowRight className="size-3" />
        </Link>
      </div>

      <p className="mt-[clamp(2.5rem,8svh,4.5rem)] font-mono text-[0.68rem] tracking-[0.18em] text-fg-subtle uppercase">
        jam night · {jam.when ?? "schedule soon"} ·{" "}
        <Link href={jam.href} className="inline-flex min-h-11 items-center text-cyan underline-offset-4 hover:underline">
          come build
        </Link>
      </p>

      <CatOnRock className="pointer-events-none absolute right-0 bottom-0 w-[min(24rem,58vw)]" />
    </section>
  );
}
