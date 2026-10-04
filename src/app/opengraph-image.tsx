import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "TechnoJam — Throttle to Learn";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ title: "Throttle to learn.", meta: "Student-led tech community · Galgotias University" });
}
