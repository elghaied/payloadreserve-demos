import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { Container } from './Container'
import { GShellBrand } from './GShellBrand'

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'footer' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tContact = await getTranslations({ locale, namespace: 'contact' })

  const payload = await getPayload({ config })
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale: locale as 'en' | 'fr',
  })

  const year = new Date().getFullYear()

  const serviceLabels: Record<string, string> = {
    lunch: tContact('lunch'),
    dinner: tContact('dinner'),
    brunch: tContact('brunch'),
    bar: tContact('bar'),
  }

  const socialIcons: Record<string, string> = {
    instagram: 'IG',
    facebook: 'FB',
    tripadvisor: 'TA',
    twitter: 'TW',
    'google-maps': 'GM',
  }

  return (
    <footer className="bg-surface border-t border-border">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href={`/${locale}`}
              className="font-heading italic text-2xl font-medium tracking-wide text-foreground hover:text-primary transition-colors"
            >
              Le Jardin
            </Link>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              {siteSettings.tagline || t('tagline')}
            </p>
            {siteSettings.socialLinks && siteSettings.socialLinks.length > 0 && (
              <div className="mt-5 flex items-center gap-3">
                <span className="text-xs text-muted uppercase tracking-widest">{t('followUs')}</span>
                {siteSettings.socialLinks.map((social) => (
                  <a
                    key={social.id ?? social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted hover:text-primary transition-colors"
                    aria-label={social.platform}
                  >
                    {socialIcons[social.platform] ?? social.platform.toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2.5">
              {[
                { href: `/${locale}/menu`, label: tNav('menu') },
                { href: `/${locale}/wines`, label: tNav('wines') },
                { href: `/${locale}/book`, label: tNav('book') },
                { href: `/${locale}/contact`, label: tNav('contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted mb-4">{t('contact')}</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              {siteSettings.address && (
                <li className="leading-relaxed">{siteSettings.address}</li>
              )}
              {siteSettings.phone && (
                <li>
                  <a
                    href={`tel:${siteSettings.phone}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {siteSettings.phone}
                  </a>
                </li>
              )}
              {siteSettings.email && (
                <li>
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {siteSettings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted mb-4">{t('hours')}</h3>
            {siteSettings.serviceHours && siteSettings.serviceHours.length > 0 ? (
              <ul className="space-y-2.5 text-sm">
                {siteSettings.serviceHours.map((hour) => (
                  <li key={hour.id ?? hour.service} className="flex flex-col">
                    <span className="text-foreground">
                      {serviceLabels[hour.service] ?? hour.service}
                    </span>
                    <span className="text-muted text-xs">
                      {hour.days} &bull; {hour.startTime}–{hour.endTime}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">{tContact('closed')}</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>
            &copy; {year} Le Jardin. {t('rights')}.
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/contact`} className="hover:text-foreground transition-colors">
              {tNav('contact')}
            </Link>
            <span className="text-border">|</span>
            <GShellBrand prefix={t('madeBy')} />
          </div>
        </div>
      </Container>
    </footer>
  )
}
