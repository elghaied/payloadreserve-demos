import { revalidateTag } from 'next/cache'

const locales = ['en', 'fr', 'default'] as const

/**
 * Revalidates all locale variants of a cached global.
 * Use in `afterChange` hooks on GlobalConfigs.
 */
export function revalidateGlobal(slug: string): void {
  for (const locale of locales) {
    revalidateTag(`global_${slug}_${locale}`)
  }
}

/**
 * Revalidates all locale variants of a cached collection document.
 * Use in `afterChange` hooks on CollectionConfigs.
 */
export function revalidateCollection(collection: string, slug?: string): void {
  for (const locale of locales) {
    if (slug) {
      revalidateTag(`${collection}_${slug}_${locale}`)
    }
    revalidateTag(`${collection}_list_${locale}`)
  }
}
