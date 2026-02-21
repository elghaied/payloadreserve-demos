import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Container } from '@/components/Container'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale })
  const payload = await getPayload({ config })

  const services = await payload.find({
    collection: 'services',
    where: { active: { equals: true } },
    limit: 50,
    locale: locale as 'en' | 'fr',
    sort: 'name',
  })

  // Group by category if available, otherwise flat list
  const grouped = new Map<string, typeof services.docs>()
  for (const service of services.docs) {
    const category = ((service as unknown as Record<string, unknown>).category as string) || 'Other'
    if (!grouped.has(category)) grouped.set(category, [])
    grouped.get(category)!.push(service)
  }

  return (
    <>
      <section className="py-16 lg:py-24">
        <Container>
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl lg:text-5xl font-semibold mb-4">
              {t('services.title')}
            </h1>
            <p className="text-muted max-w-xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          {services.docs.length === 0 ? (
            <p className="text-center text-muted">{t('services.noServices')}</p>
          ) : (
            <div className="space-y-16">
              {Array.from(grouped.entries()).map(([category, categoryServices]) => (
                <div key={category}>
                  {grouped.size > 1 && (
                    <h2 className="font-heading text-2xl font-semibold mb-8 pb-3 border-b border-border">
                      {category}
                    </h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryServices.map((service) => (
                      <div
                        key={service.id}
                        className="border border-border p-8 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-heading text-xl font-semibold mb-2">{service.name}</h3>
                        <p className="text-muted text-sm mb-6 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between mb-6">
                          <div className="text-sm text-muted">
                            <span>{service.duration} {t('common.minutes')}</span>
                          </div>
                          <span className="text-lg font-semibold text-primary">${service.price}</span>
                        </div>
                        <Link
                          href={`/${locale}/book?service=${service.id}`}
                          className="block text-center bg-primary text-white py-3 text-sm tracking-wide hover:bg-primary-dark transition-colors"
                        >
                          {t('common.bookNow')}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
