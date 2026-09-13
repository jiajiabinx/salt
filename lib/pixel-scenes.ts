/**
 * Pixel-art task animations for the marketplace dataset cards.
 *
 * Each listing advertises a handful of tasks ("bin picking", "hallway
 * navigation", "chopping"). A card that only lists them in text reads like a
 * spreadsheet row, so every card also plays a tiny sprite loop of the work
 * being done. Scenes are keyed off the listing's first recognised task word,
 * with the capability category as the fallback for tasks a seller invents.
 *
 * The sprite-stamp format and the palette live in `lib/pixel-art`; this file
 * is just the art.
 *
 * No "server-only" here: the card renders on the server today, but nothing in
 * this file needs it and the art is worth reusing client-side.
 */

import { compose as composeGrid, type Placement, type Sprite } from "./pixel-art";

export const SCENE_W = 28;
export const SCENE_H = 10;

export type Scene = {
  /** Drawn once behind every frame: ground, fixtures, anything that holds still. */
  statics: Placement[];
  /** Drawn over the statics, one entry per animation frame. */
  frames: Placement[][];
};

/* ── shared pieces ───────────────────────────────────────────────── */

const GROUND: Sprite = ["-".repeat(SCENE_W)];
const CEILING: Sprite = ["-".repeat(SCENE_W)];

/** A vertical run of ink, for gantry cords and other stems of varying length. */
const cord = (n: number): Sprite => Array.from({ length: n }, () => "#");

/* ── sweep: vacuuming, wiping, mowing, anything that clears a surface ── */

const VACUUM: Sprite = [
  "..#..",
  "..#..",
  "..#..",
  "..#..",
  "..#..",
  ".###.",
  "#####",
];
const DUST: Sprite = ["o.o", ".o."];
const DEBRIS: Sprite = [".o.", "ooo"];

const SWEEP: Scene = {
  statics: [[GROUND, 0, 9]],
  frames: [
    [[VACUUM, 3, 2], [DUST, 9, 6], [DEBRIS, 20, 7]],
    [[VACUUM, 8, 2], [DUST, 14, 7], [DEBRIS, 20, 7]],
    [[VACUUM, 13, 2], [DUST, 19, 6], [DEBRIS, 20, 7]],
    [[VACUUM, 18, 2], [DUST, 24, 7]],
  ],
};

/* ── grip: bin picking, stacking, restocking, fetching ───────────── */

const RAIL: Sprite = ["-".repeat(SCENE_W)];
const PLATFORM: Sprite = ["------"];
const BIN: Sprite = ["-.....-", "-.....-", "-------"];
const CLAW: Sprite = ["..#..", "..#..", "#####", "#...#"];
const BLOCK: Sprite = ["yyy", "yyy"];

const GRIP: Scene = {
  statics: [
    [RAIL, 0, 0],
    [GROUND, 0, 9],
    [PLATFORM, 3, 8],
    [BIN, 19, 6],
  ],
  frames: [
    [[cord(1), 5, 0], [CLAW, 3, 1], [BLOCK, 4, 6]],
    [[cord(3), 5, 0], [CLAW, 3, 3], [BLOCK, 4, 6]],
    [[cord(2), 13, 0], [CLAW, 11, 2], [BLOCK, 12, 4]],
    [[cord(2), 22, 0], [CLAW, 20, 2], [BLOCK, 21, 6]],
  ],
};

/* ── scan: barcode reads, inspection, obstacle detection ─────────── */

const PANEL: Sprite = [
  "--------",
  "-......-",
  "-......-",
  "-......-",
  "--------",
];
const CAMERA: Sprite = ["###", "#o#", "###", ".#.", ".#.", ".#."];
const SCANLINE: Sprite = ["r", "r", "r"];
const MARK: Sprite = ["o"];
const bar = (n: number): Sprite => ["y".repeat(n)];

const SCAN: Scene = {
  statics: [
    [GROUND, 0, 9],
    [CAMERA, 2, 3],
    [PANEL, 9, 3],
  ],
  frames: [
    [[SCANLINE, 10, 4], [bar(2), 9, 8]],
    [[SCANLINE, 12, 4], [MARK, 10, 5], [bar(4), 9, 8]],
    [[SCANLINE, 14, 4], [MARK, 10, 5], [MARK, 12, 6], [bar(6), 9, 8]],
    [
      [SCANLINE, 16, 4],
      [MARK, 10, 5],
      [MARK, 12, 6],
      [MARK, 14, 5],
      [bar(8), 9, 8],
    ],
  ],
};

/* ── drive: hallways, curbs, rows, routes ────────────────────────── */

const ROVER_A: Sprite = ["..##..", "######", "######", ".o..o."];
const ROVER_B: Sprite = ["..##..", "######", "######", ".#..#."];
const BEAM_UP: Sprite = ["..r", ".r.", "r.."];
const BEAM_DOWN: Sprite = ["r..", ".r.", "..r"];
const DASH: Sprite = ["--"];

const DRIVE: Scene = {
  statics: [
    [CEILING, 0, 1],
    [GROUND, 0, 9],
  ],
  frames: [
    [
      [ROVER_A, 5, 5],
      [BEAM_UP, 12, 3],
      [DASH, 14, 8],
      [DASH, 19, 8],
      [DASH, 24, 8],
    ],
    [
      [ROVER_B, 5, 5],
      [BEAM_DOWN, 12, 5],
      [DASH, 13, 8],
      [DASH, 18, 8],
      [DASH, 23, 8],
    ],
    [
      [ROVER_A, 5, 5],
      [BEAM_UP, 12, 3],
      [DASH, 12, 8],
      [DASH, 17, 8],
      [DASH, 22, 8],
    ],
    [
      [ROVER_B, 5, 5],
      [BEAM_DOWN, 12, 5],
      [DASH, 11, 8],
      [DASH, 16, 8],
      [DASH, 21, 8],
    ],
  ],
};

/* ── dig: excavation, material staging ───────────────────────────── */

const CAB: Sprite = [".####", "#####", "#####", "o###o"];
const BOOM_UP: Sprite = ["......oo", "....oo..", "..oo....", "oo......"];
const BOOM_DOWN: Sprite = ["........", "oo......", "..oooo..", "......oo"];
const BUCKET: Sprite = ["#.#", "###"];
const BUCKET_FULL: Sprite = ["#y#", "###"];
const PILE: Sprite = ["..yy..", "yyyyyy"];
const PILE_LOW: Sprite = ["......", "y.yy.y"];
const FALLING: Sprite = ["y.y"];

const DIG: Scene = {
  statics: [
    [GROUND, 0, 9],
    [CAB, 2, 5],
  ],
  frames: [
    [[BOOM_UP, 6, 3], [BUCKET, 12, 3], [PILE, 12, 7]],
    [[BOOM_DOWN, 6, 3], [BUCKET, 12, 5], [PILE, 12, 7]],
    [[BOOM_DOWN, 6, 3], [BUCKET_FULL, 12, 5], [PILE_LOW, 12, 7]],
    [[BOOM_UP, 6, 3], [BUCKET_FULL, 12, 3], [FALLING, 12, 6], [PILE_LOW, 12, 7]],
  ],
};

/* ── chop: knife work, prep, plating ─────────────────────────────── */

const BOARD: Sprite = ["oooooooooo"];
const KNIFE: Sprite = ["..oo", "..oo", "####", "###.", "##.."];
const ITEM: Sprite = ["yyyy", "yyyy"];
const HALF: Sprite = ["yy", "yy"];

const CHOP: Scene = {
  statics: [
    [GROUND, 0, 9],
    [BOARD, 9, 8],
  ],
  frames: [
    [[KNIFE, 13, 0], [ITEM, 12, 6]],
    [[KNIFE, 13, 2], [ITEM, 12, 6]],
    [[KNIFE, 13, 4], [HALF, 11, 6], [HALF, 16, 6]],
    [[KNIFE, 13, 2], [HALF, 11, 6], [HALF, 16, 6]],
  ],
};

/* ── fold: linens, bed making, laundry ───────────────────────────── */

const TABLE: Sprite = ["o".repeat(16)];
const CLOTH_FLAT: Sprite = ["y".repeat(14), "y".repeat(14)];
const CLOTH_LIFT: Sprite = [
  "yyy...........",
  "..yyy.........",
  "....yyyyyyyyyy",
];
const CLOTH_HALF: Sprite = ["yyyyyyy", "yyyyyyy", "yyyyyyy"];
const CLOTH_STACK: Sprite = ["yyyyy", "ooooo", "yyyyy", "yyyyy"];

const FOLD: Scene = {
  statics: [
    [GROUND, 0, 9],
    [TABLE, 6, 8],
  ],
  frames: [
    [[CLOTH_FLAT, 7, 6]],
    [[CLOTH_LIFT, 7, 5]],
    [[CLOTH_HALF, 11, 5]],
    [[CLOTH_STACK, 12, 4]],
  ],
};

/* ── turn: fasteners, tool work, teardown ────────────────────────── */

const PLATE: Sprite = [
  "------------",
  "-..........-",
  "-..........-",
  "-..........-",
  "-..........-",
  "------------",
];
const BAR_H: Sprite = ["#######"];
const BAR_V: Sprite = ["#", "#", "#", "#", "#", "#", "#"];
const BAR_D1: Sprite = [
  "......#",
  ".....#.",
  "....#..",
  "...#...",
  "..#....",
  ".#.....",
  "#......",
];
const BAR_D2: Sprite = [
  "#......",
  ".#.....",
  "..#....",
  "...#...",
  "....#..",
  ".....#.",
  "......#",
];
const BOLT: Sprite = ["###", "#o#", "###"];
const SPARK: Sprite = ["r.r", ".r."];

const TURN: Scene = {
  statics: [
    [GROUND, 0, 9],
    [PLATE, 8, 1],
  ],
  frames: [
    [[BAR_H, 11, 5], [BOLT, 13, 4], [SPARK, 18, 3]],
    [[BAR_D1, 11, 2], [BOLT, 13, 4]],
    [[BAR_V, 14, 2], [BOLT, 13, 4], [SPARK, 9, 3]],
    [[BAR_D2, 11, 2], [BOLT, 13, 4]],
  ],
};

/* ── handoff: deliveries, assistance, anything passed person to person ── */

const PERSON: Sprite = [".##.", ".##.", "####", ".##.", ".##.", "#..#"];
const PARCEL: Sprite = ["yy", "yy"];

const HANDOFF: Scene = {
  statics: [
    [GROUND, 0, 9],
    [PERSON, 4, 3],
    [PERSON, 20, 3],
  ],
  frames: [
    [[PARCEL, 9, 6]],
    [[PARCEL, 12, 5]],
    [[PARCEL, 15, 5]],
    [[PARCEL, 18, 6]],
  ],
};

/* ── task → scene ────────────────────────────────────────────────── */

export const SCENES = {
  sweep: SWEEP,
  grip: GRIP,
  scan: SCAN,
  drive: DRIVE,
  dig: DIG,
  chop: CHOP,
  fold: FOLD,
  turn: TURN,
  handoff: HANDOFF,
} satisfies Record<string, Scene>;

export type SceneKey = keyof typeof SCENES;

/**
 * Substring matches against the task text, most specific first. Sellers write
 * their own task names, so this matches on the verb rather than an enum.
 */
const TASK_MATCHERS: [RegExp, SceneKey][] = [
  [/vacuum|wip|tidy|mow|trim|debris|sweep|clean|bathroom|dust|mop/, "sweep"],
  [/fold|linen|bed making|laundry|towel|sheet/, "fold"],
  [/chop|slice|dice|knife|cook|food|prep|plating|plate up/, "chop"],
  [/excavat|dig|trench|material staging|grading|haul/, "dig"],
  [/fastener|bolt|screw|wrench|tool|teardown|disassembl|repair/, "turn"],
  [/handoff|hand-off|handover|deliver|assist|mobility|escort|serve|meal/, "handoff"],
  [/scan|inspect|detect|survey|walkthrough|check|diagnos|read|audit/, "scan"],
  [/navig|traversal|elevator|curb|doorstep|hallway|row follow|route|path|driv|approach/, "drive"],
  [/pick|stack|pallet|stock|shelf|planogram|fetch|grasp|sort|load|place|bin/, "grip"],
];

/**
 * Capture-domain fallback for tasks nothing above recognises. Keyed on the
 * six Mecka modules in `lib/taxonomy`; the retired capability slugs stay
 * listed because listings written under them are still in the table.
 */
const CATEGORY_SCENES: Record<string, SceneKey> = {
  telemetry: "scan",
  locomotion: "drive",
  kinematics: "turn",
  degrees_of_freedom: "turn",
  motion_capture: "handoff",
  contact_data: "grip",

  /* Pre-Mecka slugs. */
  manipulation: "grip",
  navigation: "drive",
  mobile_manipulation: "handoff",
  inspection: "scan",
  warehouse_picking: "grip",
  construction_telemetry: "dig",
  outdoor_navigation: "drive",
};

export function sceneKeyFor(tasks: string[], category: string): SceneKey {
  for (const task of tasks) {
    const text = task.toLowerCase();
    for (const [pattern, key] of TASK_MATCHERS) {
      if (pattern.test(text)) return key;
    }
  }
  return CATEGORY_SCENES[category] ?? "grip";
}

/** Flattens one frame's stamps into SCENE_H rows of SCENE_W palette chars. */
export function compose(placements: Placement[]): string[] {
  return composeGrid(placements, SCENE_W, SCENE_H);
}
