import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { Container } from '@/components/Container'

type Props = { params: Promise<{ locale: string }> }

export default async function GiftsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'gifts' })

  const packages = [
    { name: locale === 'fr' ? 'Évasion Détente' : 'Relaxation Escape', price: 150, items: locale === 'fr' ? 'Massage suédois + Soin du visage classique' : 'Swedish Massage + Classic Facial' },
    { name: locale === 'fr' ? 'Beauté Complète' : 'Complete Beauty', price: 220, items: locale === 'fr' ? 'Soin du visage + Lifting des cils + Manucure gel' : 'Facial + Lash Lift + Gel Manicure' },
    { name: locale === 'fr' ? 'Journée Lumière' : 'Lumière Day', price: 350, items: locale === 'fr' ? 'Massage + Soin du visage + Manucure + Mise en beauté des sourcils' : 'Massage + Facial + Manicure + Brow Shaping' },
  ]

  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl lg:text-5xl font-semibold mb-4">{t('title')}</h1>
          <p className="text-muted max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="max-w-3xl mx-auto mb-20">
          <div className="border border-border p-10 text-center">
            <h2 className="font-heading text-2xl font-semibold mb-4">{t('treatSomeone')}</h2>
            <p className="text-muted mb-8 max-w-md mx-auto">{t('treatDescription')}</p>
            <Link
              href={`/${locale}/contact`}
              className="inline-block bg-primary text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-primary-dark transition-colors"
            >
              {t('purchaseGiftCard')}
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl font-semibold text-center mb-10">{t('packages')}</h2>
          <div className="space-y-4">
            {packages.map((pkg, i) => (
              <div key={i} className="border border-border p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-semibold">{pkg.name}</h3>
                  <p className="text-sm text-muted mt-1">{pkg.items}</p>
                </div>
                <span className="text-xl font-semibold text-primary ml-4">${pkg.price}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted mt-8">{t('contactForPackages')}</p>
        </div>
      </Container>
    </section>
  )
}
