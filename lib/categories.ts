/**
 * The category a seller picks when they list. Deliberately the same six
 * values as the browse nav's capture domains — a listing that can't be
 * browsed to is a listing nobody finds — so this derives from the taxonomy
 * rather than restating it.
 */
import { CAPABILITIES } from "./taxonomy";

export const LISTING_CATEGORIES = CAPABILITIES.map((c) => ({
  value: c.slug,
  label: c.label,
}));

export const LISTING_CATEGORY_VALUES: Set<string> = new Set(
  LISTING_CATEGORIES.map((c) => c.value)
);
