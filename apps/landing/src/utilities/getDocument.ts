import configPromise from '@payload-config'
import { getPayload, TypedLocale, DataFromCollectionSlug } from 'payload'
import { unstable_cache } from 'next/cache'
import { Config } from '@/payload-types'

type Collection = keyof Config['collections']

async function getDocument<T extends Collection>(
  collection: T,
  slug: string,
  locale?: TypedLocale,
  depth = 0,
): Promise<DataFromCollectionSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection,
    depth,
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return page.docs[0] as DataFromCollectionSlug<T>
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedDocument = <T extends Collection>(
  collection: T,
  slug: string,
  locale?: TypedLocale,
  depth = 0,
) =>
  unstable_cache(
    async () => getDocument(collection, slug, locale, depth),
    [collection, slug, locale ?? 'default'],
    {
      tags: [`${collection}_${slug}_${locale ?? 'default'}`],
    },
  )
