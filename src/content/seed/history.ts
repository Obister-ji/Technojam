import type { Achievement, Milestone } from "@/lib/content/types";
import { S } from "./sources";

export const milestones: Milestone[] = [
  {
    year: 2015,
    title: "TechnoJam is established",
    description:
      "A technical community forms inside the School of Computing Science & Engineering, with one idea at its core: throttle to learn.",
    kind: "origin",
    verification: S.linkedin,
  },
  {
    year: 2018,
    date: "2018-11-20",
    title: "The first Dexterix",
    description: "A hackathon on “Smart Sustainable Solutions” — the start of what becomes TechnoJam's flagship series.",
    kind: "dexterix",
    href: "/dexterix/dexterix-1-0",
    verification: S.tennews2018,
  },
  {
    year: 2019,
    title: "Dexterix 2.0",
    description: "The second edition of Dexterix.",
    kind: "dexterix",
    verification: S.pending("Dexterix 5.0 site — archive", "Year inferred; confirm before publishing.", "https://dexterix.technojam.in"),
  },
  {
    year: 2022,
    date: "2022-03-11",
    title: "Dexterix goes international and hybrid",
    description: "Dexterix 3.0 runs in-person and online across eight domains with ACM, using Smart India Hackathon problem statements.",
    kind: "dexterix",
    href: "/dexterix/dexterix-3-0",
    verification: S.dx3Report,
  },
  {
    year: 2024,
    date: "2024-04-13",
    title: "Dexterix 4.0",
    description: "Twelve domains, corporate and student tracks — plus dedicated prizes for all-girls and all-freshers teams.",
    kind: "dexterix",
    href: "/dexterix/dexterix-4-0",
    verification: S.dx4Page,
  },
  {
    year: 2024,
    date: "2024-12-22",
    title: "Turing's Class",
    description: "TechnoJam runs an online series on the mathematics behind ML as part of Google's ML Math Club.",
    kind: "community",
    href: "/events/turings-class-2024",
    verification: S.turingCommudle,
  },
  {
    year: 2025,
    date: "2025-04-26",
    title: "Build With AI",
    description: "A Google for Developers–supported day of agentic AI, LLM apps, MCP, A2A and ADK at Galgotias.",
    kind: "event",
    href: "/events/build-with-ai-2025",
    verification: S.bwaGU,
  },
  {
    year: 2026,
    date: "2026-02-14",
    title: "Dexterix 5.0",
    description: "The flagship returns as a 36-hour in-person build on campus.",
    kind: "dexterix",
    href: "/dexterix/dexterix-5-0",
    verification: S.dx5LinkedIn,
  },
  {
    year: 2026,
    date: "2026-09-07",
    title: "Recruitment 2026",
    description:
      "Freshers take on domain tasks published openly on GitHub — from web and app dev to robotics, system design and vibe coding.",
    kind: "recruitment",
    href: "/join",
    verification: S.tasks2026,
  },
];

export const achievements: Achievement[] = [];
