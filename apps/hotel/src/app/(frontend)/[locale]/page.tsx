import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { ArrowRight, Star } from 'lucide-react'

import config from '@/payload.config'
import { Container } from '@/components/Container'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Ornament } from '@/components/Ornament'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale })
  const payload = await getPayload({ config })

  const loc = locale as 'en' | 'fr'
  const homepage = await payload.findGlobal({ slug: 'homepage', locale: loc })
  const roomTypes = await payload.find({
    collection: 'room-types',
    where: { active: { equals: true } },
    limit: 5,
    locale: loc,
    sort: 'price',
  })
  const amenities = await payload.find({
    collection: 'amenities',
    where: { featured: { equals: true } },
    limit: 4,
    locale: loc,
    sort: 'order',
  })

  const hero = homepage?.hero
  const about = homepage?.about
  const roomsSection = homepage?.roomsShowcase
  const amenitiesSection = homepage?.amenitiesSection
  const testimonials = homepage?.testimonials
  const cta = homepage?.cta

  const featuredRoom = roomTypes.docs[0]
  const otherRooms = roomTypes.docs.slice(1)

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO — Cinematic full-viewport with
          bottom-gradient, left-aligned text,
          floating year watermark
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {hero?.backgroundImage && typeof hero.backgroundImage === 'object' && hero.backgroundImage.url ? (
          <Image
            src={hero.backgroundImage.url}
            alt=""
            fill
            className="object-cover"
            priority
          />
        ) : (
          /* Fallback: atmospheric dark gradient when no image */
          <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-surface" />
        )}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 noise pointer-events-none" />

        {/* Floating decorative year */}
        <div className="absolute top-1/3 right-8 lg:right-16 xl:right-24 hidden lg:block watermark pointer-events-none select-none">
          <span className="font-heading text-[12rem] xl:text-[16rem] font-bold text-foreground/[0.03] leading-none">
            28
          </span>
        </div>

        <Container className="relative z-10 pb-20 lg:pb-28 pt-48">
          <ScrollReveal direction="none">
            <p className="text-xs tracking-[0.4em] uppercase text-primary mb-8 font-medium flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-primary" />
              {locale === 'fr' ? 'Depuis 1928' : 'Est. 1928'}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-[1.05] max-w-4xl">
              {hero?.title || t('hero.defaultTitle')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <p className="text-base md:text-lg text-muted max-w-md mb-12 leading-relaxed">
              {hero?.subtitle || t('hero.defaultSubtitle')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={450}>
            <Button size="lg" asChild>
              <Link href={hero?.ctaLink || `/${locale}/book`}>
                {hero?.ctaText || t('common.bookNow')}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </ScrollReveal>
        </Container>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <hr className="hr-copper" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ABOUT — Asymmetric layout,
          image breaks out of container on left,
          text offset right with ornament
          ═══════════════════════════════════════════ */}
      {about?.heading && (
        <section className="py-28 lg:py-36 relative overflow-hidden">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              {/* Image — takes 7 columns, pushed left for asymmetry */}
              {about.image && typeof about.image === 'object' && about.image.url && (
                <ScrollReveal direction="left" className="lg:col-span-7 lg:-ml-12">
                  <div className="relative aspect-[3/4] lg:aspect-[4/5] rounded-xl overflow-hidden copper-glow">
                    <Image
                      src={about.image.url}
                      alt={about.heading}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background/60 to-transparent" />
                    {/* Decorative border inset */}
                    <div className="absolute inset-4 border border-foreground/10 rounded-lg pointer-events-none" />
                  </div>
                </ScrollReveal>
              )}
              {/* Text — takes 5 columns */}
              <div className="lg:col-span-5 lg:pl-6">
                <ScrollReveal direction="right">
                  <Ornament variant="line" className="mb-8 justify-start" />
                  <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">
                    {locale === 'fr' ? 'Notre histoire' : 'Our Story'}
                  </p>
                  <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-8 leading-tight">
                    {about.heading}
                  </h2>
                </ScrollReveal>
                <ScrollReveal direction="right" delay={150}>
                  {about.body && typeof about.body === 'object' && 'root' in about.body && (
                    <div className="space-y-4">
                      {(about.body.root?.children as Array<{ children?: Array<{ text?: string }> }>)?.map(
                        (node, i) => (
                          <p key={i} className="text-muted leading-[1.8]">
                            {node.children?.map((child) => child.text).join('')}
                          </p>
                        ),
                      )}
                    </div>
                  )}
                </ScrollReveal>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          ROOMS — Featured room full-width hero card,
          then grid of remaining rooms below
          ═══════════════════════════════════════════ */}
      <section className="py-28 lg:py-36 relative">
        <div className="absolute top-0 left-0 right-0">
          <hr className="hr-copper" />
        </div>

        <Container>
          <ScrollReveal>
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium flex items-center gap-3">
                  <span className="inline-block w-6 h-px bg-primary" />
                  {locale === 'fr' ? 'Hebergements' : 'Accommodations'}
                </p>
                <h2 className="font-heading text-3xl lg:text-5xl font-bold">
                  {roomsSection?.heading || t('rooms.title')}
                </h2>
              </div>
              <p className="text-muted max-w-sm hidden lg:block text-right text-sm leading-relaxed">
                {roomsSection?.subtitle || t('rooms.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          {/* Featured room — wide cinematic card */}
          {featuredRoom && (
            <ScrollReveal className="mb-8">
              <div className="room-card relative rounded-xl overflow-hidden group cursor-pointer">
                {featuredRoom.image && typeof featuredRoom.image === 'object' && featuredRoom.image.url && (
                  <div className="relative aspect-[21/9] lg:aspect-[21/8]">
                    <Image
                      src={featuredRoom.image.url}
                      alt={featuredRoom.name}
                      fill
                      className="room-image object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

                    {/* Content over image */}
                    <div className="absolute inset-0 flex items-end p-8 lg:p-12">
                      <div className="max-w-lg">
                        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-medium">
                          {locale === 'fr' ? 'Signature' : 'Signature'}
                        </p>
                        <h3 className="font-heading text-2xl lg:text-4xl font-bold mb-3">
                          {featuredRoom.name}
                        </h3>
                        <p className="text-muted text-sm mb-6 max-w-md leading-relaxed line-clamp-2">
                          {featuredRoom.description}
                        </p>
                        <div className="flex items-center gap-6">
                          <Button asChild>
                            <Link href={`/${locale}/book?room=${featuredRoom.id}`}>
                              {t('common.bookNow')}
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                          <span className="text-2xl font-heading font-bold text-gradient-copper">
                            ${featuredRoom.price}
                            <span className="text-sm text-muted font-body font-normal ml-1">{t('common.perNight')}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          )}

          {/* Remaining rooms grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {(otherRooms.length > 0 ? otherRooms : roomTypes.docs).map((room, idx) => (
              <ScrollReveal key={room.id}>
                <Card className="room-card group h-full">
                  {room.image && typeof room.image === 'object' && room.image.url && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={room.image.url}
                        alt={room.name}
                        fill
                        className="room-image object-cover"
                      />
                      {/* Hover overlay with CTA */}
                      <div className="room-overlay absolute inset-0 bg-background/60 flex items-center justify-center">
                        <Button variant="outline" asChild>
                          <Link href={`/${locale}/book?room=${room.id}`}>
                            {t('rooms.viewDetails')}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                      <div className="absolute top-4 right-4 glass rounded-lg px-3 py-1.5">
                        <span className="text-sm font-semibold text-primary">
                          ${room.price}
                          <span className="text-xs text-muted font-normal">{t('common.perNight')}</span>
                        </span>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-bold mb-2">{room.name}</h3>
                    <p className="text-muted text-sm line-clamp-2 leading-relaxed">{room.description}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════
          AMENITIES — Horizontal cards with
          icon circles and copper borders
          ═══════════════════════════════════════════ */}
      {amenities.docs.length > 0 && (
        <section className="py-28 lg:py-36 bg-surface relative">
          <div className="absolute top-0 left-0 right-0">
            <hr className="hr-copper" />
          </div>

          <Container>
            <ScrollReveal>
              <div className="text-center mb-16">
                <Ornament className="mb-6" />
                <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
                  {amenitiesSection?.heading || (locale === 'fr' ? 'Services de l\'Hotel' : 'Hotel Amenities')}
                </h2>
                {amenitiesSection?.subtitle && (
                  <p className="text-muted max-w-xl mx-auto">{amenitiesSection.subtitle}</p>
                )}
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              {amenities.docs.map((amenity) => (
                <ScrollReveal key={amenity.id}>
                  <Card className="text-center p-8 hover:copper-glow transition-shadow duration-700">
                    {amenity.image && typeof amenity.image === 'object' && amenity.image.url ? (
                      <div className="relative w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                        <Image src={amenity.image.url} alt={amenity.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center">
                        <span className="text-primary text-2xl font-heading font-bold">{amenity.name.charAt(0)}</span>
                      </div>
                    )}
                    <h3 className="font-heading text-lg font-bold mb-3">{amenity.name}</h3>
                    <p className="text-sm text-muted leading-relaxed">{amenity.description}</p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </Container>

          <div className="absolute bottom-0 left-0 right-0">
            <hr className="hr-copper" />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          TESTIMONIALS — Editorial style:
          one large featured quote + smaller cards
          ═══════════════════════════════════════════ */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-28 lg:py-36 relative">
          <Container>
            <ScrollReveal>
              <div className="text-center mb-20">
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">
                  {locale === 'fr' ? 'Temoignages' : 'Guest Reviews'}
                </p>
                <h2 className="font-heading text-3xl lg:text-4xl font-bold">
                  {locale === 'fr' ? 'Paroles de voyageurs' : 'Words from Our Guests'}
                </h2>
              </div>
            </ScrollReveal>

            {/* Featured testimonial — large editorial quote */}
            <ScrollReveal className="mb-12">
              <div className="relative max-w-3xl mx-auto text-center px-4">
                <span className="quote-mark">&ldquo;</span>
                <p className="font-heading text-2xl lg:text-3xl italic leading-relaxed text-foreground/90 mb-8 relative z-10">
                  {testimonials[0].quote}
                </p>
                <Ornament variant="line" className="mb-4" />
                <p className="text-sm font-medium text-primary tracking-wide">
                  {testimonials[0].author}
                </p>
                {testimonials[0].rating && (
                  <div className="flex gap-1 justify-center mt-3">
                    {Array.from({ length: testimonials[0].rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Other testimonials — compact cards */}
            {testimonials.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto stagger-children">
                {testimonials.slice(1).map((testimonial, i) => (
                  <ScrollReveal key={i}>
                    <Card className="p-8">
                      {testimonial.rating && (
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: testimonial.rating }).map((_, j) => (
                            <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                          ))}
                          {Array.from({ length: 5 - testimonial.rating }).map((_, j) => (
                            <Star key={j} className="w-3.5 h-3.5 text-border" />
                          ))}
                        </div>
                      )}
                      <p className="text-foreground/80 italic mb-5 leading-relaxed">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {testimonial.author.charAt(0)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
                      </div>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </Container>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          CTA — Atmospheric with shimmer,
          radial glow, monogram watermark
          ═══════════════════════════════════════════ */}
      <section className="py-28 lg:py-40 relative overflow-hidden cta-shimmer">
        <div className="absolute top-0 left-0 right-0">
          <hr className="hr-copper" />
        </div>

        {/* Layered atmosphere */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[500px] bg-primary/[0.04] rounded-full blur-[150px]" />
        </div>
        <div className="absolute bottom-0 right-0 opacity-[0.03] pointer-events-none select-none hidden lg:block">
          <span className="font-heading text-[20rem] font-bold text-foreground leading-none">GH</span>
        </div>

        <Container className="relative text-center">
          <ScrollReveal>
            <Ornament className="mb-10" />
            <h2 className="font-heading text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              {cta?.heading || (locale === 'fr' ? 'Commencez Votre Sejour' : 'Begin Your Stay')}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="text-muted max-w-lg mx-auto mb-12 leading-relaxed">
              {cta?.body || (locale === 'fr' ? 'Reservez votre chambre aujourd\'hui.' : 'Reserve your room today.')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <Button size="lg" asChild>
              <Link href={cta?.buttonLink || `/${locale}/book`}>
                {cta?.buttonText || t('common.bookNow')}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </ScrollReveal>
        </Container>
      </section>
    </>
  )
}
