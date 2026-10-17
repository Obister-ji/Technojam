/**
 * Full-card pixel illustrations for the Hero Squad.
 *
 * Each portrait is drawn as flat vector shapes on a canvas eight times larger than the pixel
 * grid, then sampled at the centre of every cell. That gives crisp, hard-edged pixel art with
 * exactly the colours used below — no anti-aliased blends to clean up afterwards.
 */

export const ART_W = 72;
export const ART_H = 128;
/** the portraits are authored on a 64×114 grid and scaled onto the finer one */
const BASE_W = 64;
const S = 8;

export type ArtId = "ronaldo" | "baymax" | "psyduck";

type Ctx = CanvasRenderingContext2D;

const fill = (c: Ctx, d: string, color: string) => {
  c.fillStyle = color;
  c.fill(new Path2D(d));
};
const rect = (c: Ctx, x: number, y: number, w: number, h: number, color: string) => {
  c.fillStyle = color;
  c.fillRect(x, y, w, h);
};
const oval = (c: Ctx, cx: number, cy: number, rx: number, ry: number, color: string, rot = 0) => {
  c.fillStyle = color;
  c.beginPath();
  c.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
  c.fill();
};
const line = (c: Ctx, d: string, color: string, w: number) => {
  c.strokeStyle = color;
  c.lineWidth = w;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.stroke(new Path2D(d));
};

/** Letters set along an arc, like a name printed across a shirt's shoulders. */
function arcText(c: Ctx, text: string, cx: number, cy: number, r: number, centre: number, step: number, size: number, color: string) {
  c.fillStyle = color;
  c.font = `900 ${size}px "Arial Black", Impact, Arial, sans-serif`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  const start = centre - ((text.length - 1) * step) / 2;
  [...text].forEach((ch, i) => {
    const a = start + i * step;
    c.save();
    c.translate(cx + r * Math.sin(a), cy - r * Math.cos(a));
    c.rotate(a);
    c.fillText(ch, 0, 0);
    c.restore();
  });
}

const DRAW: Record<ArtId, (c: Ctx) => void> = {
  ronaldo: (c) => {
    rect(c, 0, 0, 64, 114, "#e2e4e9");
    fill(c, "M0 114 L1 70 Q4 50 22 44 L42 44 Q60 50 63 70 L64 114Z", "#c8102e");
    fill(c, "M42 44 Q60 50 63 70 L64 114 L54 114 Q56 80 42 44Z", "#a50d26");
    line(c, "M8 58 Q6 90 4 114", "#a50d26", 1);
    // neck, ears, hair
    fill(c, "M25 32 L39 32 L40 46 Q32 51 24 46Z", "#b8744c");
    oval(c, 21, 25, 2.2, 3.6, "#c68a63");
    oval(c, 43, 25, 2.2, 3.6, "#a8704a");
    oval(c, 32, 21, 11.5, 13, "#2e1b10");
    fill(c, "M20 21 Q20 6 32 6 Q44 6 44 21 Q41 11 32 11 Q23 11 20 21Z", "#4a2d1a");
    fill(c, "M21 26 Q22 35 28 35 L36 35 Q42 35 43 26 Q41 32 32 33 Q23 32 21 26Z", "#8b5a3c");
    line(c, "M25 10 Q32 7 39 10 M22 18 Q24 12 28 10 M36 8 Q42 10 43 16", "#6a4328", 1.2);
    // collar
    fill(c, "M24 46 Q32 55 40 46 L40 43 L24 43Z", "#7d0c20");
    line(c, "M24 47 Q32 56 40 47", "#f3f3f3", 1);
    // name and number
    arcText(c, "RONALDO", 32, 112, 56, 0, 0.115, 6.4, "#ffffff");
    c.fillStyle = "#ffffff";
    c.font = '900 50px "Arial Black", Impact, Arial, sans-serif';
    c.textAlign = "center";
    c.textBaseline = "alphabetic";
    c.fillText("7", 32, 100);
  },

  baymax: (c) => {
    rect(c, 0, 0, 64, 114, "#f1f4f9");
    oval(c, 32, 110, 22, 3.2, "#d9dfea");
    // legs
    fill(c, "M20 96 L21 111 Q21 114 28 114 L31 114 L31 96Z", "#c9d7ef");
    fill(c, "M33 96 L33 114 L38 114 Q44 114 44 111 L44 96Z", "#aebfde");
    // hanging arm, body
    fill(c, "M17 38 Q5 52 7 82 Q8 91 15 89 Q20 70 22 44Z", "#b9c9e6");
    fill(c, "M19 34 Q8 54 12 80 Q14 96 24 100 L40 100 Q50 96 52 80 Q56 54 45 34 Q32 28 19 34Z", "#c9d7ef");
    oval(c, 33, 68, 12, 17, "#e6edfa");
    fill(c, "M45 34 Q56 54 52 80 Q50 96 40 100 L34 100 Q46 90 47 72 Q48 52 40 36Z", "#aebfde");
    // head
    oval(c, 32, 24, 13.5, 9.5, "#d6e1f4");
    fill(c, "M32 14.5 Q45.5 16 45.5 25 Q44 33.5 32 33.5 Q40 29 40 23 Q39 17 32 14.5Z", "#b6c6e4");
    oval(c, 26, 19, 5, 2, "#eef3fc");
    oval(c, 25.5, 24, 1.7, 1.7, "#16131a");
    oval(c, 38.5, 24, 1.7, 1.7, "#16131a");
    line(c, "M25.5 24 H38.5", "#16131a", 0.9);
    // cat in the crook of its arm
    oval(c, 36, 52, 7, 6.2, "#e88b2c");
    fill(c, "M30 49 L31 42 L35.5 46Z M42 49 L41 42 L36.5 46Z", "#c96a1e");
    oval(c, 36, 55, 3.4, 2.2, "#fbe8c8");
    oval(c, 33.8, 51.5, 0.8, 0.9, "#2a1a10");
    oval(c, 38.2, 51.5, 0.8, 0.9, "#2a1a10");
    oval(c, 36, 53.6, 0.9, 0.6, "#e87080");
    fill(c, "M18 56 Q30 68 52 63 Q59 58 54 51 Q46 60 32 59 Q24 57 22 50Z", "#d6e1f4");
    fill(c, "M32 59 Q46 60 54 51 Q59 58 52 63 Q44 66 34 63Z", "#b6c6e4");
    fill(c, "M46 62 Q58 66 56 80 Q54 86 50 84 Q52 74 44 68Z", "#e88b2c");
  },

  psyduck: (c) => {
    // Drawn in the coordinates of a 736×1308 phone wallpaper, lifted so the duck clears the title.
    rect(c, 0, 0, 64, 114, "#3f6b4a");
    c.save();
    c.scale(64 / 736, 64 / 736);
    c.translate(0, -300);

    const INK = "#1e1a14";
    const YELLOW = "#f6c544";
    const YELLOW_D = "#dfa634";
    const YELLOW_L = "#fde58e";
    const BEAK = "#f5d39a";
    const BEAK_D = "#e2b47a";
    const CHALK = "#eef3ea";
    const edge = 14; // ≈ one card pixel in these coordinates

    const outlinedOval = (cx: number, cy: number, rx: number, ry: number, color: string, rot = 0) => {
      c.strokeStyle = INK;
      c.lineWidth = edge * 2;
      c.beginPath();
      c.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
      c.stroke();
      oval(c, cx, cy, rx, ry, color, rot);
    };

    // chalk doodles: a scribble thought bubble, sparkles, motion ticks
    c.strokeStyle = CHALK;
    c.lineWidth = 11;
    c.beginPath();
    c.arc(160, 640, 58, 0, Math.PI * 2);
    c.stroke();
    line(c, "M200 690 L222 722 L188 700", CHALK, 11);
    line(c, "M130 640 Q150 600 175 625 Q200 655 160 668 Q122 672 138 630 Q160 598 186 632", CHALK, 9);
    const sparkle = (x: number, y: number, r: number) =>
      fill(
        c,
        `M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z`,
        CHALK,
      );
    sparkle(100, 958, 28);
    sparkle(592, 722, 24);
    sparkle(598, 1058, 22);
    sparkle(640, 470, 20);
    line(c, "M118 742 L160 760 M112 792 L150 792 M640 790 L668 760 M650 840 L684 822", CHALK, 10);

    // ground shadow and tail
    oval(c, 380, 1222, 235, 32, "#2f5539");
    outlinedOval(150, 1072, 58, 30, YELLOW, -0.5);

    // head and body share one silhouette: outline both first, then fill both
    c.strokeStyle = INK;
    c.lineWidth = edge * 2;
    c.beginPath();
    c.ellipse(372, 1040, 205, 165, 0, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.ellipse(365, 790, 188, 168, 0, 0, Math.PI * 2);
    c.stroke();
    oval(c, 372, 1040, 205, 165, YELLOW);
    oval(c, 365, 790, 188, 168, YELLOW);
    // shading on the lower right, highlight on the crown
    c.save();
    const body = new Path2D();
    body.ellipse(372, 1040, 205, 165, 0, 0, Math.PI * 2);
    c.clip(body);
    oval(c, 470, 1100, 160, 150, YELLOW_D);
    oval(c, 330, 1010, 200, 165, YELLOW);
    c.restore();
    oval(c, 445, 690, 46, 20, YELLOW_L, -0.15);
    oval(c, 495, 705, 12, 8, YELLOW_L);

    // feet
    outlinedOval(292, 1168, 78, 58, BEAK);
    outlinedOval(518, 1166, 74, 58, BEAK);
    line(c, "M270 1112 L282 1148 M318 1112 L306 1148 M496 1110 L508 1146 M542 1110 L530 1146", INK, 9);

    // bill
    outlinedOval(405, 905, 112, 78, BEAK);
    oval(c, 405, 935, 100, 42, BEAK_D);
    oval(c, 402, 900, 104, 60, BEAK);
    oval(c, 388, 860, 6, 5, INK);
    oval(c, 418, 860, 6, 5, INK);

    // eyes and furious brows
    outlinedOval(300, 805, 48, 38, "#ffffff");
    outlinedOval(462, 785, 46, 40, "#ffffff");
    oval(c, 312, 806, 13, 13, INK);
    oval(c, 452, 788, 13, 13, INK);
    line(c, "M262 748 L326 772", INK, 13);
    line(c, "M418 760 L486 732", INK, 13);
    // blush
    line(c, "M262 860 L272 852 M282 864 L292 856", "#f08a8a", 8);
    line(c, "M502 828 L512 820 M522 832 L532 824", "#f08a8a", 8);

    // hand pressed to the cheek
    outlinedOval(212, 955, 48, 80, YELLOW, 0.12);
    outlinedOval(190, 878, 16, 22, YELLOW, -0.3);
    outlinedOval(222, 868, 16, 22, YELLOW, 0.1);
    oval(c, 212, 955, 44, 76, YELLOW, 0.12);
    // thumbs up
    outlinedOval(560, 1000, 40, 70, YELLOW, -0.9);
    outlinedOval(612, 918, 50, 52, YELLOW);
    outlinedOval(604, 850, 20, 40, YELLOW, -0.15);
    oval(c, 612, 922, 46, 48, YELLOW);
    line(c, "M584 912 L630 912 M584 936 L628 936", INK, 7);

    // three hair strands
    line(c, "M338 640 Q300 600 262 604", INK, 24);
    line(c, "M350 636 Q342 586 322 556", INK, 24);
    line(c, "M364 636 Q378 586 384 560", INK, 24);
    c.restore();
  },
};

/** Paints a portrait into a 64×114 ImageData. Call from an effect — it needs a canvas. */
export function paintHeroArt(id: ArtId): ImageData {
  const big = document.createElement("canvas");
  big.width = ART_W * S;
  big.height = ART_H * S;
  const ctx = big.getContext("2d", { willReadFrequently: true })!;
  ctx.scale((S * ART_W) / BASE_W, (S * ART_W) / BASE_W);
  DRAW[id](ctx);
  const src = ctx.getImageData(0, 0, big.width, big.height).data;
  const out = new ImageData(ART_W, ART_H);
  for (let y = 0; y < ART_H; y++) {
    for (let x = 0; x < ART_W; x++) {
      const i = ((y * S + S / 2) * big.width + (x * S + S / 2)) * 4;
      const o = (y * ART_W + x) * 4;
      out.data[o] = src[i];
      out.data[o + 1] = src[i + 1];
      out.data[o + 2] = src[i + 2];
      out.data[o + 3] = 255;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */

export interface ArtImage {
  src: string;
  /** source region as fractions [x, y, w, h]; keep it 9:16 so the card isn't stretched */
  crop: [number, number, number, number];
  /** replaces a near-white backdrop */
  background?: string;
  /** palette size after quantising */
  colors?: number;
  /** grid width in pixels (height follows at 9:16); lower is chunkier */
  width?: number;
  /** darken strong edges with the darkest colour, so it reads inked rather than photographic */
  ink?: boolean;
}

const rgbOf = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** k-means over the pixels, seeded with far-apart colours so small accents (skin, a wristband) keep their own entry. */
function quantise(d: Uint8ClampedArray, k: number) {
  const n = d.length / 4;
  const dist = (p: number, c: number[]) => {
    const r = d[p * 4] - c[0];
    const g = d[p * 4 + 1] - c[1];
    const b = d[p * 4 + 2] - c[2];
    return r * r + g * g + b * b;
  };
  const cents: number[][] = [[d[0], d[1], d[2]]];
  while (cents.length < k) {
    let far = 0;
    let farD = -1;
    for (let p = 0; p < n; p += 3) {
      const near = Math.min(...cents.map((c) => dist(p, c)));
      if (near > farD) {
        farD = near;
        far = p;
      }
    }
    cents.push([d[far * 4], d[far * 4 + 1], d[far * 4 + 2]]);
  }
  const owner = new Uint8Array(n);
  for (let it = 0; it < 10; it++) {
    const sums = cents.map(() => [0, 0, 0, 0]);
    for (let p = 0; p < n; p++) {
      let best = 0;
      let bestD = Infinity;
      for (let j = 0; j < k; j++) {
        const v = dist(p, cents[j]);
        if (v < bestD) {
          bestD = v;
          best = j;
        }
      }
      owner[p] = best;
      const s = sums[best];
      s[0] += d[p * 4];
      s[1] += d[p * 4 + 1];
      s[2] += d[p * 4 + 2];
      s[3]++;
    }
    sums.forEach((s, j) => {
      if (s[3]) cents[j] = [s[0] / s[3], s[1] / s[3], s[2] / s[3]];
    });
  }
  for (let p = 0; p < n; p++) {
    const c = cents[owner[p]];
    d[p * 4] = Math.round(c[0]);
    d[p * 4 + 1] = Math.round(c[1]);
    d[p * 4 + 2] = Math.round(c[2]);
    d[p * 4 + 3] = 255;
  }
}

/** Turns an illustration into card-sized pixel art: downscale, swap the white backdrop, quantise. */
export function pixelateImage(img: HTMLImageElement, spec: ArtImage): ImageData {
  const W = spec.width ?? ART_W;
  const H = Math.round((W * 16) / 9);
  const [fx, fy, fw, fh] = spec.crop;
  const sx = fx * img.naturalWidth;
  const sy = fy * img.naturalHeight;
  const sw = fw * img.naturalWidth;
  const sh = fh * img.naturalHeight;
  // two steps down, so the browser's filter averages instead of skipping pixels
  const mid = document.createElement("canvas");
  mid.width = W * 4;
  mid.height = H * 4;
  const m = mid.getContext("2d")!;
  m.imageSmoothingQuality = "high";
  m.drawImage(img, sx, sy, sw, sh, 0, 0, mid.width, mid.height);
  const small = document.createElement("canvas");
  small.width = W;
  small.height = H;
  const o = small.getContext("2d", { willReadFrequently: true })!;
  o.imageSmoothingQuality = "high";
  o.drawImage(mid, 0, 0, W, H);
  const data = o.getImageData(0, 0, W, H);
  const d = data.data;
  if (spec.background) {
    const [br, bg, bb] = rgbOf(spec.background);
    for (let i = 0; i < d.length; i += 4) {
      const lo = Math.min(d[i], d[i + 1], d[i + 2]);
      const hi = Math.max(d[i], d[i + 1], d[i + 2]);
      const skin = d[i] > d[i + 2] + 40;
      // light and close to neutral: the backdrop, or the soft edge where artwork fades into it.
      // A hard cut (no blending) keeps the outline clean instead of leaving a pale halo.
      if (lo > 165 && hi - lo < 70 && !skin) {
        d[i] = br;
        d[i + 1] = bg;
        d[i + 2] = bb;
      }
    }
  }
  quantise(d, spec.colors ?? 12);
  if (spec.ink) inkEdges(d, W, H);
  return data;
}

/** Where brightness jumps between neighbours, paint the darker side with the darkest colour — a cheap ink line. */
function inkEdges(d: Uint8ClampedArray, w: number, h: number) {
  const lum = (i: number) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  let darkest = 0;
  for (let i = 0; i < d.length; i += 4) if (lum(i) < lum(darkest)) darkest = i;
  const ink = [d[darkest], d[darkest + 1], d[darkest + 2]];
  const src = Uint8ClampedArray.from(d);
  const at = (x: number, y: number) => 0.299 * src[(y * w + x) * 4] + 0.587 * src[(y * w + x) * 4 + 1] + 0.114 * src[(y * w + x) * 4 + 2];
  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const here = at(x, y);
      const right = at(x + 1, y);
      const down = at(x, y + 1);
      if (Math.abs(here - right) < 70 && Math.abs(here - down) < 70) continue;
      // ink the darker of the two pixels, so lines hug shapes instead of eating highlights
      const tx = Math.abs(here - right) >= Math.abs(here - down) ? (here < right ? x : x + 1) : x;
      const ty = Math.abs(here - right) >= Math.abs(here - down) ? y : here < down ? y : y + 1;
      const i = (ty * w + tx) * 4;
      d[i] = ink[0];
      d[i + 1] = ink[1];
      d[i + 2] = ink[2];
    }
  }
}
