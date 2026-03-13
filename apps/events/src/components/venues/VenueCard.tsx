import Image from 'next/image'
import Link from 'next/link'
import type { Venue, EventType, Media } from '@/payload-types'
import { getEventTypeColor } from '@/lib/event-colors'
import { slugify } from '@/lib/utils'

export function VenueCard({
  venue,
  locale,
}: {
  venue: Venue
  locale: string
}) {
  const image = venue.image as Media | null
  const services = (venue.services || []).filter(
    (s): s is EventType => typeof s !== 'string',
  )

  return (
    <Link
      href={`/${locale}/venues/${slugify(venue.name)}`}
      className="group border-[3px] border-black transition-shadow hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]"
    >
      <div className="relative h-64 overflow-hidden">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || venue.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100">
            <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
              No Image
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-2 text-xl font-black uppercase tracking-[-1px] group-hover:underline">
          {venue.name}
        </h3>
        {venue.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-neutral-600">
            {venue.description}
          </p>
        )}
        <div className="flex items-center gap-2">
          {services.map((s) => (
            <span
              key={s.id}
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getEventTypeColor(s.name) }}
              title={s.name}
            />
          ))}
        </div>
      </div>
    </Link>
  )
}
