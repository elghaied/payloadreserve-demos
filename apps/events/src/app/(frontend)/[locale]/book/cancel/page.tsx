import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { cancelPendingBooking } from '../actions'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ reservation?: string }>
}

export default async function BookingCancelPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { reservation: bookingId } = await searchParams
  setRequestLocale(locale)

  // Free the held slot immediately
  if (bookingId) {
    await cancelPendingBooking(bookingId)
  }

  const t = await getTranslations({ locale, namespace: 'booking' })

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border-[3px] border-neutral-300">
          <svg className="h-8 w-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="mb-4 text-4xl font-black uppercase tracking-[-1px]">
          {t('paymentCancelled')}
        </h1>
        <p className="mb-8 text-neutral-600">{t('paymentCancelledMessage')}</p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}/book`}
            className="bg-black px-8 py-3 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800"
          >
            {t('tryAgain')}
          </Link>
          <Link
            href={`/${locale}`}
            className="border-[3px] border-black px-8 py-3 font-mono text-[10px] uppercase tracking-[2px] transition-colors hover:bg-black hover:text-white"
          >
            {t('backHome')}
          </Link>
        </div>
      </div>
    </section>
  )
}
