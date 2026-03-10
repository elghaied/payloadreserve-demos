import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/Container'
import { ScrollReveal, StaggerChildren } from '@/components/ScrollReveal'
import type { Homepage, Testimonial, DiningExperience } from '@/payload-types'

type Props = {
  data: Homepage
  testimonials: Testimonial[]
  locale: string
}

function formatVisitDate(dateStr: string | null | undefined, locale: string): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function getExperienceName(exp: Testimonial['diningExperience']): string | null {
  if (typeof exp === 'object' && exp !== null) {
    return (exp as DiningExperience).name
  }
  return null
}

function renderStars(rating: number): string {
  const full = Math.floor(Math.max(0, Math.min(5, rating)))
  return '★'.repeat(full) + '☆'.repeat(5 - full)
}

export async function TestimonialsSection({ data, testimonials, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'testimonials' })

  if (testimonials.length === 0) return null

  return (
    <section className="py-24 md:py-32 bg-surface/20">
      <Container>
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4">
            <p className="text-gold text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-gold w-24 mx-auto" />
            <h2 className="text-3xl md:text-5xl font-heading text-foreground">
              {data.testimonialsHeading || t('title')}
            </h2>
            {(data.testimonialsSubtitle || t('subtitle')) && (
              <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
                {data.testimonialsSubtitle || t('subtitle')}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Testimonials staggered grid */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => {
            const experienceName = getExperienceName(item.diningExperience)
            const visitDate = formatVisitDate(item.visitDate, locale)
            const stars = renderStars(item.rating)

            return (
              <ScrollReveal key={item.id}>
                <blockquote className="glass rounded-sm p-8 h-full flex flex-col gap-5 relative">
                  {/* Decorative large quote mark */}
                  <span className="quote-mark" aria-hidden="true">
                    &ldquo;
                  </span>

                  {/* Stars */}
                  <div
                    className="relative z-10 text-gold text-lg leading-none"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {stars}
                  </div>

                  {/* Quote */}
                  <p className="relative z-10 font-heading text-foreground/90 text-lg italic leading-relaxed flex-1">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  {/* Footer */}
                  <footer className="relative z-10 space-y-1 pt-2 border-t border-border/40">
                    <p className="text-foreground font-medium text-sm">{item.author}</p>
                    {experienceName && (
                      <p className="text-primary text-xs uppercase tracking-wider">
                        {experienceName}
                      </p>
                    )}
                    {visitDate && (
                      <p className="text-muted/60 text-xs">{visitDate}</p>
                    )}
                  </footer>
                </blockquote>
              </ScrollReveal>
            )
          })}
        </StaggerChildren>
      </Container>
    </section>
  )
}
