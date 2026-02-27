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
      name: 'demoDetailUi',
      type: 'group',
      label: 'Demo Detail Page UI',
      admin: { description: 'Labels and chrome for /demos/[type] pages' },
      fields: [
        { name: 'backToDemos', type: 'text', localized: true },
        { name: 'visitLiveDemo', type: 'text', localized: true },
        { name: 'demoComingSoon', type: 'text', localized: true },
        { name: 'requestPrivateDemo', type: 'text', localized: true },
        { name: 'featuresLabel', type: 'text', localized: true },
        { name: 'screenshotsHeading', type: 'text', localized: true },
        { name: 'screenshotsComingSoon', type: 'text', localized: true },
        { name: 'screenshotsLivePromptBefore', type: 'text', localized: true },
        { name: 'screenshotsLiveDemoLabel', type: 'text', localized: true },
        { name: 'screenshotsLivePromptAfter', type: 'text', localized: true },
        { name: 'configurationLabel', type: 'text', localized: true },
        { name: 'payloadConfigFile', type: 'text', localized: true },
        { name: 'docsNoteBefore', type: 'text', localized: true },
        { name: 'docsLinkLabel', type: 'text', localized: true },
        { name: 'docsNoteAfter', type: 'text', localized: true },
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
