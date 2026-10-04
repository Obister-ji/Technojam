import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";
import { validateInquiry } from "@/lib/collaborate";

/**
 * Collaboration inquiries. Server-side validation, a honeypot, a minimum
 * fill time and a per-IP rate limit. Stored as `inquiry` documents in
 * Sanity when SANITY_API_WRITE_TOKEN is set.
 *
 * The rate limiter is in-memory: fine for a single instance, best-effort
 * on serverless. Swap for Upstash/Vercel KV if abuse appears.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) return Response.json({ ok: false, error: "Too many requests — try again in a few minutes." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot + time trap: bots fill hidden fields and submit instantly.
  const startedAt = Number(body.startedAt);
  if (body.website || !Number.isFinite(startedAt) || Date.now() - startedAt < 2500) {
    return Response.json({ ok: true }); // pretend success; drop silently
  }

  const result = validateInquiry(body);
  if (!result.ok) return Response.json({ ok: false, errors: result.errors }, { status: 422 });

  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!isSanityConfigured || !token) {
    return Response.json(
      { ok: false, error: "The form isn't connected yet — please email us instead.", fallback: "email" },
      { status: 503 },
    );
  }

  try {
    const writer = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
    await writer.create({ _type: "inquiry", ...result.data, submittedAt: new Date().toISOString() });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Something went wrong on our side — please email us.", fallback: "email" }, { status: 502 });
  }
}
