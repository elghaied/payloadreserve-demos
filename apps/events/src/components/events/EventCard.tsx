import Image from 'next/image'
import Link from 'next/link'
import type { Announcement, EventType, Venue, Media } from '@/payload-types'
import { getEventTypeColor } from '@/lib/event-colors'
import { toBcp47 } from '@/lib/utils'

export function EventCard({
  announcement,
  locale,
  bookLabel,
}: {
  announcement: Announcement
  locale: string
  bookLabel: string
}) {
  const eventType = announcement.eventType as EventType | null
  const venue = announcement.venue as Venue | null
  const image = announcement.image as Media | null
  const color = eventType ? getEventTypeColor(eventType.name) : '#666666'

  return (
    <div className="group border-[3px] border-black transition-shadow hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
      <div style={{ borderTop: `4px solid ${color}` }}>
        {image?.url ? (
          <div className="relative h-52 overflow-hidden">
            <Image
              src={image.url}
              alt={image.alt || announcement.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex h-52 items-center justify-center bg-neutral-100">
            <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
              No Image
            </span>
          </div>
        )}
        <div className="p-5">
          {eventType && (
            <span
              className="mb-3 inline-block px-2 py-0.5 font-mono text-[9px] uppercase tracking-[2px] text-white"
              style={{ backgroundColor: color }}
            >
              {eventType.name}
            </span>
          )}
          <h3 className="mb-2 text-lg font-bold leading-tight">{announcement.title}</h3>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
            {new Date(announcement.startDate).toLocaleDateString(toBcp47(locale), {
              month: 'short',
              day: 'numeric',
            })}
            {announcement.endDate &&
              ` — ${new Date(announcement.endDate).toLocaleDateString(toBcp47(locale), {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}`}
          </p>
          {venue && (
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {venue.name}
            </p>
          )}
          <div className="flex items-center justify-between">
            {eventType?.price != null && (
              <span className="font-mono text-sm font-bold">
                {eventType.price}€
              </span>
            )}
            {announcement.slug && (
              <Link
                href={`/${locale}/events/${announcement.slug}`}
                className="bg-black px-5 py-2.5 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800"
              >
                {bookLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
