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
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'heroTitle', type: 'text', localized: true },
            { name: 'heroSubtitle', type: 'text', localized: true },
            { name: 'heroBackgroundImage', type: 'upload', relationTo: 'media' },
            { name: 'heroCtaText', type: 'text', localized: true },
            { name: 'heroCtaLink', type: 'text' },
          ],
        },
        {
          label: 'About',
          fields: [
            { name: 'aboutHeading', type: 'text', localized: true },
            {
              name: 'aboutBody',
              type: 'richText',
              localized: true,
            },
            { name: 'aboutImage', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Menu Showcase',
          fields: [
            { name: 'menuHeading', type: 'text', localized: true },
            { name: 'menuSubtitle', type: 'text', localized: true },
          ],
        },
        {
          label: 'Dining Experiences',
          fields: [
            { name: 'experiencesHeading', type: 'text', localized: true },
            { name: 'experiencesSubtitle', type: 'text', localized: true },
          ],
        },
        {
          label: 'Testimonials',
          fields: [
            {
              name: 'testimonials',
              type: 'array',
              fields: [
                { name: 'quote', type: 'textarea', localized: true },
                { name: 'author', type: 'text' },
                { name: 'rating', type: 'number', min: 1, max: 5 },
              ],
            },
          ],
        },
        {
          label: 'CTA',
          fields: [
            { name: 'ctaHeading', type: 'text', localized: true },
            { name: 'ctaBody', type: 'text', localized: true },
            { name: 'ctaButtonText', type: 'text', localized: true },
            { name: 'ctaButtonLink', type: 'text' },
          ],
        },
      ],
    },
  ],
}
