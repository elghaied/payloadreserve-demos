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
    // Race condition: user landed here before the webhook updated the DB.
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
    // No reservation, wrong status, or no session_id to verify against
    redirect(`/${locale}/book`)
  }

  const startTime = reservation?.startTime ? new Date(reservation.startTime) : null

  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-lg text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-heading text-3xl font-semibold mb-4">
          {t('confirmationTitle')}
        </h1>
        <p className="text-muted mb-8">{t('confirmationMessage')}</p>

        {reservation && (
          <div className="glass border border-border p-6 mb-8 text-left">
            <div className="space-y-3 text-sm">
              {typeof reservation.service === 'object' && reservation.service && (
                <div className="flex justify-between">
                  <span className="text-muted">{t('stepExperience')}</span>
                  <span className="font-medium">
                    {(reservation.service as { name?: string }).name}
                  </span>
                </div>
              )}
              {startTime && (
                <div className="flex justify-between">
                  <span className="text-muted">{t('stepDateTime')}</span>
                  <span className="font-medium">
                    {startTime.toLocaleDateString(locale, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    {startTime.toLocaleTimeString(locale, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
              {(reservation as { partySize?: number }).partySize && (
                <div className="flex justify-between">
                  <span className="text-muted">{t('partySize')}</span>
                  <span className="font-medium">
                    {t('partySizeLabel', {
                      count: (reservation as { partySize?: number }).partySize!,
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="text-muted">{locale === 'fr' ? 'Statut' : 'Status'}</span>
                <span className="font-medium text-green-600 capitalize">
                  {reservation.status}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/book`}
            className="border border-primary text-primary px-6 py-3 text-sm tracking-wide hover:bg-primary hover:text-background transition-colors"
          >
            {t('bookAnother')}
          </Link>
          <Link
            href={`/${locale}/account`}
            className="bg-primary text-background px-6 py-3 text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            {locale === 'fr' ? 'Mon compte' : 'My Account'}
          </Link>
        </div>
      </Container>
    </section>
  )
}
