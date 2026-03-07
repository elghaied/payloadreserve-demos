import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: { useAsTitle: 'caption', group: 'Content' },
  access: { read: () => true },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text', localized: true },
    { name: 'category', type: 'select', options: [
      { label: 'Rooms', value: 'rooms' },
      { label: 'Lobby & Common Areas', value: 'lobby' },
      { label: 'Dining', value: 'dining' },
      { label: 'Amenities', value: 'amenities' },
      { label: 'Exterior', value: 'exterior' },
    ]},
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}
