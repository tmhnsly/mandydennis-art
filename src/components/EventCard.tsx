import type { ArtEvent } from "../types";

interface Props {
  event: ArtEvent;
  isPast: boolean;
}

export default function EventCard({ event, isPast }: Props) {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${isPast ? "opacity-60" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <h3 className="font-display text-lg text-warm-800">{event.title}</h3>
        {isPast && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-warm-200 text-warm-500 self-start">
            Past
          </span>
        )}
      </div>
      <p className="text-sm text-warm-600 mb-1">{formattedDate}</p>
      <p className="text-sm text-warm-500 mb-3">{event.location}</p>
      {event.description && (
        <p className="text-sm text-warm-700">{event.description}</p>
      )}
      {event.link && (
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-sm text-warm-600 underline hover:text-warm-800 transition-colors"
        >
          More info
        </a>
      )}
    </div>
  );
}
