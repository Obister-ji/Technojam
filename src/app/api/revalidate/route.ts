import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → on-demand revalidation.
 * Configure in sanity.io/manage → API → Webhooks:
 *   URL:        https://www.technojam.in/api/revalidate
 *   Trigger on: create, update, delete
 *   Projection: {_type}
 *   Secret:     SANITY_REVALIDATE_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new Response("Revalidation is not configured", { status: 500 });

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) return new Response("Invalid signature", { status: 401 });
    if (!body?._type) return new Response("Bad request", { status: 400 });

    revalidateTag(body._type, "max");
    // Site-wide data (nav status, search index, footer) depends on several types.
    revalidateTag("sanity", "max");
    return Response.json({ revalidated: true, type: body._type, now: Date.now() });
  } catch (err) {
    return new Response(err instanceof Error ? err.message : "Error", { status: 500 });
  }
}
