"use client";

import { useEffect, useRef, useState } from "react";
import type { ActivityLine } from "@/lib/github";

const IST = "Asia/Kolkata";
const time = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: IST });
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const day = (iso: string) => {
  const [d, m] = new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "numeric", timeZone: IST }).split("/");
  return `${d} ${MONTHS[Number(m) - 1]}`;
};

/**
 * Teletype log of real public activity on github.com/technojam.
 * Lines print one by one the first time the panel scrolls into view.
 */
export function TransmissionLog({ lines, org, syncedAt }: { lines: ActivityLine[]; org: string; syncedAt: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const [shown, setShown] = useState(lines.length);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        let n = 0;
        setShown(0);
        const tick = () => {
          n += 1;
          setShown(n);
          if (n < lines.length) timer = window.setTimeout(tick, 180);
        };
        timer = window.setTimeout(tick, 250);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [lines.length]);

  return (
    <div className="crt overflow-hidden rounded-[18px] p-6 font-mono text-[0.82rem] shadow-[inset_0_0_60px_rgb(0_0_0/0.55)] sm:p-10 sm:text-[0.9rem]">
      <div className="flex flex-wrap justify-between gap-2 text-[0.7rem] tracking-[0.14em] text-fg-muted uppercase">
        <span>RX ← github.com/{org}</span>
        <span>Last sync {syncedAt} IST</span>
      </div>

      {lines.length ? (
        <ol ref={ref} className="mt-6 grid gap-2" aria-live="off">
          {lines.map((l, i) => (
            <li
              key={l.id}
              className={`grid grid-cols-[3.75rem_3rem_minmax(0,1fr)] gap-3 transition-opacity duration-150 sm:grid-cols-[4.5rem_3.5rem_minmax(0,1fr)] ${i < shown ? "opacity-100" : "opacity-0"}`}
            >
              <span className="text-fg-muted">{day(l.at)}</span>
              <span className="text-phosphor">{time(l.at)}</span>
              <span className="min-w-0 truncate">
                {l.who} <span className="text-fg-muted">{l.verb}</span> /{" "}
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-fg-subtle underline-offset-2 hover:text-phosphor"
                >
                  {l.repo}
                </a>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 text-pulse">LINE QUIET — [ REAL DATA REQUIRED ] (GitHub unreachable at build time)</p>
      )}
      <p className="mt-4 text-phosphor">
        &gt; listening
        <span aria-hidden className="caret ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-phosphor" />
      </p>
    </div>
  );
}
