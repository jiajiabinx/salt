import type { Metadata } from "next";
import Link from "next/link";
import { getApprovedListings, type Listing } from "../lib/listings";
import { capabilityLabel } from "../lib/taxonomy";
import ListingCard from "./components/ListingCard";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Human demonstration data for robot learning — egocentric task recordings from professional cleaners, warehouse crews, and trade experts, licensed direct from the people who collected it.",
  alternates: { canonical: "/" },
};

type Filters = { category?: string; modality?: string };

function applyFilters(listings: Listing[], f: Filters): Listing[] {
  let out = listings;

  if (f.category) {
    out = out.filter((l) => l.category === f.category);
  }
  if (f.modality) {
    const m = f.modality.toLowerCase();
    out = out.filter((l) =>
      l.parameters.sensorModalities.some((s) => s.toLowerCase() === m)
    );
  }
  return out;
}

/** Active filters as [label, href-without-it] for the dismissible chips. */
function activeChips(f: Filters): { label: string; clearHref: string }[] {
  const chips: { label: string; clearHref: string }[] = [];
  const hrefWithout = (key: keyof Filters) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(f)) if (v && k !== key) p.set(k, v);
    const qs = p.toString();
    return qs ? `/?${qs}` : "/";
  };
  if (f.category) {
    chips.push({ label: capabilityLabel(f.category), clearHref: hrefWithout("category") });
  }
  if (f.modality) chips.push({ label: f.modality, clearHref: hrefWithout("modality") });
  return chips;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Filters>;
}) {
  const filters = await searchParams;
  const listings = applyFilters(await getApprovedListings(), filters);
  const chips = activeChips(filters);
  const mid = Math.ceil(listings.length / 2);
  const topListings = listings.slice(0, mid);
  const bottomListings = listings.slice(mid);

  return (
    <>
      {chips.length > 0 && (
        <div className="marketFilterBar">
          <span>
            {listings.length} {listings.length === 1 ? "dataset" : "datasets"}
          </span>
          {chips.map((c) => (
            <Link key={c.label} href={c.clearHref} className="marketFilterChip">
              {c.label} <span aria-hidden>×</span>
              <span className="srOnly">, remove filter</span>
            </Link>
          ))}
          {chips.length > 1 && (
            <Link href="/" className="marketFilterClear">
              Clear all
            </Link>
          )}
        </div>
      )}

      {topListings.length > 0 && (
        <div className="marketplaceGrid">
          {topListings.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      )}

      <section className="marketHero">
        <h1 className="marketHeroHeadline">Straight from the source.</h1>
        <p className="marketHeroSub">
          Human demonstration data, recorded by the people who do the work for a
          living — professional cleaners, warehouse crews, line cooks, field techs.
          Every listing names its collector, sensor stack, and episode count up
          front, and you talk to whoever recorded it. No aggregator markup, no
          repackaged scrape.
        </p>
        <Link href="/signup" className="heroCtaPrimary">
          Request buyer access
          <span aria-hidden>→</span>
        </Link>
      </section>

      {listings.length === 0 ? (
        <p className="marketplaceEmpty">
          {chips.length > 0
            ? "No datasets match these filters yet — try clearing one."
            : "No datasets listed yet — check back soon."}
        </p>
      ) : (
        bottomListings.length > 0 && (
          <div className="marketplaceGrid">
            {bottomListings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={mid + i} />
            ))}
          </div>
        )
      )}
    </>
  );
}
