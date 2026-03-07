import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Container } from '@/components/Container'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Ornament } from '@/components/Ornament'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'gallery' })
  const payload = await getPayload({ config })

  const gallery = await payload.find({
    collection: 'gallery',
    limit: 50,
    locale: locale as 'en' | 'fr',
  })

  // Vary aspect ratios for visual interest
  const aspects = [
    'aspect-[4/3]',
    'aspect-[3/4]',
    'aspect-[4/3]',
    'aspect-square',
    'aspect-[3/4]',
    'aspect-[4/3]',
  ]

  return (
    <>
      {/* Header */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent via-background to-background" />
        <div className="absolute inset-0 noise pointer-events-none" />

        <Container className="relative z-10 text-center">
          <ScrollReveal direction="none">
            <Ornament className="mb-8" />
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <h1 className="font-heading text-4xl lg:text-6xl xl:text-7xl font-bold mb-6">
              {t('title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <p className="text-muted max-w-lg mx-auto text-base lg:text-lg leading-relaxed">
              {t('subtitle')}
            </p>
          </ScrollReveal>
        </Container>

        <div className="absolute bottom-0 left-0 right-0">
          <hr className="hr-copper" />
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-20 lg:py-28">
        <Container>
          {gallery.docs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-lg">
                {locale === 'fr' ? 'Galerie bientot disponible.' : 'Gallery coming soon.'}
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {gallery.docs.map((item, i) => (
                <ScrollReveal key={item.id}>
                  <div className={`relative ${aspects[i % aspects.length]} overflow-hidden rounded-xl group break-inside-avoid`}>
                    {item.image && typeof item.image === 'object' && item.image.url && (
                      <Image
                        src={item.image.url}
                        alt={item.caption || ''}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-500" />

                    {/* Caption */}
                    {item.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-foreground text-sm font-medium">{item.caption}</p>
                        {item.category && (
                          <p className="text-xs text-primary mt-1 tracking-wider uppercase">
                            {item.category}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Decorative corner */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-foreground/[0.08] rounded-tl-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-foreground/[0.08] rounded-br-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
