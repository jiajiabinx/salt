/**
 * Marketplace browse taxonomy, tracking Mecka's published vocabulary
 * (mecka.ai and the EgoVerse explorer at partners.mecka.ai/egoverse) so a
 * buyer who shops both is reading the same words in both places.
 *
 * Two axes, same as before:
 *
 *  - Capture domain is primary. Mecka's six capture modules are what a buyer
 *    arrives with ("we need contact data"), so they're the browse nav.
 *  - Signal primitives (Mecka's MK-SIG set) are a compatibility constraint
 *    applied *after* relevance, so they live in the secondary filter row.
 *
 * No "server-only" here — the client-side filter bar imports this too.
 */

export type Capability = {
  slug: string;
  label: string;
  /** Mecka's own one-line gloss for the module, used as the nav tooltip. */
  blurb: string;
};

/**
 * Mecka's six capture modules, in their published order. Labels are verbatim
 * — "Degrees of Freedom" is long for a nav row, but renaming it would break
 * the one thing this taxonomy is for.
 */
export const CAPABILITIES: Capability[] = [
  { slug: "telemetry", label: "Telemetry", blurb: "real-world sensor fusion" },
  { slug: "locomotion", label: "Locomotion", blurb: "base rotation · J1" },
  { slug: "kinematics", label: "Kinematics", blurb: "link pose & trajectory" },
  {
    slug: "degrees_of_freedom",
    label: "Degrees of Freedom",
    blurb: "6-axis articulation",
  },
  { slug: "motion_capture", label: "Motion Capture", blurb: "joint-angle telemetry" },
  { slug: "contact_data", label: "Contact Data", blurb: "grasp · force · tactile" },
];

/**
 * The capability slugs this taxonomy used before it tracked Mecka, mapped onto
 * the capture domain each one belongs to. Listings written under the old slugs
 * are still in the table, and an unmapped one is a listing the browse nav can
 * never reach.
 */
const CATEGORY_ALIASES: Record<string, string> = {
  manipulation: "contact_data",
  warehouse_picking: "contact_data",
  navigation: "locomotion",
  outdoor_navigation: "locomotion",
  mobile_manipulation: "kinematics",
  inspection: "telemetry",
  construction_telemetry: "telemetry",
};

/** A stored category as one of the six capture domains, where it maps to one. */
export function normalizeCategory(slug: string): string {
  if (CAPABILITIES.some((c) => c.slug === slug)) return slug;
  return CATEGORY_ALIASES[slug] ?? slug;
}

export function capabilityLabel(slug: string): string {
  const normalized = normalizeCategory(slug);
  return (
    CAPABILITIES.find((c) => c.slug === normalized)?.label ??
    slug.replace(/_/g, " ")
  );
}

/**
 * Mecka's MK-SIG signal and action primitives — how a recording measures the
 * world. The code is part of the name over there, so it's kept as a separate
 * field rather than folded into the label: chips show the label, and the code
 * is what a listing stores.
 *
 * All ten ship as filters even though Pixel Understanding is close to
 * universal. A filter that matches nearly everything is weak, but dropping a
 * primitive Mecka publishes would leave buyers looking for a chip that isn't
 * there.
 */
export type SignalPrimitive = {
  /** MK-SIG code, e.g. "PX-01". Stable identifier — this is what gets stored. */
  code: string;
  label: string;
};

export const SIGNAL_PRIMITIVES: SignalPrimitive[] = [
  { code: "PX-01", label: "Pixel Understanding" },
  { code: "DP-02", label: "Depth & Geometry" },
  { code: "OT-03", label: "Object Tracking" },
  { code: "SG-04", label: "Segmentation" },
  { code: "TF-05", label: "Tactile Force" },
  { code: "SW-06", label: "Sound Waves" },
  { code: "SM-07", label: "Speed & Motion" },
  { code: "PC-08", label: "Point Cloud" },
  { code: "SC-09", label: "Surface Contour" },
  { code: "LC-10", label: "Localization" },
];

/**
 * Sensor names listings used before MK-SIG, mapped onto the primitive each one
 * is. Without this every listing already in the table drops out of the signal
 * filter the moment the vocabulary changes, which looks like a broken filter
 * rather than a renamed one.
 *
 * Keys are lowercase and punctuation-free; `signalPrimitive` normalises before
 * it looks anything up.
 */
const SIGNAL_ALIASES: Record<string, string> = {
  rgb: "PX-01",
  camera: "PX-01",
  video: "PX-01",
  depth: "DP-02",
  stereo: "DP-02",
  rgbd: "DP-02",
  tracking: "OT-03",
  segmentation: "SG-04",
  forcetorque: "TF-05",
  force: "TF-05",
  tactile: "TF-05",
  audio: "SW-06",
  microphone: "SW-06",
  imu: "SM-07",
  odometry: "SM-07",
  lidar: "PC-08",
  pointcloud: "PC-08",
  gps: "LC-10",
  slam: "LC-10",
};

/**
 * Resolves any of the three things a listing might hold — the MK-SIG code, the
 * primitive's label, or a pre-MK-SIG sensor name — to its entry.
 */
export function signalPrimitive(value: string): SignalPrimitive | undefined {
  const v = value.trim().toLowerCase();
  const code = SIGNAL_ALIASES[v.replace(/[^a-z0-9]/g, "")];
  return SIGNAL_PRIMITIVES.find(
    (s) =>
      s.code.toLowerCase() === v || s.label.toLowerCase() === v || s.code === code
  );
}

export function signalLabel(value: string): string {
  return signalPrimitive(value)?.label ?? value;
}

/**
 * EgoVerse embodiments: who or what performed the episode. Human embodiments
 * are the raw demonstrations; robot embodiments are the replays those
 * demonstrations were transferred onto.
 */
export const EMBODIMENTS = [
  "human_bimanual",
  "human_left_arm",
  "human_right_arm",
  "eva",
  "eva_bimanual",
  "eva_right_arm",
  "yam_bimanual",
] as const;

export type Embodiment = (typeof EMBODIMENTS)[number];

/** `human_bimanual` → `Human bimanual`, for chips and labels. */
export function humanize(slug: string): string {
  const spaced = slug.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Recorder experience tiers, derived from years of experience rather than
 * stored alongside them. One source of truth means a listing can never claim
 * "Expert" with two years behind it.
 *
 * This is Butter's own layer, not Mecka's — over there an operator is an
 * anonymous id, and here you can see who recorded the data and talk to them.
 */
export type ExperienceTier = "novice" | "senior" | "expert";

export const EXPERIENCE_TIERS: Record<ExperienceTier, { label: string; minYears: number }> = {
  novice: { label: "Novice", minYears: 0 },
  senior: { label: "Senior", minYears: 3 },
  expert: { label: "Expert", minYears: 10 },
};

export function experienceTier(years: number): ExperienceTier {
  if (years >= EXPERIENCE_TIERS.expert.minYears) return "expert";
  if (years >= EXPERIENCE_TIERS.senior.minYears) return "senior";
  return "novice";
}

export function experienceTierLabel(years: number): string {
  return EXPERIENCE_TIERS[experienceTier(years)].label;
}
