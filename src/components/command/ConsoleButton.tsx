"use client";

import { useChrome } from "./ChromeProvider";

/** The easter egg: a quiet text link, not a feature. */
export function ConsoleButton({ className = "" }: { className?: string }) {
  const { openConsole } = useChrome();
  return (
    <button type="button" onClick={openConsole} className={`inline-flex min-h-11 items-center font-mono text-sm text-phosphor transition-colors hover:text-fg ${className}`}>
      {"C:\\LAB> keep_building"}
      <span aria-hidden className="caret ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-phosphor" />
      <span className="sr-only"> — open the TechnoJam console</span>
    </button>
  );
}
