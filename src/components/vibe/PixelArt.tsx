"use client";

import { useEffect, useRef } from "react";
import { paintScene, type Scene } from "@/lib/pixel";

/** A static pixel-art scene, painted once at low resolution and scaled up crisp. */
export function PixelArt({ scene, width, height, className }: { scene: Scene; width: number; height: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (ctx) ctx.putImageData(paintScene(width, height, scene), 0, 0);
  }, [scene, width, height]);

  return <canvas ref={ref} width={width} height={height} aria-hidden className={`pixelated ${className ?? ""}`} />;
}
