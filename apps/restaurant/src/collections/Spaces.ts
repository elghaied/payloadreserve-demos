import type { CollectionConfig } from 'payload'

export const Spaces: CollectionConfig = {
  slug: 'spaces',
  admin: {
    useAsTitle: 'name',
    group: 'Restaurant',
    defaultColumns: ['name', 'capacity', 'privateEventAvailable'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
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
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'capacity',
      type: 'number',
      required: true,
      min: 1,
      admin: { description: 'Maximum number of seated guests' },
    },
    {
      name: 'features',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Natural Light', value: 'natural-light' },
        { label: 'Garden View', value: 'garden-view' },
        { label: 'Fireplace', value: 'fireplace' },
        { label: 'Sound System', value: 'sound-system' },
        { label: 'Projector', value: 'projector' },
        { label: 'Private Entrance', value: 'private-entrance' },
        { label: 'Bar Access', value: 'bar-access' },
        { label: 'Outdoor', value: 'outdoor' },
      ],
    },
    {
      name: 'privateEventAvailable',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Available for private event bookings' },
    },
    {
      name: 'minimumSpend',
      type: 'number',
      min: 0,
      admin: {
        description: 'Minimum spend for private events (€)',
        condition: (_, siblingData) => siblingData?.privateEventAvailable,
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
