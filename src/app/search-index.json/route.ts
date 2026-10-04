import { buildSearchIndex } from "@/lib/search";

/**
 * Static JSON for the command palette and console. Fetched only when one
 * of them opens, so it never weighs down the page payload.
 */
export const revalidate = 3600;

export async function GET() {
  return Response.json(await buildSearchIndex(), {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
