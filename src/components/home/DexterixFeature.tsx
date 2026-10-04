import type { DexterixEdition } from "@/lib/content/types";
import { DexterixTimeline } from "@/components/dexterix/DexterixTimeline";
import { ButtonLink, Eyebrow } from "@/components/ui/primitives";

/** One big word, one sentence, four simple edition cards. Numbers live on /dexterix. */
export function DexterixFeature({ editions }: { editions: DexterixEdition[] }) {
  const first = Math.min(...editions.map((e) => e.year));
  return (
    <section aria-labelledby="dexterix-title" className="relative isolate overflow-hidden bg-bg-sunken py-20 cv-auto md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_0%,color-mix(in_oklab,var(--color-violet)_18%,transparent),transparent_70%)]"
      />
      <div className="container-site">
        <Eyebrow>Flagship hackathon · since {first}</Eyebrow>
        <h2
          id="dexterix-title"
          data-reveal="lines"
          className="mt-5 text-[clamp(3rem,12.6vw,14rem)] leading-[0.82] font-black tracking-[-0.05em] uppercase font-wide"
        >
          <span className="line">
            <span className="text-spectrum">Dexterix</span>
          </span>
        </h2>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p data-reveal className="max-w-2xl text-lg text-fg-muted">
            TechnoJam&apos;s flagship hackathon — from a campus event in {first} to an international hybrid edition and a 36-hour build.
          </p>
          <ButtonLink href="/dexterix" variant="secondary">
            Every edition
          </ButtonLink>
        </div>
        <div className="mt-16">
          <DexterixTimeline editions={editions} simple />
        </div>
      </div>
    </section>
  );
}
