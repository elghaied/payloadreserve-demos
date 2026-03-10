import type { CollectionConfig } from 'payload'

export const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
    group: 'Restaurant',
    defaultColumns: ['name', 'role', 'order'],
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
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Head Chef', value: 'head-chef' },
        { label: 'Sous Chef', value: 'sous-chef' },
        { label: 'Pastry Chef', value: 'pastry-chef' },
        { label: 'Sommelier', value: 'sommelier' },
        { label: 'Maître d\'Hôtel', value: 'maitre-d' },
        { label: 'Bartender', value: 'bartender' },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'specialty',
      type: 'text',
      localized: true,
      admin: { description: 'e.g. "Classical French sauces" or "Natural wines"' },
    },
    {
      name: 'signatureDish',
      type: 'text',
      localized: true,
      admin: { description: 'Their most famous creation' },
    },
    {
      name: 'awards',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'year', type: 'number' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
