import { useState, useEffect } from "react";
import { getEvents } from "../lib/content";
import EventCard from "../components/EventCard";
import type { ArtEvent } from "../types";

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<ArtEvent[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="px-6 py-8 md:px-12 md:py-12 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl text-warm-800 mb-8">Events</h1>
        <p className="text-warm-500">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl text-warm-800 mb-8">
        Events
      </h1>

      {upcoming.length > 0 ? (
        <section className="space-y-4 mb-12">
          <h2 className="font-display text-xl text-warm-700">Upcoming</h2>
          {upcoming.map((event) => (
            <EventCard key={event.slug} event={event} isPast={false} />
          ))}
        </section>
      ) : (
        <p className="text-warm-500 mb-12">
          No upcoming events at the moment. Check back soon!
        </p>
      )}

      {past.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl text-warm-400">Past Events</h2>
          {past.map((event) => (
            <EventCard key={event.slug} event={event} isPast={true} />
          ))}
        </section>
      )}
    </div>
  );
}
