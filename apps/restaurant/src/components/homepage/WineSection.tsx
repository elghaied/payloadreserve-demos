import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/Container'
import { ScrollReveal, StaggerChildren } from '@/components/ScrollReveal'
import { Badge } from '@/components/ui/badge'
import type { Homepage, WineList } from '@/payload-types'

type Props = {
  data: Homepage
  wines: WineList[]
  locale: string
}

const wineTypeVariant: Record<WineList['type'], 'default' | 'gold' | 'outline' | 'surface'> = {
  red: 'default',
  white: 'outline',
  rose: 'default',
  champagne: 'gold',
  dessert: 'surface',
}

export async function WineSection({ data, wines, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'wines' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  if (wines.length === 0) return null

  return (
    <section className="py-24 md:py-32 bg-surface/20">
      <Container>
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4">
            <p className="text-gold text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-gold w-24 mx-auto" />
            <h2 className="text-3xl md:text-5xl font-heading text-gradient-gold">
              {data.wineHeading || t('title')}
            </h2>
            {(data.wineSubtitle || t('subtitle')) && (
              <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
                {data.wineSubtitle || t('subtitle')}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Wine cards grid */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wines.map((wine) => (
            <ScrollReveal key={wine.id}>
              <div
                className="glass rounded-sm p-6 flex flex-col gap-4 h-full transition-all duration-300 hover:burgundy-glow-sm"
                style={{
                  borderColor: 'rgba(212, 175, 55, 0.15)',
                }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-heading text-xl text-foreground leading-snug">
                      {wine.name}
                    </h3>
                    <p className="text-gold text-xs uppercase tracking-widest">
                      {wine.region}
                      {wine.vintage ? ` · ${wine.vintage}` : ''}
                    </p>
                  </div>
                  <Badge variant={wineTypeVariant[wine.type]} className="text-xs shrink-0 capitalize">
                    {t(wine.type as Parameters<typeof t>[0])}
                  </Badge>
                </div>

                {/* Grape */}
                {wine.grape && (
                  <p className="text-foreground/50 text-xs italic">{wine.grape}</p>
                )}

                {/* Divider */}
                <hr className="border-border/40" />

                {/* Tasting notes */}
                {wine.tastingNotes && (
                  <p className="text-muted text-sm leading-relaxed flex-1 italic">
                    &ldquo;{wine.tastingNotes}&rdquo;
                  </p>
                )}

                {/* Pricing */}
                <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                  <div className="space-y-0.5">
                    {wine.priceGlass != null && (
                      <p className="text-muted text-xs">
                        {tCommon('perGlass')}{' '}
                        <span className="text-foreground font-medium">
                          €{wine.priceGlass.toFixed(2)}
                        </span>
                      </p>
                    )}
                    <p className="text-muted text-xs">
                      {tCommon('perBottle')}{' '}
                      <span className="text-gold font-heading text-base">
                        €{wine.priceBottle.toFixed(2)}
                      </span>
                    </p>
                  </div>
                  {wine.featured && (
                    <Badge variant="gold" className="text-xs">
                      {t('featured')}
                    </Badge>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </StaggerChildren>

        {/* CTA */}
        <ScrollReveal delay={200}>
          <div className="text-center mt-14">
            <Link
              href={`/${locale}/wines`}
              className="inline-block border border-gold/40 text-gold px-10 py-3 rounded-sm text-sm uppercase tracking-widest hover:border-gold hover:bg-gold/5 transition-all duration-300"
            >
              {t('title')}
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
