import Link from "next/link";
import type { Listing } from "../../lib/listings";
import { sceneKeyFor } from "../../lib/pixel-scenes";
import {
  capabilityLabel,
  experienceTier,
  experienceTierLabel,
} from "../../lib/taxonomy";
import TaskPixelScene from "./TaskPixelScene";

/**
 * Chip rows are held to a single line so that every card's parameter block is
 * the same height and the rows line up across a grid row. Whatever does not fit
 * on that line collapses into a "+N" counter carrying the rest in its tooltip.
 *
 * How many chips fit is decided here rather than measured in the browser, so
 * the markup is stable between the server and the client. The constants are the
 * measured geometry of .datasetCardChip at the narrowest the row ever gets
 * (single column, 375px viewport); wider breakpoints only gain slack, so a card
 * shows the same chips everywhere. If an estimate is ever short, the chip's own
 * ellipsis is the fallback.
 */
const ROW_WIDTH = 168; // px available to the chips of one parameter row (narrowest breakpoint)
const CHIP_PADDING = 17; // px of horizontal padding on a chip
const CHAR_WIDTH = 7.2; // px per character at 0.72rem
const CHIP_GAP = 6.4; // px between chips
const MORE_WIDTH = 31; // px taken by the "+N" chip

function chipWidth(text: string): number {
  return CHIP_PADDING + text.length * CHAR_WIDTH;
}

/** Greedily take chips while they fit, leaving room for "+N" if any remain. */
function packChips(values: string[]): { shown: string[]; hidden: string[] } {
  const shown: string[] = [];
  let used = 0;

  for (let i = 0; i < values.length; i += 1) {
    const next = used + (shown.length > 0 ? CHIP_GAP : 0) + chipWidth(values[i]);
    const remaining = values.length - i - 1;
    const budget = remaining > 0 ? ROW_WIDTH - CHIP_GAP - MORE_WIDTH : ROW_WIDTH;

    // Always show at least one chip, even where a long label overruns the row.
    if (next > budget && shown.length > 0) break;
    shown.push(values[i]);
    used = next;
  }

  return { shown, hidden: values.slice(shown.length) };
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function ChipRow({ label, values }: { label: string; values: string[] }) {
  const { shown, hidden } = packChips(values.length > 0 ? values : ["Not specified"]);

  return (
    <div className="datasetCardParamRow">
      <span className="datasetCardParamLabel">{label}</span>
      <div className="datasetCardChips">
        {shown.map((value) => (
          <span key={value} className="datasetCardChip">
            {value}
          </span>
        ))}
        {hidden.length > 0 && (
          <span
            className="datasetCardChip datasetCardChipMore"
            title={hidden.join(", ")}
          >
            +{hidden.length}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Who recorded the data, with the seniority tag their years in the trade
 * imply. The years themselves aren't shown — the tag is the summary.
 */
function RecorderRow({ handle, years }: { handle?: string; years?: number }) {
  return (
    <div className="datasetCardParamRow">
      <span className="datasetCardParamLabel">Recorder</span>
      <span className="datasetCardParamValue datasetCardRecorder">
        <span
          className="datasetCardRecorderHandle"
          title={handle ? `@${handle}` : undefined}
        >
          {handle ? `@${handle}` : "Not specified"}
        </span>
        {typeof years === "number" && (
          <span
            className={`datasetCardTier datasetCardTier-${experienceTier(years)}`}
          >
            {experienceTierLabel(years)}
          </span>
        )}
      </span>
    </div>
  );
}

/** Mean buyer rating and how many ratings stand behind it. */
function RatingRow({ rating, reviews }: { rating?: number; reviews?: number }) {
  const hasRating = typeof rating === "number" && typeof reviews === "number";

  return (
    <div className="datasetCardParamRow">
      <span className="datasetCardParamLabel">Rating</span>
      {hasRating ? (
        <span
          className="datasetCardParamValue"
          aria-label={`${rating.toFixed(1)} out of 5, from ${reviews} ${
            reviews === 1 ? "review" : "reviews"
          }`}
        >
          <span className="datasetCardStar" aria-hidden>
            ★
          </span>
          {rating.toFixed(1)}
          <span className="datasetCardReviewCount" aria-hidden>
            ({reviews})
          </span>
        </span>
      ) : (
        <span className="datasetCardParamValue">No ratings yet</span>
      )}
    </div>
  );
}

function ValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="datasetCardParamRow">
      <span className="datasetCardParamLabel">{label}</span>
      <span className="datasetCardParamValue">{value}</span>
    </div>
  );
}

export default function ListingCard({
  listing,
  index = 0,
}: {
  listing: Listing;
  /** Position in the grid, used only to stagger the card animations. */
  index?: number;
}) {
  const tasks = listing.parameters.tasks ?? [];
  const scene = sceneKeyFor(tasks, listing.category);
  const caption = tasks[0] ?? capabilityLabel(listing.category);
  const { demonstrations } = listing.parameters;

  return (
    <div className="datasetCard">
      <div className="datasetCardArt">
        <TaskPixelScene scene={scene} seed={index} />
        <span className="datasetCardArtLabel">{caption}</span>
      </div>

      <h3 className="datasetCardTitle">{listing.title}</h3>
      <p className="datasetCardSummary">{listing.summary}</p>

      {/* Seven rows, always, so the block is a fixed height on every card. */}
      <div className="datasetCardParams">
        <RecorderRow
          handle={listing.parameters.recorderHandle}
          years={listing.parameters.recorderYears}
        />
        <RatingRow
          rating={listing.parameters.recorderRating}
          reviews={listing.parameters.recorderReviews}
        />
        <ChipRow label="Tasks" values={tasks} />
        <ChipRow label="Modality" values={listing.parameters.sensorModalities} />
        <ValueRow
          label="Demos"
          value={
            typeof demonstrations === "number"
              ? `${demonstrations.toLocaleString("en-US")} episodes`
              : "Not specified"
          }
        />
        <ValueRow label="Hours" value={`${listing.parameters.hours}h`} />
        <ChipRow label="Environment" values={listing.parameters.environmentTags} />
      </div>

      <div className="datasetCardFooter">
        <span className="datasetCardPrice datasetCardPriceBlurred" aria-hidden>
          {formatPrice(listing.askingPriceCents)}
        </span>
        <Link
          href={`/signup?ask=${encodeURIComponent(listing.title)}`}
          className="datasetCardAsk"
        >
          Ask about this →
        </Link>
      </div>
    </div>
  );
}
