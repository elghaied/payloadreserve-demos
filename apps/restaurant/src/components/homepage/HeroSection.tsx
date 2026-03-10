import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Homepage, Media } from '@/payload-types'

type Props = {
  data: Homepage
  locale: string
}

export async function HeroSection({ data, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'hero' })

  const bgImage = data.heroBackgroundImage
  const bgUrl = typeof bgImage === 'object' && bgImage !== null ? bgImage.url : null
  const bgAlt = typeof bgImage === 'object' && bgImage !== null ? (bgImage as Media).alt : ''

  return (
    <section className="min-h-screen relative flex items-center justify-center noise overflow-hidden">
      {/* Background image */}
      {bgUrl ? (
        <img
          src={bgUrl}
          alt={bgAlt || ''}
          className="object-cover absolute inset-0 w-full h-full"
        />
      ) : (
        /* Fallback gradient when no image is set */
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 60% 40%, #3d1a2e 0%, #1a0a14 60%, #0d050c 100%)',
          }}
        />
      )}

      {/* Dark gradient overlay */}
      <div className="hero-gradient absolute inset-0" />

      {/* Decorative rose accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 opacity-40"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-primary))' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Restaurant name label */}
        <p className="text-gold text-sm uppercase tracking-widest mb-6 font-body">Le Jardin</p>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-heading text-foreground mb-6 leading-tight">
          {data.heroTitle || t('defaultTitle')}
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-muted mb-10 max-w-xl mx-auto leading-relaxed">
          {data.heroSubtitle || t('defaultSubtitle')}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={`/${locale}/book`}
            className="bg-primary text-background px-8 py-3 rounded-sm text-sm uppercase tracking-widest font-medium hover:bg-primary-hover transition-colors duration-300 min-w-[200px] text-center"
          >
            {data.heroCtaText || t('reserveCta')}
          </Link>
          <Link
            href={`/${locale}/menu`}
            className="border border-foreground/30 text-foreground px-8 py-3 rounded-sm text-sm uppercase tracking-widest font-medium hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-300 min-w-[200px] text-center"
          >
            {t('menuCta')}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs uppercase tracking-widest text-muted">Scroll</span>
        <div className="relative w-px h-12 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent, var(--color-primary))',
              animation: 'float 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  )
}
