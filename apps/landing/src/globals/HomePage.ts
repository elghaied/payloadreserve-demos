import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ── Hero ──────────────────────────────────────────────────────────────
        {
          label: 'Hero',
          fields: [
            { name: 'heroBadge', label: 'Badge', type: 'text', defaultValue: 'Payload CMS Plugin · MIT License', localized: true },
            { name: 'heroHeadline1', label: 'Headline Line 1', type: 'text', defaultValue: 'Reservations', localized: true },
            { name: 'heroHeadline2', label: 'Headline Line 2', type: 'text', defaultValue: 'for any business', localized: true },
            { name: 'heroSubheading', label: 'Subheading', type: 'textarea', localized: true },
            { name: 'heroCtaDemos', label: 'CTA — See Demos', type: 'text', defaultValue: 'See Live Demos', localized: true },
            { name: 'heroCtaDocs', label: 'CTA — Docs', type: 'text', defaultValue: 'Read the Docs', localized: true },
            {
              name: 'heroIndustryTags',
              label: 'Industry Tags',
              type: 'array',
              admin: { description: 'Pill tags below the CTA buttons, e.g. "✂️ Salon & Spa"' },
              fields: [
                { name: 'emoji', type: 'text', required: true },
                { name: 'label', type: 'text', required: true, localized: true },
              ],
            },
          ],
        },

        // ── Use Cases ─────────────────────────────────────────────────────────
        {
          label: 'Use Cases',
          fields: [
            { name: 'useCasesLabel', label: 'Section Label', type: 'text', defaultValue: 'A few of many use cases', localized: true },
            { name: 'useCasesFootnote', label: 'Footnote', type: 'text', localized: true },
            {
              name: 'useCasesItems',
              label: 'Items',
              type: 'array',
              fields: [
                { name: 'emoji', type: 'text', required: true },
                { name: 'label', type: 'text', required: true, localized: true },
                { name: 'description', type: 'text', required: true, localized: true },
              ],
            },
          ],
        },

        // ── Features ──────────────────────────────────────────────────────────
        {
          label: 'Features',
          fields: [
            { name: 'featuresLabel', label: 'Section Label', type: 'text', defaultValue: 'Features', localized: true },
            { name: 'featuresHeadline1', label: 'Headline Line 1', type: 'text', defaultValue: 'Everything you need,', localized: true },
            { name: 'featuresHeadline2', label: 'Headline Line 2', type: 'text', defaultValue: "nothing you don't", localized: true },
            { name: 'featuresSubheading', label: 'Subheading', type: 'textarea', localized: true },
            {
              name: 'featuresItems',
              label: 'Feature Items',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'description', type: 'textarea', required: true, localized: true },
              ],
            },
          ],
        },

        // ── Admin UI ──────────────────────────────────────────────────────────
        {
          label: 'Admin UI',
          fields: [
            { name: 'adminUiLabel', label: 'Section Label', type: 'text', defaultValue: 'Admin Interface', localized: true },
            { name: 'adminUiHeadline', label: 'Headline', type: 'text', localized: true },
            { name: 'adminUiSubtitle', label: 'Subtitle', type: 'textarea', localized: true },
            { name: 'adminUiBrowserUrl', label: 'Browser URL Bar', type: 'text', defaultValue: 'yoursite.com/admin/', localized: true },
            {
              name: 'adminUiSlides',
              label: 'Slides',
              type: 'array',
              admin: { description: 'Captions shown for each screenshot slide' },
              fields: [
                { name: 'caption', type: 'text', required: true, localized: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },

        // ── Private Demo ──────────────────────────────────────────────────────
        {
          label: 'Private Demo',
          fields: [
            { name: 'privateDemoLabel', label: 'Section Label', type: 'text', defaultValue: 'Private Demo', localized: true },
            { name: 'privateDemoHeadline', label: 'Headline', type: 'text', localized: true },
            { name: 'privateDemoSubtitle', label: 'Subtitle', type: 'textarea', localized: true },
            { name: 'privatedemoCta', label: 'CTA Button', type: 'text', defaultValue: 'Request Private Demo', localized: true },
            { name: 'privateDemoAudience', label: 'Audience note', type: 'text', localized: true },
            {
              name: 'privateDemoPerks',
              label: 'Perks',
              type: 'array',
              fields: [
                { name: 'text', type: 'text', required: true, localized: true },
              ],
            },
          ],
        },

        // ── Developer ─────────────────────────────────────────────────────────
        {
          label: 'Developer',
          fields: [
            { name: 'devLabel', label: 'Section Label', type: 'text', defaultValue: 'For Developers', localized: true },
            { name: 'devHeadline', label: 'Headline', type: 'text', defaultValue: 'Run it on your machine', localized: true },
            { name: 'devSubtitle', label: 'Subtitle', type: 'textarea', localized: true },
            { name: 'devCta', label: 'CTA Button', type: 'text', defaultValue: 'View on GitHub', localized: true },
            { name: 'devNote', label: 'Note', type: 'textarea', localized: true },
            {
              name: 'devSteps',
              label: 'Steps',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                // code is a shell command — same across locales
                { name: 'code', type: 'code', admin: { language: 'bash' } },
              ],
            },
          ],
        },

        // ── How It Works ──────────────────────────────────────────────────────
        {
          label: 'How It Works',
          fields: [
            { name: 'howLabel', label: 'Section Label', type: 'text', defaultValue: 'How It Works', localized: true },
            { name: 'howHeadline', label: 'Headline', type: 'text', defaultValue: 'Up and running in minutes', localized: true },
            {
              name: 'howSteps',
              label: 'Steps',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'description', type: 'textarea', required: true, localized: true },
                // code snippets are technical — same across locales
                { name: 'code', type: 'code', admin: { language: 'bash' } },
              ],
            },
          ],
        },

        // ── CTA Banner ────────────────────────────────────────────────────────
        {
          label: 'CTA Banner',
          fields: [
            { name: 'ctaLabel', label: 'Section Label', type: 'text', defaultValue: 'Open Source · MIT License', localized: true },
            { name: 'ctaHeadline', label: 'Headline', type: 'text', localized: true },
            { name: 'ctaSubtitle', label: 'Subtitle', type: 'textarea', localized: true },
            { name: 'ctaButtonDocs', label: 'CTA — Docs', type: 'text', defaultValue: 'Read the Docs', localized: true },
            { name: 'ctaButtonGithub', label: 'CTA — GitHub', type: 'text', defaultValue: 'View on GitHub', localized: true },
          ],
        },
      ],
    },
  ],
}
