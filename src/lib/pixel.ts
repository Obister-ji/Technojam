/**
 * Tiny pixel-art toolkit: ordered (Bayer) dithering over a palette,
 * deterministic noise, and a scene painter. Everything renders into a
 * low-resolution canvas that CSS scales up with `image-rendering: pixelated`.
 */

export type RGB = [number, number, number];

export const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

/** Threshold in [0,1) for pixel (x, y). */
export const bayer = (x: number, y: number) => BAYER4[(y & 3) * 4 + (x & 3)];

/** Deterministic hash → [0,1). */
export function hash(x: number, y: number, seed = 0) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Smooth value noise. */
export function noise(x: number, y: number, seed = 0) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}

/** Fractal noise, 3 octaves. */
export const fbm = (x: number, y: number, seed = 0) =>
  noise(x, y, seed) * 0.55 + noise(x * 2.1, y * 2.1, seed + 7) * 0.3 + noise(x * 4.3, y * 4.3, seed + 13) * 0.15;

/** Pick a palette entry for value v ∈ [0,1], dithered at (x, y). */
export function dither(palette: RGB[], v: number, x: number, y: number): RGB {
  const n = palette.length - 1;
  const scaled = Math.min(Math.max(v, 0), 0.9999) * n;
  const i = Math.floor(scaled);
  return palette[Math.min(n, i + (scaled - i > bayer(x, y) ? 1 : 0))];
}

/* ------------------------------------------------------------------ */

export interface Scene {
  /** Sky colours, top → bottom. */
  sky: string[];
  /** Optional planet / moon. Positions are fractions of the canvas. */
  orb?: { x: number; y: number; r: number; palette: string[]; rim?: string; clouds?: boolean };
  /** Optional ground band from `top` (fraction) down. */
  ground?: { top: number; palette: string[]; glowX?: number };
  /** Cloud wisps across the sky. */
  clouds?: { palette: string[]; band: [number, number] };
  /** A curving bright shoreline (as in the "consistency" poster). */
  wave?: { y: number; color: string };
  stars?: number;
  seed?: number;
}

/** Paints a static scene into ImageData. Transparent where nothing is drawn if `sky` is empty. */
export function paintScene(w: number, h: number, scene: Scene): ImageData {
  const img = new ImageData(w, h);
  const d = img.data;
  const seed = scene.seed ?? 1;
  const sky = scene.sky.map(hex);
  const orb = scene.orb && { ...scene.orb, pal: scene.orb.palette.map(hex), rimc: scene.orb.rim ? hex(scene.orb.rim) : null };
  const ground = scene.ground && { ...scene.ground, pal: scene.ground.palette.map(hex) };
  const clouds = scene.clouds && { ...scene.clouds, pal: scene.clouds.palette.map(hex) };
  const wave = scene.wave && { ...scene.wave, c: hex(scene.wave.color) };

  const ox = orb ? orb.x * w : 0;
  const oy = orb ? orb.y * h : 0;
  const or = orb ? orb.r * Math.max(w, h) : 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let c: RGB | null = null;
      const a = 255;

      if (sky.length) c = dither(sky, y / h, x, y);

      // stars
      if (scene.stars && c && hash(x, y, seed + 3) < scene.stars) {
        const t = hash(x, y, seed + 5);
        c = t > 0.85 ? [255, 190, 225] : t > 0.6 ? [170, 230, 255] : [255, 255, 255];
      }

      // clouds
      if (clouds && y > clouds.band[0] * h && y < clouds.band[1] * h) {
        const v = fbm(x / 14, y / 5, seed + 11);
        if (v > 0.55) c = dither(clouds.pal, (v - 0.55) / 0.3, x, y);
      }

      // orb + atmosphere
      if (orb) {
        const dx = x - ox;
        const dy = y - oy;
        const dist = Math.sqrt(dx * dx + dy * dy) / or;
        if (dist < 1) {
          // Lit from the upper left: a bright rim on the lit edge, falling into shadow.
          const limb = Math.sqrt(1 - dist * dist);
          const dir = Math.max(0, (-dx / or) * 0.85 + (-dy / or) * 0.25);
          const edge = (1 - limb) * (1 - limb);
          let v = 0.1 + dir * 0.5 + edge * dir * 0.8;
          if (orb.clouds) v += (fbm(x / 9, y / 9, seed + 17) - 0.45) * 0.55;
          c = dither(orb.pal, v, x, y);
        } else if (orb.rimc && dist < 1.06) {
          const t = 1 - (dist - 1) / 0.06;
          if (t > bayer(x, y)) c = orb.rimc;
        }
      }

      // shoreline wave
      if (wave) {
        const curve = wave.y * h + Math.sin((x / w) * 3.2 + 0.4) * h * 0.06 - (x / w) * h * 0.08;
        const off = y - curve;
        if (off > 0 && off < 3 + (x / w) * 6) {
          const t = 1 - off / (3 + (x / w) * 6);
          if (t > bayer(x, y) * 0.9) c = wave.c;
        }
      }

      // ground
      // grass tips: the edge wanders a few pixels, so it reads as a field, not a stripe
      if (ground && y >= ground.top * h - Math.round(noise(x / 5, 3, seed + 31) * 3) - (hash(x, 7, seed) < 0.3 ? 1 : 0)) {
        const depth = (y - ground.top * h) / (h - ground.top * h);
        const gx = ground.glowX ?? 0.5;
        const spot = Math.max(0, 1 - Math.hypot((x / w - gx) * 2.2, depth * 2.4));
        const v = 0.15 + spot * 0.85 + (fbm(x / 3, y / 2, seed + 23) - 0.5) * 0.35 - depth * 0.15;
        c = dither(ground.pal, v, x, y);
      }

      const i = (y * w + x) * 4;
      if (c) {
        d[i] = c[0];
        d[i + 1] = c[1];
        d[i + 2] = c[2];
        d[i + 3] = a;
      }
    }
  }
  return img;
}
