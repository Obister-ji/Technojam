import type { Person } from "@/lib/content/types";
import { GitHub, LinkedIn, ArrowUpRight } from "@/components/ui/Icon";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function MemberCard({ person, role }: { person: Person; role: string }) {
  return (
    <article id={person.slug} className="group scroll-mt-28 border border-line bg-bg transition-colors hover:border-line-strong">
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-raised">
        {person.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- Sanity CDN, cropped via hotspot params
          <img
            src={`${person.image.url}?w=600&h=750&fit=crop&auto=format`}
            alt={person.image.alt || person.name}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
          />
        ) : (
          <div aria-hidden className="flex h-full items-center justify-center">
            <span className="text-6xl font-black text-fg-subtle font-wide">{initials(person.name)}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">{person.name}</h3>
        <p className="text-fg-muted">{role}</p>
        <p className="mt-2 label-mono text-fg-subtle">
          {[person.domains[0]?.title, person.batch && `Batch ${person.batch}`].filter(Boolean).join(" · ")}
        </p>
        {person.bio ? <p className="mt-3 text-sm text-fg-muted">{person.bio}</p> : null}
        <ul className="mt-4 flex gap-3">
          {person.github ? (
            <li>
              <a
                href={person.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${person.name} on GitHub`}
                className="text-fg-muted hover:text-fg"
              >
                <GitHub />
              </a>
            </li>
          ) : null}
          {person.linkedin ? (
            <li>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`${person.name} on LinkedIn`}
                className="text-fg-muted hover:text-fg"
              >
                <LinkedIn />
              </a>
            </li>
          ) : null}
          {person.portfolio ? (
            <li>
              <a
                href={person.portfolio}
                target="_blank"
                rel="noreferrer"
                aria-label={`${person.name}'s portfolio`}
                className="text-fg-muted hover:text-fg"
              >
                <ArrowUpRight />
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}
