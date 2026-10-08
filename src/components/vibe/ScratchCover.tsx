"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { hash } from "@/lib/pixel";

/** Paints the foil: dark slate, dithered pixel texture, silver glints and a label. */
function paintFoil(ctx: CanvasRenderingContext2D, w: number, h: number, n: string) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#232a52");
  g.addColorStop(0.5, "#151a36");
  g.addColorStop(1, "#1e2547");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // pixel grain
  const px = 5;
  for (let y = 0; y < h; y += px) {
    for (let x = 0; x < w; x += px) {
      const v = hash(x / px, y / px, Number(n));
      if (v > 0.7) {
        ctx.fillStyle = v > 0.92 ? "rgba(190,200,255,0.22)" : "rgba(170,178,255,0.09)";
        ctx.fillRect(x, y, px, px);
      } else if (v < 0.18) {
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(x, y, px, px);
      }
    }
  }

  // diagonal foil glints
  ctx.save();
  ctx.rotate(-0.5);
  for (let i = -2; i < 8; i++) {
    ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.05)" : "rgba(59,227,255,0.06)";
    ctx.fillRect(-w, i * (h / 6) + h * 0.1, w * 3, h / 24);
  }
  ctx.restore();

  // stepped border
  ctx.strokeStyle = "rgba(170,178,255,0.4)";
  ctx.lineWidth = 3;
  ctx.strokeRect(7, 7, w - 14, h - 14);

  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-silkscreen").trim() || "monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(190,200,255,0.55)";
  ctx.font = `${Math.max(9, w * 0.045)}px ${family}`;
  ctx.fillText(`RULE ${n}`, w / 2, h * 0.09);

  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(59,227,255,0.8)";
  ctx.shadowBlur = 14;
  ctx.font = `${Math.max(14, w * 0.13)}px ${family}`;
  ctx.fillText("SCRATCH", w / 2, h * 0.46);
  ctx.fillStyle = "#3be3ff";
  ctx.fillText("ME", w / 2, h * 0.46 + Math.max(14, w * 0.13) * 1.25);
  ctx.shadowBlur = 0;

  ctx.fillStyle = "rgba(190,200,255,0.5)";
  ctx.font = `${Math.max(8, w * 0.04)}px ${family}`;
  ctx.fillText("▼  DRAG TO REVEAL  ▼", w / 2, h * 0.91);
}

/**
 * A scratch-off layer over a card. With a mouse you drag to scratch it away; once about half
 * is gone the rest clears itself. Touch, pen and keyboard users (and a plain click) reveal it
 * in one go, so nothing depends on a drag gesture. `onDragEnd` lets the card ignore the
 * click that ends a scratch.
 */
export function ScratchCover({
  n,
  revealed,
  onReveal,
  onDragEnd,
}: {
  n: string;
  revealed: boolean;
  onReveal: () => void;
  /** called when a real drag ends, so the card can ignore the click that follows it */
  onDragEnd: () => void;
}) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const down = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const travelled = useRef(0);
  const strokes = useRef(0);
  const done = useRef(revealed);

  useEffect(() => {
    done.current = revealed;
  }, [revealed]);

  // paint (and repaint on resize / once fonts are ready, until scratching starts)
  useEffect(() => {
    const c = cvs.current;
    if (!c) return;
    const paint = () => {
      if (done.current || strokes.current > 0) return;
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintFoil(ctx, w, h, n);
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(c);
    document.fonts?.ready.then(paint);
    return () => ro.disconnect();
  }, [n]);

  const pos = (e: PointerEvent<HTMLCanvasElement>) => {
    const c = cvs.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * c.clientWidth) / r.width, y: ((e.clientY - r.top) * c.clientHeight) / r.height };
  };

  const scratch = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const c = cvs.current!;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    // destination-out erases in proportion to the stroke's opacity: it must be fully opaque
    ctx.strokeStyle = "#000";
    ctx.shadowBlur = 0;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(20, c.clientWidth * 0.17);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x + 0.01, b.y);
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  };

  /** fraction of the foil already scratched away, sampled at low resolution */
  const cleared = () => {
    const c = cvs.current!;
    const probe = document.createElement("canvas");
    probe.width = 30;
    probe.height = 54;
    const pctx = probe.getContext("2d", { willReadFrequently: true });
    if (!pctx) return 0;
    pctx.drawImage(c, 0, 0, probe.width, probe.height);
    const d = pctx.getImageData(0, 0, probe.width, probe.height).data;
    let gone = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] < 40) gone++;
    return gone / (probe.width * probe.height);
  };

  const finish = () => {
    if (done.current) return;
    done.current = true;
    onReveal();
  };

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (done.current || e.pointerType !== "mouse" || e.button !== 0) return;
    down.current = true;
    travelled.current = 0;
    last.current = pos(e);
    try {
      cvs.current!.setPointerCapture(e.pointerId);
    } catch {
      /* the pointer is already gone: scratching still works while it stays over the card */
    }
    strokes.current += 1;
    scratch(last.current, last.current);
  };

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!down.current) return;
    const p = pos(e);
    travelled.current += Math.hypot(p.x - last.current.x, p.y - last.current.y);
    scratch(last.current, p);
    last.current = p;
    strokes.current += 1;
    if (strokes.current % 5 === 0 && cleared() > 0.45) finish();
  };

  const onUp = () => {
    if (!down.current) return;
    down.current = false;
    // a real drag shouldn't also count as a click on the card
    if (travelled.current > 6) onDragEnd();
    if (cleared() > 0.45) finish();
  };

  return (
    <canvas
      ref={cvs}
      aria-hidden
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className={`scratch-cover absolute inset-0 h-full w-full cursor-crosshair ${revealed ? "scratch-gone" : ""}`}
    />
  );
}
