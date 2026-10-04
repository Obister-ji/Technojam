import type { RecruitmentCycle } from "@/lib/content/types";
import { RecruitmentStatus, RECRUITMENT_STATE } from "@/components/join/RecruitmentStatus";
import { ButtonLink, Lines } from "@/components/ui/primitives";

export function JoinCta({ cycle }: { cycle?: RecruitmentCycle }) {
  const open = cycle?.status === "open";
  return (
    <section aria-labelledby="join-cta-title" className="cv-auto container-site py-28 md:py-40">
      <div className="relative overflow-hidden border border-line-strong p-6 sm:p-10 md:p-16">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: "var(--spectrum)" }} />
        <RecruitmentStatus cycle={cycle} />
        <h2 id="join-cta-title" data-reveal="lines" className="font-wide mt-8 text-display font-black tracking-[-0.04em] uppercase">
          <Lines text={"Build\nwith us."} />
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <p data-reveal className="text-lg leading-relaxed text-fg-muted md:col-span-6">
            We look for curiosity, consistency and a willingness to learn — not a finished résumé.{" "}
            {cycle ? RECRUITMENT_STATE[cycle.status].headline : null}{" "}
            {open ? "Pick a domain, take on the tasks, and show us how you think." : "Get a head start: the past tasks are public, and so is everything we've built."}
          </p>
          <div data-reveal className="flex flex-wrap gap-3 md:col-span-5 md:col-start-8 md:justify-end">
            {open && cycle?.tasksRepository ? (
              <>
                <ButtonLink href={cycle.tasksRepository}>View tasks</ButtonLink>
                <ButtonLink href="/join" variant="secondary">
                  How to apply
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink href="/join">How recruitment works</ButtonLink>
                <ButtonLink href="/community" variant="secondary">
                  Explore the community
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
