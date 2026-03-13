import Image from 'next/image'
import Link from 'next/link'
import type { Homepage, Venue, EventType, Media } from '@/payload-types'
import { getEventTypeColor } from '@/lib/event-colors'
import { slugify } from '@/lib/utils'

export function VenuesSection({
  homepage,
  venues,
  locale,
}: {
  homepage: Homepage
  venues: Venue[]
  locale: string
}) {
  return (
    <section className="border-t-[3px] border-black px-6 py-16 lg:px-12 lg:py-24">
      {homepage.venuesHeading && (
        <h2 className="mb-2 text-3xl font-black uppercase tracking-[-1px] md:text-4xl">
          {homepage.venuesHeading}
        </h2>
      )}
      {homepage.venuesSubtitle && (
        <p className="mb-10 text-muted-text">{homepage.venuesSubtitle}</p>
      )}
      <div className="flex flex-col gap-8">
        {venues.map((venue, idx) => {
          const image = venue.image as Media | null
          const services = (venue.services || []).filter(
            (s): s is EventType => typeof s !== 'string',
          )
          const isReversed = idx % 2 === 1

          return (
            <Link
              key={venue.id}
              href={`/${locale}/espaces/${slugify(venue.name)}`}
              className={`group grid gap-0 border-[3px] border-black md:grid-cols-2 ${isReversed ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              <div className="relative min-h-[250px]">
                {image?.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt || venue.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
              <div className="flex flex-col justify-center p-6 lg:p-10">
                <h3 className="mb-3 text-2xl font-black uppercase tracking-[-1px] group-hover:underline">
                  {venue.name}
                </h3>
                {venue.description && (
                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-text">
                    {venue.description}
                  </p>
                )}
                <div className="flex gap-2">
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
        })}
      </div>
    </section>
  )
}
