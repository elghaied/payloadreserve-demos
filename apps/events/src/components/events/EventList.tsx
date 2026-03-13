import Link from 'next/link'
import type { Announcement, EventType, Venue } from '@/payload-types'
import { getEventTypeColor } from '@/lib/event-colors'

export function EventList({
  announcements,
  locale,
  bookLabel,
}: {
  announcements: Announcement[]
  locale: string
  bookLabel: string
}) {
  return (
    <div className="border-[3px] border-black">
      {announcements.map((ann, i) => {
        const eventType = ann.eventType as EventType | null
        const venue = ann.venue as Venue | null
        const color = eventType ? getEventTypeColor(eventType.name) : '#666666'

        return (
          <div
            key={ann.id}
            className={`flex flex-col items-start gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-5 ${
              i > 0 ? 'border-t-[2px] border-black' : ''
            }`}
          >
            {/* Date */}
            <span className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[1px] text-neutral-600">
              {new Date(ann.startDate).toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
              })}
            </span>

            {/* Color dot */}
            <span
              className="hidden h-3 w-3 shrink-0 rounded-full sm:block"
              style={{ backgroundColor: color }}
            />

            {/* Title */}
            <span className="min-w-0 flex-1 truncate font-bold">
              {ann.title}
            </span>

            {/* Venue */}
            {venue && (
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                {venue.name}
              </span>
            )}

            {/* Price */}
            {eventType?.price != null && (
              <span className="shrink-0 font-mono text-sm font-bold">
                {eventType.price}€
              </span>
            )}

            {/* Book link */}
            {ann.slug && (
              <Link
                href={`/${locale}/events/${ann.slug}`}
                className="shrink-0 font-mono text-[10px] uppercase tracking-[2px] underline underline-offset-4 transition-colors hover:text-neutral-600"
              >
                {bookLabel} →
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}
