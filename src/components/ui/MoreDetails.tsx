import type { ReactNode } from "react";
import { Plus } from "./Icon";

/** Native disclosure for secondary facts — keeps sidebars short. */
export function MoreDetails({ children, label = "More details" }: { children: ReactNode; label?: string }) {
  return (
    <details className="group mt-8 border-t border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-fg-muted hover:text-fg [&::-webkit-details-marker]:hidden">
        {label}
        <Plus className="size-4 transition-transform duration-300 group-open:rotate-45" />
      </summary>
      <div className="grid gap-6 pb-4">{children}</div>
    </details>
  );
}
