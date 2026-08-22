export const LISTING_CATEGORIES = [
  { value: "manipulation", label: "Manipulation" },
  { value: "navigation", label: "Navigation" },
  { value: "warehouse_picking", label: "Warehouse picking" },
  { value: "construction_telemetry", label: "Construction telemetry" },
  { value: "outdoor_navigation", label: "Outdoor navigation" },
] as const;

export const LISTING_CATEGORY_VALUES: Set<string> = new Set(
  LISTING_CATEGORIES.map((c) => c.value)
);
