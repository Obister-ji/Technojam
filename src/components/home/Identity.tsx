import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icon";
import { Eyebrow, Lines } from "@/components/ui/primitives";

export interface Aspect {
  key: string;
  title: string;
  body: string;
  evidence: string;
  href: string;
}

/** “Not another coding club.” — the editorial turn after the hero. */
export function Identity({ aspects }: { aspects: Aspect[] }) {
  return (
    <section aria-labelledby="identity-title" className="container-site py-28 md:py-40">
      <Eyebrow index="01">Who we are</Eyebrow>
      <h2 id="identity-title" data-reveal="lines" className="font-wide mt-6 text-display font-black tracking-[-0.04em] uppercase">
        <Lines text={"Not another\ncoding club."} />
      </h2>
      <div className="mt-12 grid gap-10 md:grid-cols-12">
        <p data-reveal className="text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug font-medium md:col-span-7">
          TechnoJam is where students explore technology by actually doing the work — building projects, competing, teaching one
          another, contributing to open source and organising large technical experiences.
        </p>
        <p data-reveal className="text-lg leading-relaxed text-fg-muted md:col-span-4 md:col-start-9">
          Workshops are part of it. So are 36-hour hackathons, recruitment tasks published on GitHub, and late-night debugging
          sessions that end in a deploy. Learn. Build. Break. Improve. Repeat.
        </p>
      </div>

      <ol className="mt-20 grid border-t border-line sm:grid-cols-2 lg:grid-cols-5">
        {aspects.map((a, i) => (
          <li
            key={a.key}
            data-reveal
            style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
            className="group relative border-b border-line py-8 sm:pr-6 lg:border-r lg:border-b-0 lg:px-6 lg:first:pl-0 lg:last:border-r-0"
          >
            <p className="label-mono text-fg-subtle">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="font-wide mt-4 text-2xl font-extrabold uppercase">{a.title}</h3>
            <p className="mt-3 text-fg-muted">{a.body}</p>
            <Link href={a.href} className="label-mono mt-6 inline-flex items-center gap-2 text-fg normal-case tracking-normal hover:text-pulse">
              {a.evidence} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
