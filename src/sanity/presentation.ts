import { defineDocuments, defineLocations, type PresentationPluginOptions } from "sanity/presentation";

const at = (base: string) =>
  defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({
      locations: doc?.slug ? [{ title: doc.title || "Untitled", href: `${base}/${doc.slug}` }, { title: "Index", href: base }] : [],
    }),
  });

export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    { route: "/events/:slug", filter: `_type == "event" && slug.current == $slug` },
    { route: "/projects/:slug", filter: `_type == "project" && slug.current == $slug` },
    { route: "/dexterix/:slug", filter: `_type == "dexterixEdition" && slug.current == $slug` },
  ]),
  locations: {
    event: at("/events"),
    project: at("/projects"),
    dexterixEdition: at("/dexterix"),
    recruitmentCycle: defineLocations({ locations: [{ title: "Join", href: "/join" }] }),
    siteSettings: defineLocations({ locations: [{ title: "Home", href: "/" }] }),
  },
};
