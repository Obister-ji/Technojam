"use client";

import { useEffect, useRef } from "react";
import { NETWORK_KINDS as KINDS } from "./network";

/**
 * people → ideas → projects → events.
 * A network of nodes that drifts in from noise and resolves into the TJ
 * mark. Signals travel along edges; the cursor gently parts the nodes.
 * Purely decorative (aria-hidden); static under prefers-reduced-motion.
 */

const MARK_PATHS = ["M3 7.5h15M10.5 7.5V26", "M23.5 7.5v11.5a7 7 0 0 1-7 7h-1"];

interface Node {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  kind: number;
  r: number;
  phase: number;
  links: number[];
}

interface Signal {
  from: number;
  to: number;
  t: number;
  speed: number;
}

function samplePoints(w: number, h: number, count: number, rng: () => number) {
  if (w < 2 || h < 2) return [];
  const size = Math.min(w * 0.82, h * 0.7);
  const ox = w - size - w * 0.06;
  const oy = h * 0.58 - size / 2;
  const scale = size / 32;
  const off = document.createElement("canvas");
  off.width = Math.ceil(w);
  off.height = Math.ceil(h);
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);
  ctx.lineWidth = 3.6;
  ctx.lineCap = "square";
  ctx.strokeStyle = "#000";
  for (const d of MARK_PATHS) ctx.stroke(new Path2D(d));
  ctx.beginPath();
  ctx.arc(23.5, 7.5, 3.4, 0, Math.PI * 2);
  ctx.fill();
  const data = ctx.getImageData(0, 0, off.width, off.height).data;
  const filled: [number, number][] = [];
  const step = Math.max(3, Math.round(size / 90));
  for (let y = 0; y < off.height; y += step)
    for (let x = 0; x < off.width; x += step) if (data[(y * off.width + x) * 4 + 3] > 128) filled.push([x, y]);
  // Shuffle and take `count`
  for (let i = filled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [filled[i], filled[j]] = [filled[j], filled[i]];
  }
  return filled.slice(0, count);
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function HeroNetwork({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Phones / touch: draw the resolved mark once — no loop, no battery drain.
    const settleOnly = window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;
    const reduced = settleOnly || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let ambient: Node[] = [];
    let signals: Signal[] = [];
    let raf = 0;
    let running = false;
    let start = performance.now();
    const pointer = { x: -9999, y: -9999, active: false };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rng = mulberry32(2015);
      const small = w < 640;
      const markCount = small ? 70 : 170;
      const points = samplePoints(w, h, markCount, rng);

      nodes = points.map(([tx, ty]) => ({
        x: reduced ? tx : rng() * w,
        y: reduced ? ty : rng() * h,
        tx,
        ty,
        vx: 0,
        vy: 0,
        // Flow left→right across the mark: people, ideas, projects, events
        kind: Math.min(3, Math.floor(((tx / w) * 4 + rng() * 0.9 - 0.45 + 4) % 4)),
        r: 1 + rng() * 1.6,
        phase: rng() * Math.PI * 2,
        links: [],
      }));

      // Each node links to its nearest neighbours (computed on targets).
      for (let i = 0; i < nodes.length; i++) {
        const d = nodes
          .map((n, j) => ({ j, d: (n.tx - nodes[i].tx) ** 2 + (n.ty - nodes[i].ty) ** 2 }))
          .filter((o) => o.j !== i)
          .sort((a, b) => a.d - b.d)
          .slice(0, 3);
        nodes[i].links = d.map((o) => o.j);
      }

      // Sparse ambient field around the mark
      const ambientCount = small ? 12 : 36;
      ambient = Array.from({ length: ambientCount }, () => {
        const x = rng() * w;
        const y = rng() * h;
        return { x, y, tx: x, ty: y, vx: 0, vy: 0, kind: Math.floor(rng() * 4), r: 0.8 + rng(), phase: rng() * 6.28, links: [] };
      });
      signals = [];
      start = performance.now();
    };

    const spawnSignal = () => {
      const from = Math.floor(Math.random() * nodes.length);
      const links = nodes[from]?.links;
      if (!links?.length) return;
      signals.push({ from, to: links[Math.floor(Math.random() * links.length)], t: 0, speed: 0.012 + Math.random() * 0.02 });
    };

    const draw = (now: number) => {
      const elapsed = (now - start) / 1000;
      const settle = reduced ? 1 : Math.min(1, elapsed / 2.4);
      ctx.clearRect(0, 0, w, h);

      // Physics
      for (const n of nodes) {
        const driftX = reduced ? 0 : Math.sin(elapsed * 0.6 + n.phase) * 1.4;
        const driftY = reduced ? 0 : Math.cos(elapsed * 0.5 + n.phase) * 1.4;
        const k = 0.012 + settle * 0.05;
        n.vx += (n.tx + driftX - n.x) * k;
        n.vy += (n.ty + driftY - n.y) * k;
        if (pointer.active) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          const R = 110;
          if (dist2 < R * R && dist2 > 0.01) {
            const dist = Math.sqrt(dist2);
            const f = ((R - dist) / R) * 2.2;
            n.vx += (dx / dist) * f;
            n.vy += (dy / dist) * f;
          }
        }
        n.vx *= 0.82;
        n.vy *= 0.82;
        n.x += n.vx;
        n.y += n.vy;
      }

      // Edges
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (const j of a.links) {
          if (j < i && nodes[j].links.includes(i)) continue;
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          const alpha = Math.max(0, 1 - d / 90) * 0.38 * settle;
          if (alpha <= 0.01) continue;
          ctx.strokeStyle = `rgba(243,240,234,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Ambient
      for (const n of ambient) {
        const y = n.y + (reduced ? 0 : Math.sin(elapsed * 0.3 + n.phase) * 6);
        ctx.fillStyle = KINDS[n.kind].color;
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.arc(n.x, y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Nodes
      for (const n of nodes) {
        ctx.fillStyle = KINDS[n.kind].color;
        ctx.globalAlpha = 0.55 + 0.45 * settle;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Signals
      if (!reduced) {
        if (settle > 0.6 && signals.length < (w < 640 ? 6 : 14) && Math.random() < 0.18) spawnSignal();
        signals = signals.filter((s) => s.t <= 1);
        for (const s of signals) {
          s.t += s.speed;
          const a = nodes[s.from];
          const b = nodes[s.to];
          if (!a || !b) continue;
          const x = a.x + (b.x - a.x) * s.t;
          const y = a.y + (b.y - a.y) * s.t;
          // Soft halo without shadowBlur (which is very expensive per frame)
          ctx.fillStyle = KINDS[b.kind].color;
          ctx.globalAlpha = 0.18;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
          // Chain onward so signals travel the network
          if (s.t > 1 && b.links.length && Math.random() < 0.7) {
            signals.push({ from: s.to, to: b.links[Math.floor(Math.random() * b.links.length)], t: 0, speed: s.speed });
          }
        }
      }
    };

    let last = 0;
    const loop = (now: number) => {
      // ~30fps is plenty for a slow-drifting background
      if (now - last >= 32) {
        last = now;
        draw(now);
      }
      if (running) raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Start only once the page is idle after load, so the hero text and
    // hydration get the main thread first.
    let visible = true;
    let started = false;
    const begin = () => {
      if (started) return;
      started = true;
      build();
      if (reduced) draw(performance.now());
      else if (visible) play();
    };
    const idle = (cb: () => void) =>
      typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 1200);
    const onLoad = () => idle(begin);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!started) return;
        if (visible) play();
        else pause();
      },
      { threshold: 0 },
    );
    visibility.observe(canvas);

    const onVisibility = () => (document.hidden ? pause() : started && visible && play());
    document.addEventListener("visibilitychange", onVisibility);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = e.pointerType === "mouse";
    };
    const onLeave = () => (pointer.active = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!started) return;
        build();
        if (reduced) draw(performance.now());
      }, 150);
    });
    ro.observe(canvas);

    return () => {
      pause();
      window.removeEventListener("load", onLoad);
      visibility.disconnect();
      ro.disconnect();
      clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`block h-full w-full ${className}`} />;
}
