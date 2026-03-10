import { getPayload } from 'payload'
import config from '@payload-config'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { ScrollReveal } from '@/components/ScrollReveal'
import type { SiteSetting } from '@/payload-types'

type Props = { params: Promise<{ locale: string }> }

const dressCodeLabelMap: Record<string, string> = {
  casual: 'Casual',
  'smart-casual': 'Smart Casual',
  'business-casual': 'Business Casual',
  formal: 'Formal',
}

const socialIconMap: Record<string, string> = {
  instagram: '📷',
  facebook: 'f',
  tripadvisor: '🦉',
  twitter: '𝕏',
  'google-maps': '📍',
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'en' | 'fr'
  const payload = await getPayload({ config })
  const t = await getTranslations({ locale, namespace: 'contact' })

  const siteSettings: SiteSetting = await payload.findGlobal({
    slug: 'site-settings',
    locale: loc,
  })

  return (
    <main className="min-h-screen py-24 md:py-32">
      <Container>
        {/* Page header */}
        <ScrollReveal>
          <div className="text-center mb-20 space-y-4">
            <p className="text-primary text-sm uppercase tracking-widest">{t('title')}</p>
            <hr className="hr-rose w-24 mx-auto" />
            <h1 className="font-heading text-4xl md:text-6xl text-foreground">
              {siteSettings.restaurantName}
            </h1>
            <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left column: contact info + hours */}
          <div className="space-y-10">
            {/* Contact details */}
            <ScrollReveal>
              <div className="glass rounded-sm p-8 space-y-6">
                {siteSettings.address && (
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-gold">{t('address')}</p>
                    <p className="text-foreground leading-relaxed">{siteSettings.address}</p>
                  </div>
                )}

                {siteSettings.phone && (
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-gold">{t('phone')}</p>
                    <a
                      href={`tel:${siteSettings.phone.replace(/\s/g, '')}`}
                      className="text-foreground hover:text-primary transition-colors duration-200"
                    >
                      {siteSettings.phone}
                    </a>
                  </div>
                )}

                {siteSettings.email && (
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-gold">
                      {t('emailAddress')}
                    </p>
                    <a
                      href={`mailto:${siteSettings.email}`}
                      className="text-foreground hover:text-primary transition-colors duration-200"
                    >
                      {siteSettings.email}
                    </a>
                  </div>
                )}

                {/* Social links */}
                {siteSettings.socialLinks && siteSettings.socialLinks.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <div className="flex flex-wrap gap-3">
                      {siteSettings.socialLinks.map((link) => (
                        <Link
                          key={link.id ?? link.platform}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass rounded-sm px-4 py-2 text-xs uppercase tracking-wider text-muted hover:text-foreground hover:border-primary/30 transition-all duration-200"
                        >
                          {link.platform}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Service hours */}
            {siteSettings.serviceHours && siteSettings.serviceHours.length > 0 && (
              <ScrollReveal delay={100}>
                <div className="glass rounded-sm p-8 space-y-5">
                  <h2 className="font-heading text-2xl text-foreground">{t('hours')}</h2>
                  <hr className="hr-rose" />
                  <div className="space-y-4">
                    {siteSettings.serviceHours.map((sh) => {
                      const serviceLabel = t(sh.service as Parameters<typeof t>[0])
                      return (
                        <div key={sh.id ?? sh.service} className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-foreground font-medium text-sm">
                              {String(serviceLabel)}
                            </p>
                            <p className="text-muted text-xs mt-0.5">{sh.days}</p>
                          </div>
                          <p className="text-gold text-sm shrink-0">
                            {sh.startTime} – {sh.endTime}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Right column: policies */}
          <div className="space-y-6">
            <ScrollReveal>
              <div className="glass rounded-sm p-8 space-y-6">
                <h2 className="font-heading text-2xl text-foreground">{t('policies')}</h2>
                <hr className="hr-rose" />

                {siteSettings.dressCode && (
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-gold">{t('dressCode')}</p>
                    <p className="text-foreground text-sm">
                      {dressCodeLabelMap[siteSettings.dressCode] ?? siteSettings.dressCode}
                    </p>
                  </div>
                )}

                {siteSettings.parkingInfo && (
                  <div className="space-y-1 pt-4 border-t border-border/40">
                    <p className="text-xs uppercase tracking-widest text-gold">{t('parking')}</p>
                    <p className="text-muted text-sm leading-relaxed">{siteSettings.parkingInfo}</p>
                  </div>
                )}

                {siteSettings.accessibilityInfo && (
                  <div className="space-y-1 pt-4 border-t border-border/40">
                    <p className="text-xs uppercase tracking-widest text-gold">
                      {t('accessibility')}
                    </p>
                    <p className="text-muted text-sm leading-relaxed">
                      {siteSettings.accessibilityInfo}
                    </p>
                  </div>
                )}

                {siteSettings.reservationPolicy && (
                  <div className="space-y-1 pt-4 border-t border-border/40">
                    <p className="text-xs uppercase tracking-widest text-gold">
                      {t('reservationPolicy')}
                    </p>
                    <p className="text-muted text-sm leading-relaxed">
                      {siteSettings.reservationPolicy}
                    </p>
                  </div>
                )}

                {siteSettings.cancellationPolicy && (
                  <div className="space-y-1 pt-4 border-t border-border/40">
                    <p className="text-xs uppercase tracking-widest text-gold">
                      {t('cancellationPolicy')}
                    </p>
                    <p className="text-muted text-sm leading-relaxed">
                      {siteSettings.cancellationPolicy}
                    </p>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Reserve CTA */}
            <ScrollReveal delay={150}>
              <div className="glass rounded-sm p-8 text-center space-y-4">
                <h3 className="font-heading text-2xl text-foreground">Ready to dine with us?</h3>
                <Link
                  href={`/${locale}/booking`}
                  className="inline-block border border-primary/40 text-primary px-10 py-3 rounded-sm text-sm uppercase tracking-widest hover:bg-primary hover:text-background transition-all duration-300"
                >
                  Reserve a Table
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </main>
  )
}
