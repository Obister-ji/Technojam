import type { RecruitmentCycle } from "@/lib/content/types";
import { formatDateRange } from "@/lib/content/derive";
import { Status } from "@/components/ui/primitives";

export const RECRUITMENT_STATE: Record<
  RecruitmentCycle["status"],
  { label: string; tone: "pulse" | "volt" | "violet" | "muted"; live?: boolean; headline: string }
> = {
  open: { label: "Recruitment open", tone: "pulse", live: true, headline: "Applications are open." },
  upcoming: { label: "Opening soon", tone: "volt", headline: "Recruitment opens soon." },
  evaluating: { label: "Interviews in progress", tone: "violet", headline: "Submissions closed — interviews are running." },
  closed: { label: "Recruitment closed", tone: "muted", headline: "Recruitment is closed right now." },
};

export function RecruitmentStatus({ cycle }: { cycle?: RecruitmentCycle }) {
  if (!cycle) return <Status tone="muted">No recruitment announced</Status>;
  const s = RECRUITMENT_STATE[cycle.status];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <Status tone={s.tone} live={s.live}>
        {s.label}
      </Status>
      <span className="label-mono text-fg-subtle">
        {cycle.title}
        {cycle.deadline ? ` · ${cycle.status === "open" ? "due" : "deadline"} ${formatDateRange(cycle.deadline)}` : ""}
      </span>
    </div>
  );
}
