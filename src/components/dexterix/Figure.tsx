import type { StatFigure } from "@/lib/content/types";
import { formatFigure, publishableFigure } from "@/lib/content/derive";
import { cx } from "@/components/ui/primitives";

/**
 * A Dexterix number with its provenance printed beside it.
 * ACTUAL (post-event) wins; otherwise a TARGET is shown, clearly labelled.
 */
export function DexterixFigure({
  label,
  actual,
  target,
  size = "md",
}: {
  label: string;
  actual?: StatFigure;
  target?: StatFigure;
  size?: "md" | "lg";
}) {
  const a = publishableFigure(actual);
  const t = publishableFigure(target);
  const fig = a ?? t;
  if (!fig) return null;
  const isTarget = !a;
  return (
    <div className="border-t border-line pt-4">
      <dt className="label-mono flex items-center gap-2 text-fg-muted">
        {label}
        <span className={cx("border px-1.5 py-px", isTarget ? "border-violet/50 text-violet" : "border-pulse/50 text-pulse")}>
          {isTarget ? "Target" : "Reported"}
        </span>
      </dt>
      <dd className={cx("font-wide mt-2 font-extrabold tracking-tight tabular-nums", size === "lg" ? "text-5xl md:text-6xl" : "text-4xl")}>
        {formatFigure(fig)}
        {fig.verification?.sourceUrl ? (
          <a
            href={fig.verification.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 label-mono ml-2 align-top text-fg-subtle normal-case tracking-normal underline underline-offset-2 hover:text-fg"
          >
            src<span className="sr-only">: {fig.verification.sourceName} (opens in a new tab)</span>
          </a>
        ) : null}
        {isTarget ? <span className="mt-1 block font-sans text-sm font-normal tracking-normal text-fg-subtle">Announced before the event — not an outcome.</span> : null}
      </dd>
    </div>
  );
}
