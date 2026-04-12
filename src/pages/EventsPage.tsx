import { useState, useEffect, useMemo, useRef } from "react";
import { FaClock, FaMapMarkerAlt, FaCalendarPlus, FaDirections } from "react-icons/fa";
import { getEvents, getInitialEvents, hasFreshCache } from "../lib/content";
import { parseDate, formatDay, formatMonth, formatFullDate, formatTimeRange, mapsUrl, downloadIcs, countdown } from "../lib/events";
import CtaBanner, { CtaAccent } from "../components/CtaBanner";
import SectionHeader from "../components/SectionHeader";
import EventCard from "../components/EventCard";
import type { ArtEvent } from "../types";
import DrawLine from "../components/DrawLine";

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<ArtEvent[]>(getInitialEvents);
  // Skip entrance animation — content is above the fold on navigation
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasFreshCache("events")) return;
    getEvents().then(setAllEvents);
  }, []);

  const now = new Date();
  const toUTC = (d: string | null) => {
    if (!d) return 0;
    const [y, m, dd] = d.split("-").map(Number);
    return Date.UTC(y, m - 1, dd);
  };
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const currentMonth = now.getUTCMonth();
  const currentYear = now.getUTCFullYear();
  const eventEnd = (e: ArtEvent) => toUTC(e.endDate ?? e.startDate);
  const eventsWithDates = allEvents.filter((e) => e.startDate);

  const { featured, thisMonth, comingUp, past } = useMemo(() => {
    const upcoming = eventsWithDates
      .filter((e) => eventEnd(e) >= todayUTC)
      .sort((a, b) => toUTC(a.startDate) - toUTC(b.startDate));

    const pastEvents = eventsWithDates
      .filter((e) => eventEnd(e) < todayUTC)
      .sort((a, b) => toUTC(b.startDate) - toUTC(a.startDate));

    const feat = upcoming.length > 0 ? upcoming[0] : null;
    const rest = upcoming.slice(1);

    const thisMonthEvents: ArtEvent[] = [];
    const comingUpEvents: ArtEvent[] = [];

    for (const e of rest) {
      const d = parseDate(e.startDate);
      if (d.getUTCMonth() === currentMonth && d.getUTCFullYear() === currentYear) {
        thisMonthEvents.push(e);
      } else {
        comingUpEvents.push(e);
      }
    }

    return {
      featured: feat,
      thisMonth: thisMonthEvents,
      comingUp: comingUpEvents,
      past: pastEvents,
    };
  }, [allEvents, todayUTC]);

  return (
    <>
      <title>Events — Mandy Dennis Art</title>
      <div>
        <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[var(--pad-section)]">
          <SectionHeader title="Events" />

          <div ref={bodyRef} className="max-w-[var(--width-narrow)]">
            {allEvents.length === 0 ? (
              <p className="text-text-muted py-8">
                No events scheduled at the moment. Follow Mandy on Facebook for the latest updates.
              </p>
            ) : (
              <>
                {featured && <FeaturedHero event={featured} todayUTC={todayUTC} />}

                {!featured && (
                  <p className="text-text-muted mb-10">
                    No upcoming events at the moment. Check back soon!
                  </p>
                )}

                {thisMonth.length > 0 && (
                  <div className="space-y-3 mb-10">
                    <h2 className="font-display text-lg font-semibold text-text-mid mb-3">This Month</h2>
                    {thisMonth.map((event) => (
                      <EventCard key={event.slug} event={event} isPast={false} />
                    ))}
                  </div>
                )}

                {comingUp.length > 0 && (
                  <div className="space-y-3 mb-10">
                    <h2 className="font-display text-lg font-semibold text-text-mid mb-3">Coming Up</h2>
                    {comingUp.map((event) => (
                      <EventCard key={event.slug} event={event} isPast={false} />
                    ))}
                  </div>
                )}

                <div className="space-y-3 mt-12 pt-10 border-t border-line">
                  <h2 className="font-display text-lg font-semibold text-text-subtle mb-3">Past Events</h2>
                  {past.length > 0 ? (
                    past.map((event) => (
                      <EventCard key={event.slug} event={event} isPast={true} />
                    ))
                  ) : (
                    <p className="text-text-subtle text-[0.85rem] py-4">No past events yet.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <DrawLine />

      <CtaBanner
        heading={<>Want to <CtaAccent>get in touch?</CtaAccent></>}
        text="Have a question about an event, or interested in commissioning a piece?"
        buttonLabel="Get in Touch"
        buttonTo="/commissions"
        secondaryLabel="View Gallery"
        secondaryTo="/gallery"
      />
      <DrawLine />
    </>
  );
}

/** Featured event — same date block as EventCard, larger typography + countdown */
function FeaturedHero({ event, todayUTC }: { event: ArtEvent; todayUTC: number }) {
  const start = parseDate(event.startDate);
  const end = event.endDate ? parseDate(event.endDate) : null;
  const isMultiDay = end && end.getTime() !== start.getTime();
  const timeStr = formatTimeRange(event);
  const maps = mapsUrl(event.location);
  const countdownText = countdown(event.startDate, todayUTC);

  return (
    <div className="border border-line bg-text/[0.03] p-[clamp(1.5rem,4vw,2.5rem)] mb-10 grid grid-cols-[4.5rem_1fr] gap-5 items-start">
      {/* Date block — same style as EventCard but larger */}
      <div className="text-center pt-1">
        <div className="font-display font-bold text-4xl tracking-tight leading-none">
          {formatDay(start)}
        </div>
        <div className="text-[0.65rem] tracking-widest uppercase text-accent font-medium mt-1">
          {formatMonth(start)}
        </div>
        {isMultiDay && (
          <>
            <div className="text-[0.65rem] text-text-subtle my-1">—</div>
            <div className="font-display font-bold text-2xl tracking-tight leading-none">
              {formatDay(end)}
            </div>
            <div className="text-[0.6rem] tracking-widest uppercase text-accent font-medium mt-0.5">
              {formatMonth(end)}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0">
        <span className="inline-block text-[0.6rem] tracking-widest uppercase font-medium px-3 py-1 border border-accent/30 text-accent mb-4">
          {countdownText}
        </span>

        <h2 className="font-display text-[clamp(1.3rem,3.5vw,2rem)] font-bold tracking-tight leading-tight mb-2 line-clamp-2">
          {event.title}
        </h2>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.85rem] text-text-muted mb-4">
          <a
            href={maps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-text transition-colors min-w-0"
          >
            <FaMapMarkerAlt size={12} className="text-text-subtle flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </a>
          {timeStr && (
            <span className="inline-flex items-center gap-1.5 flex-shrink-0">
              <FaClock size={12} className="text-text-subtle" />
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
          <p className="text-[0.95rem] text-text-mid leading-relaxed max-w-[55ch] mb-5 line-clamp-4">
            {event.description}
          </p>
        )}

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mb-5 text-[0.85rem] text-text-mid underline hover:text-text transition-colors min-h-[44px]"
          >
            More info →
          </a>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => downloadIcs(event)}
            className="inline-flex items-center justify-center gap-2 text-[0.72rem] tracking-wide uppercase font-medium text-text-muted hover:text-text border border-line hover:border-line-strong px-4 py-2.5 min-h-[44px] transition-colors cursor-pointer"
          >
            <FaCalendarPlus size={11} />
            Add to calendar
          </button>
          <a
            href={maps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-[0.72rem] tracking-wide uppercase font-medium text-text-muted hover:text-text border border-line hover:border-line-strong px-4 py-2.5 min-h-[44px] transition-colors"
          >
            <FaDirections size={11} />
            Get directions
          </a>
        </div>
      </div>
    </div>
  );
}
