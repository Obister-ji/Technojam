import { getDexterixEdition, getDexterixEditions } from "@/lib/content";
import { formatDateRange, isPublishable } from "@/lib/content/derive";
import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "Dexterix — TechnoJam's flagship hackathon";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getDexterixEditions()).filter((e) => isPublishable(e.verification)).map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const e = await getDexterixEdition((await params).slug);
  if (!e) return renderOg({ title: "Dexterix" });
  const when = e.startDate ? formatDateRange(e.startDate, e.endDate) : String(e.year);
  return renderOg({
    title: e.title,
    meta: e.durationHours ? `${e.durationHours} hours of building · ${when}` : when,
    accent: "#b06fdc",
  });
}
