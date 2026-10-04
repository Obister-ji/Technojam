import Link from "next/link";
import type { NowItem } from "@/lib/content/now";
import { ArrowRight } from "@/components/ui/Icon";
import { Status } from "@/components/ui/primitives";

function Anchor({ item, className, children }: { item: NowItem; className: string; children: React.ReactNode }) {
  return item.external ? (
    <a href={item.href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={item.href} className={className}>
      {children}
    </Link>
  );
}

/** One primary item, everything else as small links on the same line. */
export function NowStrip({ items }: { items: NowItem[] }) {
  const [primary, ...rest] = items;
  if (!primary) return null;

  return (
    <section id="now" aria-labelledby="now-title" className="scroll-mt-(--nav-h) border-y border-line bg-bg-raised">
      <div className="container-site flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <h2 id="now-title" className="sr-only">
          Now at TechnoJam
        </h2>
        <Anchor item={primary} className="group flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <Status tone={primary.tone} live={primary.live}>
            {primary.label}
          </Status>
          <span className="text-lg font-bold group-hover:text-pulse">{primary.title}</span>
          <span className="text-sm text-fg-muted">{primary.detail}</span>
          <ArrowRight className="size-4 self-center text-fg-subtle transition-transform group-hover:translate-x-1" />
        </Anchor>
        {rest.length ? (
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-fg-muted">
            {rest.map((item) => (
              <li key={item.key}>
                <Anchor item={item} className="hover:text-fg">
                  {item.title}
                </Anchor>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
