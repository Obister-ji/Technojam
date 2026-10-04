export const INTENTS = [
  { value: "sponsor-dexterix", label: "Sponsor Dexterix", detail: "Put your name — and your problem statements — in front of the builders." },
  { value: "sponsor-technojam", label: "Sponsor TechnoJam", detail: "Back a year of workshops, sessions and projects." },
  { value: "host-workshop", label: "Host a workshop", detail: "Teach a tool or a technique, hands-on, to people who'll use it." },
  { value: "mentor", label: "Become a mentor", detail: "Help teams get unstuck during hackathons or across a semester." },
  { value: "judge", label: "Judge a hackathon", detail: "Ask the hard questions at demo time." },
  { value: "speak", label: "Speak at an event", detail: "Talks, AMAs and fireside chats with the community." },
  { value: "community-partnership", label: "Community partnership", detail: "Co-host events with your club, GDG, user group or community." },
  { value: "industry-collaboration", label: "University / industry collaboration", detail: "Research, internships, challenges or longer engagements." },
] as const;

export type Intent = (typeof INTENTS)[number]["value"];

export interface InquiryInput {
  name: string;
  email: string;
  organization: string;
  intent: Intent;
  message: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared validation — runs on the server; the client mirrors it for instant feedback. */
export function validateInquiry(raw: Record<string, unknown>): { ok: true; data: InquiryInput } | { ok: false; errors: Partial<Record<keyof InquiryInput, string>> } {
  const s = (k: string, max: number) => (typeof raw[k] === "string" ? (raw[k] as string).trim().slice(0, max) : "");
  const data = {
    name: s("name", 120),
    email: s("email", 200),
    organization: s("organization", 160),
    intent: s("intent", 40) as Intent,
    message: s("message", 4000),
  };
  const errors: Partial<Record<keyof InquiryInput, string>> = {};
  if (data.name.length < 2) errors.name = "Tell us your name.";
  if (!EMAIL.test(data.email)) errors.email = "That email doesn't look right.";
  if (data.organization.length < 2) errors.organization = "Which organisation or community are you from?";
  if (!INTENTS.some((i) => i.value === data.intent)) errors.intent = "Pick what you'd like to do.";
  if (data.message.length < 20) errors.message = "A couple of sentences helps us reply properly (20+ characters).";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
