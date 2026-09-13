import Link from "next/link";
import type { Listing, ListingParameters } from "../../lib/listings";
import { sceneKeyFor } from "../../lib/pixel-scenes";
import {
  capabilityLabel,
  experienceTier,
  experienceTierLabel,
  humanize,
  signalLabel,
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

/** 3,300,000 → "3.3M". Frame counts run to seven figures; the strip has ~40px. */
function compactCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  return n.toLocaleString("en-US");
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

/**
 * The counts EgoVerse leads with on an episode — episodes, frames, duration —
 * on one mono line above the chip rows. They're numbers rather than tags, so
 * putting them in the chip block would cost three of its seven rows and read
 * as a category list.
 *
 * Anything unset is dropped rather than shown as "—": the strip is one line
 * either way, so a gap costs nothing and a placeholder is noise. The licence
 * is deliberately not here — at card width it is what the ellipsis eats, and
 * it matters too much to lose, so it sits in the footer beside the price.
 */
function StatStrip({ parameters }: { parameters: ListingParameters }) {
  const { episodes, frames, hours, isEval, evalSuccessRate } = parameters;

  const stats: string[] = [];
  if (typeof episodes === "number") {
    stats.push(`${compactCount(episodes)} ${episodes === 1 ? "episode" : "episodes"}`);
  }
  if (typeof frames === "number") stats.push(`${compactCount(frames)} frames`);
  if (hours > 0) stats.push(`${hours}h`);

  if (stats.length === 0 && !isEval) return <div className="datasetCardStats" />;

  return (
    <div className="datasetCardStats">
      {isEval && (
        <span
          className="datasetCardEvalBadge"
          title={
            typeof evalSuccessRate === "number"
              ? `${Math.round(evalSuccessRate * 100)}% eval success`
              : "Evaluation set"
          }
        >
          Eval
          {typeof evalSuccessRate === "number" &&
            ` ${Math.round(evalSuccessRate * 100)}%`}
        </span>
      )}
      {stats.map((stat, i) => (
        <span key={stat}>
          {i > 0 && <span aria-hidden> · </span>}
          {stat}
        </span>
      ))}
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

  return (
    <div className="datasetCard">
      <div className="datasetCardArt">
        <TaskPixelScene scene={scene} seed={index} />
        <span className="datasetCardArtLabel">{caption}</span>
      </div>

      <h3 className="datasetCardTitle">{listing.title}</h3>
      <p className="datasetCardSummary">{listing.summary}</p>

      <StatStrip parameters={listing.parameters} />

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
        <ChipRow label="Scenes" values={listing.parameters.scenes} />
        <ChipRow label="Objects" values={listing.parameters.objects} />
        <ChipRow
          label="Signals"
          values={listing.parameters.signals.map(signalLabel)}
        />
        <ChipRow
          label="Embodiment"
          values={listing.parameters.embodiments.map(humanize)}
        />
      </div>

      <div className="datasetCardFooter">
        <span className="datasetCardPrice datasetCardPriceBlurred" aria-hidden>
          {formatPrice(listing.askingPriceCents)}
        </span>
        {listing.parameters.license && (
          <span className="datasetCardLicense">{listing.parameters.license}</span>
        )}
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
