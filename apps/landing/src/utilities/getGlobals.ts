import configPromise from '@payload-config'
import { getPayload, TypedLocale, DataFromGlobalSlug } from 'payload'
import { unstable_cache } from 'next/cache'
import { Config } from '@/payload-types'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0, locale?: TypedLocale): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale,
  })

  return global as DataFromGlobalSlug<T>
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0, locale?: TypedLocale) =>
  unstable_cache(async () => getGlobal(slug, depth, locale), [slug, locale ?? 'default'], {
    tags: [`global_${slug}_${locale ?? 'default'}`],
  })
