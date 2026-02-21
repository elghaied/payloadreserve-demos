import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { Container } from './Container'

type Props = {
  locale: string
}

export async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'footer' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  return (
    <footer className="bg-foreground text-background/80 mt-auto">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl text-background mb-4">Lumière</h3>
            <p className="text-sm leading-relaxed text-background/60">
              {locale === 'fr'
                ? "L'art des soins esthétiques dans un cadre serein et luxueux."
                : 'The art of esthetic care in a serene, luxurious setting.'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background mb-4">
              {t('quickLinks')}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href={`/${locale}/services`} className="text-sm hover:text-background transition-colors">
                {tNav('services')}
              </Link>
              <Link href={`/${locale}/book`} className="text-sm hover:text-background transition-colors">
                {tNav('book')}
              </Link>
              <Link href={`/${locale}/gallery`} className="text-sm hover:text-background transition-colors">
                {tNav('gallery')}
              </Link>
              <Link href={`/${locale}/contact`} className="text-sm hover:text-background transition-colors">
                {tNav('contact')}
              </Link>
            </nav>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background mb-4">
              {locale === 'fr' ? 'Contact' : 'Contact'}
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <p>123 Rue de la Beauté</p>
              <p>Montreal, QC H2X 1Y6</p>
              <p>(514) 555-0123</p>
              <p>info@lumiere-salon.com</p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background mb-4">
              {t('openingHours')}
            </h4>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between">
                <span>{locale === 'fr' ? 'Lun - Ven' : 'Mon - Fri'}</span>
                <span>9:00 - 19:00</span>
              </div>
              <div className="flex justify-between">
                <span>{locale === 'fr' ? 'Sam' : 'Sat'}</span>
                <span>9:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>{locale === 'fr' ? 'Dim' : 'Sun'}</span>
                <span>{locale === 'fr' ? 'Fermé' : 'Closed'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-sm text-background/40">
          &copy; {new Date().getFullYear()} Lumière Salon. {t('rights')}
        </div>
      </Container>
    </footer>
  )
}
