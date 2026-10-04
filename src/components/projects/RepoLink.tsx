"use client";

import { ButtonLink } from "@/components/ui/primitives";
import { track } from "@/lib/analytics";

export function RepoLink({ href, slug }: { href: string; slug: string }) {
  return (
    <ButtonLink href={href} onClick={() => track("project_repo_click", { project: slug })}>
      View repository
    </ButtonLink>
  );
}
