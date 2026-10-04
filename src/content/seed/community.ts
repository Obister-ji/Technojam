import type { Announcement, Partner, TeamYear } from "@/lib/content/types";
import { S } from "./sources";

/**
 * Intentionally empty. No first-party, consented roster was found — the
 * previous site's team section used placeholder people. Add real members
 * in the Studio (with consent) and they appear on /team automatically.
 */
export const teamYears: TeamYear[] = [];

/** Leave empty unless there is genuinely current news. */
export const announcements: Announcement[] = [];

export const partners: Partner[] = [
  {
    name: "Google for Developers",
    kind: "industry",
    url: "https://developers.google.com/community",
    description: "Supported Build With AI 2025 at Galgotias.",
    verification: S.bwaGU,
  },
  {
    name: "ACM",
    kind: "community",
    url: "https://www.acm.org",
    description: "Dexterix 3.0 was organised in association with ACM.",
    verification: S.dx3Report,
  },
  {
    name: "TFUG Ghaziabad",
    kind: "community",
    description: "Co-ran ML Math Clubs with TechnoJam in 2024.",
    verification: S.commudleEvents,
  },
  {
    name: "Commudle",
    kind: "platform",
    url: "https://www.commudle.com/communities/technojam",
    description: "Home of TechnoJam's community events and RSVPs.",
    verification: S.commudle,
  },
];
