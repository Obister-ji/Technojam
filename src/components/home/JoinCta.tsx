import type { RecruitmentCycle } from "@/lib/content/types";
import { RecruitmentStatus } from "@/components/join/RecruitmentStatus";
import { ButtonLink } from "@/components/ui/primitives";

/** Students on the left, organisations on the right — one block, two doors. */
export function JoinCta({ cycle }: { cycle?: RecruitmentCycle }) {
  const open = cycle?.status === "open";
  return (
    <section aria-label="Get involved" className="container-site py-20 cv-auto md:py-32">
      <div className="grid gap-px overflow-hidden bg-line md:grid-cols-2">
        <div className="relative bg-bg-raised p-8 md:p-12">
          <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: "var(--spectrum)" }} />
          <RecruitmentStatus cycle={cycle} />
          <h2 className="mt-6 text-headline font-black tracking-[-0.03em] uppercase font-wide">Build with us.</h2>
          <p className="mt-4 max-w-md text-fg-muted">
            We look for curiosity and consistency — not a finished résumé.
            {open ? " Pick a domain and take on the tasks." : " The past tasks are public: start there."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {open && cycle?.tasksRepository ? <ButtonLink href={cycle.tasksRepository}>View tasks</ButtonLink> : null}
            <ButtonLink href="/join" variant={open ? "secondary" : "primary"}>
              {open ? "How to apply" : "How recruitment works"}
            </ButtonLink>
          </div>
        </div>
        <div className="bg-bg-raised p-8 md:p-12">
          <p className="label-mono text-fg-subtle">For organisations</p>
          <h2 className="mt-6 text-headline font-black tracking-[-0.03em] uppercase font-wide">Partner with us.</h2>
          <p className="mt-4 max-w-md text-fg-muted">Sponsor Dexterix, host a workshop, mentor, judge or speak.</p>
          <div className="mt-8">
            <ButtonLink href="/collaborate" variant="secondary">
              Collaborate
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
