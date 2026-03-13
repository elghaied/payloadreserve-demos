import type { CollectionConfig } from 'payload'

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    useAsTitle: 'name',
    group: 'Éclat',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'specialty',
      type: 'select',
      options: [
        { label: 'Musician', value: 'musician' },
        { label: 'Actor', value: 'actor' },
        { label: 'Visual Artist', value: 'visual-artist' },
        { label: 'Filmmaker', value: 'filmmaker' },
        { label: 'Dancer', value: 'dancer' },
        { label: 'Speaker', value: 'speaker' },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
