import type { Metadata } from "next";
import type { Project, SiteSettings, TJEvent } from "./content/types";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.technojam.in").replace(/\/$/, "");

export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
  };
}

/** Safe JSON-LD: escape "<" so CMS strings can't close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}

export function organizationJsonLd(s: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: s.name,
    slogan: s.tagline,
    description: s.description,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    foundingDate: String(s.foundedYear),
    email: s.email,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: s.institution,
      department: { "@type": "Organization", name: s.school },
    },
    address: { "@type": "PostalAddress", addressLocality: "Greater Noida", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
    sameAs: s.socials.filter((x) => x.url.startsWith("http")).map((x) => x.url),
  };
}

const MODE = {
  "in-person": "https://schema.org/OfflineEventAttendanceMode",
  online: "https://schema.org/OnlineEventAttendanceMode",
  hybrid: "https://schema.org/MixedEventAttendanceMode",
} as const;

export function eventJsonLd(e: TJEvent) {
  const location =
    e.mode === "online"
      ? { "@type": "VirtualLocation", url: e.registrationUrl || e.externalLinks[0]?.url || `${SITE_URL}/events/${e.slug}` }
      : { "@type": "Place", name: e.venue || "Galgotias University", address: { "@type": "PostalAddress", addressLocality: "Greater Noida", addressCountry: "IN" } };
  return {
    "@context": "https://schema.org",
    "@type": e.type === "workshop" || e.type === "session" ? "EducationEvent" : "Event",
    name: e.title,
    description: e.shortDescription,
    startDate: e.startDate,
    endDate: e.endDate ?? e.startDate,
    eventAttendanceMode: MODE[e.mode],
    eventStatus:
      e.statusOverride === "cancelled"
        ? "https://schema.org/EventCancelled"
        : e.statusOverride === "postponed"
          ? "https://schema.org/EventPostponed"
          : "https://schema.org/EventScheduled",
    location,
    url: `${SITE_URL}/events/${e.slug}`,
    ...(e.heroImage ? { image: e.heroImage.url } : {}),
    organizer: { "@id": `${SITE_URL}/#organization` },
    ...(e.speakers.length ? { performer: e.speakers.map((s) => ({ "@type": "Person", name: s.name })) } : {}),
  };
}

export function projectJsonLd(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: p.title,
    description: p.summary,
    codeRepository: p.repository,
    programmingLanguage: p.language,
    dateCreated: String(p.year),
    url: `${SITE_URL}/projects/${p.slug}`,
    author: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
  };
}
