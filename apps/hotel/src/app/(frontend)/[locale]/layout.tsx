import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { routing } from '@/i18n/routing'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { libreBaskerville } from '@/lib/fonts'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: locale === 'fr' ? 'Grand Hotel — Luxe intemporel' : 'Grand Hotel — Timeless Luxury',
    description:
      locale === 'fr'
        ? 'Vivez un luxe intemporel au coeur de la ville'
        : 'Experience timeless luxury in the heart of the city',
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'fr')) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${GeistSans.variable} ${libreBaskerville.variable}`}>
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
