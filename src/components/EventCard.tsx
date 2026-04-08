import type { ArtEvent } from "../types";

interface Props {
  event: ArtEvent;
  isPast: boolean;
}

export default function EventCard({ event, isPast }: Props) {
  const [year, month, dayNum] = event.date.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, dayNum));
  const day = date.getUTCDate();
  const monthStr = date.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });

  return (
    <div
      className={`border border-line p-5 grid grid-cols-[3.5rem_1fr_auto] gap-4 items-start transition-colors hover:border-line-strong ${
        isPast ? "opacity-50" : ""
      }`}
    >
      <div className="text-center">
        <div className="font-display font-bold text-2xl tracking-tight leading-none">
          {day}
        </div>
        <div className="text-[0.58rem] tracking-widest uppercase text-text-subtle font-medium mt-0.5">
          {monthStr}
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-[0.95rem] tracking-tight mb-0.5">
          {event.title}
        </h3>
        <p className="text-[0.8rem] text-text-muted">{event.location}</p>
        {event.description && (
          <p className="text-[0.85rem] text-text-mid leading-relaxed mt-1.5">
            {event.description}
          </p>
        )}
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-[0.8rem] text-text-mid underline hover:text-text transition-colors"
          >
            More info
          </a>
        )}
      </div>

      <span className="text-[0.58rem] tracking-widest uppercase text-text-subtle font-medium px-2 py-1 border border-line self-center whitespace-nowrap">
        {isPast ? "Past" : "Upcoming"}
      </span>
    </div>
  );
}
