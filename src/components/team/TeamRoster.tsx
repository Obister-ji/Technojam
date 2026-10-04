import type { TeamYear } from "@/lib/content/types";
import { MemberCard } from "./MemberCard";

const GROUPS: { key: TeamYear["members"][number]["group"]; label: string }[] = [
  { key: "faculty", label: "Faculty" },
  { key: "lead", label: "Leads" },
  { key: "core", label: "Core team" },
  { key: "domain-lead", label: "Domain leads" },
  { key: "member", label: "Members" },
];

export function TeamRoster({ team }: { team: TeamYear }) {
  return (
    <div className="grid gap-16">
      {GROUPS.map(({ key, label }) => {
        const members = team.members.filter((m) => m.group === key);
        if (!members.length) return null;
        return (
          <section key={key} aria-label={label}>
            <h3 className="label-mono text-fg-muted">
              {label} · {members.length}
            </h3>
            <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {members.map((m) => (
                <li key={m.person.slug}>
                  <MemberCard person={m.person} role={m.role} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
