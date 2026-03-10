import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/Container'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Badge } from '@/components/ui/badge'
import type { Homepage, Space, Media } from '@/payload-types'

type Props = {
  data: Homepage
  spaces: Space[]
  locale: string
}

function getImageUrl(img: Space['featuredImage']): string | null {
  if (typeof img === 'object' && img !== null) {
    return (img as Media).url ?? null
  }
  return null
}

function getImageAlt(img: Space['featuredImage']): string {
  if (typeof img === 'object' && img !== null) {
    return (img as Media).alt ?? ''
  }
  return ''
}

const featureLabelMap: Record<string, string> = {
  'natural-light': 'Natural Light',
  'garden-view': 'Garden View',
  fireplace: 'Fireplace',
  'sound-system': 'Sound System',
  projector: 'Projector',
  'private-entrance': 'Private Entrance',
  'bar-access': 'Bar Access',
  outdoor: 'Outdoor',
}

export async function SpacesPreview({ data, spaces, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'spaces' })

  if (spaces.length === 0) return null

  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4">
            <p className="text-primary text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-rose w-24 mx-auto" />
            <h2 className="text-3xl md:text-5xl font-heading text-foreground">
              {data.spacesHeading || t('title')}
            </h2>
            {(data.spacesSubtitle || t('subtitle')) && (
              <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
                {data.spacesSubtitle || t('subtitle')}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Alternating layout */}
        <div className="space-y-24">
          {spaces.map((space, i) => {
            const imgUrl = getImageUrl(space.featuredImage)
            const imgAlt = getImageAlt(space.featuredImage)
            const isEven = i % 2 === 0

            return (
              <ScrollReveal key={space.id}>
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${
                    isEven ? '' : 'md:[&>*:first-child]:order-2'
                  }`}
                >
                  {/* Image side */}
                  <div className="relative overflow-hidden rounded-sm aspect-[4/3]">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={imgAlt || space.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          background:
                            'radial-gradient(ellipse at center, #3d1a2e 0%, #1a0a14 100%)',
                        }}
                      />
                    )}
                    {/* Capacity badge overlay */}
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="surface" className="text-xs backdrop-blur-sm">
                        {t('capacity', { count: space.capacity })}
                      </Badge>
                    </div>
                    {space.privateEventAvailable && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="gold" className="text-xs">
                          {t('privateEvents')}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Text side */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-2xl md:text-4xl font-heading text-foreground">
                        {space.name}
                      </h3>
                      {space.description && (
                        <p className="text-muted leading-relaxed">{space.description}</p>
                      )}
                    </div>

                    {/* Features */}
                    {space.features && space.features.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-gold">
                          {t('features')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {space.features.map((f) => (
                            <Badge key={f} variant="outline" className="text-xs">
                              {featureLabelMap[f] ?? f}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Minimum spend */}
                    {space.minimumSpend != null && (
                      <p className="text-muted text-sm">
                        {t('minimumSpend', { amount: space.minimumSpend })}
                      </p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* CTA */}
        <ScrollReveal delay={200}>
          <div className="text-center mt-16">
            <Link
              href={`/${locale}/spaces`}
              className="inline-block border border-foreground/30 text-foreground px-10 py-3 rounded-sm text-sm uppercase tracking-widest hover:border-primary hover:text-primary transition-colors duration-300"
            >
              {t('inquire')}
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
