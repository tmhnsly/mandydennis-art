import { useState, useEffect } from "react";
import { getEvents } from "../lib/content";
import { useAnimateIn } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import EventCard from "../components/EventCard";
import type { ArtEvent } from "../types";

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<ArtEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const bodyRef = useAnimateIn();

  useEffect(() => {
    getEvents().then((data) => {
      setAllEvents(data);
      setLoading(false);
    });
  }, []);

  const now = new Date();
  const upcoming = allEvents.filter((e) => new Date(e.date) >= now);
  const past = allEvents
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <div className="border-b border-line">
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
          <SectionHeader title="Events" />
          <p className="text-text-muted">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-line">
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
        <SectionHeader title="Events" />

        <div ref={bodyRef} className="animate-in max-w-[700px]">
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
        </div>
      </div>
    </div>
  );
}
