"use client";

import { ButtonLink } from "@/components/ui/primitives";
import { track } from "@/lib/analytics";

export function RegisterLink({ href, slug }: { href: string; slug: string }) {
  return (
    <ButtonLink href={href} onClick={() => track("event_registration_click", { event: slug })}>
      Register
    </ButtonLink>
  );
}
