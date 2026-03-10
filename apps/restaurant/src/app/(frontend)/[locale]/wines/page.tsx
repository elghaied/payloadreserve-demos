import { getPayload } from 'payload'
import config from '@payload-config'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Container } from '@/components/Container'
import { ScrollReveal, StaggerChildren } from '@/components/ScrollReveal'
import { Badge } from '@/components/ui/badge'
import type { WineList } from '@/payload-types'

type Props = { params: Promise<{ locale: string }> }

type WineType = WineList['type']

const WINE_TYPE_ORDER: WineType[] = ['champagne', 'white', 'rose', 'red', 'dessert']

function groupByType(wines: WineList[]): Map<WineType, WineList[]> {
  const map = new Map<WineType, WineList[]>()
  for (const wine of wines) {
    const list = map.get(wine.type) ?? []
    list.push(wine)
    map.set(wine.type, list)
  }
  return map
}

export default async function WinesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })
  const t = await getTranslations({ locale, namespace: 'wines' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const { docs: wines } = await payload.find({
    collection: 'wine-list',
    locale: loc,
    limit: 200,
    sort: 'name',
  })

  const grouped = groupByType(wines)

  return (
    <main className="min-h-screen py-24 md:py-32">
      <Container>
        {/* Page header */}
        <ScrollReveal>
          <div className="text-center mb-20 space-y-4">
            <p className="text-gold text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-gold w-24 mx-auto" />
            <h1 className="font-heading text-4xl md:text-6xl text-gradient-gold">{t('title')}</h1>
            <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
          </div>
        </ScrollReveal>

        {/* Wine type sections */}
        {WINE_TYPE_ORDER.filter((type) => grouped.has(type)).length === 0 ? (
          <p className="text-muted text-center py-16">{t('subtitle')}</p>
        ) : (
          <div className="space-y-24">
            {WINE_TYPE_ORDER.filter((type) => grouped.has(type)).map((type) => {
              const typeWines = grouped.get(type)!
              const typeLabel = t(type as Parameters<typeof t>[0])

              return (
                <ScrollReveal key={type}>
                  <section>
                    {/* Type heading */}
                    <div className="text-center mb-10 space-y-3">
                      <h2 className="font-heading text-3xl text-gradient-gold">{typeLabel}</h2>
                      <hr className="hr-gold w-32 mx-auto" />
                    </div>

                    {/* Wine entries */}
                    <StaggerChildren className="space-y-6 max-w-4xl mx-auto">
                      {typeWines.map((wine) => (
                        <ScrollReveal key={wine.id}>
                          <article
                            className={`glass rounded-sm p-6 md:p-8 transition-all duration-300 ${
                              wine.featured ? 'burgundy-glow border-gold/20' : ''
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                              {/* Left: wine info */}
                              <div className="flex-1 space-y-3">
                                {/* Name + featured badge */}
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-heading text-2xl text-foreground">
                                    {wine.name}
                                  </h3>
                                  {wine.featured && (
                                    <Badge variant="gold" className="text-xs">
                                      {t('featured')}
                                    </Badge>
                                  )}
                                </div>

                                {/* Meta: region, vintage, grape */}
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-wider text-muted">
                                  {wine.region && (
                                    <span>
                                      <span className="text-gold">{t('region')}:</span>{' '}
                                      {wine.region}
                                    </span>
                                  )}
                                  {wine.vintage && (
                                    <span>
                                      <span className="text-gold">{t('vintage')}:</span>{' '}
                                      {wine.vintage}
                                    </span>
                                  )}
                                  {wine.grape && (
                                    <span>
                                      <span className="text-gold">{t('grape')}:</span> {wine.grape}
                                    </span>
                                  )}
                                </div>

                                {/* Tasting notes */}
                                {wine.tastingNotes && (
                                  <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-wider text-gold">
                                      {t('tastingNotes')}
                                    </p>
                                    <p className="text-muted text-sm italic leading-relaxed">
                                      {wine.tastingNotes}
                                    </p>
                                  </div>
                                )}

                                {/* Pairing notes */}
                                {wine.pairingNotes && (
                                  <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-wider text-gold">
                                      {t('pairingNotes')}
                                    </p>
                                    <p className="text-muted text-sm leading-relaxed">
                                      {wine.pairingNotes}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Right: prices */}
                              <div className="shrink-0 flex flex-col items-end gap-2 md:min-w-[120px]">
                                {wine.priceGlass != null && (
                                  <div className="text-right">
                                    <p className="text-xs uppercase tracking-wider text-muted">
                                      {tCommon('perGlass')}
                                    </p>
                                    <p className="font-heading text-xl text-foreground">
                                      €{wine.priceGlass.toFixed(2)}
                                    </p>
                                  </div>
                                )}
                                <div className="text-right">
                                  <p className="text-xs uppercase tracking-wider text-muted">
                                    {tCommon('perBottle')}
                                  </p>
                                  <p className="font-heading text-xl text-foreground">
                                    €{wine.priceBottle.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </article>
                        </ScrollReveal>
                      ))}
                    </StaggerChildren>
                  </section>
                </ScrollReveal>
              )
            })}
          </div>
        )}
      </Container>
    </main>
  )
}
