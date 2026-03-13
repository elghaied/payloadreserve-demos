import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { VenueCard } from '@/components/espaces/VenueCard'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'venues' })
  return { title: t('title') }
}

export default async function VenuesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })

  const t = await getTranslations({ locale, namespace: 'venues' })

  const venues = await payload.find({
    collection: 'venues',
    locale: loc,
    depth: 1,
    where: { active: { equals: true } },
  })

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <h1 className="mb-2 text-4xl font-black uppercase tracking-[-1px] md:text-5xl">
        {t('title')}
      </h1>
      <div className="mb-10 h-[3px] w-16 bg-black" />

      <div className="grid gap-8 md:grid-cols-2">
        {venues.docs.map((venue) => (
          <VenueCard key={venue.id} venue={venue} locale={locale} />
        ))}
      </div>

      {venues.docs.length === 0 && (
        <p className="py-20 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
          No venues available
        </p>
      )}
    </section>
  )
}
