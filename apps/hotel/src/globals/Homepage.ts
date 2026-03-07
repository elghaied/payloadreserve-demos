import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'group',
      name: 'hero',
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'subtitle', type: 'textarea', localized: true },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
        { name: 'ctaText', type: 'text', localized: true },
        { name: 'ctaLink', type: 'text' },
      ],
    },
    {
      type: 'group',
      name: 'about',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'richText', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      type: 'group',
      name: 'roomsShowcase',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'subtitle', type: 'textarea', localized: true },
      ],
    },
    {
      type: 'group',
      name: 'amenitiesSection',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'subtitle', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      fields: [
        { name: 'quote', type: 'textarea', localized: true, required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'rating', type: 'number', min: 1, max: 5 },
      ],
    },
    {
      type: 'group',
      name: 'cta',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'buttonText', type: 'text', localized: true },
        { name: 'buttonLink', type: 'text' },
      ],
    },
  ],
}
