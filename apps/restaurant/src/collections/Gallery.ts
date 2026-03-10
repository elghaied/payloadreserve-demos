import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'caption',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
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
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Dining Room', value: 'dining-room' },
        { label: 'Terrace', value: 'terrace' },
        { label: 'Cuisine', value: 'cuisine' },
        { label: 'Bar', value: 'bar' },
        { label: 'Events', value: 'events' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
