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
            { name: 'venueName', type: 'text', localized: true, required: true },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'tagline', type: 'text', localized: true },
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
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'X / Twitter', value: 'x-twitter' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Box Office Hours',
          fields: [
            {
              name: 'boxOfficeHours',
              type: 'array',
              fields: [
                {
                  name: 'day',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Monday', value: 'mon' },
                    { label: 'Tuesday', value: 'tue' },
                    { label: 'Wednesday', value: 'wed' },
                    { label: 'Thursday', value: 'thu' },
                    { label: 'Friday', value: 'fri' },
                    { label: 'Saturday', value: 'sat' },
                    { label: 'Sunday', value: 'sun' },
                  ],
                },
                { name: 'open', type: 'text', admin: { description: 'HH:MM format' } },
                { name: 'close', type: 'text', admin: { description: 'HH:MM format' } },
                { name: 'closed', type: 'checkbox', defaultValue: false },
              ],
            },
          ],
        },
        {
          label: 'Policies',
          fields: [
            { name: 'bookingPolicy', type: 'textarea', localized: true },
            { name: 'cancellationPolicy', type: 'textarea', localized: true },
            { name: 'accessibilityInfo', type: 'textarea', localized: true },
          ],
        },
      ],
    },
  ],
}
