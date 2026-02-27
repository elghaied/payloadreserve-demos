import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload, TypedLocale } from 'payload'
import config from '@payload-config'
import type { Config } from '@/payload-types'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const loc = locale as Config['locale']
  const payload = await getPayload({ config })
  const siteSettings = await payload.findGlobal({ slug: 'site-settings', locale: loc })
  return {
    title: siteSettings.defaultMeta?.title ?? 'payload-reserve',
    description: siteSettings.defaultMeta?.description ?? '',
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'fr')) {
    notFound()
  }
  const payload = await getPayload({ config })
  const [navigation, footerData] = await Promise.all([
    payload.findGlobal({ slug: 'navigation', locale: locale as TypedLocale }),
    payload.findGlobal({ slug: 'footer', locale: locale as TypedLocale }),
  ])
  const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
  const urls = siteSettings.externalUrls
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Nav navigation={navigation} urls={urls} />
      {children}
      <Footer footerData={footerData} urls={urls} />
    </NextIntlClientProvider>
  )
}
