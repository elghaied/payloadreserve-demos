import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Content',
  },
  fields: [
    { name: 'docsLabel', type: 'text', defaultValue: 'Docs', localized: true },
    { name: 'demosLabel', type: 'text', defaultValue: 'Demos', localized: true },
    { name: 'githubLabel', type: 'text', defaultValue: 'GitHub', localized: true },
    { name: 'requestDemoLabel', type: 'text', defaultValue: 'Request Demo', localized: true },
  ],
}
