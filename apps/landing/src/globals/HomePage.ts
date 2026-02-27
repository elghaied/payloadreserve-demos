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
            { name: 'heroBadge', label: 'Badge', type: 'text', localized: true },
            { name: 'heroHeadline1', label: 'Headline Line 1', type: 'text', localized: true },
            { name: 'heroHeadline2', label: 'Headline Line 2', type: 'text', localized: true },
            { name: 'heroSubheading', label: 'Subheading', type: 'textarea', localized: true },
            { name: 'heroCtaDemos', label: 'CTA — See Demos', type: 'text', localized: true },
            { name: 'heroCtaDocs', label: 'CTA — Docs', type: 'text', localized: true },
            {
              // Array-level localized: each locale has its own tag list
              name: 'heroIndustryTags',
              label: 'Industry Tags',
              type: 'array',
              localized: true,
              admin: { description: 'Pill tags below the CTA buttons' },
              fields: [
                { name: 'emoji', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
          ],
        },

        // ── Use Cases ─────────────────────────────────────────────────────────
        {
          label: 'Use Cases',
          fields: [
            { name: 'useCasesLabel', label: 'Section Label', type: 'text', localized: true },
            { name: 'useCasesFootnote', label: 'Footnote', type: 'text', localized: true },
            {
              name: 'useCasesItems',
              label: 'Items',
              type: 'array',
              localized: true,
              fields: [
                { name: 'emoji', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
                { name: 'description', type: 'text', required: true },
              ],
            },
          ],
        },

        // ── Features ──────────────────────────────────────────────────────────
        {
          label: 'Features',
          fields: [
            { name: 'featuresLabel', label: 'Section Label', type: 'text', localized: true },
            { name: 'featuresHeadline1', label: 'Headline Line 1', type: 'text', localized: true },
            { name: 'featuresHeadline2', label: 'Headline Line 2', type: 'text', localized: true },
            { name: 'featuresSubheading', label: 'Subheading', type: 'textarea', localized: true },
            {
              name: 'featuresItems',
              label: 'Feature Items',
              type: 'array',
              localized: true,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
              ],
            },
          ],
        },

        // ── Admin UI ──────────────────────────────────────────────────────────
        {
          label: 'Admin UI',
          fields: [
            { name: 'adminUiLabel', label: 'Section Label', type: 'text', localized: true },
            { name: 'adminUiHeadline', label: 'Headline', type: 'text', localized: true },
            { name: 'adminUiSubtitle', label: 'Subtitle', type: 'textarea', localized: true },
            { name: 'adminUiBrowserUrl', label: 'Browser URL Bar', type: 'text', localized: true },
            {
              name: 'adminUiSlides',
              label: 'Slides',
              type: 'array',
              localized: true,
              admin: { description: 'Captions shown for each screenshot slide' },
              fields: [
                { name: 'caption', type: 'text', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },

        // ── Private Demo ──────────────────────────────────────────────────────
        {
          label: 'Private Demo',
          fields: [
            { name: 'privateDemoLabel', label: 'Section Label', type: 'text', localized: true },
            { name: 'privateDemoHeadline', label: 'Headline', type: 'text', localized: true },
            { name: 'privateDemoSubtitle', label: 'Subtitle', type: 'textarea', localized: true },
            { name: 'privatedemoCta', label: 'CTA Button', type: 'text', localized: true },
            { name: 'privateDemoAudience', label: 'Audience note', type: 'text', localized: true },
            {
              name: 'privateDemoPerks',
              label: 'Perks',
              type: 'array',
              localized: true,
              fields: [
                { name: 'text', type: 'text', required: true },
              ],
            },
          ],
        },

        // ── Developer ─────────────────────────────────────────────────────────
        {
          label: 'Developer',
          fields: [
            { name: 'devLabel', label: 'Section Label', type: 'text', localized: true },
            { name: 'devHeadline', label: 'Headline', type: 'text', localized: true },
            { name: 'devSubtitle', label: 'Subtitle', type: 'textarea', localized: true },
            { name: 'devCta', label: 'CTA Button', type: 'text', localized: true },
            { name: 'devNote', label: 'Note', type: 'textarea', localized: true },
            {
              name: 'devSteps',
              label: 'Steps',
              type: 'array',
              localized: true,
              fields: [
                { name: 'title', type: 'text', required: true },
                // code is a shell command — same across locales but stored per locale
                { name: 'code', type: 'code', admin: { language: 'bash' } },
              ],
            },
          ],
        },

        // ── How It Works ──────────────────────────────────────────────────────
        {
          label: 'How It Works',
          fields: [
            { name: 'howLabel', label: 'Section Label', type: 'text', localized: true },
            { name: 'howHeadline', label: 'Headline', type: 'text', localized: true },
            {
              name: 'howSteps',
              label: 'Steps',
              type: 'array',
              localized: true,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'code', type: 'code', admin: { language: 'bash' } },
              ],
            },
          ],
        },

        // ── CTA Banner ────────────────────────────────────────────────────────
        {
          label: 'CTA Banner',
          fields: [
            { name: 'ctaLabel', label: 'Section Label', type: 'text', localized: true },
            { name: 'ctaHeadline', label: 'Headline', type: 'text', localized: true },
            { name: 'ctaSubtitle', label: 'Subtitle', type: 'textarea', localized: true },
            { name: 'ctaButtonDocs', label: 'CTA — Docs', type: 'text', localized: true },
            { name: 'ctaButtonGithub', label: 'CTA — GitHub', type: 'text', localized: true },
          ],
        },
      ],
    },
  ],
}
