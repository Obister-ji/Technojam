import type { SchemaTypeDefinition } from "sanity";
import { accessibleImage, eventFigure, link, richText, speaker, statFigure, verification } from "./objects";
import {
  achievement,
  announcement,
  dexterixEdition,
  domain,
  event,
  gallery,
  homepageFeature,
  inquiry,
  metric,
  milestone,
  partner,
  person,
  project,
  recruitmentCycle,
  resource,
  siteSettings,
  socialLink,
  sponsor,
  teamYear,
} from "./documents";

export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  verification,
  link,
  accessibleImage,
  statFigure,
  eventFigure,
  speaker,
  richText,
  // documents
  siteSettings,
  socialLink,
  announcement,
  homepageFeature,
  domain,
  project,
  event,
  dexterixEdition,
  person,
  teamYear,
  recruitmentCycle,
  sponsor,
  partner,
  achievement,
  milestone,
  metric,
  resource,
  gallery,
  inquiry,
];

export const SINGLETONS = ["siteSettings"];
