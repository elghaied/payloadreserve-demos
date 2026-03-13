import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', locale: locale as 'en' | 'fr' })

  return {
    title: {
      default: `${settings.venueName}`,
      template: `%s — ${settings.venueName}`,
    },
    description: settings.tagline,
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'en' | 'fr')) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  // Fetch site settings for footer
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', locale: locale as 'en' | 'fr' })

  return (
    <NextIntlClientProvider messages={messages}>
      <Header locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} settings={settings} />
    </NextIntlClientProvider>
  )
}
