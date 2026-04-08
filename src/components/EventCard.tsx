import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import type { ArtEvent } from "../types";

interface Props {
  event: ArtEvent;
  isPast: boolean;
}

function parseDate(d: string) {
  const [y, m, dd] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, dd));
}

function formatDay(d: Date) {
  return d.getUTCDate();
}

function formatMonth(d: Date) {
  return d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
}

function formatFullDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "UTC" });
}

export default function EventCard({ event, isPast }: Props) {
  const start = parseDate(event.startDate);
  const end = event.endDate ? parseDate(event.endDate) : null;
  const isMultiDay = end && end.getTime() !== start.getTime();

  const timeStr = event.startTime
    ? event.endTime
      ? `${event.startTime} – ${event.endTime}`
      : `From ${event.startTime}`
    : null;

  return (
    <div
      className={`border border-line p-5 grid grid-cols-[4rem_1fr_auto] gap-4 items-start transition-colors hover:border-line-strong ${
        isPast ? "opacity-50" : ""
      }`}
    >
      {/* Date block */}
      <div className="text-center">
        <div className="font-display font-bold text-2xl tracking-tight leading-none">
          {formatDay(start)}
        </div>
        <div className="text-[0.6rem] tracking-widest uppercase text-text-subtle font-medium mt-0.5">
          {formatMonth(start)}
        </div>
        {isMultiDay && (
          <>
            <div className="text-[0.6rem] text-text-subtle my-0.5">—</div>
            <div className="font-display font-bold text-lg tracking-tight leading-none">
              {formatDay(end)}
            </div>
            <div className="text-[0.55rem] tracking-widest uppercase text-text-subtle font-medium mt-0.5">
              {formatMonth(end)}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="font-display font-semibold text-[0.95rem] tracking-tight mb-1">
          {event.title}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.78rem] text-text-muted mb-2">
          <span className="inline-flex items-center gap-1.5">
            <FaMapMarkerAlt size={11} className="text-text-subtle" />
            {event.location}
          </span>
          {timeStr && (
            <span className="inline-flex items-center gap-1.5">
              <FaClock size={11} className="text-text-subtle" />
              {timeStr}
            </span>
          )}
          {isMultiDay && (
            <span className="text-text-subtle">
              {formatFullDate(start)} – {formatFullDate(end)}
            </span>
          )}
        </div>

        {event.description && (
          <p className="text-[0.85rem] text-text-mid leading-relaxed">
            {event.description}
          </p>
        )}
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-[0.8rem] text-text-mid underline hover:text-text transition-colors min-h-11 flex items-center"
          >
            More info →
          </a>
        )}
      </div>

      {/* Status badge */}
      <span className={`text-[0.58rem] tracking-widest uppercase font-medium px-2.5 py-1 border self-center whitespace-nowrap ${
        isPast ? "border-line text-text-subtle" : "border-accent/30 text-accent"
      }`}>
        {isPast ? "Past" : "Upcoming"}
      </span>
    </div>
  );
}
