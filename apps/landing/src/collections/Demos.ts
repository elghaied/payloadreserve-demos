import type { CollectionConfig } from 'payload'

export const Demos: CollectionConfig = {
  slug: 'demos',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'active', 'displayOrder'],
    group: 'Content',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Salon', value: 'salon' },
        { label: 'Hotel', value: 'hotel' },
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Events', value: 'events' },
      ],
    },
    {
      name: 'emoji',
      type: 'text',
      required: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show as live (not "Coming Soon")' },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'liveUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Full URL to the live demo (leave blank if not yet deployed)',
        condition: (_, siblingData) => siblingData?.active === true,
      },
    },
    // ── Card content ─────────────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Card',
          description: 'Content shown on the demo cards on the homepage',
          fields: [
            {
              name: 'tagline',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              localized: true,
            },
            {
              name: 'cardImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Header image for the demo card (landscape, ~640×320)' },
            },
            {
              name: 'cardFeatures',
              label: 'Feature Bullets',
              type: 'array',
              admin: { description: 'Short feature pills shown on the card (4 recommended)' },
              fields: [
                { name: 'text', type: 'text', required: true, localized: true },
              ],
            },
          ],
        },
        {
          label: 'Detail Page',
          description: 'Content shown on /demos/[type]',
          fields: [
            {
              name: 'workflowIndustry',
              type: 'text',
              localized: true,
              admin: { description: 'Used in "Built for {industry} workflows" heading, e.g. "salon"' },
            },
            {
              name: 'detailDescription',
              label: 'Description',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'detailFeatures',
              label: 'Features',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'description', type: 'textarea', required: true, localized: true },
              ],
            },
            {
              name: 'pluginSnippet',
              type: 'code',
              // code is language-agnostic (TypeScript); same in both locales
              admin: { language: 'typescript', description: 'Plugin config snippet shown on the detail page' },
            },
            {
              name: 'screenshots',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'alt', type: 'text', required: true, localized: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
