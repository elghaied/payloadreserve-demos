import type { ReactNode } from 'react'
import Image from 'next/image'
import { RootProvider } from 'fumadocs-ui/provider'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { source } from '@/lib/source'
import { Outfit, DM_Mono } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <RootProvider>
          <DocsLayout
            tree={source.pageTree}
            nav={{
              title: (
                <span className="flex items-center gap-2">
                  <Image
                    src="/reserve-logo.svg"
                    alt="payload-reserve"
                    width={24}
                    height={24}
                  />
                  <span className="font-mono text-sm font-semibold">
                    payload
                    <span className="text-fd-primary">-reserve</span>
                  </span>
                </span>
              ),
              url: 'https://payloadreserve.com',
            }}
            githubUrl="https://github.com/elghaied/payload-reserve"
            links={[
              {
                text: 'payloadreserve.com',
                url: 'https://payloadreserve.com',
                external: true,
              },
            ]}
          >
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  )
}
