import { createSearchAPI } from 'fumadocs-core/search/server'
import { source } from '@/lib/source'

export const { GET } = createSearchAPI('advanced', {
  indexes: source.getPages().map((page) => ({
    title: (page.data as { title: string }).title,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    structuredData: (page.data as any).structuredData,
    id: page.url,
    url: page.url,
  })),
})
