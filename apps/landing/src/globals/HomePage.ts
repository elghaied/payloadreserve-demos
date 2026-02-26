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
            { name: 'heroBadge', label: 'Badge', type: 'text', defaultValue: 'Payload CMS Plugin · MIT License' },
            { name: 'heroHeadline1', label: 'Headline Line 1', type: 'text', defaultValue: 'Reservations' },
            { name: 'heroHeadline2', label: 'Headline Line 2', type: 'text', defaultValue: 'for any business' },
            { name: 'heroSubheading', label: 'Subheading', type: 'textarea' },
            { name: 'heroCtaDemos', label: 'CTA — See Demos', type: 'text', defaultValue: 'See Live Demos' },
            { name: 'heroCtaDocs', label: 'CTA — Docs', type: 'text', defaultValue: 'Read the Docs' },
            {
              name: 'heroIndustryTags',
              label: 'Industry Tags',
              type: 'array',
              admin: { description: 'Pill tags below the CTA buttons, e.g. "✂️ Salon & Spa"' },
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
            { name: 'useCasesLabel', label: 'Section Label', type: 'text', defaultValue: 'A few of many use cases' },
            { name: 'useCasesFootnote', label: 'Footnote', type: 'text' },
            {
              name: 'useCasesItems',
              label: 'Items',
              type: 'array',
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
            { name: 'featuresLabel', label: 'Section Label', type: 'text', defaultValue: 'Features' },
            { name: 'featuresHeadline1', label: 'Headline Line 1', type: 'text', defaultValue: 'Everything you need,' },
            { name: 'featuresHeadline2', label: 'Headline Line 2', type: 'text', defaultValue: 'nothing you don\'t' },
            { name: 'featuresSubheading', label: 'Subheading', type: 'textarea' },
            {
              name: 'featuresItems',
              label: 'Feature Items',
              type: 'array',
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
            { name: 'adminUiLabel', label: 'Section Label', type: 'text', defaultValue: 'Admin Interface' },
            { name: 'adminUiHeadline', label: 'Headline', type: 'text' },
            { name: 'adminUiSubtitle', label: 'Subtitle', type: 'textarea' },
            { name: 'adminUiBrowserUrl', label: 'Browser URL Bar', type: 'text', defaultValue: 'yoursite.com/admin/' },
            {
              name: 'adminUiSlides',
              label: 'Slides',
              type: 'array',
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
            { name: 'privateDemoLabel', label: 'Section Label', type: 'text', defaultValue: 'Private Demo' },
            { name: 'privateDemoHeadline', label: 'Headline', type: 'text' },
            { name: 'privateDemoSubtitle', label: 'Subtitle', type: 'textarea' },
            { name: 'privatedemoCta', label: 'CTA Button', type: 'text', defaultValue: 'Request Private Demo' },
            { name: 'privateDemoAudience', label: 'Audience note', type: 'text' },
            {
              name: 'privateDemoPerks',
              label: 'Perks',
              type: 'array',
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
            { name: 'devLabel', label: 'Section Label', type: 'text', defaultValue: 'For Developers' },
            { name: 'devHeadline', label: 'Headline', type: 'text', defaultValue: 'Run it on your machine' },
            { name: 'devSubtitle', label: 'Subtitle', type: 'textarea' },
            { name: 'devCta', label: 'CTA Button', type: 'text', defaultValue: 'View on GitHub' },
            { name: 'devNote', label: 'Note', type: 'textarea' },
            {
              name: 'devSteps',
              label: 'Steps',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'code', type: 'code', admin: { language: 'bash' } },
              ],
            },
          ],
        },

        // ── How It Works ──────────────────────────────────────────────────────
        {
          label: 'How It Works',
          fields: [
            { name: 'howLabel', label: 'Section Label', type: 'text', defaultValue: 'How It Works' },
            { name: 'howHeadline', label: 'Headline', type: 'text', defaultValue: 'Up and running in minutes' },
            {
              name: 'howSteps',
              label: 'Steps',
              type: 'array',
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
            { name: 'ctaLabel', label: 'Section Label', type: 'text', defaultValue: 'Open Source · MIT License' },
            { name: 'ctaHeadline', label: 'Headline', type: 'text' },
            { name: 'ctaSubtitle', label: 'Subtitle', type: 'textarea' },
            { name: 'ctaButtonDocs', label: 'CTA — Docs', type: 'text', defaultValue: 'Read the Docs' },
            { name: 'ctaButtonGithub', label: 'CTA — GitHub', type: 'text', defaultValue: 'View on GitHub' },
          ],
        },
      ],
    },
  ],
}
