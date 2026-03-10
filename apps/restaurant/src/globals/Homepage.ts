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
          label: 'Story',
          fields: [
            { name: 'storyHeading', type: 'text', localized: true },
            { name: 'storyBody', type: 'textarea', localized: true },
            { name: 'storyImage', type: 'upload', relationTo: 'media' },
            { name: 'storyEstablished', type: 'text', localized: true, admin: { description: 'e.g. "Est. 1987"' } },
          ],
        },
        {
          label: 'Menu Preview',
          fields: [
            { name: 'menuHeading', type: 'text', localized: true },
            { name: 'menuSubtitle', type: 'text', localized: true },
            { name: 'menuCtaText', type: 'text', localized: true },
            { name: 'menuCtaLink', type: 'text' },
          ],
        },
        {
          label: 'Meet the Team',
          fields: [
            { name: 'teamHeading', type: 'text', localized: true },
            { name: 'teamSubtitle', type: 'text', localized: true },
          ],
        },
        {
          label: 'Our Spaces',
          fields: [
            { name: 'spacesHeading', type: 'text', localized: true },
            { name: 'spacesSubtitle', type: 'text', localized: true },
          ],
        },
        {
          label: 'Wine Program',
          fields: [
            { name: 'wineHeading', type: 'text', localized: true },
            { name: 'wineSubtitle', type: 'text', localized: true },
            { name: 'wineImage', type: 'upload', relationTo: 'media' },
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
            { name: 'testimonialsHeading', type: 'text', localized: true },
            { name: 'testimonialsSubtitle', type: 'text', localized: true },
          ],
        },
        {
          label: "What's On",
          fields: [
            { name: 'announcementsHeading', type: 'text', localized: true },
            { name: 'announcementsSubtitle', type: 'text', localized: true },
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
