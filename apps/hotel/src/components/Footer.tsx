import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

import { Container } from './Container'
import { GShellBrand } from './GShellBrand'
import { Ornament } from './Ornament'

type Props = {
  locale: string
}

export async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'footer' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  return (
    <footer className="relative bg-surface mt-auto overflow-hidden">
      <div className="absolute top-0 left-0 right-0">
        <hr className="hr-copper" />
      </div>

      {/* Watermark monogram */}
      <div className="absolute -bottom-8 -right-4 pointer-events-none select-none opacity-[0.025]">
        <span className="font-heading text-[18rem] font-bold text-foreground leading-none">GH</span>
      </div>

      <Container className="py-16 lg:py-20 relative">
        {/* Top section — brand + ornament */}
        <div className="text-center mb-14">
          <Ornament variant="monogram" className="mb-4 flex justify-center" />
          <p className="text-xs tracking-[0.3em] uppercase text-muted-light">
            {locale === 'fr' ? 'Depuis 1928 · Paris' : 'Est. 1928 · Paris'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-heading text-2xl font-bold mb-4">
              Grand<span className="text-gradient-copper"> Hotel</span>
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {locale === 'fr'
                ? 'Un luxe intemporel au coeur de la ville depuis 1928.'
                : 'Timeless luxury in the heart of the city since 1928.'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-6">
              {t('quickLinks')}
            </h4>
            <nav className="flex flex-col gap-3">
              <Link href={`/${locale}/rooms`} className="text-sm text-muted hover:text-primary transition-colors duration-300">
                {tNav('rooms')}
              </Link>
              <Link href={`/${locale}/book`} className="text-sm text-muted hover:text-primary transition-colors duration-300">
                {tNav('book')}
              </Link>
              <Link href={`/${locale}/gallery`} className="text-sm text-muted hover:text-primary transition-colors duration-300">
                {tNav('gallery')}
              </Link>
              <Link href={`/${locale}/contact`} className="text-sm text-muted hover:text-primary transition-colors duration-300">
                {tNav('contact')}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-6">
              Contact
            </h4>
            <div className="flex flex-col gap-3 text-sm text-muted">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary/60 shrink-0" />
                1 Place de la Concorde, Paris 75008
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary/60 shrink-0" />
                +33 1 42 68 00 00
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary/60 shrink-0" />
                reservations@grandhotel.com
              </p>
            </div>
          </div>

          {/* Check-in/out */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-6">
              {locale === 'fr' ? 'Informations' : 'Information'}
            </h4>
            <div className="flex flex-col gap-3 text-sm text-muted">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary/60" />
                  {t('checkIn')}
                </span>
                <span className="text-foreground font-medium">15:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary/60" />
                  {t('checkOut')}
                </span>
                <span className="text-foreground font-medium">11:00</span>
              </div>
              <p className="text-muted-light text-xs mt-2">
                {locale === 'fr' ? 'Reception 24h/24' : '24-hour front desk'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Ornament variant="line" />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-light">
            &copy; {new Date().getFullYear()} Grand Hotel. {t('rights')}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-light">
            <span>Powered by <span className="text-primary font-medium">payload-reserve</span></span>
            <span className="text-muted-light/30">|</span>
            <GShellBrand size="sm" />
          </div>
        </div>
      </Container>
    </footer>
  )
}
