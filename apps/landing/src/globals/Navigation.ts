import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/utilities/revalidateCache'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Content',
  },
  hooks: {
    afterChange: [() => revalidateGlobal('navigation')],
  },
  fields: [
    { name: 'docsLabel', type: 'text', defaultValue: 'Docs', localized: true },
    { name: 'demosLabel', type: 'text', defaultValue: 'Demos', localized: true },
    { name: 'githubLabel', type: 'text', defaultValue: 'GitHub', localized: true },
    { name: 'requestDemoLabel', type: 'text', defaultValue: 'Request Demo', localized: true },
  ],
}
