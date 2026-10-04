import type { Metric } from "@/lib/content/types";
import { CHECKED, S } from "./sources";

/**
 * Only numbers with a source. Third-party counts carry an “as of” date.
 * `years` is computed at render time from the founding year.
 */
export const metrics: Metric[] = [
  {
    label: "Commudle members",
    value: 2023,
    detail: "People in the TechnoJam community on Commudle",
    asOf: CHECKED,
    verification: S.commudle,
  },
  {
    label: "Public repositories",
    value: 67,
    detail: "On github.com/technojam, since 2018",
    asOf: CHECKED,
    verification: S.github,
  },
  {
    label: "Dexterix editions",
    value: 5,
    detail: "From the first in 2018 to 5.0 in 2026",
    verification: S.dx5Site,
  },
  {
    label: "Recruitment domains",
    value: 11,
    detail: "Tracks in the 2026 task repository",
    verification: S.tasks2026,
  },
];
