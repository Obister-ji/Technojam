export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-10-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** When false, the site renders from the verified local seed in src/content/seed. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);

export const studioUrl = "/studio";
