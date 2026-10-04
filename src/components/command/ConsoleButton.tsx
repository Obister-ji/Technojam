"use client";

import { useChrome } from "./ChromeProvider";

export function ConsoleButton({ className = "" }: { className?: string }) {
  const { openConsole } = useChrome();
  return (
    <button
      type="button"
      onClick={openConsole}
      className={`label-mono group inline-flex h-11 items-center gap-2 border border-line-strong px-4 text-fg transition-colors hover:border-pulse hover:text-pulse ${className}`}
    >
      <span aria-hidden className="text-pulse transition-colors group-hover:text-pulse">{">_"}</span> Open console
    </button>
  );
}
