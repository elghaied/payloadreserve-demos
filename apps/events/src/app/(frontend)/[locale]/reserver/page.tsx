import { setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { BookingWizard } from '@/components/booking/BookingWizard'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })
  return { title: t('title') }
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ eventType?: string; venue?: string }>
}) {
  const { locale } = await params
  const search = await searchParams
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })

  const [eventTypes, venues, settings] = await Promise.all([
    payload.find({ collection: 'event-types', locale: loc, where: { active: { equals: true } } }),
    payload.find({ collection: 'venues', locale: loc, depth: 1, where: { active: { equals: true } } }),
    payload.findGlobal({ slug: 'site-settings', locale: loc }),
  ])

  return (
    <BookingWizard
      eventTypes={eventTypes.docs}
      venues={venues.docs}
      locale={locale}
      preselectedEventTypeId={search.eventType}
      preselectedVenueId={search.venue}
      cancellationPolicy={settings.cancellationPolicy || ''}
    />
  )
}
