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
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  let reservation = null
  if (reservationId) {
    try { reservation = await getBookingConfirmation(reservationId) } catch { /* ignore */ }
  }

  if (reservation?.status === 'confirmed') {
    // fall through
  } else if (reservation?.status === 'pending' && sessionId) {
    const confirmed = await confirmReservationViaStripe(reservationId!, sessionId)
    if (!confirmed) redirect(`/${locale}/book`)
    try { reservation = await getBookingConfirmation(reservationId!) } catch { /* ignore */ }
  } else {
    redirect(`/${locale}/book`)
  }

  const nights = reservation?.startTime && reservation?.endTime
    ? Math.ceil((new Date(reservation.endTime).getTime() - new Date(reservation.startTime).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-lg text-center">
        {/* Success icon with copper glow */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 bg-success/10 border border-success/20">
          <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-heading text-3xl font-semibold mb-3 tracking-tight">{t('confirmationTitle')}</h1>
        <div className="w-10 h-px bg-primary mx-auto mb-4" />
        <p className="text-muted mb-10">{t('confirmationMessage')}</p>

        {reservation && (
          <div className="glass-strong p-6 mb-10 text-left">
            <div className="space-y-3 text-sm">
              {typeof reservation.service === 'object' && (
                <div className="flex justify-between">
                  <span className="text-muted">{t('stepRoom')}</span>
                  <span className="font-medium">{reservation.service.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">{t('checkIn')}</span>
                <span className="font-medium">
                  {new Date(reservation.startTime).toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              {reservation.endTime && (
                <div className="flex justify-between">
                  <span className="text-muted">{t('checkOut')}</span>
                  <span className="font-medium">
                    {new Date(reservation.endTime).toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              )}
              {nights > 0 && (
                <>
                  <div className="hr-copper my-3" />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t('totalStay')}</span>
                    <span className="font-semibold text-gradient-copper">
                      {nights} {tCommon('nights')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/book`}
            className="border border-primary/50 text-primary px-6 py-3.5 text-sm tracking-widest uppercase hover:bg-primary hover:text-background transition-all duration-300"
          >
            {t('bookAnother')}
          </Link>
          <Link
            href={`/${locale}/account`}
            className="bg-primary text-background px-6 py-3.5 text-sm tracking-widest uppercase hover:bg-primary-dark transition-all duration-300 copper-glow-sm"
          >
            {locale === 'fr' ? 'Mon compte' : 'My Account'}
          </Link>
        </div>
      </Container>
    </section>
  )
}
