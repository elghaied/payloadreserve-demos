import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ScrollReveal } from '@/components/ScrollReveal'
import type { Homepage } from '@/payload-types'

type Props = {
  data: Homepage
  locale: string
}

export async function CTABanner({ data, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'cta' })

  const heading = data.ctaHeading || t('heading')
  const body = data.ctaBody || t('subheading')
  const buttonText = data.ctaButtonText || t('button')
  const buttonLink = data.ctaButtonLink || `/${locale}/book`

  return (
    <section className="relative py-24 md:py-32 bg-surface cta-shimmer">
      {/* Rosé-to-gold gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--color-primary), var(--color-gold), var(--color-primary), transparent)',
        }}
      />

      <ScrollReveal>
        <div className="max-w-3xl mx-auto px-4 text-center space-y-8">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-4">
            <hr
              className="flex-1 max-w-[80px] border-0 h-px"
              style={{
                background:
                  'linear-gradient(to right, transparent, var(--color-primary))',
              }}
            />
            <span className="text-gold text-lg" aria-hidden="true">
              ✦
            </span>
            <hr
              className="flex-1 max-w-[80px] border-0 h-px"
              style={{
                background:
                  'linear-gradient(to left, transparent, var(--color-primary))',
              }}
            />
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-heading text-foreground leading-tight">
            {heading}
          </h2>

          {/* Body */}
          {body && (
            <p className="text-muted text-xl leading-relaxed max-w-xl mx-auto">{body}</p>
          )}

          {/* CTA Button */}
          <div>
            <Link
              href={buttonLink}
              className="inline-block bg-primary text-background px-12 py-4 rounded-sm text-sm uppercase tracking-widest font-medium hover:bg-primary-hover transition-colors duration-300 min-w-[220px] text-center"
            >
              {buttonText}
            </Link>
          </div>

          {/* Decorative element */}
          <div className="flex items-center justify-center gap-4 opacity-40">
            <hr
              className="flex-1 max-w-[60px] border-0 h-px"
              style={{
                background:
                  'linear-gradient(to right, transparent, var(--color-gold))',
              }}
            />
            <span className="text-gold text-sm" aria-hidden="true">
              ✦
            </span>
            <hr
              className="flex-1 max-w-[60px] border-0 h-px"
              style={{
                background:
                  'linear-gradient(to left, transparent, var(--color-gold))',
              }}
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Rosé-to-gold gradient bottom border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--color-primary), var(--color-gold), var(--color-primary), transparent)',
        }}
      />
    </section>
  )
}
