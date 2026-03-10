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
            { name: 'cuisineType', type: 'text', localized: true, admin: { description: 'e.g. "Contemporary French"' } },
            {
              name: 'michelinStars',
              type: 'select',
              options: [
                { label: 'None', value: '0' },
                { label: '1 Star', value: '1' },
                { label: '2 Stars', value: '2' },
                { label: '3 Stars', value: '3' },
              ],
              defaultValue: '0',
            },
            { name: 'tagline', type: 'text', localized: true, admin: { description: 'Short motto or slogan' } },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'address', type: 'text' },
            { name: 'phone', type: 'text' },
            { name: 'email', type: 'email' },
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
                    { label: 'Twitter / X', value: 'twitter' },
                    { label: 'Google Maps', value: 'google-maps' },
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
        {
          label: 'Policies & Info',
          fields: [
            {
              name: 'dressCode',
              type: 'select',
              options: [
                { label: 'Casual', value: 'casual' },
                { label: 'Smart Casual', value: 'smart-casual' },
                { label: 'Business Casual', value: 'business-casual' },
                { label: 'Formal', value: 'formal' },
              ],
              defaultValue: 'smart-casual',
            },
            { name: 'parkingInfo', type: 'textarea', localized: true },
            { name: 'accessibilityInfo', type: 'textarea', localized: true },
            { name: 'reservationPolicy', type: 'textarea', localized: true },
            { name: 'cancellationPolicy', type: 'textarea', localized: true },
          ],
        },
      ],
    },
  ],
}
