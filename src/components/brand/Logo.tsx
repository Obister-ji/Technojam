import type { SVGProps } from "react";

/**
 * Interim TJ mark drawn in code: a T and a J sharing one baseline, with a
 * signal node where the J begins. Swap for the official logo via
 * Site settings → Logo in the Studio.
 */
export function Mark({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden={title ? undefined : true} role={title ? "img" : undefined} {...props}>
      {title ? <title>{title}</title> : null}
      <path d="M3 7.5h15M10.5 7.5V26" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" />
      <path d="M23.5 7.5v11.5a7 7 0 0 1-7 7h-1" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" />
      <circle cx="23.5" cy="7.5" r="3.4" fill="var(--color-pulse)" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`items-center gap-2.5 ${className || "inline-flex"}`}>
      <Mark className="size-7 shrink-0" />
      <span className="text-[0.95rem] font-extrabold tracking-[0.02em] uppercase font-wide">TechnoJam</span>
    </span>
  );
}
