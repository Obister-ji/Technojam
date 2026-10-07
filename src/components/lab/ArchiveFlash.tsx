"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import logo from "../../../public/brand/tj-logo.webp";

export type Scrap =
  | { kind: "poster"; title: string; date: string; tag: string; href: string }
  | { kind: "slip"; line: string; href: string }
  | { kind: "tag"; line: string; href: string };

/** Deterministic scatter so server and client agree. */
const ROT = [-6, 4, -2, 7, -4, 3, -7, 5, -3, 6, -5, 2, -1, 4];

/**
 * A rapid collage of real artifacts. On desktop the layers drift a few
 * pixels toward the cursor; otherwise it stays still.
 */
export function ArchiveFlash({ scraps }: { scraps: Scrap[] }) {
  const field = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = field.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--dx", `${(x * 14).toFixed(1)}px`);
        el.style.setProperty("--dy", `${(y * 10).toFixed(1)}px`);
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section aria-labelledby="archive-title" className="overflow-hidden bg-bg-raised py-24">
      <div className="container-site">
        <h2
          id="archive-title"
          className="text-[clamp(1.9rem,4.2vw,4rem)] leading-[0.9] font-black tracking-[-0.04em] uppercase font-wide"
        >
          We leave
          <br />
          things behind.
        </h2>
        <p className="mt-4 font-mono text-sm tracking-[0.12em] text-fg-muted">projects / mistakes / notes / people</p>
      </div>

      <ul
        ref={field}
        aria-label="From the archive"
        className="container-site mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-6 py-6"
      >
        {scraps.map((s, i) => {
          const depth = (i % 3) + 1;
          const style = {
            transform: `translate(calc(var(--dx, 0px) * ${depth}), calc(var(--dy, 0px) * ${depth})) rotate(${ROT[i % ROT.length]}deg)`,
            transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
          };
          if (s.kind === "poster")
            return (
              <li key={i} style={style}>
                <Link
                  href={s.href}
                  className="flex aspect-[3/4] w-[10.5rem] flex-col justify-between border border-fg/25 bg-bg p-3 shadow-[3px_4px_0_rgb(28_27_24/0.14)] transition-colors hover:border-fg sm:w-[12.5rem]"
                >
                  <span className="flex items-center gap-1.5">
                    <Image src={logo} alt="" className="h-5 w-auto" />
                    <span className="font-mono text-[0.58rem] tracking-[0.14em] uppercase">{s.tag}</span>
                  </span>
                  <span className="text-xl leading-[0.95] font-black tracking-tight uppercase font-wide">{s.title}</span>
                  <span className="font-mono text-[0.62rem] tracking-[0.12em] text-fg-muted uppercase">{s.date}</span>
                </Link>
              </li>
            );
          if (s.kind === "slip")
            return (
              <li key={i} style={style}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="crt block max-w-[17rem] rounded-sm px-3 py-2 font-mono text-[0.7rem] leading-snug"
                >
                  {s.line}
                </a>
              </li>
            );
          return (
            <li key={i} style={style}>
              <a href={s.href} target="_blank" rel="noreferrer" className="stamp block bg-bg mix-blend-normal!">
                {s.line}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
