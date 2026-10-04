"use client";

/**
 * Sanity Studio, embedded at /studio. Editors publish events, flip
 * recruitment status, archive members and add Dexterix editions here —
 * no code changes required.
 */
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioUrl } from "./src/sanity/env";
import { resolve } from "./src/sanity/presentation";
import { SINGLETONS, schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "technojam",
  title: "TechnoJam",
  basePath: studioUrl,
  projectId: projectId || "unconfigured",
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (input, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? input.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : input,
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
    }),
  ],
  apiVersion,
});
