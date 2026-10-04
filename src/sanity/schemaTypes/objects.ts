import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Attached to every fact-bearing document. Entries marked "pending" stay
 * visible to editors but never render on the public site.
 */
export const verification = defineType({
  name: "verification",
  title: "Verification",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: "status",
      type: "string",
      initialValue: "pending",
      options: {
        list: [
          { title: "Verified — safe to publish", value: "verified" },
          { title: "Pending — hidden from the public site", value: "pending" },
          { title: "Archived source — verified, but the source is no longer online", value: "archived_source" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "sourceName", type: "string", description: "e.g. “Galgotias University — Dexterix 4.0”" }),
    defineField({
      name: "sourceUrl",
      type: "url",
      validation: (r) =>
        r.custom((url, ctx) => {
          const parent = ctx.parent as { status?: string } | undefined;
          return parent?.status === "verified" && !url ? "Verified facts need a source URL" : true;
        }),
    }),
    defineField({ name: "lastVerified", type: "date" }),
    defineField({ name: "notes", type: "text", rows: 2, description: "Conflicts, caveats, what still needs checking." }),
  ],
});

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "url",
      type: "url",
      validation: (r) => r.required().uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
    }),
  ],
  preview: { select: { title: "label", subtitle: "url" } },
});

export const accessibleImage = defineType({
  name: "accessibleImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe what's in the photo for people who can't see it.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "credit", type: "string", description: "Photographer / source" }),
  ],
});

/** A number with provenance — used for stats so targets can't pose as outcomes. */
export const statFigure = defineType({
  name: "statFigure",
  title: "Figure",
  type: "object",
  fields: [
    defineField({ name: "value", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "suffix", type: "string", description: "e.g. “+”" }),
    defineField({ name: "verification", type: "verification" }),
  ],
  preview: {
    select: { value: "value", suffix: "suffix", status: "verification.status" },
    prepare: ({ value, suffix, status }) => ({ title: `${value ?? "—"}${suffix ?? ""}`, subtitle: status }),
  },
});

export const eventFigure = defineType({
  name: "eventFigure",
  title: "Event figure",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "kind",
      type: "string",
      description: "Be precise: a target announced before the event is not an outcome.",
      options: {
        list: [
          { title: "Actual (post-event)", value: "actual" },
          { title: "Target (pre-event promotion)", value: "target" },
          { title: "Registered / RSVPs", value: "registered" },
          { title: "Reach / invitations", value: "reach" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "verification", type: "verification" }),
  ],
  preview: { select: { title: "label", subtitle: "value", kind: "kind" } },
});

export const speaker = defineType({
  name: "speaker",
  title: "Speaker / mentor / judge",
  type: "object",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "affiliation", type: "string", description: "As published by the organiser" }),
    defineField({ name: "topic", type: "string" }),
    defineField({ name: "url", type: "url" }),
  ],
  preview: { select: { title: "name", subtitle: "affiliation" } },
});

export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [{ name: "href", type: "url", validation: (r) => r.uri({ scheme: ["http", "https", "mailto"] }) }],
          },
        ],
      },
    }),
    defineArrayMember({ type: "accessibleImage" }),
  ],
});
