import { getProject, getProjects } from "@/lib/content";
import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "TechnoJam project";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = await getProject((await params).slug);
  if (!project) return renderOg({ title: "Projects" });
  return renderOg({
    kicker: "TechnoJam / projects",
    title: project.title,
    meta: `${project.year} · ${project.stack.slice(0, 3).join(" · ")}`,
    accent: "#4c7dff",
  });
}
