import { defineQuery } from "next-sanity";

/* Projections return the exact shapes in src/lib/content/types.ts */

const IMG = `{
  "url": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  caption,
  credit
}`;

const RICH = `[]{ ..., _type == "accessibleImage" => { _type, _key, "url": asset->url, "alt": coalesce(alt, ""), caption } }`;

const VERIFICATION = `verification{ status, sourceUrl, sourceName, lastVerified, notes }`;
const DOMAIN_REF = `{ "slug": slug.current, title }`;
/** People only appear publicly with recorded consent. */
const PERSON_REF = `{ "slug": slug.current, name, role, github }`;
const CONSENTED = `[defined(@) && consent == true]`;

const SPONSOR = `{ name, url, tier, "logo": logo${IMG}, ${VERIFICATION} }`;

export const settingsQuery = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{
    name, tagline, positioning, description, foundedYear, institution, school, location, email, githubOrg,
    "logo": logo${IMG},
    ${VERIFICATION}
  },
  "socials": *[_type == "socialLink"] | order(order asc){ platform, label, url, handle }
}`);

export const domainsQuery = defineQuery(`*[_type == "domain"] | order(order asc){
  "slug": slug.current, title, shortTitle, order, summary, "active": coalesce(active, true), keywords, ${VERIFICATION}
}`);

const PROJECT = `{
  "slug": slug.current, title, summary, "description": description${RICH}, status, statusNote, builtBecause, year, repository, repoFullName, liveUrl, language,
  "stack": coalesce(stack, []),
  "domains": coalesce(domains[]->${DOMAIN_REF}, []),
  "maintainers": coalesce(maintainers[]->${CONSENTED}${PERSON_REF}, []),
  "contributors": coalesce(contributors[]->${CONSENTED}${PERSON_REF}, []),
  "screenshots": coalesce(screenshots[]${IMG}, []),
  "featured": coalesce(featured, false),
  "relatedEvent": relatedEvent->{ "slug": slug.current, title },
  ${VERIFICATION}
}`;

export const projectsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(featured desc, year desc) ${PROJECT}`);

const EVENT = `{
  "slug": slug.current, title, type, statusOverride, shortDescription, "body": body${RICH}, startDate, endDate,
  "mode": coalesce(mode, "in-person"), venue, registrationUrl,
  "externalLinks": coalesce(externalLinks[]{ label, url }, []),
  "heroImage": heroImage${IMG},
  "topics": coalesce(topics, []),
  "agenda": coalesce(agenda[]{ time, title, speaker }, []),
  "speakers": coalesce(speakers[]{ name, affiliation, topic, url }, []),
  "mentors": coalesce(mentors[]{ name, affiliation, topic, url }, []),
  "judges": coalesce(judges[]{ name, affiliation, topic, url }, []),
  "highlights": coalesce(highlights, []),
  "figures": coalesce(figures[]{ label, value, kind, ${VERIFICATION} }, []),
  "sponsors": coalesce(sponsors[]->${SPONSOR}, []),
  "partners": coalesce(partners, []),
  "relatedProjects": coalesce(relatedProjects[]->{ "slug": slug.current, title }, []),
  "gallery": gallery->[approved == true]{ "slug": slug.current, title, date, "images": coalesce(images[]${IMG}, []) },
  "dexterixEdition": dexterixEdition->{ "slug": slug.current, edition },
  ${VERIFICATION}
}`;

export const eventsQuery = defineQuery(`*[_type == "event" && defined(slug.current)] | order(startDate desc) ${EVENT}`);

const FIGURE = `{ value, suffix, ${VERIFICATION} }`;

export const dexterixQuery = defineQuery(`*[_type == "dexterixEdition" && defined(slug.current)] | order(year desc){
  "slug": slug.current, edition, title, year, startDate, endDate, durationHours, durationNote, format, venue, tagline, summary,
  "themes": coalesce(themes, []),
  "tracks": coalesce(tracks, []),
  "participantsActual": participantsActual${FIGURE},
  "participantsTarget": participantsTarget${FIGURE},
  "institutionsActual": institutionsActual${FIGURE},
  "institutionsTarget": institutionsTarget${FIGURE},
  "prizes": coalesce(prizes[]{ label, amount }, []),
  prizeNote,
  "winners": coalesce(winners[]{ team, project, prize, url }, []),
  judgesNote,
  "sponsors": coalesce(sponsors[]->${SPONSOR}, []),
  microsite,
  "links": coalesce(links[]{ label, url }, []),
  "event": event->{ "slug": slug.current, title },
  "postEventDataAvailable": coalesce(postEventDataAvailable, false),
  ${VERIFICATION}
}`);

const PERSON = `{
  "slug": slug.current, name, "image": image${IMG}, role,
  "domains": coalesce(domains[]->${DOMAIN_REF}, []),
  batch, tenure, bio, obsession, lastShipped, askMeAbout, github, linkedin, portfolio,
  "currentMember": coalesce(currentMember, false),
  ${VERIFICATION}
}`;

export const teamYearsQuery = defineQuery(`*[_type == "teamYear" && defined(slug.current)] | order(startYear desc){
  "slug": slug.current, label, startYear, "current": coalesce(current, false),
  "members": coalesce(members[defined(person) && person->consent == true]{ role, "group": coalesce(group, "member"), "person": person->${PERSON} }, []),
  ${VERIFICATION}
}`);

export const recruitmentQuery = defineQuery(`*[_type == "recruitmentCycle" && defined(slug.current)] | order(year desc){
  "slug": slug.current, year, title, status, "summary": coalesce(summary, ""), openingDate, deadline,
  "eligibility": coalesce(eligibility, []),
  "tracks": coalesce(tracks[]{ title, "domainSlug": domain->slug.current, description, tasksUrl }, []),
  tasksRepository, applicationUrl,
  "instructions": coalesce(instructions, []),
  "timeline": coalesce(timeline[]{ label, date, note }, []),
  "faq": coalesce(faq[]{ question, answer }, []),
  "contact": contact{ label, url },
  ${VERIFICATION}
}`);

export const milestonesQuery = defineQuery(`*[_type == "milestone"] | order(year asc, date asc){
  year, date, title, description, kind, href, ${VERIFICATION}
}`);

export const resourcesQuery = defineQuery(`*[_type == "resource" && defined(slug.current)] | order(title asc){
  "slug": slug.current, title, url, kind, "description": coalesce(description, ""),
  "domain": domain->${DOMAIN_REF}, "forRecruitment": coalesce(forRecruitment, false)
}`);

export const announcementsQuery = defineQuery(`*[_type == "announcement" && defined(slug.current)] | order(priority desc){
  "slug": slug.current, kind, "label": coalesce(label, "NOW"), title, summary, "cta": cta{ label, url },
  activeFrom, activeUntil, "priority": coalesce(priority, 0)
}`);

export const partnersQuery = defineQuery(`*[_type == "partner"] | order(name asc){
  name, kind, url, description, "logo": logo${IMG}, ${VERIFICATION}
}`);

export const metricsQuery = defineQuery(`*[_type == "metric"] | order(order asc){
  label, value, prefix, suffix, detail, asOf, ${VERIFICATION}
}`);

export const achievementsQuery = defineQuery(`*[_type == "achievement"] | order(date desc){
  title, date, "description": coalesce(description, ""), url, ${VERIFICATION}
}`);

export const labFactsQuery = defineQuery(`*[_type == "labFact"] | order(order asc){
  kind, when, label, value, detail, "ours": coalesce(ours, false), ${VERIFICATION}
}`);

export const ritualQuery = defineQuery(`*[_type == "ritual"][0]{
  name, day, startTime, endTime, venue, "bring": coalesce(bring, []), experience, signupUrl, ${VERIFICATION}
}`);
