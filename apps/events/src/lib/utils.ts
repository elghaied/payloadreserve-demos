import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Convert short locale ('en', 'fr') to BCP 47 tag for Intl APIs */
export function toBcp47(locale: string): string {
  const map: Record<string, string> = { en: 'en-US', fr: 'fr-FR' }
  return map[locale] ?? locale
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
