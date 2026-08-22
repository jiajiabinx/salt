"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CAPABILITIES, MODALITY_FILTERS } from "../../lib/taxonomy";

/**
 * Builds a marketplace href with one param toggled — clicking the active
 * filter clears it, and every other active filter is preserved.
 */
function toggleHref(
  params: URLSearchParams,
  key: string,
  value: string
): string {
  const next = new URLSearchParams(params.toString());
  if (next.get(key) === value) {
    next.delete(key);
  } else {
    next.set(key, value);
  }
  const qs = next.toString();
  return qs ? `/?${qs}` : "/";
}

export function CapabilityNav() {
  const params = useSearchParams();
  const active = params.get("category");

  return (
    <div className="marketNavCapabilities">
      {CAPABILITIES.map((c) => (
        <Link
          key={c.slug}
          href={toggleHref(params, "category", c.slug)}
          className={`marketNavLink${active === c.slug ? " marketNavLinkActive" : ""}`}
          aria-current={active === c.slug ? "page" : undefined}
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}

export function ModalityFilters() {
  const params = useSearchParams();
  const activeModality = params.get("modality");

  return (
    <div className="marketSubNav">
      <span className="marketSubNavLabel">Filter</span>

      {MODALITY_FILTERS.map((m) => {
        const on = activeModality?.toLowerCase() === m.toLowerCase();
        return (
          <Link
            key={m}
            href={toggleHref(params, "modality", m)}
            className={`marketChip${on ? " marketChipActive" : ""}`}
            aria-pressed={on}
          >
            {m}
          </Link>
        );
      })}
    </div>
  );
}
