import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'defaultMeta',
      type: 'group',
      label: 'Default Meta',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'externalUrls',
      type: 'group',
      label: 'External URLs',
      // URLs are locale-independent
      fields: [
        { name: 'github', type: 'text', defaultValue: 'https://github.com/elghaied/payload-reserve' },
        { name: 'docs', type: 'text', defaultValue: 'https://docs.payloadreserve.com' },
        { name: 'gshell', type: 'text', defaultValue: 'https://gshell.fr' },
        { name: 'payloadcms', type: 'text', defaultValue: 'https://payloadcms.com' },
        { name: 'nextjs', type: 'text', defaultValue: 'https://nextjs.org' },
      ],
    },
  ],
}
