import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/utilities/revalidateCache'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  admin: {
    group: 'Content',
  },
  hooks: {
    afterChange: [() => revalidateGlobal('home-page')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ── Hero ──────────────────────────────────────────────────────────────
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroSection',
              label: 'Hero Section',
              type: 'group',
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
          ],
        },

        // ── Use Cases ─────────────────────────────────────────────────────────
        {
          label: 'Use Cases',
          fields: [
            {
              name: 'useCasesSection',
              label: 'Use Cases Section',
              type: 'group',
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
          ],
        },

        // ── Features ──────────────────────────────────────────────────────────
        {
          label: 'Features',
          fields: [
            {
              name: 'featuresSection',
              label: 'Features Section',
              type: 'group',
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
          ],
        },

        // ── Demos Section ─────────────────────────────────────────────────────
        {
          label: 'Demos',
          fields: [
            {
              name: 'demosSection',
              label: 'Demos Section',
              type: 'group',
              fields: [
                { name: 'demosLabel', label: 'Section Label', type: 'text', localized: true },
                { name: 'demosHeadline', label: 'Headline', type: 'text', localized: true },
                { name: 'demosSubheading', label: 'Subheading', type: 'textarea', localized: true },
                {
                  name: 'demosComingSoon',
                  label: '"Coming Soon" label',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'demosExploreLabel',
                  label: '"Explore Demo" label',
                  type: 'text',
                  localized: true,
                },
              ],
            },
          ],
        },

        // ── Admin UI ──────────────────────────────────────────────────────────
        {
          label: 'Admin UI',
          fields: [
            {
              name: 'adminUiSection',
              label: 'Admin UI Section',
              type: 'group',
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
          ],
        },

        // ── Private Demo ──────────────────────────────────────────────────────
        {
          label: 'Private Demo',
          fields: [
            {
              name: 'privateDemoSection',
              label: 'Private Demo Section',
              type: 'group',
              fields: [
                { name: 'privateDemoLabel', label: 'Section Label', type: 'text', localized: true },
                { name: 'privateDemoHeadline', label: 'Headline', type: 'text', localized: true },
                { name: 'privateDemoSubtitle', label: 'Subtitle', type: 'textarea', localized: true },
                { name: 'privateDemoCta', label: 'CTA Button', type: 'text', localized: true },
                { name: 'privateDemoAudience', label: 'Audience note', type: 'text', localized: true },
                {
                  name: 'privateDemoPerks',
                  label: 'Perks',
                  type: 'array',
                  localized: true,
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
              ],
            },
          ],
        },

        // ── Developer ─────────────────────────────────────────────────────────
        {
          label: 'Developer',
          fields: [
            {
              name: 'developerSection',
              label: 'Developer Section',
              type: 'group',
              fields: [
                { name: 'devLabel', label: 'Section Label', type: 'text', localized: true },
                { name: 'devHeadline', label: 'Headline', type: 'text', localized: true },
                { name: 'devSubtitle', label: 'Subtitle', type: 'textarea', localized: true },
                { name: 'devNote', label: 'Note', type: 'textarea', localized: true },
                {
                  name: 'devCards',
                  label: 'Cards',
                  type: 'array',
                  localized: true,
                  minRows: 2,
                  maxRows: 2,
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'description', type: 'textarea' },
                    { name: 'url', type: 'text', required: true },
                    { name: 'linkLabel', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },

        // ── How It Works ──────────────────────────────────────────────────────
        {
          label: 'How It Works',
          fields: [
            {
              name: 'howItWorksSection',
              label: 'How It Works Section',
              type: 'group',
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
          ],
        },

        // ── CTA Banner ────────────────────────────────────────────────────────
        {
          label: 'CTA Banner',
          fields: [
            {
              name: 'ctaBannerSection',
              label: 'CTA Banner Section',
              type: 'group',
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
    },
  ],
}
