import { notFound } from 'next/navigation'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { slugify } from '@/lib/utils'
import { getEventTypeColor } from '@/lib/event-colors'
import { VenueSchedule } from '@/components/venues/VenueSchedule'
import { EventCard } from '@/components/events/EventCard'
import type { EventType, Media, Schedule } from '@/payload-types'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const payload = await getPayload({ config })
  const loc = locale as 'en' | 'fr'

  const venues = await payload.find({
    collection: 'venues',
    locale: loc,
    depth: 1,
    where: { active: { equals: true } },
  })
  const venue = venues.docs.find((v) => slugify(v.name) === slug)

  if (!venue) return { title: 'Not Found' }
  return { title: venue.name }
}

export default async function VenueDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })

  const t = await getTranslations({ locale, namespace: 'venues' })
  const tDays = await getTranslations({ locale, namespace: 'days' })
  const tProgramme = await getTranslations({ locale, namespace: 'programme' })

  // Find venue by slugified name
  const venues = await payload.find({
    collection: 'venues',
    locale: loc,
    depth: 1,
    where: { active: { equals: true } },
  })
  const venue = venues.docs.find((v) => slugify(v.name) === slug)
  if (!venue) notFound()

  const image = venue.image as Media | null
  const services = (venue.services || []).filter(
    (s): s is EventType => typeof s !== 'string',
  )

  // Fetch schedule for this venue
  const schedules = await payload.find({
    collection: 'schedules',
    where: { resource: { equals: venue.id } },
  })
  const schedule = schedules.docs[0] as Schedule | undefined

  // Fetch upcoming announcements at this venue
  const upcoming = await payload.find({
    collection: 'announcements',
    locale: loc,
    depth: 1,
    where: {
      venue: { equals: venue.id },
      active: { equals: true },
    },
    sort: 'startDate',
    limit: 5,
  })

  const dayLabels: Record<string, string> = {
    mon: tDays('mon'),
    tue: tDays('tue'),
    wed: tDays('wed'),
    thu: tDays('thu'),
    fri: tDays('fri'),
    sat: tDays('sat'),
    sun: tDays('sun'),
  }

  return (
    <article>
      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[300px] w-full border-b-[3px] border-black md:h-[50vh]">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || venue.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100">
            <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* Info Grid */}
      <div className="px-6 py-12 lg:px-12 lg:py-16">
        <h1 className="mb-4 text-4xl font-black uppercase tracking-[-1px] md:text-5xl">
          {venue.name}
        </h1>

        {/* Event Types */}
        {services.length > 0 && (
          <div className="mb-6">
            <span className="mb-3 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {t('eventTypes')}
            </span>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <span
                  key={s.id}
                  className="inline-block px-3 py-1 font-mono text-[9px] uppercase tracking-[2px] text-white"
                  style={{ backgroundColor: getEventTypeColor(s.name) }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Capacity */}
        <div className="mb-6">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
            {t('capacity')}
          </span>
          <span className="font-mono text-sm font-bold">{venue.quantity}</span>
        </div>

        {/* Description */}
        {venue.description && (
          <div className="mb-12 max-w-2xl">
            <p className="text-base leading-relaxed text-neutral-700">
              {venue.description}
            </p>
          </div>
        )}

        {/* Schedule */}
        {schedule && (
          <div className="mb-12 max-w-md">
            <h2 className="mb-4 text-2xl font-black uppercase tracking-[-1px]">
              {t('schedule')}
            </h2>
            <VenueSchedule
              schedule={schedule}
              dayLabels={dayLabels}
              closedLabel={t('closed')}
            />
          </div>
        )}

        {/* Upcoming Events */}
        {upcoming.docs.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-black uppercase tracking-[-1px]">
              {t('upcomingEvents')}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.docs.map((announcement) => (
                <EventCard
                  key={announcement.id}
                  announcement={announcement}
                  locale={locale}
                  bookLabel={tProgramme('book')}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
