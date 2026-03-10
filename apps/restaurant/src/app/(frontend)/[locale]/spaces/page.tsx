import { getPayload } from 'payload'
import config from '@payload-config'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Badge } from '@/components/ui/badge'
import type { Space, Media } from '@/payload-types'

type Props = { params: Promise<{ locale: string }> }

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

function getMediaUrl(img: string | Media | null | undefined): string | null {
  if (!img) return null
  if (typeof img === 'object') return (img as Media).url ?? null
  return null
}

function getMediaAlt(img: string | Media | null | undefined, fallback = ''): string {
  if (!img || typeof img !== 'object') return fallback
  return (img as Media).alt ?? fallback
}

export default async function SpacesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })
  const t = await getTranslations({ locale, namespace: 'spaces' })

  const { docs: spaces } = await payload.find({
    collection: 'spaces',
    locale: loc,
    limit: 20,
    sort: 'order',
  })

  return (
    <main className="min-h-screen py-24 md:py-32">
      <Container>
        {/* Page header */}
        <ScrollReveal>
          <div className="text-center mb-20 space-y-4">
            <p className="text-primary text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-rose w-24 mx-auto" />
            <h1 className="font-heading text-4xl md:text-6xl text-foreground">{t('title')}</h1>
            <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
          </div>
        </ScrollReveal>

        {/* Spaces */}
        {spaces.length === 0 ? (
          <p className="text-muted text-center py-16">{t('subtitle')}</p>
        ) : (
          <div className="space-y-32">
            {spaces.map((space: Space, i) => {
              const imgUrl = getMediaUrl(space.featuredImage)
              const imgAlt = getMediaAlt(space.featuredImage, space.name)
              const isEven = i % 2 === 0

              return (
                <ScrollReveal key={space.id}>
                  <section
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                      isEven ? '' : 'lg:[&>*:first-child]:order-2'
                    }`}
                  >
                    {/* Image + gallery side */}
                    <div className="space-y-3">
                      {/* Hero image */}
                      <div className="relative overflow-hidden rounded-sm aspect-[4/3]">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={imgAlt}
                            className="w-full h-full object-cover"
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

                      {/* Gallery thumbnails */}
                      {space.gallery && space.gallery.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {space.gallery.slice(0, 4).map((item, idx) => {
                            const thumbUrl = getMediaUrl(item.image)
                            return (
                              <div
                                key={item.id ?? idx}
                                className="aspect-square overflow-hidden rounded-sm"
                              >
                                {thumbUrl ? (
                                  <img
                                    src={thumbUrl}
                                    alt={item.caption ?? `${space.name} ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full"
                                    style={{ background: '#2d1525' }}
                                  />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Text side */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h2 className="font-heading text-3xl md:text-4xl text-foreground">
                          {space.name}
                        </h2>
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

                      {/* Private event info */}
                      {space.privateEventAvailable && (
                        <div className="glass rounded-sm p-4 space-y-2">
                          <p className="text-xs uppercase tracking-widest text-gold">
                            {t('privateEvents')}
                          </p>
                          {space.minimumSpend != null && (
                            <p className="text-muted text-sm">
                              {t('minimumSpend', { amount: space.minimumSpend })}
                            </p>
                          )}
                          <Link
                            href={`/${locale}/contact`}
                            className="inline-block text-primary text-xs uppercase tracking-wider hover:underline mt-1"
                          >
                            {t('inquire')} →
                          </Link>
                        </div>
                      )}
                    </div>
                  </section>
                </ScrollReveal>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <ScrollReveal delay={200}>
          <div className="text-center mt-24 pt-12 border-t border-border/40">
            <Link
              href={`/${locale}/contact`}
              className="inline-block border border-primary/40 text-primary px-10 py-3 rounded-sm text-sm uppercase tracking-widest hover:bg-primary hover:text-background transition-all duration-300"
            >
              {t('inquire')}
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </main>
  )
}
