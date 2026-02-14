import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Container } from '@/components/Container'

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
  const services = await payload.find({
    collection: 'services',
    where: { active: { equals: true } },
    limit: 6,
    locale: loc,
  })
  const specialists = await payload.find({
    collection: 'specialists',
    where: { active: { equals: true } },
    limit: 4,
    locale: loc,
  })

  const hero = homepage?.hero
  const about = homepage?.about
  const servicesSection = homepage?.servicesShowcase
  const specialistsSection = homepage?.specialistsSection
  const testimonials = homepage?.testimonials
  const cta = homepage?.cta

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {hero?.backgroundImage && typeof hero.backgroundImage === 'object' && hero.backgroundImage.url && (
          <Image
            src={hero.backgroundImage.url}
            alt=""
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-foreground/40" />
        <Container className="relative text-center text-white z-10 py-24">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight">
            {hero?.title || t('hero.defaultTitle')}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            {hero?.subtitle || t('hero.defaultSubtitle')}
          </p>
          <Link
            href={hero?.ctaLink || `/${locale}/book`}
            className="inline-block bg-primary text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-primary-dark transition-colors"
          >
            {hero?.ctaText || t('common.bookNow')}
          </Link>
        </Container>
      </section>

      {/* About */}
      {about?.heading && (
        <section className="py-20 lg:py-28">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {about.image && typeof about.image === 'object' && about.image.url && (
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={about.image.url}
                    alt={about.heading}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h2 className="font-heading text-3xl lg:text-4xl font-semibold mb-6">
                  {about.heading}
                </h2>
                {about.body && (
                  <div className="prose prose-lg text-muted max-w-none">
                    {/* Rich text rendered as simple paragraphs for now */}
                    {typeof about.body === 'object' && 'root' in about.body && (
                      <div>
                        {(about.body.root?.children as Array<{ children?: Array<{ text?: string }> }>)?.map(
                          (node, i) => (
                            <p key={i}>
                              {node.children?.map((child) => child.text).join('')}
                            </p>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Services */}
      <section className="py-20 lg:py-28 bg-surface">
        <Container>
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold mb-4">
              {servicesSection?.heading || t('services.title')}
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              {servicesSection?.subtitle || t('services.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.docs.map((service) => (
              <div
                key={service.id}
                className="border border-border p-8 hover:shadow-md transition-shadow group"
              >
                <h3 className="font-heading text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-muted text-sm mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">{service.duration} {t('common.minutes')}</span>
                  <span className="text-primary font-semibold">${service.price}</span>
                </div>
                <Link
                  href={`/${locale}/book?service=${service.id}`}
                  className="mt-6 inline-block text-sm tracking-wide text-primary border-b border-primary/30 hover:border-primary transition-colors"
                >
                  {t('common.bookNow')}
                </Link>
              </div>
            ))}
          </div>
          {services.totalDocs > 6 && (
            <div className="text-center mt-12">
              <Link
                href={`/${locale}/services`}
                className="text-sm tracking-wide text-primary border-b border-primary/30 hover:border-primary transition-colors"
              >
                {t('common.viewAll')}
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Specialists */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold mb-4">
              {specialistsSection?.heading || (locale === 'fr' ? 'Nos Spécialistes' : 'Meet Our Specialists')}
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              {specialistsSection?.subtitle || (locale === 'fr' ? 'Des experts passionnés à votre service' : 'Passionate experts at your service')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {specialists.docs.map((specialist) => (
              <div key={specialist.id} className="text-center group">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  {specialist.image && typeof specialist.image === 'object' && specialist.image.url ? (
                    <Image
                      src={specialist.image.url}
                      alt={specialist.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-border/30 flex items-center justify-center">
                      <span className="text-4xl text-muted/30">{specialist.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-heading text-lg font-semibold">{specialist.name}</h3>
                <p className="text-sm text-muted mt-1">{specialist.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 lg:py-28 bg-foreground text-background">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="p-8">
                  {testimonial.rating && (
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, j) => (
                        <svg key={j} className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                  <p className="text-background/80 italic mb-4 leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <p className="text-sm font-medium text-primary">{testimonial.author}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 lg:py-28 text-center">
        <Container>
          <h2 className="font-heading text-3xl lg:text-4xl font-semibold mb-4">
            {cta?.heading || (locale === 'fr' ? 'Prêt à vous faire dorloter ?' : 'Ready to Treat Yourself?')}
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-10">
            {cta?.body || (locale === 'fr' ? "Réservez votre rendez-vous aujourd'hui et vivez la différence." : 'Book your appointment today and experience the difference.')}
          </p>
          <Link
            href={cta?.buttonLink || `/${locale}/book`}
            className="inline-block bg-primary text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-primary-dark transition-colors"
          >
            {cta?.buttonText || t('common.bookNow')}
          </Link>
        </Container>
      </section>
    </>
  )
}
