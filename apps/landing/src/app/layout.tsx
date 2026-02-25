import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { RootProvider } from 'fumadocs-ui/provider'
import { headers } from 'next/headers'
import './globals.css'

export const metadata: Metadata = {
  title: 'payload-reserve | Booking & Reservation Plugin for Payload CMS',
  description:
    'Open-source reservation plugin for Payload CMS 3.x — add bookings, appointments, and scheduling to your Payload app in minutes.',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const locale = headersList.get('x-locale') ?? 'en'

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
