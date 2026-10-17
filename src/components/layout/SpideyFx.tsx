"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

const f = (n: number) => n.toFixed(1);

/** A web splat: spokes from the centre, then sagging threads between them, a little uneven. */
const WEB = (() => {
  const spokes = 10;
  const turn = (i: number) => (i / spokes) * Math.PI * 2 + 0.2;
  let d = "";
  for (let i = 0; i < spokes; i++) d += `M0 0L${f(Math.cos(turn(i)) * 50)} ${f(Math.sin(turn(i)) * 50)}`;
  [13, 25, 37, 48].forEach((r, ring) => {
    for (let i = 0; i < spokes; i++) {
      const a1 = turn(i);
      const a2 = turn(i + 1);
      const wobble = 1 - ((i * 7 + ring * 3) % 5) * 0.035;
      const mid = (a1 + a2) / 2;
      d += `M${f(Math.cos(a1) * r * wobble)} ${f(Math.sin(a1) * r * wobble)}`;
      d += `Q${f(Math.cos(mid) * r * 0.8)} ${f(Math.sin(mid) * r * 0.8)} ${f(Math.cos(a2) * r)} ${f(Math.sin(a2) * r)}`;
    }
  });
  return d;
})();

function Splat({ className }: { className: string }) {
  return (
    <svg viewBox="-52 -52 104 104" className={`sp-splat ${className}`} aria-hidden>
      <path d={WEB} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Played when the signature is clicked: two web-shots THWIP across the screen and splat, then
 * Spider-Man drops in upside down on a line, sways, says hi, and zips back up. Tap to skip.
 */
export function SpideyFx({ onSkip }: { onSkip: () => void }) {
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
    <div className="sp" role="status" aria-live="polite" onClick={onSkip}>
      <span className="sr-only">Opening Sarvagya&apos;s GitHub</span>

      <div aria-hidden>
        {/* the two web-shots, fired from the bottom corners */}
        {/* percentages in screen space, so the stroke stays one even thread at any aspect ratio */}
        <svg className="absolute inset-0 h-full w-full">
          <line className="sp-shot sp-shot-a" x1="0%" y1="100%" x2="27%" y2="30%" pathLength={1} />
          <line className="sp-shot sp-shot-b" x1="100%" y1="100%" x2="75%" y2="47%" pathLength={1} />
        </svg>
        <Splat className="sp-splat-a" />
        <Splat className="sp-splat-b" />
        <span className="sp-thwip sp-thwip-a">Thwip!</span>
        <span className="sp-thwip sp-thwip-b">Thwip!</span>

        {/* the drop-in: zip (up and away) ⟶ drop (down on the line) ⟶ sway */}
        <div className="sp-zip">
          <div className="sp-drop">
            <div className="sp-sway">
              <span className="sp-line" />
              {/* eslint-disable-next-line @next/next/no-img-element -- a 52×60 sprite, scaled up crisp */}
              <img src="/fx/spidey.png" alt="" width={52} height={60} className="sp-sprite" />
            </div>
            <div className="sp-bubble">
              <p>
                Hi, I&apos;m <span>Sarvagya</span>
              </p>
              <p className="sp-bubble-sub">your friendly neighbourhood dev</p>
            </div>
          </div>
        </div>

        <p className="sp-hint">▼ opening github</p>
      </div>
    </div>,
    document.body,
  );
}
