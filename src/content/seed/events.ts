import type { TJEvent } from "@/lib/content/types";
import { S } from "./sources";

type SeedEvent = Omit<
  TJEvent,
  | "externalLinks"
  | "topics"
  | "agenda"
  | "speakers"
  | "mentors"
  | "judges"
  | "highlights"
  | "figures"
  | "sponsors"
  | "partners"
  | "relatedProjects"
> &
  Partial<TJEvent>;

const withDefaults = (e: SeedEvent): TJEvent => ({
  externalLinks: [],
  topics: [],
  agenda: [],
  speakers: [],
  mentors: [],
  judges: [],
  highlights: [],
  figures: [],
  sponsors: [],
  partners: [],
  relatedProjects: [],
  ...e,
});

/**
 * Only events with first-party (or reputable press) evidence.
 * Commudle RSVP counts are labelled as such and dated — they are not
 * headcounts.
 */
export const events: TJEvent[] = [
  withDefaults({
    slug: "dexterix-5-0",
    title: "Dexterix 5.0",
    type: "hackathon",
    shortDescription: "The fifth edition of TechnoJam's flagship hackathon — a 36-hour, in-person build at Galgotias University.",
    body: [
      "Dexterix 5.0 brought TechnoJam's flagship hackathon back to Galgotias University as a 36-hour offline edition, organised by Team TechnoJam in collaboration with the School of Computing Science & Engineering.",
      "Ahead of the event, the official site promoted a target of 600+ participants from 100+ colleges and universities. Those are pre-event targets — post-event figures, results and winners have not been published in a source we could verify, so they are not shown here.",
    ],
    startDate: "2026-02-14",
    endDate: "2026-02-15",
    mode: "in-person",
    venue: "Galgotias University, Greater Noida",
    externalLinks: [
      { label: "Dexterix 5.0 site", url: "https://dexterix.technojam.in" },
      { label: "Dexterix 5.0 Linktree", url: "https://linktr.ee/Dexterix_5.0" },
    ],
    highlights: [
      "36-hour offline format",
      "Open calls for mentors, judges and community partners",
      "Advertised prizes for winner, runners-up and best girls' team",
    ],
    figures: [
      { label: "Participants", value: "600+", kind: "target", verification: S.dx5Site },
      { label: "Colleges & universities", value: "100+", kind: "target", verification: S.dx5Site },
      { label: "Hours", value: "36", kind: "actual", verification: S.dx5LinkedIn },
    ],
    dexterixEdition: { slug: "dexterix-5-0", edition: "5.0" },
    verification: S.dx5LinkedIn,
  }),
  withDefaults({
    slug: "agents-101",
    title: "Agents 101",
    type: "session",
    shortDescription: "An online, hour-long introduction to building AI agents.",
    startDate: "2026-03-16",
    mode: "online",
    speakers: [{ name: "Saidev Dhal", topic: "AI agents" }],
    topics: ["AI agents", "LLMs"],
    figures: [
      {
        label: "Attending on Commudle",
        value: "86",
        kind: "registered",
        verification: S.agents101Commudle,
      },
    ],
    externalLinks: [
      {
        label: "Commudle event",
        url: "https://www.commudle.com/communities/technojam/events/let-s-talk-agents-7334d8ba-480b-43cb-a80a-e8c87d9e8a84",
      },
    ],
    verification: S.agents101Commudle,
  }),
  withDefaults({
    slug: "lets-talk-agents",
    title: "Let's Talk Agents",
    type: "workshop",
    shortDescription: "An in-person workshop on AI agents at Galgotias University.",
    startDate: "2025-12-23",
    mode: "in-person",
    venue: "Galgotias University",
    speakers: [{ name: "Saidev Dhal", topic: "AI agents" }],
    topics: ["AI agents"],
    externalLinks: [
      {
        label: "Commudle event",
        url: "https://www.commudle.com/communities/technojam/events/let-s-talk-agents",
      },
    ],
    verification: S.agentsCommudle,
  }),
  withDefaults({
    slug: "build-with-ai-2025",
    title: "Build With AI 2025",
    type: "workshop",
    shortDescription:
      "A full day of hands-on generative AI at Galgotias — agentic AI, LLM apps, prompt engineering, MCP, A2A and the Agent Development Kit.",
    body: [
      "Build With AI — Galgotias edition was hosted by the School of Computing Science & Engineering in collaboration with TechnoJam, and supported by Google for Developers as part of the Build with AI series.",
      "Sessions moved from ideas to implementation: agentic AI, building an HR chatbot with LLMs, prompt engineering, and a practical look at the Model Context Protocol (MCP), Agent2Agent (A2A) and Google's Agent Development Kit (ADK).",
      "According to the university's write-up, nearly half the attendees came from outside Galgotias.",
    ],
    startDate: "2025-04-26",
    mode: "in-person",
    venue: "Galgotias University, Greater Noida",
    topics: [
      "Agentic AI",
      "LLM applications",
      "AI chatbots",
      "Prompt engineering",
      "Model Context Protocol (MCP)",
      "Agent2Agent (A2A)",
      "Agent Development Kit (ADK)",
    ],
    speakers: [
      { name: "Sourav Bera", affiliation: "Microsoft", topic: "Agentic AI" },
      { name: "Anuj Saini", affiliation: "RPX", topic: "Building an HR chatbot with LLMs" },
      { name: "Jatin Kumar", affiliation: "Amazon", topic: "Prompt engineering" },
      { name: "Deepansh Singh", affiliation: "GDG Cloud Delhi", topic: "MCP, A2A and ADK" },
    ],
    partners: ["Google for Developers"],
    figures: [{ label: "Registered", value: "250+", kind: "registered", verification: S.bwaCommudle }],
    highlights: [
      "Supported by Google for Developers",
      "Nearly half of attendees from outside Galgotias",
      "Four industry and community speakers",
    ],
    externalLinks: [
      {
        label: "University write-up",
        url: "https://www.galgotiasuniversity.edu.in/p/Build-with-AI--Team-Technojam",
      },
      {
        label: "Commudle event",
        url: "https://www.commudle.com/communities/technojam/events/build-with-ai-galgotias-edition",
      },
    ],
    verification: {
      ...S.bwaGU,
      notes: "Speaker affiliations follow the university page; Commudle lists different titles for two speakers.",
    },
  }),
  withDefaults({
    slug: "turings-class-2024",
    title: "Turing's Class: The Math That Powers Machine Learning",
    type: "session",
    shortDescription: "An online series on the mathematics behind ML, run as part of Google's ML Math Club.",
    startDate: "2024-12-22",
    endDate: "2025-01-12",
    mode: "online",
    topics: ["Linear algebra", "Probability", "Machine learning"],
    partners: ["Google ML Math Club"],
    figures: [
      {
        label: "Attending on Commudle",
        value: "85",
        kind: "registered",
        verification: S.turingCommudle,
      },
    ],
    externalLinks: [{ label: "Commudle event", url: "https://www.commudle.com/communities/technojam/events/ml-event" }],
    verification: S.turingCommudle,
  }),
  withDefaults({
    slug: "ml-math-clubs-tfug-ghaziabad",
    title: "ML Math Clubs × TFUG Ghaziabad",
    type: "collaboration",
    shortDescription: "A community collaboration with TensorFlow User Group Ghaziabad on ML mathematics.",
    startDate: "2024-07-06",
    mode: "online",
    partners: ["TFUG Ghaziabad"],
    figures: [
      {
        label: "Attending on Commudle",
        value: "360",
        kind: "registered",
        verification: S.commudleEvents,
      },
    ],
    verification: S.commudleEvents,
  }),
  withDefaults({
    slug: "meghon-se-sakshatkar",
    title: "मेघों से साक्षात्कार — Meet the Clouds",
    type: "workshop",
    shortDescription: "An online introduction to the three big clouds: AWS, Azure and Google Cloud.",
    startDate: "2024-06-08",
    mode: "online",
    topics: ["AWS", "Azure", "Google Cloud"],
    externalLinks: [
      {
        label: "Commudle event",
        url: "https://www.commudle.com/communities/technojam/events/ed203036-505f-4c33-af78-68c6e726cf5d",
      },
    ],
    verification: S.cloudCommudle,
  }),
  withDefaults({
    slug: "expert-talk-akshay-saini",
    title: "Expert Talk by Akshay Saini",
    type: "session",
    shortDescription: "An in-person talk by the founder of NamasteDev at the New Auditorium.",
    startDate: "2024-04-24",
    mode: "in-person",
    venue: "New Auditorium, Galgotias University",
    speakers: [{ name: "Akshay Saini", affiliation: "NamasteDev" }],
    figures: [
      {
        label: "Attending on Commudle",
        value: "167",
        kind: "registered",
        verification: S.akshayCommudle,
      },
    ],
    externalLinks: [
      {
        label: "Commudle event",
        url: "https://www.commudle.com/communities/technojam/events/expert-talk-by-akshay-saini",
      },
    ],
    verification: S.akshayCommudle,
  }),
  withDefaults({
    slug: "dexterix-4-0",
    title: "Dexterix 4.0",
    type: "hackathon",
    shortDescription: "The fourth Dexterix: an offline hackathon with corporate and student tracks across twelve domains.",
    body: [
      "Dexterix 4.0 ran on 13–14 April 2024 at Galgotias University, organised by Team TechnoJam and the School of Computing Science & Engineering.",
      "Teams built across twelve domains — from fintech and sustainability to AR/VR, AI/ML and IoT, robotics & drones — in separate corporate-level and student-level tracks.",
    ],
    startDate: "2024-04-13",
    endDate: "2024-04-14",
    mode: "in-person",
    venue: "Galgotias University, Greater Noida",
    mentors: [{ name: "Dr. Arvind Dagur" }],
    figures: [{ label: "Domains", value: "12", kind: "actual", verification: S.dx4Page }],
    externalLinks: [
      { label: "University page", url: "https://www.galgotiasuniversity.edu.in/p/Dexterix-40" },
      {
        label: "Commudle hackathon",
        url: "https://www.commudle.com/communities/technojam/hackathons/dexterix-4-0",
      },
    ],
    dexterixEdition: { slug: "dexterix-4-0", edition: "4.0" },
    verification: S.dx4Page,
  }),
  withDefaults({
    slug: "freshers-fest-2024",
    title: "Fresher's Fest 2024",
    type: "collaboration",
    shortDescription: "A welcome for first-years, run together with Graphex, the university's design club.",
    startDate: "2024-01-15",
    mode: "in-person",
    venue: "Galgotias University",
    partners: ["Graphex"],
    verification: S.commudleEvents,
  }),
  withDefaults({
    slug: "dexterix-3-0",
    title: "Dexterix 3.0",
    type: "hackathon",
    shortDescription: "An international hybrid hackathon across eight domains, hosted by TechnoJam with SCSE and ACM.",
    body: [
      "Dexterix 3.0 was inaugurated on 11 March 2022 as an international hybrid hackathon, organised by the School of Computing Science & Engineering in association with ACM and hosted by TechnoJam.",
      "Teams of four to five worked on problem statements drawn from Smart India Hackathon 2022 across eight domains, in corporate and student tracks. Registration ran through Townscript and coordination through Discord.",
    ],
    startDate: "2022-03-11",
    endDate: "2022-03-12",
    mode: "hybrid",
    venue: "Galgotias University, Greater Noida & online",
    partners: ["ACM"],
    speakers: [
      { name: "Dr. Mohit Gambhir", affiliation: "Ministry of Education's Innovation Cell" },
      { name: "Dhruv Galgotia", affiliation: "CEO, Galgotias University" },
      { name: "Prof. Preeti Bajaj", affiliation: "Vice Chancellor, Galgotias University" },
      { name: "Dr. Munish Sabharwal", affiliation: "Dean, SCSE" },
    ],
    figures: [{ label: "Domains", value: "8", kind: "actual", verification: S.dx3Report }],
    externalLinks: [
      { label: "University report (PDF)", url: "https://www.galgotiasuniversity.edu.in/pdfs/DEXTERIX-REPORT.pdf" },
      { label: "Archived microsite", url: "https://technojam.github.io/dexterix3/" },
    ],
    dexterixEdition: { slug: "dexterix-3-0", edition: "3.0" },
    verification: S.dx3Report,
  }),
  withDefaults({
    slug: "dexterix-2018",
    title: "Dexterix (2018)",
    type: "hackathon",
    shortDescription: "The first Dexterix — a hackathon on “Smart Sustainable Solutions” at Galgotias University.",
    body: [
      "The first Dexterix was held at Galgotias University on 20 November 2018 around the theme “Smart Sustainable Solutions”, with awards across six categories. Press coverage at the time reported more than 500 students taking part.",
    ],
    startDate: "2018-11-20",
    mode: "in-person",
    venue: "Galgotias University, Greater Noida",
    topics: ["Smart Sustainable Solutions"],
    figures: [{ label: "Students", value: "500+", kind: "actual", verification: S.tennews2018 }],
    externalLinks: [
      {
        label: "TenNews coverage",
        url: "https://tennews.in/hackathon-named-dexterix-organised-at-galgotias-university-greater-noida/",
      },
    ],
    dexterixEdition: { slug: "dexterix-1-0", edition: "1.0" },
    verification: S.tennews2018,
  }),
];
