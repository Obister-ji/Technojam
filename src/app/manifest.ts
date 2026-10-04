import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TechnoJam — Throttle to Learn",
    short_name: "TechnoJam",
    description: "The student-led technical community at Galgotias University.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0c10",
    theme_color: "#0b0c10",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
