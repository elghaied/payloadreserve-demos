import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Content',
  },
  fields: [
    { name: 'docsLabel', type: 'text', defaultValue: 'Docs' },
    { name: 'demosLabel', type: 'text', defaultValue: 'Demos' },
    { name: 'githubLabel', type: 'text', defaultValue: 'GitHub' },
    { name: 'requestDemoLabel', type: 'text', defaultValue: 'Request Demo' },
  ],
}
