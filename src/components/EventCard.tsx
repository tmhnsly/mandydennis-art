import { FaClock, FaMapMarkerAlt, FaCalendarPlus, FaDirections } from "react-icons/fa";
import { parseDate, formatDay, formatMonth, formatFullDate, formatTimeRange, mapsUrl, downloadIcs } from "../lib/events";
import type { ArtEvent } from "../types";

interface Props {
  event: ArtEvent;
  isPast: boolean;
  /** Compact mode for homepage teaser — hides description & action buttons */
  compact?: boolean;
}

export default function EventCard({ event, isPast, compact }: Props) {
  const start = parseDate(event.startDate);
  const end = event.endDate ? parseDate(event.endDate) : null;
  const isMultiDay = end && end.getTime() !== start.getTime();
  const timeStr = formatTimeRange(event);
  const maps = mapsUrl(event.location);

  return (
    <div
      className={`border border-line bg-text/[0.03] p-4 sm:p-5 grid grid-cols-[3.5rem_1fr] sm:grid-cols-[4rem_1fr] gap-3 sm:gap-4 items-start transition-colors hover:border-line-strong ${
        isPast ? "opacity-50" : ""
      }`}
    >
      {/* Date block */}
      <div className="text-center pt-0.5">
        <div className="font-display font-bold text-2xl tracking-tight leading-none">
          {formatDay(start)}
        </div>
        <div className="text-[0.6rem] tracking-widest uppercase text-accent font-medium mt-0.5">
          {formatMonth(start)}
        </div>
        {isMultiDay && (
          <>
            <div className="text-[0.6rem] text-text-subtle my-0.5">—</div>
            <div className="font-display font-bold text-lg tracking-tight leading-none">
              {formatDay(end)}
            </div>
            <div className="text-[0.55rem] tracking-widest uppercase text-accent font-medium mt-0.5">
              {formatMonth(end)}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0">
        <h3 className="font-display font-semibold text-[0.95rem] tracking-tight mb-1 truncate">
          {event.title}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.78rem] text-text-muted mb-2">
          <a
            href={maps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-text transition-colors min-w-0"
          >
            <FaMapMarkerAlt size={11} className="text-text-subtle flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </a>
          {timeStr && (
            <span className="inline-flex items-center gap-1.5 flex-shrink-0">
              <FaClock size={11} className="text-text-subtle" />
              {timeStr}
            </span>
          )}
          {isMultiDay && (
            <span className="text-text-subtle truncate">
              {formatFullDate(start)} – {formatFullDate(end)}
            </span>
          )}
        </div>

        {event.description && (
          <p className="text-[0.85rem] text-text-mid leading-relaxed line-clamp-3">
            {event.description}
          </p>
        )}
        {!compact && event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-[0.8rem] text-text-mid underline hover:text-text transition-colors min-h-[44px]"
          >
            More info →
          </a>
        )}

        {/* Action buttons — always side by side */}
        {!compact && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => downloadIcs(event)}
              className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-wide uppercase font-medium text-text-muted hover:text-text border border-line hover:border-line-strong px-2.5 py-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <FaCalendarPlus size={10} />
              Calendar
            </button>
            <a
              href={maps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-wide uppercase font-medium text-text-muted hover:text-text border border-line hover:border-line-strong px-2.5 py-2 transition-colors whitespace-nowrap"
            >
              <FaDirections size={10} />
              Directions
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
