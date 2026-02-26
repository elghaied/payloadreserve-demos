import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: 'Content',
  },
  fields: [
    { name: 'description', type: 'textarea' },
    { name: 'copyright', type: 'text', defaultValue: '© 2026 payload-reserve. MIT License.' },
    {
      type: 'row',
      fields: [
        { name: 'madeByLabel', label: 'Made by label', type: 'text', defaultValue: 'Made by' },
        { name: 'builtWithLabel', label: 'Built with label', type: 'text', defaultValue: 'Built with' },
        { name: 'andLabel', label: 'And separator', type: 'text', defaultValue: '&' },
      ],
    },
    {
      name: 'productSection',
      type: 'group',
      label: 'Product Column',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Product' },
        { name: 'documentation', type: 'text', defaultValue: 'Documentation' },
        { name: 'liveDemo', type: 'text', defaultValue: 'Live Demo' },
        { name: 'features', type: 'text', defaultValue: 'Features' },
      ],
    },
    {
      name: 'demosSection',
      type: 'group',
      label: 'Demos Column',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Demos' },
        { name: 'salon', type: 'text', defaultValue: 'Salon' },
        { name: 'hotel', type: 'text', defaultValue: 'Hotel' },
        { name: 'restaurant', type: 'text', defaultValue: 'Restaurant' },
        { name: 'events', type: 'text', defaultValue: 'Events' },
      ],
    },
    {
      name: 'linksSection',
      type: 'group',
      label: 'Links Column',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Links' },
        { name: 'github', type: 'text', defaultValue: 'GitHub ↗' },
        { name: 'payloadCms', type: 'text', defaultValue: 'Payload CMS ↗' },
      ],
    },
  ],
}
