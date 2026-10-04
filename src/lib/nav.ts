export interface NavItem {
  label: string;
  href: string;
  /** shown in the mobile menu and command palette */
  description: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Projects", href: "/projects", description: "What we build and ship, in the open" },
  { label: "Events", href: "/events", description: "Hackathons, workshops and sessions" },
  { label: "Dexterix", href: "/dexterix", description: "Our flagship hackathon series" },
  { label: "Team", href: "/team", description: "Current team and every generation before" },
  { label: "About", href: "/about", description: "Story, history and how we work" },
];

export const JOIN_NAV: NavItem = { label: "Join", href: "/join", description: "Recruitment, domains and how to prepare" };

export const SECONDARY_NAV: NavItem[] = [
  { label: "Community", href: "/community", description: "How we learn together" },
  { label: "Collaborate", href: "/collaborate", description: "Sponsor, mentor, judge or speak" },
  { label: "Resources", href: "/resources", description: "Starting points for every domain" },
];

export const ALL_PAGES: NavItem[] = [{ label: "Home", href: "/", description: "Start here" }, ...PRIMARY_NAV, JOIN_NAV, ...SECONDARY_NAV];
