import { useEffect, useRef } from "react";

/** One character per pixel; "." is transparent. Short rows are padded. */
export type SpriteFrame = string[];

interface Props {
  frame: SpriteFrame;
  palette: Record<string, string>;
  scale?: number;
  className?: string;
  flip?: boolean;
}

/** Draws a text-grid sprite on a canvas, crisp at any scale. */
export default function PixelSprite({ frame, palette, scale = 3, className = "", flip = false }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const width = Math.max(...frame.map((r) => r.length));
  const height = frame.length;

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    frame.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const colour = palette[ch];
        if (!colour) return;
        ctx.fillStyle = colour;
        ctx.fillRect(flip ? width - 1 - x : x, y, 1, 1);
      });
    });
  }, [frame, palette, width, height, flip]);

  return (
    <canvas
      ref={canvas}
      width={width}
      height={height}
      aria-hidden="true"
      className={className}
      style={{ width: width * scale, height: height * scale, imageRendering: "pixelated" }}
    />
  );
}
