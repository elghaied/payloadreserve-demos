import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import type { Announcement, EventType, Venue, Artist, Media } from '@/payload-types'
import { getEventTypeColor, getSpecialtyColor } from '@/lib/event-colors'

const SPECIALTY_MAP: Record<string, string> = {
  'Concert': 'musician',
  'Theater': 'actor',
  'Theatre': 'actor',
  'Exhibition': 'visual-artist',
  'Exposition': 'visual-artist',
  'Film Screening': 'filmmaker',
  'Projection': 'filmmaker',
  'Workshop': 'speaker',
  'Atelier': 'speaker',
  'Dance Performance': 'dancer',
  'Spectacle de danse': 'dancer',
}

function getSpecialtyForEventType(eventTypeName: string): string | null {
  return SPECIALTY_MAP[eventTypeName] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'announcements',
    locale: locale as 'en' | 'fr',
    depth: 1,
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const event = result.docs[0]
  if (!event) return { title: 'Event Not Found' }

  return {
    title: event.title,
    description: event.description ?? undefined,
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const t = await getTranslations({ locale, namespace: 'eventDetail' })
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'announcements',
    locale: loc,
    depth: 2,
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!result.docs[0]) notFound()
  const event = result.docs[0]

  const eventType = event.eventType as EventType | null
  const venue = event.venue as Venue | null
  const image = event.image as Media | null
  const color = eventType ? getEventTypeColor(eventType.name) : '#666666'

  // Fetch related artists by matching specialty to event type
  let artists: Artist[] = []
  if (eventType) {
    const specialty = getSpecialtyForEventType(eventType.name)
    if (specialty) {
      const artistResult = await payload.find({
        collection: 'artists',
        locale: loc,
        where: { specialty: { equals: specialty } },
        limit: 10,
      })
      artists = artistResult.docs
    }
  }

  // Build booking link
  const bookingParams = new URLSearchParams()
  if (eventType) bookingParams.set('eventType', eventType.id)
  if (venue) bookingParams.set('venue', venue.id)
  const bookingLink = `/${locale}/reserver?${bookingParams.toString()}`

  return (
    <>
      {/* Hero image */}
      {image?.url && (
        <div className="relative h-[40vh] w-full border-b-[3px] border-black md:h-[50vh]">
          <Image
            src={image.url}
            alt={image.alt || event.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 lg:p-12">
            <h1 className="text-3xl font-black uppercase tracking-[-1px] text-white md:text-5xl">
              {event.title}
            </h1>
          </div>
        </div>
      )}

      {/* Title fallback if no image */}
      {!image?.url && (
        <section className="border-b-[3px] border-black px-6 py-12 lg:px-12">
          <h1 className="text-3xl font-black uppercase tracking-[-1px] md:text-5xl">
            {event.title}
          </h1>
        </section>
      )}

      {/* Info bar */}
      <div className="flex flex-wrap items-center gap-4 border-b-[3px] border-black px-6 py-4 lg:px-12">
        {eventType && (
          <span
            className="inline-block px-3 py-1 font-mono text-[10px] uppercase tracking-[2px] text-white"
            style={{ backgroundColor: color }}
          >
            {eventType.name}
          </span>
        )}
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-600">
          {t('date')}:{' '}
          {new Date(event.startDate).toLocaleDateString(locale, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
          {event.endDate &&
            ` — ${new Date(event.endDate).toLocaleDateString(locale, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}`}
        </span>
        {venue && (
          <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-600">
            {venue.name}
          </span>
        )}
        {eventType?.price != null && (
          <span className="ml-auto font-mono text-lg font-bold">
            {eventType.price}€
          </span>
        )}
      </div>

      <div className="px-6 py-12 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Description */}
            {event.description && (
              <div className="mb-12">
                <h2 className="mb-4 text-2xl font-black uppercase tracking-[-1px]">
                  {t('aboutEvent')}
                </h2>
                <p className="max-w-prose leading-relaxed text-neutral-700">
                  {event.description}
                </p>
              </div>
            )}

            {/* Event details */}
            <div className="mb-12 border-[3px] border-black p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {eventType && (
                  <div>
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                      {t('duration')}
                    </p>
                    <p className="font-bold">
                      {eventType.duration} {t('minutes')}
                    </p>
                  </div>
                )}
                {eventType?.price != null && (
                  <div>
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                      {t('price')}
                    </p>
                    <p className="font-bold">{eventType.price}€</p>
                  </div>
                )}
                <div>
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                    {t('date')}
                  </p>
                  <p className="font-bold">
                    {new Date(event.startDate).toLocaleDateString(locale, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {event.endDate &&
                      ` — ${new Date(event.endDate).toLocaleDateString(locale, {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}`}
                  </p>
                </div>
                {venue && (
                  <div>
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                      {t('venue')}
                    </p>
                    <p className="font-bold">{venue.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Artists section */}
            {artists.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-6 text-2xl font-black uppercase tracking-[-1px]">
                  {t('relatedArtists')}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {artists.map((artist) => {
                    const photo = artist.photo as Media | null
                    const specialtyColor = artist.specialty
                      ? getSpecialtyColor(artist.specialty)
                      : '#666666'

                    return (
                      <div key={artist.id}>
                        <div className="relative mb-3 aspect-square border-[3px] border-black">
                          {photo?.url ? (
                            <Image
                              src={photo.url}
                              alt={photo.alt || artist.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-neutral-100">
                              <span className="font-mono text-[9px] uppercase tracking-[2px] text-neutral-400">
                                No Photo
                              </span>
                            </div>
                          )}
                        </div>
                        <h3 className="mb-1 text-sm font-bold">{artist.name}</h3>
                        {artist.specialty && (
                          <span
                            className="inline-block px-2 py-0.5 font-mono text-[8px] uppercase tracking-[2px] text-white"
                            style={{ backgroundColor: specialtyColor }}
                          >
                            {artist.specialty.replace('-', ' ')}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Venue card */}
            {venue && (
              <div className="mb-6 border-[3px] border-black">
                {(() => {
                  const venueImage = venue.image as Media | null
                  return venueImage?.url ? (
                    <div className="relative h-40">
                      <Image
                        src={venueImage.url}
                        alt={venueImage.alt || venue.name}
                        fill
                        className="object-cover"
                        sizes="400px"
                      />
                    </div>
                  ) : null
                })()}
                <div className="p-5">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                    {t('venue')}
                  </p>
                  <h3 className="mb-2 text-lg font-bold">{venue.name}</h3>
                  {venue.description && (
                    <p className="mb-3 text-sm leading-relaxed text-neutral-600">
                      {venue.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Book button (desktop sidebar) */}
            <Link
              href={bookingLink}
              className="hidden w-full border-[3px] border-black bg-black py-4 text-center font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800 lg:block"
            >
              {t('bookThisEvent')}
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar (mobile/tablet) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t-[3px] border-black bg-white px-6 py-3 lg:hidden">
        <div>
          <p className="text-sm font-bold">{event.title}</p>
          {eventType?.price != null && (
            <p className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {eventType.price}€
            </p>
          )}
        </div>
        <Link
          href={bookingLink}
          className="bg-black px-5 py-2.5 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800"
        >
          {t('bookThisEvent')}
        </Link>
      </div>

      {/* Spacer for sticky bottom bar on mobile */}
      <div className="h-16 lg:hidden" />
    </>
  )
}
