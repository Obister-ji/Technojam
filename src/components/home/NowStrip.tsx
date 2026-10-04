import Link from "next/link";
import type { NowItem } from "@/lib/content/now";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icon";
import { Status } from "@/components/ui/primitives";

export function NowStrip({ items }: { items: NowItem[] }) {
  if (!items.length) return null;
  return (
    <section id="now" aria-labelledby="now-title" className="scroll-mt-(--nav-h) border-y border-line bg-bg-raised">
      <div className="container-site grid md:grid-cols-[12rem_1fr]">
        <h2 id="now-title" className="label-mono flex items-center gap-2 border-line py-5 text-fg md:border-r md:py-8">
          <span aria-hidden className="pulse-dot size-1.5 rounded-full bg-pulse" />
          Now at TechnoJam
        </h2>
        <ul className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((item) => {
            const inner = (
              <>
                <Status tone={item.tone} live={item.live}>
                  {item.label}
                </Status>
                <p className="mt-3 text-xl font-bold tracking-tight transition-colors group-hover:text-pulse">{item.title}</p>
                <p className="label-mono mt-1 text-fg-muted normal-case tracking-normal">{item.detail}</p>
                {item.external ? (
                  <ArrowUpRight className="absolute top-6 right-5 text-fg-subtle md:top-8" />
                ) : (
                  <ArrowRight className="absolute top-6 right-5 text-fg-subtle transition-transform group-hover:translate-x-1 md:top-8" />
                )}
              </>
            );
            return (
              <li key={item.key} className="relative">
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="group block py-6 pr-12 md:px-6 md:py-8">
                    {inner}
                  </a>
                ) : (
                  <Link href={item.href} className="group block py-6 pr-12 md:px-6 md:py-8">
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
