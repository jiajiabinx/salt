/**
 * Marketplace browse taxonomy.
 *
 * Capability is the primary axis: buyers arrive with a capability need ("we
 * need manipulation data"), and it's how the field organizes itself. Sensor
 * modality is a compatibility constraint applied *after* relevance, so it
 * lives in a secondary filter row rather than the main nav.
 *
 * No "server-only" here — the client-side filter bar imports this too.
 */

export type Capability = {
  slug: string;
  label: string;
};

export const CAPABILITIES: Capability[] = [
  { slug: "manipulation", label: "Manipulation" },
  { slug: "navigation", label: "Navigation" },
  { slug: "mobile_manipulation", label: "Mobile manipulation" },
  { slug: "inspection", label: "Inspection" },
];

export function capabilityLabel(slug: string): string {
  return CAPABILITIES.find((c) => c.slug === slug)?.label ?? slug.replace(/_/g, " ");
}

/**
 * Modality filters, deliberately excluding RGB: every listing carries it, so
 * offering it as a filter returns the entire catalog and teaches buyers the
 * filters don't work.
 */
export const MODALITY_FILTERS = ["Depth", "LiDAR", "IMU", "GPS", "Force-torque"];

/**
 * Recorder experience tiers, derived from years of experience rather than
 * stored alongside them. One source of truth means a listing can never claim
 * "Expert" with two years behind it.
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
