import Image from 'next/image'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'season' })
  return { title: t('title') }
}

export default async function SeasonPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })

  const t = await getTranslations({ locale, namespace: 'season' })

  const now = new Date().toISOString()

  const seasons = await payload.find({
    collection: 'seasons',
    locale: loc,
    sort: 'startDate',
    limit: 10,
  })

  // Find current season (startDate <= now <= endDate)
  const currentSeason = seasons.docs.find(
    (s) => s.startDate <= now && s.endDate >= now,
  )
  const upcomingSeasons = seasons.docs.filter((s) => s.startDate > now)

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric',
    })} — ${endDate.toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric',
    })}`
  }

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <h1 className="mb-2 text-4xl font-black uppercase tracking-[-1px] md:text-5xl">
        {t('title')}
      </h1>
      <div className="mb-10 h-[3px] w-16 bg-black" />

      {/* Current Season Hero */}
      {currentSeason && (
        <div className="mb-16">
          <span className="mb-4 inline-block bg-black px-3 py-1 font-mono text-[10px] uppercase tracking-[2px] text-white">
            {t('current')}
          </span>
          <div className="border-[3px] border-black">
            {(() => {
              const image = currentSeason.featuredImage as Media | null
              return image?.url ? (
                <div className="relative h-[40vh] min-h-[300px] w-full">
                  <Image
                    src={image.url}
                    alt={image.alt || currentSeason.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                </div>
              ) : null
            })()}
            <div className="p-8 lg:p-12">
              <h2 className="mb-2 text-3xl font-black uppercase tracking-[-1px] md:text-4xl">
                {currentSeason.name}
              </h2>
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                {formatDateRange(currentSeason.startDate, currentSeason.endDate)}
              </p>
              {currentSeason.description && (
                <p className="mb-8 max-w-2xl text-base leading-relaxed text-neutral-700">
                  {currentSeason.description}
                </p>
              )}
              <Link
                href={`/${locale}/programme`}
                className="inline-block bg-black px-5 py-2.5 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800"
              >
                {t('exploreEvents')}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* No Current Season */}
      {!currentSeason && upcomingSeasons.length === 0 && (
        <p className="py-20 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
          No season information available
        </p>
      )}

      {/* Upcoming Seasons */}
      {upcomingSeasons.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-black uppercase tracking-[-1px]">
            {t('upcoming')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {upcomingSeasons.map((season) => {
              const image = season.featuredImage as Media | null
              return (
                <div
                  key={season.id}
                  className="border-[3px] border-black transition-shadow hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]"
                >
                  {image?.url && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.alt || season.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="mb-1 text-lg font-bold">{season.name}</h3>
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                      {formatDateRange(season.startDate, season.endDate)}
                    </p>
                    {season.description && (
                      <p className="line-clamp-3 text-sm leading-relaxed text-neutral-600">
                        {season.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
