import type { CollectionConfig } from 'payload'

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'type', 'startDate', 'active'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Concert Series', value: 'concert-series' },
        { label: 'Festival', value: 'festival' },
        { label: 'Exhibition Opening', value: 'exhibition-opening' },
        { label: 'Special Screening', value: 'special-screening' },
        { label: 'Workshop Series', value: 'workshop-series' },
        { label: 'Gala', value: 'gala' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' }, description: 'Leave empty for single-day events' },
    },
    {
      name: 'ctaText',
      type: 'text',
      localized: true,
      admin: { description: 'Button text (e.g. "Book Now", "Learn More")' },
    },
    {
      name: 'ctaLink',
      type: 'text',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
