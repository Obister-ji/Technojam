import type { SiteSettings } from "@/lib/content/types";
import { ButtonLink } from "@/components/ui/primitives";
import { HeroNetwork } from "./HeroNetwork";
import { NETWORK_KINDS as NETWORK_LEGEND } from "./network";

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate min-h-[100svh] overflow-hidden pt-(--nav-h)">
      <div aria-hidden className="bg-grid absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" />
      <div className="absolute inset-0 -z-10 opacity-60 md:inset-y-0 md:right-0 md:left-auto md:w-[58%] md:opacity-100">
        <HeroNetwork />
      </div>

      <div className="container-site flex min-h-[calc(100svh-var(--nav-h))] flex-col justify-between py-8 md:py-12">
        <div className="label-mono flex flex-wrap gap-x-6 gap-y-1 text-fg-muted">
          <span>Est. {settings.foundedYear}</span>
          <span>{settings.location}</span>
          <span className="hidden sm:inline">SCSE · {settings.institution}</span>
        </div>

        <div className="py-16">
          <h1 id="hero-title">
            <span className="line label-mono mb-6 text-pulse">
              <span>{settings.name}</span>
            </span>
            <span className="font-wide block text-display-xl font-black tracking-[-0.045em] uppercase">
              <span className="line" style={{ ["--line-index" as string]: 1 }}>
                <span className="throttle-word">Throttle</span>
              </span>
              <span className="line" style={{ ["--line-index" as string]: 2 }}>
                <span>
                  to learn<span className="text-pulse">.</span>
                </span>
              </span>
            </span>
          </h1>

          <div className="rise mt-10 max-w-xl" style={{ ["--rise-delay" as string]: "500ms" }}>
            <p className="text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug font-medium">We learn technology by building it.</p>
            <p className="mt-2 text-lg text-fg-muted">
              Student-led technical community at {settings.institution}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#now">Explore TechnoJam</ButtonLink>
              <ButtonLink href="/join" variant="secondary">
                Join the community
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-6">
          <ul aria-label="The network: people, ideas, projects, events" className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-muted">
            {NETWORK_LEGEND.map((k, i) => (
              <li key={k.name} className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full" style={{ background: k.color }} />
                {k.name}
                {i < NETWORK_LEGEND.length - 1 ? <span aria-hidden className="text-fg-subtle">→</span> : null}
              </li>
            ))}
          </ul>
          <p aria-hidden className="label-mono hidden text-fg-subtle md:block">
            Scroll to throttle ↓
          </p>
        </div>
      </div>
    </section>
  );
}
