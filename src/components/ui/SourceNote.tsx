import type { Verification } from "@/lib/content/types";

/** Compact provenance: a single “Source ↗” link; details live in the tooltip. */
export function SourceNote({ verification, className = "" }: { verification?: Verification; className?: string }) {
  if (!verification?.sourceName) return null;
  const detail = [
    verification.sourceName,
    verification.lastVerified && `checked ${verification.lastVerified}`,
    verification.status === "archived_source" && "archived source",
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <p className={`text-sm text-fg-subtle ${className}`}>
      {verification.sourceUrl ? (
        <a
          href={verification.sourceUrl}
          target="_blank"
          rel="noreferrer"
          title={detail}
          className="underline decoration-line-strong underline-offset-4 hover:text-fg"
        >
          Source ↗<span className="sr-only">: {detail} (opens in a new tab)</span>
        </a>
      ) : (
        <span title={detail}>Source: {verification.sourceName}</span>
      )}
    </p>
  );
}
