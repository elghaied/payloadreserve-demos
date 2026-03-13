import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { EventFilters } from '@/components/events/EventFilters'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'programme' })

  return {
    title: t('title'),
  }
}

export default async function ProgrammePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const t = await getTranslations({ locale, namespace: 'programme' })
  const payload = await getPayload({ config })

  const [announcements, eventTypes, venues] = await Promise.all([
    payload.find({
      collection: 'announcements',
      locale: loc,
      depth: 2,
      where: { active: { equals: true } },
      limit: 100,
      sort: 'startDate',
    }),
    payload.find({
      collection: 'event-types',
      locale: loc,
      where: { active: { equals: true } },
    }),
    payload.find({
      collection: 'venues',
      locale: loc,
      where: { active: { equals: true } },
    }),
  ])

  return (
    <section className="border-t-[3px] border-black px-6 py-16 lg:px-12 lg:py-24">
      <h1 className="mb-10 text-4xl font-black uppercase tracking-[-1px] md:text-5xl">
        {t('title')}
      </h1>
      <EventFilters
        announcements={announcements.docs}
        eventTypes={eventTypes.docs}
        venues={venues.docs}
        locale={locale}
      />
    </section>
  )
}
