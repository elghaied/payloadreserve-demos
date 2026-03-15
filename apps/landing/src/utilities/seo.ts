import type { Metadata } from 'next'

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
