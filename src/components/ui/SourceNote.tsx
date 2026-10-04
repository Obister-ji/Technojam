import type { Verification } from "@/lib/content/types";

/** Small, public provenance line: “Source: Galgotias University · checked 04 Oct 2026”. */
export function SourceNote({ verification, className = "" }: { verification?: Verification; className?: string }) {
  if (!verification?.sourceName) return null;
  const checked = verification.lastVerified
    ? new Date(verification.lastVerified + "T00:00:00Z").toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;
  return (
    <p className={`label-mono text-fg-subtle normal-case tracking-normal ${className}`}>
      Source:{" "}
      {verification.sourceUrl ? (
        <a href={verification.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-fg">
          {verification.sourceName}
        </a>
      ) : (
        verification.sourceName
      )}
      {checked ? ` · checked ${checked}` : null}
      {verification.status === "archived_source" ? " · archived source" : null}
    </p>
  );
}
