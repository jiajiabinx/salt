/**
 * Shared primitives for the site's pixel art.
 *
 * Art is authored as sprites stamped at grid coordinates rather than as one
 * hand-drawn grid per frame: motion is then a coordinate change, so a frame
 * costs a line instead of ten. `compose` flattens a frame's stamps into rows
 * of palette chars, and `runsFor` turns those rows into horizontal runs the
 * renderer emits as <rect> nodes.
 *
 * Palette chars: '#' ink, 'o' mid ink, 'y' accent, 'r' alert, '-' faint,
 * '.' transparent.
 */

/** Rows of a sprite, top to bottom. Ragged rows are fine, they just stop early. */
export type Sprite = string[];

/** A sprite stamped at [x, y] in grid cells, origin top-left. Later wins. */
export type Placement = [Sprite, number, number];

/** One horizontal run of a single colour, one cell tall. */
export type Run = { x: number; y: number; w: number; fill: string };

/** Palette char to the CSS variable the scene sets. */
export const PIXEL_COLORS: Record<string, string> = {
  "#": "var(--px-ink)",
  o: "var(--px-mid)",
  y: "var(--px-accent)",
  r: "var(--px-alert)",
  "-": "var(--px-faint)",
};

/** Flattens one frame's stamps into `h` rows of `w` palette chars. */
export function compose(placements: Placement[], w: number, h: number): string[] {
  const grid: string[][] = Array.from({ length: h }, () =>
    new Array<string>(w).fill(".")
  );

  for (const [sprite, ox, oy] of placements) {
    for (let ry = 0; ry < sprite.length; ry++) {
      const row = sprite[ry];
      for (let rx = 0; rx < row.length; rx++) {
        const ch = row[rx];
        if (ch === ".") continue;
        const x = ox + rx;
        const y = oy + ry;
        if (x < 0 || x >= w || y < 0 || y >= h) continue;
        grid[y][x] = ch;
      }
    }
  }

  return grid.map((row) => row.join(""));
}

/**
 * Merges horizontal runs of one colour into a single rect. The art is sparse,
 * so this cuts a frame down to a couple of dozen nodes.
 */
export function runsFor(rows: string[]): Run[] {
  const out: Run[] = [];

  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === ".") {
        x++;
        continue;
      }
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      out.push({ x, y, w: end - x, fill: PIXEL_COLORS[ch] ?? "var(--px-ink)" });
      x = end;
    }
  });

  return out;
}

/** A single grid cell on a path. */
export type Cell = [number, number];

/**
 * Cells from `from` to `to` inclusive. Straight and 45-degree runs only, which
 * is all the art uses and all that stays crisp at this scale.
 */
export function run(from: Cell, to: Cell): Cell[] {
  const [x0, y0] = from;
  const [x1, y1] = to;
  const dx = Math.sign(x1 - x0);
  const dy = Math.sign(y1 - y0);
  const spanX = Math.abs(x1 - x0);
  const spanY = Math.abs(y1 - y0);
  const steps = Math.max(spanX, spanY);

  return Array.from({ length: steps + 1 }, (_, i) => [
    x0 + dx * Math.min(i, spanX),
    y0 + dy * Math.min(i, spanY),
  ] as Cell);
}
