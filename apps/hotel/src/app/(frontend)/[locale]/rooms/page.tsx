import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import { ArrowRight } from 'lucide-react'

import config from '@/payload.config'
import { Container } from '@/components/Container'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Ornament } from '@/components/Ornament'
import { Button } from '@/components/ui/button'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function RoomsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale })
  const payload = await getPayload({ config })

  const roomTypes = await payload.find({
    collection: 'room-types',
    where: { active: { equals: true } },
    limit: 50,
    locale: locale as 'en' | 'fr',
    sort: 'price',
  })

  return (
    <>
      {/* Hero header */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent via-background to-background" />
        <div className="absolute inset-0 noise pointer-events-none" />

        {/* Floating watermark */}
        <div className="absolute top-1/4 right-8 lg:right-16 hidden lg:block pointer-events-none select-none">
          <span className="font-heading text-[10rem] xl:text-[14rem] font-bold text-foreground/[0.02] leading-none">
            R
          </span>
        </div>

        <Container className="relative z-10">
          <ScrollReveal direction="none">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium flex items-center gap-3">
              <span className="inline-block w-6 h-px bg-primary" />
              {locale === 'fr' ? 'Hebergements' : 'Accommodations'}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <h1 className="font-heading text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight max-w-3xl">
              {t('rooms.title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <p className="text-muted max-w-lg text-base lg:text-lg leading-relaxed">
              {t('rooms.subtitle')}
            </p>
          </ScrollReveal>
        </Container>

        <div className="absolute bottom-0 left-0 right-0">
          <hr className="hr-copper" />
        </div>
      </section>

      {/* Room listings */}
      <section className="py-20 lg:py-28">
        <Container>
          {roomTypes.docs.length === 0 ? (
            <div className="text-center py-20">
              <Ornament className="mb-6" />
              <p className="text-muted text-lg">{t('rooms.noRooms')}</p>
            </div>
          ) : (
            <div className="space-y-20 lg:space-y-28">
              {roomTypes.docs.map((room, i) => {
                const isReversed = i % 2 === 1
                return (
                  <ScrollReveal key={room.id}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      {/* Image */}
                      <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : ''}`}>
                        {room.image && typeof room.image === 'object' && room.image.url && (
                          <div className="room-card relative aspect-[4/3] rounded-xl overflow-hidden group">
                            <Image
                              src={room.image.url}
                              alt={room.name}
                              fill
                              className="room-image object-cover"
                            />
                            <div className="room-overlay absolute inset-0 bg-background/50 flex items-center justify-center">
                              <Button variant="outline" asChild>
                                <Link href={`/${locale}/book?room=${room.id}`}>
                                  {t('common.bookNow')}
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </Button>
                            </div>
                            {/* Price badge */}
                            <div className="absolute top-4 right-4 glass rounded-lg px-3 py-1.5">
                              <span className="text-sm font-semibold text-primary">
                                ${room.price}
                                <span className="text-xs text-muted font-normal">{t('common.perNight')}</span>
                              </span>
                            </div>
                            {/* Decorative inset border */}
                            <div className="absolute inset-3 border border-foreground/[0.06] rounded-lg pointer-events-none" />
                          </div>
                        )}
                      </div>

                      {/* Text content */}
                      <div className={`lg:col-span-5 ${isReversed ? 'lg:order-1 lg:pr-4' : 'lg:pl-4'}`}>
                        <Ornament variant="line" className="mb-6 justify-start" />
                        <p className="text-xs tracking-[0.3em] uppercase text-primary/70 mb-3 font-medium">
                          {locale === 'fr' ? `Chambre ${String(i + 1).padStart(2, '0')}` : `Room ${String(i + 1).padStart(2, '0')}`}
                        </p>
                        <h2 className="font-heading text-2xl lg:text-3xl xl:text-4xl font-bold mb-5 leading-tight">
                          {room.name}
                        </h2>
                        <p className="text-muted mb-8 leading-[1.8]">
                          {room.description}
                        </p>
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-xs tracking-wider uppercase text-muted">{t('rooms.from')}</span>
                            <span className="text-3xl font-heading font-bold text-gradient-copper ml-2">
                              ${room.price}
                            </span>
                            <span className="text-sm text-muted ml-1">{t('common.perNight')}</span>
                          </div>
                        </div>
                        <div className="mt-8">
                          <Button asChild>
                            <Link href={`/${locale}/book?room=${room.id}`}>
                              {t('common.bookNow')}
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          )}
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 relative overflow-hidden cta-shimmer">
        <div className="absolute top-0 left-0 right-0">
          <hr className="hr-copper" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-primary/[0.03] rounded-full blur-[120px]" />
        </div>
        <Container className="relative text-center">
          <ScrollReveal>
            <Ornament className="mb-8" />
            <h2 className="font-heading text-3xl lg:text-5xl font-bold mb-5">
              {locale === 'fr' ? 'Pret a reserver ?' : 'Ready to Reserve?'}
            </h2>
            <p className="text-muted max-w-md mx-auto mb-10 leading-relaxed">
              {locale === 'fr'
                ? 'Choisissez vos dates et decouvrez nos disponibilites.'
                : 'Choose your dates and discover our availability.'}
            </p>
            <Button size="lg" asChild>
              <Link href={`/${locale}/book`}>
                {t('common.bookNow')}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </ScrollReveal>
        </Container>
      </section>
    </>
  )
}
