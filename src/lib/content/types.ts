/**
 * Content contracts shared by the Sanity adapter and the local seed.
 * GROQ projections in `queries.ts` return exactly these shapes, so
 * components never know (or care) where content came from.
 */

export type VerificationStatus = "verified" | "pending" | "archived_source";

export interface Verification {
  status: VerificationStatus;
  sourceUrl?: string;
  sourceName?: string;
  /** ISO date (YYYY-MM-DD) */
  lastVerified?: string;
  notes?: string;
}

export interface Link {
  label: string;
  url: string;
}

export interface ImageAsset {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  /** base64 low-quality placeholder from Sanity */
  lqip?: string;
  caption?: string;
  credit?: string;
}

/** Portable Text from Sanity, or plain paragraphs from the seed. */
export type RichText = unknown[] | string[];

/* ------------------------------------------------------------------ */

export interface SocialLink {
  platform: "github" | "linkedin" | "instagram" | "x" | "commudle" | "discord" | "facebook" | "youtube" | "email" | "website";
  label: string;
  url: string;
  handle?: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  positioning: string;
  description: string;
  foundedYear: number;
  institution: string;
  school: string;
  location: string;
  email: string;
  logo?: ImageAsset;
  socials: SocialLink[];
  githubOrg: string;
  verification?: Verification;
}

export interface Domain {
  slug: string;
  title: string;
  shortTitle?: string;
  order: number;
  summary: string;
  /** Currently recruited/active domain vs. historically represented */
  active: boolean;
  keywords?: string[];
  verification?: Verification;
}

export type ProjectStatus = "active" | "maintained" | "experiment" | "event" | "archived";

export interface PersonRef {
  slug: string;
  name: string;
  role?: string;
  github?: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description?: RichText;
  status: ProjectStatus;
  year: number;
  repository?: string;
  /** owner/name — used for cached GitHub metadata */
  repoFullName?: string;
  liveUrl?: string;
  stack: string[];
  language?: string;
  domains: Pick<Domain, "slug" | "title">[];
  maintainers: PersonRef[];
  contributors: PersonRef[];
  screenshots: ImageAsset[];
  featured: boolean;
  relatedEvent?: { slug: string; title: string };
  verification?: Verification;
}

export type EventType = "hackathon" | "workshop" | "meetup" | "competition" | "session" | "collaboration" | "recruitment";

export type EventMode = "in-person" | "online" | "hybrid";

export interface Speaker {
  name: string;
  /** As published by the organiser */
  affiliation?: string;
  topic?: string;
  url?: string;
}

export interface AgendaItem {
  time?: string;
  title: string;
  speaker?: string;
}

export interface EventFigure {
  label: string;
  value: string;
  /** "actual" figures are post-event; "target" figures are pre-event promotion */
  kind: "actual" | "target" | "registered" | "reach";
  verification?: Verification;
}

export interface TJEvent {
  slug: string;
  title: string;
  type: EventType;
  /** Manual override; otherwise derived from dates */
  statusOverride?: "cancelled" | "postponed";
  shortDescription: string;
  body?: RichText;
  startDate: string;
  endDate?: string;
  mode: EventMode;
  venue?: string;
  registrationUrl?: string;
  externalLinks: Link[];
  heroImage?: ImageAsset;
  topics: string[];
  agenda: AgendaItem[];
  speakers: Speaker[];
  mentors: Speaker[];
  judges: Speaker[];
  highlights: string[];
  figures: EventFigure[];
  sponsors: Sponsor[];
  partners: string[];
  relatedProjects: Pick<Project, "slug" | "title">[];
  gallery?: Gallery;
  dexterixEdition?: { slug: string; edition: string };
  verification?: Verification;
}

export interface Person {
  slug: string;
  name: string;
  image?: ImageAsset;
  role?: string;
  domains: Pick<Domain, "slug" | "title">[];
  batch?: string;
  tenure?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  currentMember: boolean;
  verification?: Verification;
}

export interface TeamYear {
  slug: string;
  label: string;
  startYear: number;
  current: boolean;
  members: {
    person: Person;
    role: string;
    group: "lead" | "core" | "domain-lead" | "member" | "faculty";
  }[];
  verification?: Verification;
}

export interface Sponsor {
  name: string;
  url?: string;
  logo?: ImageAsset;
  tier?: string;
  verification?: Verification;
}

export interface Partner {
  name: string;
  kind: "community" | "university" | "industry" | "platform";
  url?: string;
  logo?: ImageAsset;
  description?: string;
  verification?: Verification;
}

export interface Resource {
  slug: string;
  title: string;
  url: string;
  kind: "repository" | "guide" | "documentation" | "video" | "course" | "tool";
  description: string;
  domain?: Pick<Domain, "slug" | "title">;
  forRecruitment: boolean;
}

export interface Gallery {
  slug: string;
  title: string;
  date?: string;
  images: ImageAsset[];
}

export type RecruitmentStatus = "upcoming" | "open" | "evaluating" | "closed";

export interface RecruitmentTrack {
  title: string;
  domainSlug?: string;
  description?: string;
  tasksUrl?: string;
}

export interface RecruitmentCycle {
  slug: string;
  year: number;
  title: string;
  status: RecruitmentStatus;
  summary: string;
  openingDate?: string;
  deadline?: string;
  eligibility: string[];
  tracks: RecruitmentTrack[];
  tasksRepository?: string;
  applicationUrl?: string;
  instructions: string[];
  timeline: { label: string; date?: string; note?: string }[];
  faq: { question: string; answer: string }[];
  contact?: { label: string; url: string };
  verification?: Verification;
}

export interface StatFigure {
  value: number;
  /** "+" for 600+, etc. */
  suffix?: string;
  verification?: Verification;
}

export interface DexterixEdition {
  slug: string;
  edition: string;
  title: string;
  year: number;
  startDate?: string;
  endDate?: string;
  durationHours?: number;
  /** Conflicting first-party durations, shown honestly */
  durationNote?: string;
  format?: EventMode;
  venue?: string;
  tagline?: string;
  summary: string;
  themes: string[];
  tracks: string[];
  participantsActual?: StatFigure;
  participantsTarget?: StatFigure;
  institutionsActual?: StatFigure;
  institutionsTarget?: StatFigure;
  prizes: { label: string; amount: string }[];
  prizeNote?: string;
  winners: { team: string; project?: string; prize?: string; url?: string }[];
  judgesNote?: string;
  sponsors: Sponsor[];
  microsite?: string;
  links: Link[];
  event?: { slug: string; title: string };
  postEventDataAvailable: boolean;
  verification?: Verification;
}

export interface Milestone {
  year: number;
  date?: string;
  title: string;
  description: string;
  kind: "origin" | "dexterix" | "event" | "community" | "recruitment" | "open-source";
  href?: string;
  verification?: Verification;
}

export interface Announcement {
  slug: string;
  kind: "recruitment" | "event" | "project" | "announcement" | "dexterix" | "workshop";
  label: string;
  title: string;
  summary: string;
  cta?: Link;
  activeFrom?: string;
  activeUntil?: string;
  priority: number;
}

export interface Metric {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  detail: string;
  asOf?: string;
  verification: Verification;
}

export interface Achievement {
  title: string;
  date?: string;
  description: string;
  url?: string;
  verification?: Verification;
}
