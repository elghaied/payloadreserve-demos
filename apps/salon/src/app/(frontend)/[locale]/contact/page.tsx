'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Container } from '@/components/Container'

export default function ContactPage() {
  const t = useTranslations('contact')
  const params = useParams()
  const locale = params.locale as string

  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // Simulate sending — in production this would call a server action
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl lg:text-5xl font-semibold mb-4">
            {t('title')}
          </h1>
          <p className="text-muted max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Contact form */}
          <div>
            {sent ? (
              <div className="bg-success/10 text-success p-6 text-center">
                <p className="font-medium">{t('sent')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                    {t('nameLabel')}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                    {t('emailLabel')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                    {t('messageLabel')}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 text-sm tracking-wide hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {loading ? '...' : t('send')}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">{t('address')}</h3>
              <p className="text-muted">123 Rue de la Beauté<br />Montreal, QC H2X 1Y6</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">{t('phone')}</h3>
              <p className="text-muted">(514) 555-0123</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">{t('emailAddress')}</h3>
              <p className="text-muted">info@lumiere-salon.com</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">{t('hours')}</h3>
              <div className="space-y-1 text-sm text-muted">
                <div className="flex justify-between">
                  <span>{locale === 'fr' ? 'Lundi - Vendredi' : 'Monday - Friday'}</span>
                  <span>9:00 - 19:00</span>
                </div>
                <div className="flex justify-between">
                  <span>{locale === 'fr' ? 'Samedi' : 'Saturday'}</span>
                  <span>9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>{locale === 'fr' ? 'Dimanche' : 'Sunday'}</span>
                  <span>{t('closed')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
