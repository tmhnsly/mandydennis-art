import { useState, useEffect } from "react";
import { getEvents } from "../lib/content";
import { motion } from "motion/react";
import { useAnimateIn } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import EventCard from "../components/EventCard";
import type { ArtEvent } from "../types";
import DrawLine from "../components/DrawLine";

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<ArtEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: bodyRef, isInView } = useAnimateIn();

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
      <>
        <div>
          <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
            <SectionHeader title="Events" />
            <p className="text-text-muted">Loading events...</p>
          </div>
        </div>
        <DrawLine />
      </>
    );
  }

  return (
    <>
      <div>
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
          <SectionHeader title="Events" />

          <motion.div ref={bodyRef} initial={{ opacity: 0, y: 8 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.3 }} className="max-w-[700px]">
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
          </motion.div>
        </div>
      </div>
      <DrawLine />
    </>
  );
}
