import { setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'

import { BookingWizard } from './BookingWizard'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function BookPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Suspense>
      <BookingWizard />
    </Suspense>
  )
}
