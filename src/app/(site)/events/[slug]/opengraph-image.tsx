import { getEvent, getEvents } from "@/lib/content";
import { formatDateRange } from "@/lib/content/derive";
import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "TechnoJam event";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const event = await getEvent((await params).slug);
  if (!event) return renderOg({ title: "Events" });
  const meta =
    event.type === "hackathon" && event.figures.some((f) => f.label === "Hours")
      ? `${event.figures.find((f) => f.label === "Hours")?.value} hours of building · ${formatDateRange(event.startDate, event.endDate)}`
      : formatDateRange(event.startDate, event.endDate);
  return renderOg({ title: event.title, meta });
}
