import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const logoDataUrl = readFile(join(process.cwd(), "public/brand/tj-logo.png")).then(
  (buf) => `data:image/png;base64,${buf.toString("base64")}`,
);

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Fetch a static, subsetted Archivo Expanded instance for exactly the
 * glyphs we draw. Falls back to the built-in font if offline.
 */
async function loadFont(text: string, weight: 500 | 900) {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,${weight}&text=${encodeURIComponent(text)}`, {
      signal: AbortSignal.timeout(4000),
    }).then((r) => r.text());
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    return await fetch(src, { signal: AbortSignal.timeout(4000) }).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

/**
 * TECHNOJAM / BIG TITLE / meta line — one card system for every route.
 */
export async function renderOg({
  kicker = "TechnoJam",
  title,
  meta,
  accent = "#ec3f86",
}: {
  kicker?: string;
  title: string;
  meta?: string;
  accent?: string;
}) {
  const upperTitle = title.toUpperCase();
  const kickerText = kicker.toUpperCase();
  const metaText = (meta ?? "THROTTLE TO LEARN").toUpperCase();
  const [black, medium, logo] = await Promise.all([
    loadFont(upperTitle + kickerText, 900),
    loadFont(metaText + "TECHNOJAM", 500),
    logoDataUrl,
  ]);
  const fonts = [
    ...(black ? [{ name: "Archivo", data: black, weight: 900 as const, style: "normal" as const }] : []),
    ...(medium ? [{ name: "Archivo", data: medium, weight: 500 as const, style: "normal" as const }] : []),
  ];
  const size = upperTitle.length > 28 ? 84 : upperTitle.length > 16 ? 108 : 140;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0b0c10",
        color: "#f3f0ea",
        fontFamily: "Archivo",
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> */}
          <img src={logo} alt="" height={64} width={40} />
          <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: 1 }}>{kickerText}</span>
        </div>
        <span style={{ fontSize: 22, fontWeight: 500, color: "#a5a3ab", letterSpacing: 3 }}>TECHNOJAM.IN</span>
      </div>
      <div style={{ display: "flex", fontSize: size, fontWeight: 900, lineHeight: 0.9, letterSpacing: -3, maxWidth: 1050 }}>
        {upperTitle}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 120, height: 8, background: `linear-gradient(90deg, #31a8df, #b06fdc, ${accent})` }} />
        <span style={{ fontSize: 28, fontWeight: 500, color: "#a5a3ab", letterSpacing: 3 }}>{metaText}</span>
      </div>
    </div>,
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
