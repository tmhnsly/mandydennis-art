import { useState, useEffect } from "react";
import { getEvents, getInitialEvents } from "../lib/content";
import { useAnimateIn } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import EventCard from "../components/EventCard";
import type { ArtEvent } from "../types";
import DrawLine from "../components/DrawLine";

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<ArtEvent[]>(getInitialEvents);
  const { ref: bodyRef, isInView } = useAnimateIn();

  useEffect(() => { document.title = "Events — Mandy Dennis Art"; }, []);
  useEffect(() => { getEvents().then(setAllEvents); }, []);

  const now = new Date();
  const toUTC = (d: string | null) => {
    if (!d) return 0;
    const [y, m, dd] = d.split("-").map(Number);
    return Date.UTC(y, m - 1, dd);
  };
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const eventEnd = (e: ArtEvent) => toUTC(e.endDate ?? e.startDate);
  const eventsWithDates = allEvents.filter((e) => e.startDate);
  const upcoming = eventsWithDates.filter((e) => eventEnd(e) >= todayUTC);
  const past = eventsWithDates
    .filter((e) => eventEnd(e) < todayUTC)
    .sort((a, b) => toUTC(b.startDate) - toUTC(a.startDate));

  return (
    <>
      <div>
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
          <SectionHeader title="Events" />

          <div ref={bodyRef} className={`anim-fade-up ${isInView ? "in-view" : ""} max-w-[700px]`}>
            {allEvents.length === 0 ? (
              <p className="text-text-muted py-8">
                No events scheduled at the moment. Follow Mandy on Facebook for the latest updates.
              </p>
            ) : (
              <>
                {upcoming.length > 0 ? (
                  <div className="space-y-3 mb-10">
                    <h2 className="font-display text-lg font-semibold text-text-mid mb-3">Upcoming</h2>
                    {upcoming.map((event) => (
                      <EventCard key={event.slug} event={event} isPast={false} />
                    ))}
                  </div>
                ) : (
                  <p className="text-text-muted mb-10">
                    No upcoming events at the moment. Check back soon!
                  </p>
                )}

                {past.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="font-display text-lg font-semibold text-text-subtle mb-3">Past Events</h2>
                    {past.map((event) => (
                      <EventCard key={event.slug} event={event} isPast={true} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <DrawLine />
    </>
  );
}
