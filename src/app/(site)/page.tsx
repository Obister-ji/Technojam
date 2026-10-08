import { ProjectReel } from "@/components/lab/ProjectReel";
import { Finale } from "@/components/vibe/Finale";
import { Hero } from "@/components/vibe/Hero";
import { HouseRules } from "@/components/vibe/HouseRules";
import { getJamNight, getProjects } from "@/lib/content";

export const revalidate = 3600;

/** The reel, in order — real repositories with a true “built because”. */
const REEL = ["dexterix-5-0-platform", "techxpo-registration", "tj-tasks-2026", "cryptic-hunt", "deepfake-detection"];

export default async function HomePage() {
  const [ritual, projects] = await Promise.all([getJamNight(), getProjects()]);
  const reel = REEL.map((slug) => projects.find((p) => p.slug === slug)).filter((p) => p !== undefined);
  const when = ritual.day && ritual.startTime ? `${ritual.day} / ${ritual.startTime}` : undefined;

  return (
    <div className="overflow-x-clip">
      {/* title screen */}
      <Hero />
      {/* who we are, as rules */}
      <HouseRules />
      {/* real work */}
      <ProjectReel projects={reel} />
      {/* the ask — and where to find us weekly */}
      <Finale jam={{ when, href: ritual.signupUrl ?? "/join#follow" }} />
    </div>
  );
}
