import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: { useAsTitle: 'caption', group: 'Content' },
  access: { read: () => true },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text', localized: true },
    { name: 'category', type: 'select', options: [
      { label: 'Salon', value: 'salon' },
      { label: 'Treatments', value: 'treatments' },
      { label: 'Results', value: 'results' },
      { label: 'Team', value: 'team' },
    ]},
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}
