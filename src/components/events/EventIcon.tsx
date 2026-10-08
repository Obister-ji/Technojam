import type { EventType } from "@/lib/content/types";

/** Tiny 11×9 pixel icons, one per kind of event. "1" is a filled pixel. */
const ICONS: Record<EventType, string[]> = {
  // trophy
  hackathon: [
    "01111111110",
    "11111111111",
    "10111111101",
    "10011111001",
    "01001110010",
    "00000100000",
    "00001110000",
    "00011111000",
    "00111111100",
  ],
  // laptop
  workshop: [
    "00111111100",
    "01000000010",
    "01011110010",
    "01011110010",
    "01000000010",
    "01111111110",
    "11111111111",
    "10000000001",
    "11111111111",
  ],
  // speech bubble
  session: [
    "01111111110",
    "10000000001",
    "10111111101",
    "10000000001",
    "10111100001",
    "10000000001",
    "01111111110",
    "00110000000",
    "00010000000",
  ],
  // two people
  collaboration: [
    "00110001100",
    "01001010010",
    "00110001100",
    "00110001100",
    "01111011110",
    "01111011110",
    "11111111111",
    "01001010010",
    "01001010010",
  ],
  // flag
  competition: [
    "01111100000",
    "01111110000",
    "01111111000",
    "01111110000",
    "01111100000",
    "01000000000",
    "01000000000",
    "01000000000",
    "11100000000",
  ],
  // pin (meetup)
  meetup: [
    "00011111000",
    "00111111100",
    "01110001110",
    "01110001110",
    "00111111100",
    "00011111000",
    "00001110000",
    "00000100000",
    "00000100000",
  ],
  // star (anything else)
  recruitment: [
    "00000100000",
    "00000100000",
    "00001110000",
    "11111111111",
    "01111111110",
    "00111111100",
    "00111011100",
    "01110001110",
    "01100000110",
  ],
};

export function EventIcon({ type, className }: { type: EventType; className?: string }) {
  const rows = ICONS[type] ?? ICONS.recruitment;
  return (
    <svg viewBox="0 0 11 9" className={className} aria-hidden shapeRendering="crispEdges" fill="currentColor">
      {rows.flatMap((row, y) => [...row].map((b, x) => (b === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)))}
    </svg>
  );
}
