import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { BookingWizard } from './BookingWizard'

type Props = { params: Promise<{ locale: string }> }

export default async function BookPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>}>
      <BookingWizard />
    </Suspense>
  )
}
