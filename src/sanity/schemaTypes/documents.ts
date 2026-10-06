import { defineArrayMember, defineField, defineType } from "sanity";

const slugField = (source = "title") =>
  defineField({
    name: "slug",
    type: "slug",
    options: { source, maxLength: 96 },
    description: "Becomes the permanent URL — avoid changing it after publishing.",
    validation: (r) => r.required(),
  });

const verificationField = defineField({
  name: "verification",
  type: "verification",
  group: "verification",
});

const groups = [
  { name: "content", title: "Content", default: true },
  { name: "details", title: "Details" },
  { name: "media", title: "Media" },
  { name: "verification", title: "Verification" },
];

/* ---------------- Site ---------------- */

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", initialValue: "TechnoJam", validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string", initialValue: "Throttle to Learn", validation: (r) => r.required() }),
    defineField({ name: "positioning", type: "string" }),
    defineField({ name: "description", type: "text", rows: 3, description: "Default SEO description" }),
    defineField({ name: "foundedYear", type: "number" }),
    defineField({ name: "institution", type: "string" }),
    defineField({ name: "school", type: "string" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "email", type: "string", validation: (r) => r.email() }),
    defineField({ name: "githubOrg", type: "string", description: "GitHub organisation login, e.g. technojam" }),
    defineField({ name: "logo", type: "accessibleImage" }),
    defineField({ name: "verification", type: "verification" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "document",
  fields: [
    defineField({
      name: "platform",
      type: "string",
      options: {
        list: ["github", "linkedin", "instagram", "x", "commudle", "discord", "facebook", "youtube", "email", "website"],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "url", type: "url", validation: (r) => r.required().uri({ scheme: ["http", "https", "mailto"] }) }),
    defineField({ name: "handle", type: "string" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "label", subtitle: "url" } },
});

export const announcement = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  description: "Short, time-boxed news shown in the “Now at TechnoJam” strip.",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required().max(90) }),
    slugField(),
    defineField({
      name: "kind",
      type: "string",
      options: { list: ["announcement", "recruitment", "event", "project", "dexterix", "workshop"] },
      initialValue: "announcement",
    }),
    defineField({ name: "label", type: "string", description: "Eyebrow, e.g. NOW, NEXT UP, NEW", initialValue: "NOW" }),
    defineField({ name: "summary", type: "text", rows: 2, validation: (r) => r.required().max(220) }),
    defineField({ name: "cta", type: "link" }),
    defineField({ name: "activeFrom", type: "date" }),
    defineField({ name: "activeUntil", type: "date" }),
    defineField({ name: "priority", type: "number", initialValue: 0, description: "Higher shows first" }),
  ],
  preview: { select: { title: "title", subtitle: "label" } },
});

export const homepageFeature = defineType({
  name: "homepageFeature",
  title: "Homepage feature",
  type: "document",
  description:
    "Pin a document to the top of the homepage. If none are active, the site picks the most relevant live content automatically.",
  fields: [
    defineField({ name: "label", type: "string", initialValue: "NOW AT TECHNOJAM" }),
    defineField({
      name: "item",
      type: "reference",
      to: [{ type: "event" }, { type: "project" }, { type: "recruitmentCycle" }, { type: "dexterixEdition" }, { type: "announcement" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "activeFrom", type: "date" }),
    defineField({ name: "activeUntil", type: "date" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "item.title", subtitle: "label" } },
});

/* ---------------- Taxonomy ---------------- */

export const domain = defineType({
  name: "domain",
  title: "Technical domain",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "shortTitle", type: "string" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "summary", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({
      name: "active",
      type: "boolean",
      initialValue: true,
      description: "Off = historically represented, not currently recruited.",
    }),
    defineField({ name: "keywords", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "verification", type: "verification" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", active: "active" },
    prepare: ({ title, active }) => ({ title, subtitle: active ? "Active" : "Historical" }),
  },
});

/* ---------------- Work ---------------- */

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups,
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    { ...slugField(), group: "content" },
    defineField({ name: "summary", type: "text", rows: 2, group: "content", validation: (r) => r.required().max(240) }),
    defineField({ name: "description", type: "richText", group: "content" }),
    defineField({
      name: "status",
      type: "string",
      group: "details",
      description: "Be honest — archived repositories are not “active”.",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Maintained", value: "maintained" },
          { title: "Experiment", value: "experiment" },
          { title: "Event project", value: "event" },
          { title: "Archived", value: "archived" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "builtBecause",
      title: "Built because…",
      type: "string",
      group: "content",
      description: "One line for the homepage reel. Finish the sentence: Built because …",
      validation: (r) => r.max(110),
    }),
    defineField({
      name: "statusNote",
      type: "string",
      group: "details",
      description: "Optional honest status stamp, e.g. MOSTLY WORKS, VERSION 0.3, WE LEARNED A LOT. Must be true.",
    }),
    defineField({ name: "year", type: "number", group: "details", validation: (r) => r.required().min(2015) }),
    defineField({ name: "repository", type: "url", group: "details" }),
    defineField({
      name: "repoFullName",
      type: "string",
      group: "details",
      description: "owner/name — enables cached GitHub metadata (last push, language).",
    }),
    defineField({ name: "liveUrl", type: "url", group: "details" }),
    defineField({ name: "language", type: "string", group: "details" }),
    defineField({ name: "stack", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "details" }),
    defineField({ name: "domains", type: "array", of: [{ type: "reference", to: [{ type: "domain" }] }], group: "details" }),
    defineField({ name: "maintainers", type: "array", of: [{ type: "reference", to: [{ type: "person" }] }], group: "details" }),
    defineField({ name: "contributors", type: "array", of: [{ type: "reference", to: [{ type: "person" }] }], group: "details" }),
    defineField({ name: "relatedEvent", type: "reference", to: [{ type: "event" }], group: "details" }),
    defineField({ name: "featured", type: "boolean", initialValue: false, group: "details" }),
    defineField({ name: "screenshots", type: "array", of: [{ type: "accessibleImage" }], group: "media" }),
    verificationField,
  ],
  orderings: [{ title: "Year, newest", name: "yearDesc", by: [{ field: "year", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "status", media: "screenshots.0" } },
});

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  groups,
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    { ...slugField(), group: "content" },
    defineField({
      name: "type",
      type: "string",
      group: "content",
      options: { list: ["hackathon", "workshop", "meetup", "competition", "session", "collaboration", "recruitment"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "shortDescription", type: "text", rows: 2, group: "content", validation: (r) => r.required().max(240) }),
    defineField({ name: "body", type: "richText", group: "content" }),
    defineField({ name: "startDate", type: "date", group: "details", validation: (r) => r.required() }),
    defineField({
      name: "endDate",
      type: "date",
      group: "details",
      validation: (r) =>
        r.custom((end, ctx) => {
          const start = (ctx.document as { startDate?: string } | undefined)?.startDate;
          return end && start && end < start ? "End date is before the start date" : true;
        }),
    }),
    defineField({
      name: "statusOverride",
      type: "string",
      group: "details",
      description: "Leave empty — upcoming / live / past is worked out from the dates.",
      options: { list: ["cancelled", "postponed"] },
    }),
    defineField({
      name: "mode",
      type: "string",
      group: "details",
      options: { list: ["in-person", "online", "hybrid"] },
      initialValue: "in-person",
    }),
    defineField({ name: "venue", type: "string", group: "details" }),
    defineField({ name: "registrationUrl", type: "url", group: "details" }),
    defineField({ name: "externalLinks", type: "array", of: [{ type: "link" }], group: "details" }),
    defineField({ name: "topics", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "details" }),
    defineField({
      name: "agenda",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          name: "agendaItem",
          fields: [
            { name: "time", type: "string" },
            { name: "title", type: "string", validation: (r) => r.required() },
            { name: "speaker", type: "string" },
          ],
        }),
      ],
    }),
    defineField({ name: "speakers", type: "array", of: [{ type: "speaker" }], group: "details" }),
    defineField({ name: "mentors", type: "array", of: [{ type: "speaker" }], group: "details" }),
    defineField({ name: "judges", type: "array", of: [{ type: "speaker" }], group: "details" }),
    defineField({ name: "highlights", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({ name: "figures", type: "array", of: [{ type: "eventFigure" }], group: "details" }),
    defineField({ name: "sponsors", type: "array", of: [{ type: "reference", to: [{ type: "sponsor" }] }], group: "details" }),
    defineField({ name: "partners", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({ name: "relatedProjects", type: "array", of: [{ type: "reference", to: [{ type: "project" }] }], group: "details" }),
    defineField({ name: "dexterixEdition", type: "reference", to: [{ type: "dexterixEdition" }], group: "details" }),
    defineField({ name: "heroImage", type: "accessibleImage", group: "media" }),
    defineField({ name: "gallery", type: "reference", to: [{ type: "gallery" }], group: "media" }),
    verificationField,
  ],
  orderings: [{ title: "Date, newest", name: "dateDesc", by: [{ field: "startDate", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "startDate", media: "heroImage" } },
});

export const dexterixEdition = defineType({
  name: "dexterixEdition",
  title: "Dexterix edition",
  type: "document",
  groups: [...groups, { name: "numbers", title: "Numbers" }],
  fields: [
    defineField({ name: "edition", type: "string", group: "content", description: "e.g. 5.0", validation: (r) => r.required() }),
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    { ...slugField(), group: "content" },
    defineField({ name: "year", type: "number", group: "content", validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string", group: "content" }),
    defineField({ name: "summary", type: "text", rows: 3, group: "content", validation: (r) => r.required() }),
    defineField({ name: "startDate", type: "date", group: "details" }),
    defineField({ name: "endDate", type: "date", group: "details" }),
    defineField({ name: "durationHours", type: "number", group: "details" }),
    defineField({ name: "durationNote", type: "string", group: "details" }),
    defineField({ name: "format", type: "string", group: "details", options: { list: ["in-person", "online", "hybrid"] } }),
    defineField({ name: "venue", type: "string", group: "details" }),
    defineField({ name: "themes", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({ name: "tracks", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({
      name: "participantsActual",
      title: "Participants — ACTUAL (post-event)",
      type: "statFigure",
      group: "numbers",
      description: "Only a count reported after the event. Never copy a target here.",
    }),
    defineField({ name: "participantsTarget", title: "Participants — TARGET (pre-event)", type: "statFigure", group: "numbers" }),
    defineField({ name: "institutionsActual", title: "Institutions — ACTUAL", type: "statFigure", group: "numbers" }),
    defineField({ name: "institutionsTarget", title: "Institutions — TARGET / reach", type: "statFigure", group: "numbers" }),
    defineField({
      name: "prizes",
      type: "array",
      group: "numbers",
      of: [
        defineArrayMember({
          type: "object",
          name: "prize",
          fields: [
            { name: "label", type: "string" },
            { name: "amount", type: "string" },
          ],
        }),
      ],
    }),
    defineField({ name: "prizeNote", type: "string", group: "numbers" }),
    defineField({
      name: "winners",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          name: "winner",
          fields: [
            { name: "team", type: "string", validation: (r) => r.required() },
            { name: "project", type: "string" },
            { name: "prize", type: "string" },
            { name: "url", type: "url" },
          ],
        }),
      ],
    }),
    defineField({ name: "judgesNote", type: "string", group: "details" }),
    defineField({ name: "sponsors", type: "array", of: [{ type: "reference", to: [{ type: "sponsor" }] }], group: "details" }),
    defineField({ name: "microsite", type: "url", group: "details" }),
    defineField({ name: "links", type: "array", of: [{ type: "link" }], group: "details" }),
    defineField({ name: "event", type: "reference", to: [{ type: "event" }], group: "details" }),
    defineField({ name: "gallery", type: "reference", to: [{ type: "gallery" }], group: "media" }),
    defineField({
      name: "postEventDataAvailable",
      type: "boolean",
      initialValue: false,
      group: "numbers",
      description: "Tick once outcomes (actual numbers / winners) are published from a verifiable source.",
    }),
    verificationField,
  ],
  orderings: [{ title: "Year, newest", name: "yearDesc", by: [{ field: "year", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "year" } },
});

/* ---------------- People ---------------- */

export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  groups,
  fields: [
    defineField({ name: "name", type: "string", group: "content", validation: (r) => r.required() }),
    { ...slugField("name"), group: "content" },
    defineField({ name: "image", type: "accessibleImage", group: "media" }),
    defineField({ name: "role", type: "string", group: "content", description: "Most recent TechnoJam role" }),
    defineField({ name: "domains", type: "array", of: [{ type: "reference", to: [{ type: "domain" }] }], group: "details" }),
    defineField({ name: "batch", type: "string", group: "details", description: "Academic batch, e.g. 2023–27" }),
    defineField({ name: "tenure", type: "string", group: "details", description: "e.g. 2024–2026" }),
    defineField({ name: "bio", type: "text", rows: 3, group: "content" }),
    defineField({ name: "obsession", title: "Currently obsessed with", type: "string", group: "content" }),
    defineField({ name: "lastShipped", title: "Last shipped", type: "string", group: "content" }),
    defineField({ name: "askMeAbout", title: "Ask me about", type: "string", group: "content" }),
    defineField({ name: "github", type: "url", group: "details" }),
    defineField({ name: "linkedin", type: "url", group: "details" }),
    defineField({ name: "portfolio", type: "url", group: "details" }),
    defineField({
      name: "currentMember",
      type: "boolean",
      initialValue: true,
      group: "details",
      description: "Untick to archive — alumni stay on the site under past teams.",
    }),
    defineField({
      name: "consent",
      type: "boolean",
      initialValue: false,
      group: "verification",
      description: "This person agreed to be listed publicly. Required to publish.",
      validation: (r) => r.custom((v) => (v ? true : "Get consent before listing a person publicly")).warning(),
    }),
    verificationField,
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});

export const teamYear = defineType({
  name: "teamYear",
  title: "Team year",
  type: "document",
  fields: [
    defineField({ name: "label", type: "string", description: "e.g. 2025–26", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "label" }, validation: (r) => r.required() }),
    defineField({ name: "startYear", type: "number", validation: (r) => r.required() }),
    defineField({ name: "current", type: "boolean", initialValue: false }),
    defineField({
      name: "members",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "membership",
          fields: [
            { name: "person", type: "reference", to: [{ type: "person" }], validation: (r) => r.required() },
            { name: "role", type: "string", validation: (r) => r.required() },
            {
              name: "group",
              type: "string",
              options: { list: ["lead", "core", "domain-lead", "member", "faculty"] },
              initialValue: "member",
            },
          ],
          preview: { select: { title: "person.name", subtitle: "role" } },
        }),
      ],
    }),
    defineField({ name: "verification", type: "verification" }),
  ],
  orderings: [{ title: "Newest", name: "startDesc", by: [{ field: "startYear", direction: "desc" }] }],
  preview: {
    select: { title: "label", current: "current" },
    prepare: ({ title, current }) => ({ title, subtitle: current ? "Current team" : "Past team" }),
  },
});

/* ---------------- Recruitment ---------------- */

export const recruitmentCycle = defineType({
  name: "recruitmentCycle",
  title: "Recruitment cycle",
  type: "document",
  groups,
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    { ...slugField(), group: "content" },
    defineField({ name: "year", type: "number", group: "content", validation: (r) => r.required() }),
    defineField({
      name: "status",
      type: "string",
      group: "content",
      description: "Flip this to open or close recruitment across the whole site.",
      options: {
        list: [
          { title: "Upcoming — announced, not open yet", value: "upcoming" },
          { title: "Open — accepting submissions", value: "open" },
          { title: "Evaluating — submissions closed, interviews running", value: "evaluating" },
          { title: "Closed", value: "closed" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "summary", type: "text", rows: 2, group: "content" }),
    defineField({ name: "openingDate", type: "date", group: "details" }),
    defineField({ name: "deadline", type: "date", group: "details" }),
    defineField({ name: "eligibility", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({
      name: "tracks",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          name: "track",
          fields: [
            { name: "title", type: "string", validation: (r) => r.required() },
            { name: "domain", type: "reference", to: [{ type: "domain" }] },
            { name: "description", type: "text", rows: 2 },
            { name: "tasksUrl", type: "url" },
          ],
        }),
      ],
    }),
    defineField({ name: "tasksRepository", type: "url", group: "details" }),
    defineField({ name: "applicationUrl", type: "url", group: "details" }),
    defineField({ name: "instructions", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({
      name: "timeline",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            { name: "label", type: "string", validation: (r) => r.required() },
            { name: "date", type: "date" },
            { name: "note", type: "string" },
          ],
        }),
      ],
    }),
    defineField({
      name: "faq",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            { name: "question", type: "string", validation: (r) => r.required() },
            { name: "answer", type: "text", rows: 3, validation: (r) => r.required() },
          ],
        }),
      ],
    }),
    defineField({ name: "contact", type: "link", group: "details" }),
    verificationField,
  ],
  orderings: [{ title: "Year, newest", name: "yearDesc", by: [{ field: "year", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "status" } },
});

/* ---------------- Supporting ---------------- */

export const sponsor = defineType({
  name: "sponsor",
  title: "Sponsor",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "logo", type: "accessibleImage" }),
    defineField({ name: "tier", type: "string" }),
    defineField({ name: "verification", type: "verification" }),
  ],
  preview: { select: { title: "name", subtitle: "tier", media: "logo" } },
});

export const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "kind", type: "string", options: { list: ["community", "university", "industry", "platform"] } }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "logo", type: "accessibleImage" }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({ name: "verification", type: "verification" }),
  ],
  preview: { select: { title: "name", subtitle: "kind", media: "logo" } },
});

export const achievement = defineType({
  name: "achievement",
  title: "Achievement",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "people", type: "array", of: [{ type: "reference", to: [{ type: "person" }] }] }),
    defineField({ name: "event", type: "reference", to: [{ type: "event" }] }),
    defineField({ name: "verification", type: "verification" }),
  ],
});

export const milestone = defineType({
  name: "milestone",
  title: "History milestone",
  type: "document",
  fields: [
    defineField({ name: "year", type: "number", validation: (r) => r.required().min(2015) }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({
      name: "kind",
      type: "string",
      options: { list: ["origin", "dexterix", "event", "community", "recruitment", "open-source"] },
    }),
    defineField({ name: "href", type: "string", description: "Internal path (/dexterix/…) or full URL" }),
    defineField({ name: "verification", type: "verification" }),
  ],
  orderings: [
    {
      title: "Chronological",
      name: "yearAsc",
      by: [
        { field: "year", direction: "asc" },
        { field: "date", direction: "asc" },
      ],
    },
  ],
  preview: { select: { title: "title", subtitle: "year" } },
});

export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "url", type: "url", validation: (r) => r.required() }),
    defineField({ name: "kind", type: "string", options: { list: ["repository", "guide", "documentation", "video", "course", "tool"] } }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({ name: "domain", type: "reference", to: [{ type: "domain" }] }),
    defineField({ name: "forRecruitment", type: "boolean", initialValue: false, description: "Show on the Join page as preparation" }),
  ],
  preview: { select: { title: "title", subtitle: "kind" } },
});

export const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "event", type: "reference", to: [{ type: "event" }] }),
    defineField({
      name: "approved",
      type: "boolean",
      initialValue: false,
      description: "Only approved galleries (with consent from people pictured) appear publicly.",
    }),
    defineField({ name: "images", type: "array", of: [{ type: "accessibleImage" }], options: { layout: "grid" } }),
  ],
  preview: { select: { title: "title", subtitle: "date", media: "images.0" } },
});

export const metric = defineType({
  name: "metric",
  title: "Impact metric",
  type: "document",
  description: "Shown on the homepage only when verified. Third-party counts need an “as of” date.",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "prefix", type: "string" }),
    defineField({ name: "suffix", type: "string" }),
    defineField({ name: "detail", type: "string", validation: (r) => r.required() }),
    defineField({ name: "asOf", type: "date", description: "Required for counts that change (members, repos, followers)." }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "verification", type: "verification", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "label", subtitle: "value" } },
});

/* ---------------- Lab story ---------------- */

export const labFact = defineType({
  name: "labFact",
  title: "Lab story fact",
  type: "document",
  description: "Dated, sourced facts for the homepage prologue (timeline) and the infrastructure chapter (stats).",
  fields: [
    defineField({
      name: "kind",
      type: "string",
      options: { list: ["timeline", "stat"], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "when",
      type: "string",
      description: "Printed as an annotation: 1995, 15 AUG 1995, MAR 2026",
      validation: (r) => r.required(),
    }),
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", type: "string", description: "Stats only, e.g. 1,092.79 M" }),
    defineField({ name: "detail", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "ours", type: "boolean", initialValue: false, description: "A TechnoJam milestone on the national timeline" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "verification", type: "verification", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "label", subtitle: "when" } },
});

export const ritual = defineType({
  name: "ritual",
  title: "Ritual (Jam Night)",
  type: "document",
  description: "The recurring build night shown on the homepage. Leave a field empty and the site prints [ REAL DATA REQUIRED ].",
  fields: [
    defineField({ name: "name", type: "string", initialValue: "Jam Night", validation: (r) => r.required() }),
    defineField({ name: "day", type: "string", description: "e.g. FRIDAY" }),
    defineField({ name: "startTime", type: "string", description: "24h, e.g. 19:00" }),
    defineField({ name: "endTime", type: "string", description: "e.g. UNTIL WE'RE DONE" }),
    defineField({ name: "venue", type: "string" }),
    defineField({ name: "bring", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "experience", type: "string", initialValue: "none" }),
    defineField({ name: "signupUrl", type: "url" }),
    defineField({ name: "verification", type: "verification" }),
  ],
  preview: { select: { title: "name", subtitle: "day" } },
});

/** Created by the Collaborate form — read-only for editors. */
export const inquiry = defineType({
  name: "inquiry",
  title: "Collaboration inquiry",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "organization", type: "string" }),
    defineField({ name: "intent", type: "string" }),
    defineField({ name: "message", type: "text" }),
    defineField({ name: "submittedAt", type: "datetime" }),
  ],
  orderings: [{ title: "Newest", name: "newest", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: { select: { title: "organization", subtitle: "intent", name: "name" } },
});
