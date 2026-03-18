import type { Metadata } from 'next'
import type { Media } from '@/payload-types'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || ''

export function buildAlternates(locale: string, path: string): Metadata['alternates'] {
  const cleanPath = path === '/' ? '' : path
  return {
    canonical: `${SERVER_URL}/${locale}${cleanPath}`,
    languages: {
      en: `${SERVER_URL}/en${cleanPath}`,
      fr: `${SERVER_URL}/fr${cleanPath}`,
      'x-default': `${SERVER_URL}/en${cleanPath}`,
    },
  }
}

export function getOgImageUrl(image?: Media | string | null): string {
  if (image && typeof image === 'object' && image.url) {
    return image.url.startsWith('http') ? image.url : `${SERVER_URL}${image.url}`
  }
  return `${SERVER_URL}/og.webp`
}

export function mergeOpenGraph(
  overrides?: Partial<NonNullable<Metadata['openGraph']>>,
): Metadata['openGraph'] {
  return {
    type: 'website',
    siteName: 'payload-reserve',
    images: [{ url: `${SERVER_URL}/og.webp`, width: 1200, height: 630 }],
    ...overrides,
  }
}
