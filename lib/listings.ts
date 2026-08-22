import "server-only";
import { ensureSchema, sql } from "./db";

export type ListingParameters = {
  hours: number;
  /** Episode count. Absent on listings created before the field existed. */
  demonstrations?: number;
  /** Platform handle of the recorder. Stored bare; the "@" is display-only. */
  recorderHandle?: string;
  /** Years in the trade. Not shown directly — this is what derives the tier. */
  recorderYears?: number;
  /** Mean buyer rating, 0-5. */
  recorderRating?: number;
  /** Number of ratings behind `recorderRating`. */
  recorderReviews?: number;
  sensorModalities: string[];
  slam: boolean;
  robotPlatform: string;
  environmentTags: string[];
  tasks: string[];
};

export type ListingStatus = "pending_review" | "approved" | "rejected";

export type Listing = {
  id: number;
  title: string;
  category: string;
  summary: string;
  askingPriceCents: number;
  parameters: ListingParameters;
  status: ListingStatus;
  createdAt: string;
};

export async function getApprovedListings(): Promise<Listing[]> {
  if (!sql) return [];
  await ensureSchema();

  return sql<Listing[]>`
    SELECT
      id, title, category, summary,
      asking_price_cents AS "askingPriceCents",
      parameters, status,
      created_at AS "createdAt"
    FROM listings
    WHERE status = 'approved'
    ORDER BY created_at DESC
  `;
}
