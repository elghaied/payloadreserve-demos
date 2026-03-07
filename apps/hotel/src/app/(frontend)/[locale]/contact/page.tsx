import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

import config from '@/payload.config'
import { Container } from '@/components/Container'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Ornament } from '@/components/Ornament'
import { Card } from '@/components/ui/card'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'contact' })
  const payload = await getPayload({ config })

  const settings = await payload.findGlobal({ slug: 'site-settings' })

  const contactInfo = [
    {
      icon: MapPin,
      label: t('address'),
      value: settings?.address || '1 Place de la Concorde\nParis 75008, France',
    },
    {
      icon: Phone,
      label: t('phone'),
      value: settings?.phone || '+33 1 42 68 00 00',
    },
    {
      icon: Mail,
      label: t('emailAddress'),
      value: settings?.email || 'reservations@grandhotel.com',
    },
    {
      icon: Clock,
      label: t('hours'),
      value: locale === 'fr' ? 'Reception ouverte 24h/24, 7j/7' : 'Front desk open 24/7',
    },
  ]

  return (
    <>
      {/* Header */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent via-background to-background" />
        <div className="absolute inset-0 noise pointer-events-none" />

        {/* Floating watermark */}
        <div className="absolute bottom-0 right-8 lg:right-16 hidden lg:block pointer-events-none select-none">
          <span className="font-heading text-[10rem] font-bold text-foreground/[0.02] leading-none">
            GH
          </span>
        </div>

        <Container className="relative z-10 text-center">
          <ScrollReveal direction="none">
            <Ornament className="mb-8" />
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <h1 className="font-heading text-4xl lg:text-6xl xl:text-7xl font-bold mb-6">
              {t('title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <p className="text-muted max-w-lg mx-auto text-base lg:text-lg leading-relaxed">
              {t('subtitle')}
            </p>
          </ScrollReveal>
        </Container>

        <div className="absolute bottom-0 left-0 right-0">
          <hr className="hr-copper" />
        </div>
      </section>

      {/* Content */}
      <section className="py-20 lg:py-28">
        <Container className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact info */}
            <div>
              <ScrollReveal>
                <Ornament variant="line" className="mb-8 justify-start" />
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-6 font-medium">
                  {locale === 'fr' ? 'Nous trouver' : 'Find Us'}
                </p>
              </ScrollReveal>

              <div className="space-y-8">
                {contactInfo.map((item, i) => (
                  <ScrollReveal key={item.label} delay={i * 100}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xs tracking-wider uppercase text-muted font-medium mb-1.5">
                          {item.label}
                        </h3>
                        <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-line">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Contact form (static/visual for demo) */}
            <ScrollReveal delay={200}>
              <Card className="p-8">
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-6 font-medium">
                  {locale === 'fr' ? 'Ecrivez-nous' : 'Write to Us'}
                </p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-muted mb-2 font-medium">
                      {t('nameLabel')}
                    </label>
                    <input
                      type="text"
                      className="w-full border border-border bg-background/50 px-4 py-3 text-sm text-foreground rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-muted mb-2 font-medium">
                      {t('emailLabel')}
                    </label>
                    <input
                      type="email"
                      className="w-full border border-border bg-background/50 px-4 py-3 text-sm text-foreground rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-muted mb-2 font-medium">
                      {t('messageLabel')}
                    </label>
                    <textarea
                      rows={5}
                      className="w-full border border-border bg-background/50 px-4 py-3 text-sm text-foreground rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none placeholder:text-muted-light"
                    />
                  </div>
                  <button className="w-full bg-primary text-white py-3 text-sm font-medium tracking-wide rounded-md hover:bg-primary-dark hover:copper-glow-sm transition-all active:scale-[0.98]">
                    {t('send')}
                  </button>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    </>
  )
}
