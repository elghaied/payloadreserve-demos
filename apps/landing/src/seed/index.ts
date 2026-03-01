import type { Payload } from 'payload'

import { siteSettingsData, navigationData, footerData, homePageData } from './data/globals'
import { demosData } from './data/demos'
import { fetchFile } from './images'

// Resolved media IDs, built during the upload phase
interface SeedMedia {
  cards: Record<string, string>   // demo slug → media id
  salonScreenshot: string
  adminSlides: string[]            // [month, week, day, pending, add, module]
  privateDemo: string
}

export async function seed(payload: Payload): Promise<void> {
  payload.logger.info('\n🌱 Starting landing seed…\n')

  // ── 1. Clear existing data ─────────────────────────────────────────────────
  payload.logger.info('Clearing demos and media…')
  await Promise.all([
    payload.delete({ collection: 'demos', where: { id: { exists: true } } }),
    payload.delete({ collection: 'media', where: { id: { exists: true } } }),
  ])

  // ── 2. Upload all images ───────────────────────────────────────────────────
  payload.logger.info('Uploading images…')

  const [
    salonCard, hotelCard, restaurantCard, eventsCard,
    salonShot,
    slideMonth, slideWeek, slideDay, slidePending, slideAdd, slideModule,
    privDemo,
  ] = await Promise.all([
    // Demo card images
    payload.create({ collection: 'media', data: { alt: 'Lumière Salon' },      file: fetchFile('salon.webp') }),
    payload.create({ collection: 'media', data: { alt: 'Grand Hotel' },         file: fetchFile('hotel.webp') }),
    payload.create({ collection: 'media', data: { alt: 'Maison Restaurant' },   file: fetchFile('resto.webp') }),
    payload.create({ collection: 'media', data: { alt: 'Event Venue' },         file: fetchFile('events.webp') }),
    // Salon detail-page screenshot
    payload.create({ collection: 'media', data: { alt: 'Salon demo screenshot' }, file: fetchFile('salon-screenshot.webp') }),
    // Admin UI carousel slides (order must match adminUiSlides in globals.ts)
    payload.create({ collection: 'media', data: { alt: 'Calendar month view' },    file: fetchFile('screenshot-reservations-month.webp') }),
    payload.create({ collection: 'media', data: { alt: 'Calendar week view' },     file: fetchFile('screenshot-reservations-week.webp') }),
    payload.create({ collection: 'media', data: { alt: 'Calendar day view' },      file: fetchFile('screenshot-reservations-day.webp') }),
    payload.create({ collection: 'media', data: { alt: 'Pending reservations' },   file: fetchFile('screenshot-pending.webp') }),
    payload.create({ collection: 'media', data: { alt: 'Add reservation' },        file: fetchFile('screenshot-add-reservation.webp') }),
    payload.create({ collection: 'media', data: { alt: 'Dashboard module' },       file: fetchFile('screenshot-module.webp') }),
    // Private demo section image
    payload.create({ collection: 'media', data: { alt: 'Private demo admin panel' }, file: fetchFile('private-demo.webp') }),
  ])

  payload.logger.info('  ✓ 12 images uploaded')

  const media: SeedMedia = {
    cards: {
      salon:      salonCard.id,
      hotel:      hotelCard.id,
      restaurant: restaurantCard.id,
      events:     eventsCard.id,
    },
    salonScreenshot: salonShot.id,
    adminSlides: [
      slideMonth.id, slideWeek.id, slideDay.id,
      slidePending.id, slideAdd.id, slideModule.id,
    ],
    privateDemo: privDemo.id,
  }

  // ── 3. Globals ─────────────────────────────────────────────────────────────
  await seedSiteSettings(payload)
  await seedNavigation(payload)
  await seedFooter(payload)
  await seedHomePage(payload, media)

  // ── 4. Demos ───────────────────────────────────────────────────────────────
  await seedDemos(payload, media)

  payload.logger.info('\n✅ Landing seed complete.\n')
}

// ─── SiteSettings ─────────────────────────────────────────────────────────────

async function seedSiteSettings(payload: Payload) {
  payload.logger.info('⚙️  Seeding SiteSettings…')

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      defaultMeta: siteSettingsData.meta.en,
      externalUrls: siteSettingsData.externalUrls,
      demoDetailUi: siteSettingsData.demoDetailUi.en,
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'fr',
    data: {
      defaultMeta: siteSettingsData.meta.fr,
      demoDetailUi: siteSettingsData.demoDetailUi.fr,
    },
  })

  payload.logger.info('  ✓ SiteSettings (en + fr)')
}

// ─── Navigation ───────────────────────────────────────────────────────────────

async function seedNavigation(payload: Payload) {
  payload.logger.info('🧭 Seeding Navigation…')

  await payload.updateGlobal({ slug: 'navigation', locale: 'en', data: navigationData.en })
  await payload.updateGlobal({ slug: 'navigation', locale: 'fr', data: navigationData.fr })

  payload.logger.info('  ✓ Navigation (en + fr)')
}

// ─── Footer ───────────────────────────────────────────────────────────────────

async function seedFooter(payload: Payload) {
  payload.logger.info('🦶 Seeding Footer…')

  await payload.updateGlobal({
    slug: 'footer',
    locale: 'en',
    data: {
      ...footerData.en,
      linksSection: {
        ...footerData.en.linksSection,
        github: footerData.linksSection.github,
        payloadCms: footerData.linksSection.payloadCms,
      },
    },
  })
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'fr',
    data: {
      ...footerData.fr,
      linksSection: {
        ...footerData.fr.linksSection,
        github: footerData.linksSection.github,
        payloadCms: footerData.linksSection.payloadCms,
      },
    },
  })

  payload.logger.info('  ✓ Footer (en + fr)')
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

async function seedHomePage(payload: Payload, media: SeedMedia) {
  payload.logger.info('🏠 Seeding HomePage…')

  // Merge slide image IDs into the adminUiSlides arrays.
  // Index order matches the upload order above (month, week, day, pending, add, module).
  const withSlides = (slides: { caption: string }[]) =>
    slides.map((slide, i) => ({ ...slide, image: media.adminSlides[i] }))

  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'en',
    data: {
      ...homePageData.en,
      adminUiSection: {
        ...homePageData.en.adminUiSection,
        adminUiSlides: withSlides(homePageData.en.adminUiSection.adminUiSlides),
      },
      privateDemoSection: {
        ...homePageData.en.privateDemoSection,
        privateDemoImage: media.privateDemo,
      },
    },
  })
  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'fr',
    data: {
      ...homePageData.fr,
      adminUiSection: {
        ...homePageData.fr.adminUiSection,
        adminUiSlides: withSlides(homePageData.fr.adminUiSection.adminUiSlides),
      },
      privateDemoSection: {
        ...homePageData.fr.privateDemoSection,
        privateDemoImage: media.privateDemo,
      },
    },
  })

  payload.logger.info('  ✓ HomePage (en + fr)')
}

// ─── Demos ────────────────────────────────────────────────────────────────────

async function seedDemos(payload: Payload, media: SeedMedia) {
  payload.logger.info('🎮 Seeding Demos…')

  for (const demo of demosData) {
    payload.logger.info(`  → ${demo.slug}`)

    // Only the salon demo has a detail-page screenshot so far
    const isSalon = demo.slug === 'salon'
    const enScreenshots = isSalon
      ? demo.en.screenshots.map((s) => ({ ...s, image: media.salonScreenshot }))
      : []
    const frScreenshots = isSalon
      ? demo.fr.screenshots.map((s) => ({ ...s, image: media.salonScreenshot }))
      : []

    const created = await payload.create({
      collection: 'demos',
      locale: 'en',
      data: {
        // Non-localized
        slug: demo.slug,
        emoji: demo.emoji,
        active: demo.active,
        displayOrder: demo.displayOrder,
        liveUrl: demo.liveUrl,
        cardImage: media.cards[demo.slug],
        pluginSnippet: demo.pluginSnippet,
        // EN localized
        name: demo.en.name,
        tagline: demo.en.tagline,
        description: demo.en.description,
        workflowIndustry: demo.en.workflowIndustry,
        detailDescription: demo.en.detailDescription,
        cardFeatures: demo.en.cardFeatures,
        detailFeatures: demo.en.detailFeatures,
        featuresHeading: demo.en.featuresHeading,
        pluginConfigHeading: demo.en.pluginConfigHeading,
        detailCtaTitle: demo.en.detailCtaTitle,
        detailCtaSubtitle: demo.en.detailCtaSubtitle,
        screenshots: enScreenshots,
      },
    })

    await payload.update({
      collection: 'demos',
      id: created.id,
      locale: 'fr',
      data: {
        // FR localized
        name: demo.fr.name,
        tagline: demo.fr.tagline,
        description: demo.fr.description,
        workflowIndustry: demo.fr.workflowIndustry,
        detailDescription: demo.fr.detailDescription,
        cardFeatures: demo.fr.cardFeatures,
        detailFeatures: demo.fr.detailFeatures,
        featuresHeading: demo.fr.featuresHeading,
        pluginConfigHeading: demo.fr.pluginConfigHeading,
        detailCtaTitle: demo.fr.detailCtaTitle,
        detailCtaSubtitle: demo.fr.detailCtaSubtitle,
        screenshots: frScreenshots,
      },
    })

    payload.logger.info(`    ✓ ${demo.slug} seeded (en + fr)`)
  }
}
