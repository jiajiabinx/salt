import { runsFor } from "../../lib/pixel-art";

/** One frame's composed rows, drawn as merged horizontal runs. */
export function PixelRects({ rows }: { rows: string[] }) {
  return (
    <>
      {runsFor(rows).map((r) => (
        <rect
          key={`${r.y}-${r.x}`}
          x={r.x}
          y={r.y}
          width={r.w}
          height={1}
          fill={r.fill}
        />
      ))}
    </>
  );
}

/**
 * A looping sprite animation.
 *
 * The frames sit side by side in a strip that slides one frame-width at a time
 * inside a nested <svg> viewport, which is the sprite-sheet trick done in
 * markup: one CSS animation drives every scene regardless of frame count, and
 * nothing needs JavaScript to run.
 */
export default function PixelSheet({
  w,
  h,
  statics,
  frames,
  className = "pxScene",
  delay = 0,
  children,
}: {
  w: number;
  h: number;
  /** Composed rows drawn once behind every frame. */
  statics: string[];
  /** Composed rows, one entry per frame. */
  frames: string[][];
  className?: string;
  /** Offsets the loop so a grid of scenes doesn't march in lockstep. */
  delay?: number;
  children?: React.ReactNode;
}) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      style={
        {
          "--px-frames": frames.length,
          "--px-span": (frames.length - 1) * w,
          "--px-delay": `${-delay}s`,
        } as React.CSSProperties
      }
    >
      <svg x={0} y={0} width={w} height={h}>
        <g className="pxStatics">
          <PixelRects rows={statics} />
        </g>
        <g className="pxSheet">
          {frames.map((rows, i) => (
            <g key={i} transform={`translate(${i * w} 0)`}>
              <PixelRects rows={rows} />
            </g>
          ))}
        </g>
      </svg>
      {children}
    </svg>
  );
}
