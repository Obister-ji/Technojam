import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TechnoJam — Throttle to Learn",
    short_name: "TechnoJam",
    description: "A student tech club and a community for curious people.",
    start_url: "/",
    display: "standalone",
    background_color: "#f1ece1",
    theme_color: "#f1ece1",
    icons: [{ src: "/icon.png", sizes: "192x192", type: "image/png" }],
  };
}
