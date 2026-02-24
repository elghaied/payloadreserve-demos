import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Container } from '@/components/Container'
import { getBookingConfirmation, confirmReservationViaStripe } from '../actions'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ reservation?: string; session_id?: string }>
}

export default async function BookingSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { reservation: reservationId, session_id: sessionId } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'booking' })

  let reservation = null
  if (reservationId) {
    try {
      reservation = await getBookingConfirmation(reservationId)
    } catch {
      // ignore
    }
  }

  // Happy path: webhook already fired
  if (reservation?.status === 'confirmed') {
    // fall through to render
  } else if (reservation?.status === 'pending' && sessionId) {
    // Race condition: user landed here before the webhook updated the DB (or webhook was delayed).
    // Verify payment with Stripe and update the DB directly as a fallback.
    const confirmed = await confirmReservationViaStripe(reservationId!, sessionId)
    if (!confirmed) {
      redirect(`/${locale}/book`)
    }
    // Re-fetch to get the updated confirmed status for display
    try {
      reservation = await getBookingConfirmation(reservationId!)
    } catch {
      // ignore re-fetch errors — we already confirmed via Stripe
    }
  } else {
    // No reservation, wrong status (cancelled/etc.), or no session_id to verify against
    redirect(`/${locale}/book`)
  }

  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-lg text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-heading text-3xl font-semibold mb-4">{t('confirmationTitle')}</h1>
        <p className="text-muted mb-8">{t('confirmationMessage')}</p>

        {reservation && (
          <div className="border border-border p-6 mb-8 text-left">
            <div className="space-y-3 text-sm">
              {typeof reservation.service === 'object' && (
                <div className="flex justify-between">
                  <span className="text-muted">{t('stepService')}</span>
                  <span className="font-medium">{reservation.service.name}</span>
                </div>
              )}
              {typeof reservation.resource === 'object' && (
                <div className="flex justify-between">
                  <span className="text-muted">{t('stepSpecialist')}</span>
                  <span className="font-medium">{reservation.resource.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">{t('stepDateTime')}</span>
                <span className="font-medium">
                  {new Date(reservation.startTime).toLocaleDateString(locale, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  {new Date(reservation.startTime).toLocaleTimeString(locale, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/book`}
            className="border border-primary text-primary px-6 py-3 text-sm tracking-wide hover:bg-primary hover:text-white transition-colors"
          >
            {t('bookAnother')}
          </Link>
          <Link
            href={`/${locale}/account`}
            className="bg-primary text-white px-6 py-3 text-sm tracking-wide hover:bg-primary-dark transition-colors"
          >
            {locale === 'fr' ? 'Mon compte' : 'My Account'}
          </Link>
        </div>
      </Container>
    </section>
  )
}
