import Link from "next/link";
import type { Metric } from "@/lib/content/types";
import { Eyebrow, Lines } from "@/components/ui/primitives";

export interface Aspect {
  key: string;
  title: string;
  href: string;
}

/** “Not another coding club.” — headline, one paragraph, one row of words, one quiet line of numbers. */
export function Identity({ aspects, metrics }: { aspects: Aspect[]; metrics: Metric[] }) {
  return (
    <section aria-labelledby="identity-title" className="container-site py-20 md:py-36">
      <Eyebrow>Who we are</Eyebrow>
      <h2 id="identity-title" data-reveal="lines" className="mt-5 text-display font-black tracking-[-0.04em] uppercase font-wide">
        <Lines text={"Not another\ncoding club."} />
      </h2>
      <p data-reveal className="mt-10 max-w-3xl text-[clamp(1.2rem,2.2vw,1.6rem)] leading-snug font-medium">
        TechnoJam is where students explore technology by actually doing the work — building projects, competing, teaching one another,
        contributing to open source and organising large technical experiences.
      </p>

      <ul data-reveal aria-label="What TechnoJam is about" className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xl font-semibold">
        {aspects.map((a) => (
          <li key={a.key}>
            <Link href={a.href} className="text-fg-muted transition-colors hover:text-pulse">
              {a.title}
            </Link>
          </li>
        ))}
      </ul>

      {metrics.length ? (
        <dl data-reveal className="mt-16 flex flex-wrap gap-x-12 gap-y-6">
          {metrics.map((m) => (
            <div key={m.label}>
              <dd className="text-3xl font-extrabold tracking-tight font-wide">
                {m.prefix}
                {m.value.toLocaleString("en-IN")}
                {m.suffix}
              </dd>
              <dt className="mt-1 text-sm text-fg-muted">
                {m.verification.sourceUrl ? (
                  <a
                    href={m.verification.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    title={`${m.verification.sourceName}${m.asOf ? ` · as of ${m.asOf}` : ""}`}
                    className="hover:text-fg"
                  >
                    {m.label}
                    <span className="sr-only">
                      {" "}
                      — source: {m.verification.sourceName}
                      {m.asOf ? `, as of ${m.asOf}` : ""} (opens in a new tab)
                    </span>
                  </a>
                ) : (
                  m.label
                )}
              </dt>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
