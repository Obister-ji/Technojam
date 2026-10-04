import type { DexterixEdition } from "@/lib/content/types";
import { DexterixTimeline } from "@/components/dexterix/DexterixTimeline";
import { ButtonLink, Eyebrow } from "@/components/ui/primitives";

export function DexterixFeature({ editions }: { editions: DexterixEdition[] }) {
  const first = Math.min(...editions.map((e) => e.year));
  return (
    <section aria-labelledby="dexterix-title" className="cv-auto relative isolate overflow-hidden bg-bg-sunken py-28 md:py-40">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_0%,color-mix(in_oklab,var(--color-violet)_22%,transparent),transparent_70%),radial-gradient(40%_40%_at_10%_100%,color-mix(in_oklab,var(--color-pulse)_14%,transparent),transparent_70%)]" />
      <div className="container-site">
        <Eyebrow index="05">Flagship hackathon · since {first}</Eyebrow>
        <h2
          id="dexterix-title"
          data-reveal="lines"
          className="font-wide mt-6 text-[clamp(3rem,12.6vw,14rem)] leading-[0.82] font-black tracking-[-0.05em] uppercase"
        >
          <span className="line">
            <span className="text-spectrum">Dexterix</span>
          </span>
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <p data-reveal className="text-[clamp(1.2rem,2.2vw,1.6rem)] leading-snug font-medium md:col-span-7">
            TechnoJam&apos;s flagship hackathon. What started on campus in {first} became an international hybrid edition in 2022 and a
            36-hour build in 2026.
          </p>
          <div data-reveal className="md:col-span-4 md:col-start-9 md:justify-self-end">
            <ButtonLink href="/dexterix" variant="secondary">
              Explore every edition
            </ButtonLink>
          </div>
        </div>
        <div className="mt-20">
          <DexterixTimeline editions={editions} />
        </div>
        <p className="label-mono mt-8 max-w-2xl text-fg-subtle normal-case tracking-normal">
          “Reported” figures come from post-event first-party or press sources. “Target” figures were announced before an event and are
          not outcomes.
        </p>
      </div>
    </section>
  );
}
