"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

/* A tiny original pixel hero in the site's colours: 12 wide, legs swap between two frames. */
const COLORS: Record<string, string> = {
  b: "#ff4d9d", // cap
  h: "#5a3a22", // hair
  f: "#ffd0a0", // skin
  e: "#14162b", // eye
  s: "#3be3ff", // shirt
  p: "#7a5cff", // trousers
  d: "#14162b", // shoes
};
const BODY = [
  "....bbbbb...",
  "...bbbbbbbb.",
  "...hhhffeff.",
  "..hfhfffeff.",
  "..hfhhfffff.",
  "...hffffff..",
  "....ffffff..",
  "..sssppsss..",
  ".sssspppsss.",
  ".fssspppssf.",
  ".ff.pppp.ff.",
  "...pppppp...",
];
const LEGS_A = ["..ppp..ppp..", "..ddd..ddd..", ".dddd..dddd."];
const LEGS_B = ["...pppppp...", "...dddddd...", "...dddddd..."];
const QMARK = [".xxx.", "x...x", "....x", "..xx.", "..x..", ".....", "..x.."];

function Pixels({ rows, y0 = 0, colors }: { rows: string[]; y0?: number; colors: Record<string, string> }) {
  return (
    <>
      {rows.flatMap((row, y) =>
        [...row].map((c, x) => (c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y + y0} width="1" height="1" fill={colors[c]} />)),
      )}
    </>
  );
}

/** Night clouds: dusky violet with a lighter rim. */
function Cloud({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x + 3} y={y - 2} width="6" height="2" fill="#3a3391" />
      <rect x={x} y={y} width="12" height="3" fill="#2d2878" />
      <rect x={x + 3} y={y - 2} width="6" height="1" fill="#5a52c8" />
      <rect x={x} y={y} width="12" height="1" fill="#4a44ad" />
    </g>
  );
}

function Block({ x, hit = false }: { x: number; hit?: boolean }) {
  return (
    <g className={hit ? "sg-bump" : undefined}>
      <rect x={x} y="44" width="10" height="10" fill="#4a2a9c" />
      <rect x={x + 1} y="45" width="8" height="8" fill="#a46bff" />
      <rect x={x + 1} y="45" width="8" height="1" fill="#d2b4ff" />
      <rect x={x + 1} y="52" width="8" height="1" fill="#7a46d8" />
      <g transform={`translate(${x + 2.5} 45.5)`}>
        <Pixels rows={QMARK} colors={{ x: "#3be3ff" }} />
      </g>
      {hit ? <rect className="sg-used" x={x} y="44" width="10" height="10" fill="#241f63" /> : null}
    </g>
  );
}

const STARS = Array.from({ length: 46 }, (_, i) => {
  const h = (n: number) => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1;
  return { x: Math.floor(h(1) * 100), y: Math.floor(h(2) * 50) + 8, d: +(h(3) * 3).toFixed(2), big: h(4) > 0.84 };
});

const SPARKS = Array.from({ length: 30 }, (_, i) => ({
  a: i * 12 + ((i * 7) % 5),
  d: (((i * 37) % 100) / 100) * 1.1,
  dx: ((i * 53) % 9) - 4,
}));

/**
 * Played when the signature is clicked: a sling-ring portal opens, a night-sky pixel world pops out,
 * the maker climbs out of the pipe, bumps a block, introduces themselves and drops back in. Tap to skip.
 */
export function PortalFx({ onSkip }: { onSkip: () => void }) {
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onSkip();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onSkip]);

  return createPortal(
    <div className="sg" role="status" aria-live="polite" onClick={onSkip}>
      <span className="sr-only">Opening Sarvagya&apos;s GitHub</span>

      <div className="sg-world" aria-hidden>
        <svg
          viewBox="0 0 100 90"
          preserveAspectRatio="xMidYMax slice"
          shapeRendering="crispEdges"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="sg-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#05050b" />
              <stop offset="0.55" stopColor="#0d0c2b" />
              <stop offset="1" stopColor="#2a1f7a" />
            </linearGradient>
            <linearGradient id="sg-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a46bff" stopOpacity="0" />
              <stop offset="1" stopColor="#ff4d9d" stopOpacity="0.35" />
            </linearGradient>
            <pattern id="sg-brick" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="#241f63" />
              <rect width="8" height="1" fill="#0f0e2e" />
              <rect y="4" width="8" height="1" fill="#0f0e2e" />
              <rect width="1" height="4" fill="#0f0e2e" />
              <rect x="4" y="4" width="1" height="4" fill="#0f0e2e" />
              <rect y="1" width="8" height="1" fill="#4a3fb5" opacity="0.7" />
              <rect x="1" y="5" width="3" height="1" fill="#4a3fb5" opacity="0.45" />
            </pattern>
            {/* hides the maker inside the pipe: everything except the pipe's mouth */}
            <clipPath id="sg-pipe-clip">
              <path clipRule="evenodd" d="M-20 -20H120V110H-20Z M58 62H70V110H58Z" />
            </clipPath>
          </defs>

          <rect width="100" height="90" fill="url(#sg-sky)" />
          <rect y="30" width="100" height="44" fill="url(#sg-glow)" />

          {STARS.map((s, i) => (
            <rect
              key={i}
              className="sg-star"
              x={s.x}
              y={s.y}
              width={s.big ? 1.2 : 0.7}
              height={s.big ? 1.2 : 0.7}
              fill={i % 5 === 0 ? "#aee6ff" : i % 7 === 0 ? "#ffb3d9" : "#fff"}
              style={{ animationDelay: `${s.d}s` }}
            />
          ))}

          {/* moon */}
          <circle cx="64" cy="11" r="4.5" fill="#c8cef0" opacity="0.9" />
          <circle cx="62.6" cy="9.6" r="1.1" fill="#9aa2d0" opacity="0.7" />
          <circle cx="65.4" cy="12.8" r="1.3" fill="#9aa2d0" opacity="0.6" />

          <Cloud x={6} y={36} />
          <Cloud x={72} y={34} />
          <Cloud x={40} y={26} />

          {/* hills */}
          <g fill="#17163d">
            <rect x="2" y="70" width="26" height="4" />
            <rect x="7" y="66" width="16" height="4" />
            <rect x="11" y="63" width="8" height="3" />
            <rect x="76" y="68" width="22" height="6" />
            <rect x="81" y="64" width="12" height="4" />
          </g>
          <g fill="#2a2570">
            <rect x="7" y="66" width="16" height="1" />
            <rect x="81" y="64" width="12" height="1" />
          </g>

          <rect x="0" y="74" width="100" height="16" fill="url(#sg-brick)" />
          <rect x="0" y="74" width="100" height="1" fill="#3be3ff" opacity="0.85" />

          <Block x={32} />
          <Block x={44} hit />
          <Block x={56} />

          {/* the maker, clipped so he rises out of and drops into the pipe's mouth */}
          <g clipPath="url(#sg-pipe-clip)">
            <g className="sg-walk">
              <Pixels rows={BODY} colors={COLORS} />
              <g className="sg-leg-a">
                <Pixels rows={LEGS_A} y0={12} colors={COLORS} />
              </g>
              <g className="sg-leg-b">
                <Pixels rows={LEGS_B} y0={12} colors={COLORS} />
              </g>
            </g>
          </g>

          {/* pipe */}
          <rect x="58" y="66" width="12" height="8" fill="#0f7a99" />
          <rect x="59" y="66" width="2" height="8" fill="#6fe3ff" />
          <rect x="57" y="62" width="14" height="4" fill="#3be3ff" />
          <rect x="58" y="62" width="2" height="4" fill="#c4f6ff" />
          <rect x="57" y="65" width="14" height="1" fill="#0b5870" />
        </svg>

        <div className="sg-hud">
          <span>SARVAGYA</span>
          <span>WORLD 1-1</span>
        </div>
        <div className="sg-text">
          <p className="sg-title">
            Hi, I&apos;m <span>Sarvagya</span>
          </p>
        </div>
        <p className="sg-hint">▼ opening github</p>
      </div>

      <div className="sg-ring" aria-hidden>
        <svg viewBox="-50 -50 100 100" className="h-full w-full">
          <g className="sg-spin">
            <circle r="47" fill="none" stroke="#ffb347" strokeWidth="2.2" strokeDasharray="1.2 3" />
          </g>
          <g className="sg-spin sg-spin-rev">
            <circle r="43.5" fill="none" stroke="#ff7a1a" strokeWidth="1.2" strokeDasharray="10 4 2 4" />
          </g>
          <g className="sg-spin sg-spin-fast">
            <circle r="49.2" fill="none" stroke="#ffe0a0" strokeWidth="0.7" strokeDasharray="0.5 5" />
          </g>
        </svg>
        {SPARKS.map((s, i) => (
          <span
            key={i}
            className="sg-spark"
            style={{ ["--a" as string]: `${s.a}deg`, ["--d" as string]: `${s.d}s`, ["--dx" as string]: `${s.dx}vmin` }}
          >
            <i />
          </span>
        ))}
      </div>
    </div>,
    document.body,
  );
}
