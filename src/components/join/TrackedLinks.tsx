"use client";

import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/primitives";
import { track, type TrackedEvent } from "@/lib/analytics";

export function TrackView({ cycle }: { cycle?: string }) {
  useEffect(() => {
    track("recruitment_view", cycle ? { cycle } : undefined);
  }, [cycle]);
  return null;
}

export function TrackedButton({
  event,
  href,
  children,
  variant,
}: {
  event: TrackedEvent;
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <ButtonLink href={href} variant={variant} onClick={() => track(event)}>
      {children}
    </ButtonLink>
  );
}
