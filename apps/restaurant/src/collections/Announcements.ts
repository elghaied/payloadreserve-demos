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
        { label: 'Seasonal Menu', value: 'seasonal-menu' },
        { label: 'Special Event', value: 'special-event' },
        { label: 'Holiday Menu', value: 'holiday-menu' },
        { label: 'Chef Collaboration', value: 'chef-collab' },
        { label: 'Live Entertainment', value: 'live-entertainment' },
        { label: 'Wine Tasting', value: 'wine-tasting' },
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
      admin: { description: 'Button text (e.g. "Reserve Now", "Learn More")' },
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
