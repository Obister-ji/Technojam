"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Project } from "@/lib/content/types";
import type { Scene } from "@/lib/pixel";
import { PixelArt } from "@/components/vibe/PixelArt";

function status(p: Project) {
  if (p.statusNote) return p.statusNote;
  if (p.status === "event") return p.relatedEvent ? `SHIPPED FOR ${p.relatedEvent.title}` : `SHIPPED ${p.year}`;
  if (p.status === "maintained") return "LIVE";
  if (p.status === "active") return "WORKS";
  if (p.status === "experiment") return "EXPERIMENT";
  return "ARCHIVED";
}

/** The little world the projects circle: same pixel style as the hero planet. */
const PLANET: Scene = {
  sky: [],
  orb: {
    x: 0.5,
    y: 0.5,
    r: 0.44,
    palette: ["#01040f", "#031233", "#072a66", "#0f4a9e", "#1f78d0", "#4fb4f0", "#a8e4ff"],
    rim: "#3be3ff",
    clouds: true,
  },
  seed: 11,
};

interface Pop {
  i: number;
  /** moon position inside the stage, in % */
  x: number;
  y: number;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Things we shipped, as an orbit: a small pixel planet with the projects circling it as moons.
 * As you scroll in, the camera starts zoomed right up on the planet and pulls back while the
 * moons fly out of it into their orbit (--z goes 0 → 1, eased and smoothed). Once settled,
 * hover, focus or tap a moon for a small pop-up; the orbit slows to a stop while you look.
 * Reduced motion: no pinning or zoom, just the settled orbit.
 */
export function ProjectReel({ projects }: { projects: Project[] }) {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const closeTimer = useRef(0);
  const [pop, setPop] = useState<Pop | null>(null);

  // Scroll → zoom. A tall track holds a one-screen sticky stage; progress through the track
  // drives --z, and the value glides toward its target instead of jumping with every wheel notch.
  useEffect(() => {
    const el = track.current;
    const st = stage.current;
    if (!el || !st || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cur = 0;
    let target = 0;
    let raf = 0;
    const read = () => {
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? clamp(-r.top / span) : 1;
      // the zoom finishes about 70% of the way through, leaving a calm pause once it's settled
      target = easeOut(clamp(p / 0.7));
    };
    const apply = (v: number) => {
      el.style.setProperty("--z", v.toFixed(4));
      st.dataset.ready = String(v > 0.95);
    };
    const loop = () => {
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.0007) {
        cur = target;
        apply(cur);
        raf = 0;
        return;
      }
      apply(cur);
      raf = requestAnimationFrame(loop);
    };
    const onScroll = () => {
      read();
      if (!raf) raf = requestAnimationFrame(loop);
    };

    read();
    cur = target;
    apply(cur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const open = (i: number, dot: HTMLElement) => {
    clearTimeout(closeTimer.current);
    const s = stage.current?.getBoundingClientRect();
    const d = dot.getBoundingClientRect();
    if (!s) return;
    setPop({ i, x: ((d.left + d.width / 2 - s.left) / s.width) * 100, y: ((d.top + d.height / 2 - s.top) / s.height) * 100 });
  };
  const closeSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setPop(null), 180);
  };
  const keep = () => clearTimeout(closeTimer.current);

  // Escape or a click elsewhere closes the pop-up.
  useEffect(() => {
    if (!pop) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPop(null);
    const onDown = (e: PointerEvent) => {
      if (!stage.current?.contains(e.target as Node)) setPop(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [pop]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const p = pop ? projects[pop.i] : null;

  return (
    <section ref={track} aria-labelledby="reel-title" className="relative h-[190svh] motion-reduce:h-auto" style={{ ["--z" as string]: 1 }}>
      <div className="sticky top-0 container-site flex h-[100svh] min-h-[min(32rem,100svh)] min-w-0 flex-col justify-center overflow-hidden py-[6svh] motion-reduce:static">
        <div className="orbit-title">
          <p className="font-mono text-[0.7rem] tracking-[0.14em] text-fg-subtle uppercase">
            {"// shipped · "}
            {String(projects.length).padStart(2, "0")}
          </p>
          <h2 id="reel-title" className="mt-3 font-pixel text-[clamp(1.3rem,2.4vw,2rem)] leading-[1.05] uppercase">
            Things we <span className="text-cyan">shipped.</span>
          </h2>
        </div>

        <div
          ref={stage}
          data-paused={pop !== null}
          className="orbit orbit-zoom [container-type:size] relative mx-auto mt-[3svh] aspect-square w-[min(58svh,86vw,36rem)]"
        >
          {/* soft glow and two quiet orbit rings */}
          <span
            aria-hidden
            className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle,rgb(59_227_255/0.14),transparent_70%)]"
          />
          <span aria-hidden className="orbit-rings absolute inset-[8%] rounded-full border border-dashed border-line-strong" />
          <span aria-hidden className="orbit-rings absolute inset-[-2%] rounded-full border border-line opacity-60" />

          {/* the planet, with the count written on it */}
          <div className="absolute inset-[31%] grid place-items-center">
            <PixelArt scene={PLANET} width={48} height={48} className="absolute inset-0 h-full w-full" />
            <p className="relative text-center font-pixel leading-none uppercase [text-shadow:0_2px_0_rgb(0_0_0/0.6),0_0_14px_rgb(0_0_0/0.7)]">
              <span className="block text-[9cqw] text-white">{String(projects.length).padStart(2, "0")}</span>
              <span className="mt-[1cqw] block text-[2.6cqw] tracking-[0.12em] text-white/85">shipped</span>
            </p>
          </div>

          {/* the moons */}
          <ul aria-label="Projects" className="orbit-ring orbit-moons absolute inset-0 [--orbit-r:36cqw] sm:[--orbit-r:42cqw]">
            {projects.map((x, i) => {
              const angle = (360 / projects.length) * i - 90;
              const on = pop?.i === i;
              return (
                <li
                  key={x.slug}
                  className="absolute top-1/2 left-1/2"
                  style={{ transform: `rotate(${angle}deg) translateX(calc(var(--orbit-r) * var(--z, 1))) rotate(${-angle}deg)` }}
                >
                  <div className="moon-upright">
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls="orbit-pop"
                      onPointerEnter={(e) => e.pointerType === "mouse" && open(i, e.currentTarget)}
                      onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
                      onFocus={(e) => open(i, e.currentTarget)}
                      onClick={(e) => (on ? setPop(null) : open(i, e.currentTarget))}
                      className="group relative block -translate-x-1/2 -translate-y-1/2 after:absolute after:-inset-3 after:content-['']"
                    >
                      <span
                        aria-hidden
                        className={`block size-3.5 rounded-full transition-[background-color,box-shadow,transform] duration-300 ${
                          on
                            ? "scale-125 bg-pulse shadow-[0_0_18px_4px_rgb(255_77_157/0.6)]"
                            : "bg-cyan shadow-[0_0_14px_2px_rgb(59_227_255/0.55)] group-hover:scale-125"
                        }`}
                      />
                      <span
                        className={`orbit-label absolute top-5 left-1/2 w-[6.5rem] -translate-x-1/2 text-center font-mono text-[0.6rem] leading-tight tracking-[0.1em] uppercase transition-colors sm:w-[8rem] sm:text-[0.66rem] ${
                          on ? "text-fg" : "text-fg-muted group-hover:text-fg"
                        }`}
                      >
                        {x.title}
                      </span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* the pop-up: small, calm, beside its moon (below the orbit on phones) */}
          {p && pop ? (
            <div
              id="orbit-pop"
              role="dialog"
              aria-label={p.title}
              onPointerEnter={keep}
              onPointerLeave={closeSoon}
              className="orbit-pop absolute z-20 w-[min(17rem,80vw)] border border-line-strong bg-bg-raised/95 p-5 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9)] backdrop-blur-sm"
              style={
                {
                  top: `${Math.min(80, Math.max(20, pop.y))}%`,
                  // sit inward of the moon, clear of its label
                  [pop.x > 50 ? "right" : "left"]: `calc(${pop.x > 50 ? 100 - pop.x : pop.x}% + 5.5rem)`,
                } as CSSProperties
              }
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[0.66rem] tracking-[0.12em] text-cyan uppercase">
                  {String(pop.i + 1).padStart(2, "0")} · {p.year}
                </p>
                <button
                  type="button"
                  onClick={() => setPop(null)}
                  aria-label="Close"
                  className="-mt-3 -mr-3 grid size-11 place-items-center font-mono text-lg text-fg-subtle hover:text-fg"
                >
                  ×
                </button>
              </div>
              <h3 className="mt-2 font-pixel text-[0.95rem] leading-snug uppercase">{p.title}</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-fg-muted">
                Built because {p.builtBecause ?? <span className="data-required">[ REAL DATA REQUIRED ]</span>}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.68rem] tracking-[0.1em] uppercase">
                {p.repository ? (
                  <a
                    href={p.repository}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center text-cyan underline underline-offset-4 hover:text-pulse"
                  >
                    Source ↗
                  </a>
                ) : null}
                {p.liveUrl ? (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-cyan underline underline-offset-4 hover:text-pulse">
                    Demo ↗
                  </a>
                ) : null}
                <span className="text-fg-subtle">{status(p)}</span>
              </div>
            </div>
          ) : null}
        </div>

        <p
          aria-hidden
          className="orbit-title mt-[2svh] text-center font-mono text-[0.66rem] tracking-[0.14em] text-fg-subtle uppercase [@media(max-height:30rem)]:hidden"
        >
          hover or tap a moon
        </p>
      </div>
    </section>
  );
}
