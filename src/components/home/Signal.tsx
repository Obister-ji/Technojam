import type { Metric } from "@/lib/content/types";
import { CountUp } from "@/components/ui/CountUp";
import { Eyebrow } from "@/components/ui/primitives";

const asOf = (iso?: string) =>
  iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }) : null;

/** Verified numbers only — each one links to where it came from. */
export function Signal({ metrics }: { metrics: Metric[] }) {
  if (!metrics.length) return null;
  return (
    <section aria-labelledby="signal-title" className="border-y border-line bg-bg-sunken">
      <div className="container-site py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Eyebrow index="02">
            <span id="signal-title">Signal, not noise</span>
          </Eyebrow>
          <p className="label-mono text-fg-subtle">Every number links to its source</p>
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5">
          {metrics.map((m) => (
            <div key={m.label} data-reveal className="border-l border-line pl-4 md:pl-6">
              <dt className="label-mono text-fg-muted">{m.label}</dt>
              <dd className="mt-3">
                <span className="font-wide block text-[clamp(2.4rem,5vw,4rem)] leading-none font-extrabold tracking-tight">
                  {m.prefix}
                  <CountUp value={m.value} />
                  {m.suffix}
                </span>
                <span className="mt-3 block text-sm text-fg-muted">{m.detail}</span>
                <span className="label-mono mt-2 block text-fg-subtle normal-case tracking-normal">
                  {m.verification.sourceUrl ? (
                    <a href={m.verification.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-fg">
                      {m.verification.sourceName}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    m.verification.sourceName
                  )}
                  {m.asOf ? ` · as of ${asOf(m.asOf)}` : ""}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
