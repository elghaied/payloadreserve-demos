import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { cancelPendingReservation } from '../actions'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ reservation?: string }>
}

export default async function BookingCancelPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { reservation: reservationId } = await searchParams
  setRequestLocale(locale)

  if (reservationId) {
    await cancelPendingReservation(reservationId)
  }

  const t = await getTranslations({ locale, namespace: 'booking' })

  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-lg text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 bg-warning/10 border border-warning/20">
          <svg className="w-7 h-7 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="font-heading text-3xl font-semibold mb-3 tracking-tight">{t('paymentCancelled')}</h1>
        <div className="w-10 h-px bg-primary mx-auto mb-4" />
        <p className="text-muted mb-10">{t('paymentCancelledMessage')}</p>
        <Link
          href={`/${locale}/book`}
          className="inline-block bg-primary text-background px-8 py-4 text-sm tracking-widest uppercase hover:bg-primary-dark transition-all duration-300 copper-glow-sm"
        >
          {t('tryAgain')}
        </Link>
      </Container>
    </section>
  )
}
