import type { SiteSettings } from "@/lib/content/types";
import { S } from "./sources";

export const siteSettings: SiteSettings = {
  name: "TechnoJam",
  tagline: "Throttle to Learn",
  positioning: "Where curious students become builders.",
  description:
    "TechnoJam is the student-led technical community of the School of Computing Science & Engineering at Galgotias University. We learn technology by building it — projects, hackathons, workshops, open source and Dexterix.",
  foundedYear: 2015,
  institution: "Galgotias University",
  school: "School of Computing Science & Engineering",
  location: "Greater Noida, India",
  email: "technojam@galgotiasuniversity.edu.in",
  githubOrg: "technojam",
  socials: [
    { platform: "github", label: "GitHub", url: "https://github.com/technojam", handle: "technojam" },
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/technojam/",
      handle: "technojam",
    },
    {
      platform: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/teamtechnojam/",
      handle: "@teamtechnojam",
    },
    {
      platform: "commudle",
      label: "Commudle",
      url: "https://www.commudle.com/communities/technojam",
      handle: "technojam",
    },
    { platform: "x", label: "X", url: "https://x.com/technojam_gu", handle: "@technojam_gu" },
    { platform: "discord", label: "Discord", url: "https://discord.com/invite/6ksUUABBkY" },
    {
      platform: "email",
      label: "Email",
      url: "mailto:technojam@galgotiasuniversity.edu.in",
      handle: "technojam@galgotiasuniversity.edu.in",
    },
  ],
  verification: S.linkedin,
};
