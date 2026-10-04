import type { Verification } from "@/lib/content/types";

/**
 * Every seeded fact points at one of these sources. Researched and last
 * checked on 2026-10-04 — see docs/01-research.md for the full log.
 */
const CHECKED = "2026-10-04";

const src = (sourceName: string, sourceUrl: string, notes?: string): Verification => ({
  status: "verified",
  sourceName,
  sourceUrl,
  lastVerified: CHECKED,
  ...(notes ? { notes } : {}),
});

const pending = (sourceName: string, notes: string, sourceUrl?: string): Verification => ({
  status: "pending",
  sourceName,
  sourceUrl,
  lastVerified: CHECKED,
  notes,
});

export const S = {
  linkedin: src("TechnoJam on LinkedIn", "https://www.linkedin.com/company/technojam/"),
  commudle: src("TechnoJam on Commudle", "https://www.commudle.com/communities/technojam"),
  guTechnoJam: src("Galgotias University — TechnoJam", "https://www.galgotiasuniversity.edu.in/p/TechnoJam"),
  guClubPage: src("Galgotias University — Team TechnoJam club page", "https://www.galgotiasuniversity.edu.in/p/clubs/team-technojam"),
  github: src("GitHub — technojam", "https://github.com/technojam"),
  tasks2026: src("GitHub — technojam/TJ-TASKS-2026", "https://github.com/technojam/TJ-TASKS-2026"),
  technojamSite: src("technojam.in (previous site)", "https://www.technojam.in"),
  tennews2018: src("TenNews, 21 Nov 2018", "https://tennews.in/hackathon-named-dexterix-organised-at-galgotias-university-greater-noida/"),
  dx3Report: src("Galgotias University — Dexterix 3.0 report (PDF)", "https://www.galgotiasuniversity.edu.in/pdfs/DEXTERIX-REPORT.pdf"),
  dx3Brochure: src(
    "Galgotias University — All about Dexterix 3.0 (PDF)",
    "https://www.galgotiasuniversity.edu.in/pdfs/all-about-dexterix.pdf",
  ),
  dx3Page: src("Galgotias University — Dexterix 3.0", "https://www.galgotiasuniversity.edu.in/p/dexterix-30"),
  dx4Page: src("Galgotias University — Dexterix 4.0", "https://www.galgotiasuniversity.edu.in/p/Dexterix-40"),
  dx4Commudle: src("Commudle — Dexterix 4.0", "https://www.commudle.com/communities/technojam/hackathons/dexterix-4-0"),
  dx5Site: src("Dexterix 5.0 official site", "https://dexterix.technojam.in"),
  dx5LinkedIn: src("TechnoJam LinkedIn — Dexterix 5.0 call for mentors & judges", "https://www.linkedin.com/company/technojam/"),
  bwaGU: src(
    "Galgotias University — Build with AI, Team TechnoJam",
    "https://www.galgotiasuniversity.edu.in/p/Build-with-AI--Team-Technojam",
  ),
  bwaCommudle: src(
    "Commudle — Build With AI, Galgotias edition",
    "https://www.commudle.com/communities/technojam/events/build-with-ai-galgotias-edition",
  ),
  akshayCommudle: src(
    "Commudle — Expert Talk by Akshay Saini",
    "https://www.commudle.com/communities/technojam/events/expert-talk-by-akshay-saini",
  ),
  cloudCommudle: src(
    "Commudle — मेघों से साक्षात्कार",
    "https://www.commudle.com/communities/technojam/events/ed203036-505f-4c33-af78-68c6e726cf5d",
  ),
  turingCommudle: src("Commudle — Turing's Class", "https://www.commudle.com/communities/technojam/events/ml-event"),
  agentsCommudle: src("Commudle — Let's Talk Agents", "https://www.commudle.com/communities/technojam/events/let-s-talk-agents"),
  agents101Commudle: src(
    "Commudle — Agents 101",
    "https://www.commudle.com/communities/technojam/events/let-s-talk-agents-7334d8ba-480b-43cb-a80a-e8c87d9e8a84",
  ),
  commudleEvents: src("Commudle — TechnoJam events", "https://www.commudle.com/communities/technojam/events"),
  pending,
} as const;

export { CHECKED };
