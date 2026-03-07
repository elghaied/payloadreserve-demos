import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'hotelName', type: 'text', localized: true, required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'address', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'checkInTime', type: 'text', defaultValue: '15:00', admin: { description: 'e.g., 15:00' } },
    { name: 'checkOutTime', type: 'text', defaultValue: '11:00', admin: { description: 'e.g., 11:00' } },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'TripAdvisor', value: 'tripadvisor' },
            { label: 'X / Twitter', value: 'twitter' },
          ],
          required: true,
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
