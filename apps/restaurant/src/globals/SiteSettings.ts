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
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'restaurantName', type: 'text', required: true, localized: true },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'address', type: 'text' },
            { name: 'phone', type: 'text' },
            { name: 'email', type: 'email' },
          ],
        },
        {
          label: 'Social Links',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'TripAdvisor', value: 'tripadvisor' },
                    { label: 'Twitter', value: 'twitter' },
                  ],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Service Hours',
          fields: [
            {
              name: 'serviceHours',
              type: 'array',
              fields: [
                {
                  name: 'service',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Lunch', value: 'lunch' },
                    { label: 'Dinner', value: 'dinner' },
                    { label: 'Brunch', value: 'brunch' },
                    { label: 'Bar', value: 'bar' },
                  ],
                },
                { name: 'days', type: 'text', required: true },
                { name: 'startTime', type: 'text', required: true },
                { name: 'endTime', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
