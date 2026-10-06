/**
 * Exports the verified seed (src/content/seed) as Sanity documents.
 *
 *   npm run seed:export
 *   npx sanity dataset import scripts/out/seed.ndjson production --replace
 *
 * IDs are deterministic, so re-running is idempotent with --replace.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as seed from "../src/content/seed";
import type { Verification } from "../src/lib/content/types";

type Doc = Record<string, unknown> & { _id: string; _type: string };

let k = 0;
const key = () => `k${(k++).toString(36)}`;
const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key() });
const ref1 = (id: string) => ({ _type: "reference", _ref: id });
const slug = (current: string) => ({ _type: "slug", current });
const keyed = <T extends object>(items: T[]) => items.map((i) => ({ _key: key(), ...i }));
const ver = (v?: Verification) => (v ? { _type: "verification", ...v } : undefined);
const blocks = (paras?: unknown[]) =>
  paras?.every((p) => typeof p === "string")
    ? (paras as string[]).map((text) => ({
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: key(), text, marks: [] }],
      }))
    : paras;
const clean = (o: Doc): Doc => JSON.parse(JSON.stringify(o));

const docs: Doc[] = [];
const s = seed.siteSettings;

docs.push({
  _id: "siteSettings",
  _type: "siteSettings",
  name: s.name,
  tagline: s.tagline,
  positioning: s.positioning,
  description: s.description,
  foundedYear: s.foundedYear,
  institution: s.institution,
  school: s.school,
  location: s.location,
  email: s.email,
  githubOrg: s.githubOrg,
  verification: ver(s.verification),
});

s.socials.forEach((x, i) => docs.push({ _id: `social-${x.platform}`, _type: "socialLink", ...x, order: i }));

seed.domains.forEach((d) =>
  docs.push({ _id: `domain-${d.slug}`, _type: "domain", ...d, slug: slug(d.slug), verification: ver(d.verification) }),
);

seed.projects.forEach((p) =>
  docs.push({
    _id: `project-${p.slug}`,
    _type: "project",
    title: p.title,
    slug: slug(p.slug),
    summary: p.summary,
    description: blocks(p.description),
    status: p.status,
    year: p.year,
    repository: p.repository,
    repoFullName: p.repoFullName,
    liveUrl: p.liveUrl,
    language: p.language,
    stack: p.stack,
    domains: p.domains.map((d) => ref(`domain-${d.slug}`)),
    featured: p.featured,
    relatedEvent: p.relatedEvent ? ref1(`event-${p.relatedEvent.slug}`) : undefined,
    verification: ver(p.verification),
  }),
);

seed.events.forEach((e) =>
  docs.push({
    _id: `event-${e.slug}`,
    _type: "event",
    title: e.title,
    slug: slug(e.slug),
    type: e.type,
    shortDescription: e.shortDescription,
    body: blocks(e.body),
    startDate: e.startDate,
    endDate: e.endDate,
    mode: e.mode,
    venue: e.venue,
    registrationUrl: e.registrationUrl,
    externalLinks: keyed(e.externalLinks.map((l) => ({ _type: "link", ...l }))),
    topics: e.topics,
    agenda: keyed(e.agenda),
    speakers: keyed(e.speakers.map((x) => ({ _type: "speaker", ...x }))),
    mentors: keyed(e.mentors.map((x) => ({ _type: "speaker", ...x }))),
    judges: keyed(e.judges.map((x) => ({ _type: "speaker", ...x }))),
    highlights: e.highlights,
    figures: keyed(e.figures.map((f) => ({ _type: "eventFigure", ...f, verification: ver(f.verification) }))),
    partners: e.partners,
    dexterixEdition: e.dexterixEdition ? ref1(`dexterix-${e.dexterixEdition.slug}`) : undefined,
    verification: ver(e.verification),
  }),
);

const fig = (f?: { value: number; suffix?: string; verification?: Verification }) =>
  f ? { _type: "statFigure", value: f.value, suffix: f.suffix, verification: ver(f.verification) } : undefined;

seed.dexterixEditions.forEach((d) =>
  docs.push({
    _id: `dexterix-${d.slug}`,
    _type: "dexterixEdition",
    edition: d.edition,
    title: d.title,
    slug: slug(d.slug),
    year: d.year,
    tagline: d.tagline,
    summary: d.summary,
    startDate: d.startDate,
    endDate: d.endDate,
    durationHours: d.durationHours,
    durationNote: d.durationNote,
    format: d.format,
    venue: d.venue,
    themes: d.themes,
    tracks: d.tracks,
    participantsActual: fig(d.participantsActual),
    participantsTarget: fig(d.participantsTarget),
    institutionsActual: fig(d.institutionsActual),
    institutionsTarget: fig(d.institutionsTarget),
    prizes: keyed(d.prizes),
    prizeNote: d.prizeNote,
    winners: keyed(d.winners),
    judgesNote: d.judgesNote,
    microsite: d.microsite,
    links: keyed(d.links.map((l) => ({ _type: "link", ...l }))),
    event: d.event ? ref1(`event-${d.event.slug}`) : undefined,
    postEventDataAvailable: d.postEventDataAvailable,
    verification: ver(d.verification),
  }),
);

seed.milestones.forEach((m, i) => docs.push({ _id: `milestone-${m.year}-${i}`, _type: "milestone", ...m, verification: ver(m.verification) }));

seed.metrics.forEach((m, i) =>
  docs.push({ _id: `metric-${i}`, _type: "metric", ...m, order: i, verification: ver(m.verification) }),
);

seed.resources.forEach((r) =>
  docs.push({
    _id: `resource-${r.slug}`,
    _type: "resource",
    ...r,
    slug: slug(r.slug),
    domain: r.domain ? ref1(`domain-${r.domain.slug}`) : undefined,
  }),
);

seed.recruitmentCycles.forEach((c) =>
  docs.push({
    _id: `recruitment-${c.slug}`,
    _type: "recruitmentCycle",
    ...c,
    slug: slug(c.slug),
    tracks: keyed(
      c.tracks.map(({ domainSlug, ...t }) => ({ ...t, ...(domainSlug ? { domain: ref1(`domain-${domainSlug}`) } : {}) })),
    ),
    timeline: keyed(c.timeline),
    faq: keyed(c.faq),
    contact: c.contact ? { _type: "link", ...c.contact } : undefined,
    verification: ver(c.verification),
  }),
);

seed.partners.forEach((p) =>
  docs.push({ _id: `partner-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, _type: "partner", ...p, verification: ver(p.verification) }),
);

seed.labFacts.forEach((f, i) => docs.push({ _id: `labfact-${i}`, _type: "labFact", ...f, order: i, verification: ver(f.verification) }));

docs.push({ _id: "ritual-jam-night", _type: "ritual", ...seed.jamNight, verification: ver(seed.jamNight.verification) });

const outDir = join(process.cwd(), "scripts", "out");
mkdirSync(outDir, { recursive: true });
const file = join(outDir, "seed.ndjson");
writeFileSync(file, docs.map((d) => JSON.stringify(clean(d))).join("\n") + "\n");
console.log(`Wrote ${docs.length} documents → ${file}`);
