import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: 'Content',
  },
  fields: [
    { name: 'description', type: 'textarea', localized: true },
    { name: 'copyright', type: 'text', defaultValue: '© 2026 payload-reserve. MIT License.', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'madeByLabel', label: 'Made by label', type: 'text', defaultValue: 'Made by', localized: true },
        { name: 'builtWithLabel', label: 'Built with label', type: 'text', defaultValue: 'Built with', localized: true },
        { name: 'andLabel', label: 'And separator', type: 'text', defaultValue: '&', localized: true },
      ],
    },
    {
      name: 'productSection',
      type: 'group',
      label: 'Product Column',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Product', localized: true },
        { name: 'documentation', type: 'text', defaultValue: 'Documentation', localized: true },
        { name: 'liveDemo', type: 'text', defaultValue: 'Live Demo', localized: true },
        { name: 'features', type: 'text', defaultValue: 'Features', localized: true },
      ],
    },
    {
      name: 'demosSection',
      type: 'group',
      label: 'Demos Column',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Demos', localized: true },
        { name: 'salon', type: 'text', defaultValue: 'Salon', localized: true },
        { name: 'hotel', type: 'text', defaultValue: 'Hotel', localized: true },
        { name: 'restaurant', type: 'text', defaultValue: 'Restaurant', localized: true },
        { name: 'events', type: 'text', defaultValue: 'Events', localized: true },
      ],
    },
    {
      name: 'linksSection',
      type: 'group',
      label: 'Links Column',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Links', localized: true },
        // Proper names — not translated
        { name: 'github', type: 'text', defaultValue: 'GitHub ↗' },
        { name: 'payloadCms', type: 'text', defaultValue: 'Payload CMS ↗' },
      ],
    },
  ],
}
