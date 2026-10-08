import type { Ritual } from "@/lib/content/types";
import { BracketLink, DataRequired, Plate } from "./furniture";

/* JAM NIGHT — the weekly ritual, over a full-bleed photo ------------- */

export function JamNightScreen({ ritual }: { ritual: Ritual }) {
  const when = ritual.day && ritual.startTime ? `${ritual.day} / ${ritual.startTime}` : null;
  return (
    <section aria-labelledby="jam-title" className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      {/* Full-bleed documentary photo — or the shot list until one exists */}
      <Plate
        className="absolute inset-0 -z-10 [&>div]:h-full [&>div]:items-end [&>div]:justify-start [&>div]:p-6 [&>div]:pt-24"
        shot="Students building together at Jam Night — wide, real light"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-bg),transparent_60%)]" />
      <div className="container-site pt-40 pb-16">
        <div className="pixel-panel max-w-max border border-line-strong px-6 py-8 sm:px-10">
          <p className="font-mono text-[clamp(0.85rem,2vw,1.1rem)] font-bold tracking-[0.06em] text-cyan uppercase">
            {when ?? (
              <>
                Day / time: <DataRequired what="Jam Night day and time" />
              </>
            )}
          </p>
          <h2 id="jam-title" className="mt-4 font-pixel text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] uppercase glow">
            Jam night
          </h2>
          <p className="mt-5 text-xl">
            Bring something <span className="text-pulse">unfinished.</span>
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <BracketLink href={ritual.signupUrl ?? "/join#follow"}>Come build</BracketLink>
            {!when ? <span className="stamp stamp-in">Schedule pending</span> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
