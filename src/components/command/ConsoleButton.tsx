"use client";

import { useChrome } from "./ChromeProvider";

/** The easter egg: a quiet text link, not a feature. */
export function ConsoleButton({ className = "" }: { className?: string }) {
  const { openConsole } = useChrome();
  return (
    <button
      type="button"
      onClick={openConsole}
      className={`font-mono text-sm text-fg-subtle transition-colors hover:text-pulse ${className}`}
    >
      {">_ keep_building"}
      <span className="sr-only"> — open the TechnoJam console</span>
    </button>
  );
}
