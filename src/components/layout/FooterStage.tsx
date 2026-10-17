"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Mark } from "@/components/brand/Logo";
import { SpideyFx } from "@/components/layout/SpideyFx";
import { GitHub } from "@/components/ui/Icon";

const GITHUB = "https://github.com/Obister-ji";

interface Item {
  href: string;
  label: string;
}

/** Four-point stars, echoing the ones scattered through the painting: [x%, y%, size, delay]. */
const SPARKS: [number, number, number, number][] = [
  [9, 22, 1, 0],
  [86, 14, 1.2, 1.1],
  [92, 62, 0.9, 0.6],
  [14, 84, 1, 2.2],
];

function Spark({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <svg
      viewBox="0 0 7 7"
      aria-hidden
      shapeRendering="crispEdges"
      className="ft-spk pointer-events-none absolute text-[#ffe9c4]"
      style={{ left: `${x}%`, top: `${y}%`, width: `${size}rem`, height: `${size}rem`, animationDelay: `${delay}s` }}
      fill="currentColor"
    >
      <rect x="3" y="0" width="1" height="7" opacity="0.55" />
      <rect x="0" y="3" width="7" height="1" opacity="0.55" />
      <rect x="2" y="2" width="3" height="3" />
    </svg>
  );
}

/** A word whose letters rise in one by one; `start` keeps the colour wave continuous across words. */
function Word({ text, start, tone }: { text: string; start: number; tone?: "cyan" | "pink" }) {
  return (
    <span className="inline-flex" aria-hidden>
      {[...text].map((ch, i) => (
        <span key={i} className={`ft-letter${tone ? ` ft-letter-${tone}` : ""}`} style={{ ["--i" as string]: start + i }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/**
 * A quiet footer on a dimmed cosmic-burst painting: one giant headline, one row of links, one
 * line of credit. Everything animates only once it scrolls into view.
 */
export function FooterStage({
  navigation,
  socials,
  location,
  email,
}: {
  navigation: Item[];
  socials: Item[];
  location: string;
  email: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [live, setLive] = useState(false);
  const [fx, setFx] = useState(false);

  const fxTimers = useRef<number[]>([]);

  const finishSignature = (open: boolean, fade = false) => {
    fxTimers.current.forEach((t) => window.clearTimeout(t));
    fxTimers.current = [];
    if (open) {
      // blocked as a popup (some browsers expire the click too soon): fall back to this tab
      if (!window.open(GITHUB, "_blank", "noopener,noreferrer")) window.location.assign(GITHUB);
    }
    if (fade) fxTimers.current = [window.setTimeout(() => setFx(false), 500)];
    else setFx(false);
  };

  const openSignature = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (fx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    setFx(true);
    fxTimers.current = [window.setTimeout(() => finishSignature(true, true), 3700)];
  };

  useEffect(() => {
    setArmed(true);
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLive(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={root}
      className="ft-art relative isolate overflow-hidden [text-shadow:0_1px_14px_rgb(5_5_11/0.95)]"
      data-armed={armed ? "1" : undefined}
      data-live={live ? "1" : undefined}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0,transparent_2%,#000_26%)] [clip-path:inset(2px_0_0_0)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local art, cropped with object-fit */}
        <img
          src="/footer-burst.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="ft-img absolute inset-0 h-full w-full object-cover object-[58%_58%]"
        />
        <div className="ft-pulse absolute inset-0" />
        {/* wash: dims the painting so the type is the loudest thing here */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(5_5_11/0.82),rgb(5_5_11/0.72)_45%,rgb(5_5_11/0.92))]" />
        {SPARKS.map(([x, y, size, delay]) => (
          <Spark key={`${x}-${y}`} x={x} y={y} size={size} delay={delay} />
        ))}
      </div>

      <div className="container-site flex min-h-[min(80svh,38rem)] flex-col justify-between gap-10 pt-12 pb-[max(5rem,calc(env(safe-area-inset-bottom)+4rem))] max-md:[--gutter:1.5rem] sm:pt-14 md:pb-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-8">
          <h2
            aria-label="TechnoJam"
            className="flex items-center gap-[0.3em] font-pixel text-[clamp(2rem,11vw,3rem)] leading-none tracking-[0.02em] uppercase md:text-[clamp(2.3rem,6vw,5.25rem)] lg:-translate-y-[0.26em]"
          >
            <span className="ft-letter ft-logo" style={{ ["--i" as string]: 0 }}>
              <Mark className="h-[1.15em]" />
            </span>
            <span className="inline-flex" aria-hidden>
              <Word text="Techno" start={1} />
              <Word text="Jam" start={7} tone="cyan" />
            </span>
          </h2>

          <div className="ft-reveal lg:max-w-xs lg:text-right" style={{ ["--i" as string]: 2 }}>
            <p className="max-w-[28ch] text-[0.95rem] leading-relaxed text-fg-muted lg:max-w-none lg:text-[1rem]">
              Built by students who probably broke production at least once.
            </p>
            <ul className="mt-4 hidden flex-wrap gap-x-5 lg:flex lg:justify-end" aria-label="Social links">
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="ft-link ft-link-accent">
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:gap-5">
          <div
            className="ft-reveal grid grid-cols-2 gap-x-6 border-t border-[rgb(170_178_255/0.16)] pt-6 lg:block lg:pt-2"
            style={{ ["--i" as string]: 3 }}
          >
            <nav aria-label="Footer">
              <p aria-hidden className="mb-2 font-mono text-[0.6rem] tracking-[0.26em] text-fg-subtle uppercase lg:hidden">
                Explore
              </p>
              <ul className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-between lg:gap-x-6">
                {navigation.map((item, i) => (
                  <li key={item.href} className={i > 5 ? "max-lg:hidden" : undefined}>
                    <Link href={item.href} className="ft-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="lg:hidden">
              <p aria-hidden className="mb-2 font-mono text-[0.6rem] tracking-[0.26em] text-fg-subtle uppercase">
                Connect
              </p>
              <ul className="flex flex-col" aria-label="Social links">
                {socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="ft-link">
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="ft-reveal grid grid-cols-1 gap-y-3 border-t border-[rgb(170_178_255/0.1)] pt-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-x-4 lg:gap-y-1 lg:border-0 lg:pt-0"
            style={{ ["--i" as string]: 4 }}
          >
            <p className="max-w-[30ch] text-[0.9rem] leading-relaxed text-fg-muted lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:max-w-none lg:text-right lg:font-mono lg:text-[0.66rem] lg:tracking-[0.14em] lg:text-fg-subtle lg:uppercase">
              Anything between your screen and the server is my sculpture
            </p>

            <p className="order-3 flex flex-col text-[0.8rem] leading-snug text-fg-subtle lg:order-none lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:font-mono lg:text-[0.66rem] lg:tracking-[0.14em] lg:uppercase">
              <span>{location}</span>
              <a
                href={`mailto:${email}`}
                className="inline-flex min-h-10 items-center font-mono text-[0.72rem] tracking-[0.02em] text-fg-muted normal-case transition-colors hover:text-cyan lg:tracking-[0.04em]"
              >
                {email}
              </a>
            </p>

            <a
              href={GITHUB}
              target="_blank"
              rel="noreferrer"
              onClick={openSignature}
              className="ft-name-link group order-2 inline-flex min-h-10 items-center gap-3 justify-self-start lg:order-none lg:col-start-2 lg:row-start-2 lg:justify-self-end"
            >
              <span className="ft-name font-pixel text-[clamp(0.78rem,1.1vw,0.95rem)] tracking-[0.24em]">sarvagya</span>
              <GitHub className="size-4 text-fg-muted transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12 group-hover:text-fg" />
              <span className="sr-only">(GitHub, opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
      {fx ? <SpideyFx onSkip={() => finishSignature(true)} /> : null}
    </div>
  );
}
