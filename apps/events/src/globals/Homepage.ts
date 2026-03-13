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
            { name: 'heroSubtitle', type: 'textarea', localized: true },
            { name: 'heroBackgroundImage', type: 'upload', relationTo: 'media' },
            { name: 'heroCtaText', type: 'text', localized: true },
            { name: 'heroCtaLink', type: 'text' },
          ],
        },
        {
          label: 'About',
          fields: [
            { name: 'aboutHeading', type: 'text', localized: true },
            { name: 'aboutBody', type: 'textarea', localized: true },
            { name: 'aboutImage', type: 'upload', relationTo: 'media' },
            { name: 'aboutEstablished', type: 'text', localized: true },
          ],
        },
        {
          label: 'Programming',
          fields: [
            { name: 'programmingHeading', type: 'text', localized: true },
            { name: 'programmingSubtitle', type: 'textarea', localized: true },
          ],
        },
        {
          label: 'Our Venues',
          fields: [
            { name: 'venuesHeading', type: 'text', localized: true },
            { name: 'venuesSubtitle', type: 'textarea', localized: true },
          ],
        },
        {
          label: 'Artists',
          fields: [
            { name: 'artistsHeading', type: 'text', localized: true },
            { name: 'artistsSubtitle', type: 'textarea', localized: true },
          ],
        },
        {
          label: 'Testimonials',
          fields: [
            { name: 'testimonialsHeading', type: 'text', localized: true },
            { name: 'testimonialsSubtitle', type: 'textarea', localized: true },
          ],
        },
        {
          label: "What's On",
          fields: [
            { name: 'announcementsHeading', type: 'text', localized: true },
            { name: 'announcementsSubtitle', type: 'textarea', localized: true },
          ],
        },
        {
          label: 'CTA',
          fields: [
            { name: 'ctaHeading', type: 'text', localized: true },
            { name: 'ctaBody', type: 'textarea', localized: true },
            { name: 'ctaButtonText', type: 'text', localized: true },
            { name: 'ctaButtonLink', type: 'text' },
          ],
        },
      ],
    },
  ],
}
