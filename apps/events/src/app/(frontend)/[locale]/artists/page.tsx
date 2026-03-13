import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ArtistCard } from '@/components/artists/ArtistCard'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'artists' })
  return { title: t('title') }
}

export default async function ArtistsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })

  const t = await getTranslations({ locale, namespace: 'artists' })

  const artists = await payload.find({
    collection: 'artists',
    locale: loc,
    limit: 50,
    sort: '-featured',
  })

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <h1 className="mb-2 text-4xl font-black uppercase tracking-[-1px] md:text-5xl">
        {t('title')}
      </h1>
      <div className="mb-10 h-[3px] w-16 bg-black" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {artists.docs.map((artist) => {
          const specialtyKey = artist.specialty as string | undefined
          const specialtyLabel = specialtyKey
            ? t(`specialties.${specialtyKey}`)
            : undefined

          return (
            <ArtistCard
              key={artist.id}
              artist={artist}
              featured={artist.featured ?? false}
              specialtyLabel={specialtyLabel}
              websiteLabel={t('website')}
            />
          )
        })}
      </div>

      {artists.docs.length === 0 && (
        <p className="py-20 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
          No artists available
        </p>
      )}
    </section>
  )
}
