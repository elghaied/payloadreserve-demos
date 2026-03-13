import type { CollectionConfig } from 'payload'

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric to hyphens
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
}

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
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (data && (operation === 'create' || operation === 'update')) {
          // Generate slug from English title if not already set or if title changed
          const title = typeof data.title === 'string' ? data.title : data.title?.en
          if (title && !data.slug) {
            data.slug = slugify(title)
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from the English title. Can be overridden.',
      },
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
      name: 'eventType',
      type: 'relationship',
      relationTo: 'event-types',
      admin: { description: 'Links to the bookable event type (drives color display and booking flow)' },
    },
    {
      name: 'venue',
      type: 'relationship',
      relationTo: 'venues',
      admin: { description: 'The venue where this event takes place' },
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
