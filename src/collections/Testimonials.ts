import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'author', group: 'Content' },
  access: { read: () => true },
  fields: [
    { name: 'quote', type: 'textarea', localized: true, required: true },
    { name: 'author', type: 'text', required: true },
    { name: 'rating', type: 'number', min: 1, max: 5, required: true },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}
