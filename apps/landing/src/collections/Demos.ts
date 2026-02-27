import { slugField, type CollectionConfig } from 'payload'

export const Demos: CollectionConfig = {
  slug: 'demos',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'active', 'displayOrder'],
    group: 'Content',
  },
  fields: [
    // ── Non-localized ─────────────────────────────────────────────────────────
    slugField({ fieldToUse: 'name' }),
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
        description: 'Full URL to the live demo',
        condition: (_, siblingData) => siblingData?.active === true,
      },
    },
    // ── Localized scalar fields ───────────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },

    // ── Tabs ─────────────────────────────────────────────────────────────────
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
              // Not localized — same image for all locales
              admin: { description: 'Header image for the demo card (landscape, ~640×320)' },
            },
            {
              // localized: true on the array → each locale stores its own array
              name: 'cardFeatures',
              label: 'Feature Bullets',
              type: 'array',
              localized: true,
              admin: { description: 'Short feature pills shown on the card (4 recommended)' },
              fields: [{ name: 'text', type: 'text', required: true }],
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
              admin: { description: 'Industry identifier, e.g. "salon", "hotel"' },
            },
            {
              name: 'featuresHeading',
              type: 'text',
              localized: true,
              admin: { description: 'Heading above the features grid, e.g. "Built for salon workflows"' },
            },
            {
              name: 'pluginConfigHeading',
              type: 'text',
              localized: true,
              admin: { description: 'Heading for the plugin config section, e.g. "Plugin config for Lumière Salon"' },
            },
            {
              name: 'detailCtaTitle',
              type: 'text',
              localized: true,
              admin: { description: 'CTA strip heading, e.g. "Ready to explore Lumière Salon?"' },
            },
            {
              name: 'detailCtaSubtitle',
              type: 'text',
              localized: true,
              admin: { description: 'CTA strip subtitle' },
            },
            {
              name: 'detailDescription',
              label: 'Description',
              type: 'textarea',
              localized: true,
            },
            {
              // localized: true on the array → EN and FR have independent feature lists
              name: 'detailFeatures',
              label: 'Features',
              type: 'array',
              localized: true,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
              ],
            },
            {
              name: 'pluginSnippet',
              type: 'code',
              // Not localized — TypeScript is language-agnostic
              admin: {
                language: 'typescript',
                description: 'Plugin config snippet shown on the detail page',
              },
            },
            {
              // localized: true on the array → alt text differs per locale
              name: 'screenshots',
              type: 'array',
              localized: true,
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'alt', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
