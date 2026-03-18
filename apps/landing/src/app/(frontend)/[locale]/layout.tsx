import type { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { TypedLocale } from 'payload'
import { DM_Serif_Display, Outfit, DM_Mono } from 'next/font/google'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { mergeOpenGraph, getOgImageUrl } from '@/utilities/seo'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-dm-serif',
})

const dmMono = DM_Mono({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
})

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const loc = locale as TypedLocale
  const [siteSettings, homepage] = await Promise.all([
    getCachedGlobal('site-settings', 0, loc)(),
    getCachedGlobal('home-page', 1, loc)(),
  ])

  const title = siteSettings.defaultMeta?.title ?? 'payload-reserve'
  const description = siteSettings.defaultMeta?.description ?? ''
  const ogImage = getOgImageUrl(homepage.meta?.image)

  return {
    title,
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadreserve.com'),
    openGraph: mergeOpenGraph({
      title,
      description,
      locale,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'fr')) {
    notFound()
  }

  const loc = locale as TypedLocale
  const [navigation, footerData, siteSettings, messages] = await Promise.all([
    getCachedGlobal('navigation', 0, loc)(),
    getCachedGlobal('footer', 0, loc)(),
    getCachedGlobal('site-settings', 0, loc)(),
    getMessages(),
  ])
  const urls = siteSettings.externalUrls

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${outfit.variable} ${dmSerifDisplay.variable} ${dmMono.variable}`}
    >
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-violet-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Nav navigation={navigation} urls={urls} />
            {children}
            <Footer footerData={footerData} urls={urls} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
