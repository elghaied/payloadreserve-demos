import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getBookingConfirmation, confirmBookingViaStripe } from '../actions'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ reservation?: string; session_id?: string }>
}

export default async function BookingSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { reservation: bookingId, session_id: sessionId } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'booking' })

  let booking = null
  if (bookingId) {
    try {
      booking = await getBookingConfirmation(bookingId)
    } catch {
      // ignore
    }
  }

  if (booking?.status === 'confirmed') {
    // Webhook already fired — fall through to render
  } else if (booking?.status === 'pending' && sessionId) {
    const confirmed = await confirmBookingViaStripe(bookingId!, sessionId)
    if (!confirmed) {
      redirect(`/${locale}/book`)
    }
    try {
      booking = await getBookingConfirmation(bookingId!)
    } catch {
      // ignore re-fetch errors
    }
  } else {
    redirect(`/${locale}/book`)
  }

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border-[3px] border-black">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mb-4 text-4xl font-black uppercase tracking-[-1px]">
          {t('success')}
        </h1>
        <p className="mb-8 text-neutral-600">{t('successMessage')}</p>

        {booking && (
          <div className="mb-8 border-[3px] border-black p-6 text-left">
            <div className="space-y-3 text-sm">
              {typeof booking.service === 'object' && (
                <div className="flex justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                    {t('eventType')}
                  </span>
                  <span className="font-bold">{booking.service.name}</span>
                </div>
              )}
              {typeof booking.resource === 'object' && (
                <div className="flex justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                    {t('venue')}
                  </span>
                  <span className="font-bold">{booking.resource.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                  {t('date')}
                </span>
                <span className="font-bold">
                  {new Date(booking.startTime).toLocaleDateString(locale, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                  {t('time')}
                </span>
                <span className="font-bold">
                  {new Date(booking.startTime).toLocaleTimeString(locale, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {booking.ticketQuantity && (
                <div className="flex justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
                    {t('tickets')}
                  </span>
                  <span className="font-bold">{booking.ticketQuantity}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}/book`}
            className="border-[3px] border-black px-6 py-3 font-mono text-[10px] uppercase tracking-[2px] transition-colors hover:bg-black hover:text-white"
          >
            {t('bookAnother')}
          </Link>
          <Link
            href={`/${locale}/account`}
            className="bg-black px-6 py-3 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800"
          >
            {t('myAccount')}
          </Link>
        </div>
      </div>
    </section>
  )
}
