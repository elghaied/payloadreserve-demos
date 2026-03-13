import type { Payload } from 'payload'
import { uploadImage, type ImageKey } from './images.js'
import { eventTypesData } from './data/eventTypes.js'
import { venuesData } from './data/venues.js'
import { artistsData } from './data/artists.js'
import { seasonsData } from './data/seasons.js'
import { announcementsData } from './data/announcements.js'
import { testimonialsData } from './data/testimonials.js'
import { homepageData, siteSettingsData } from './data/homepage.js'

export async function runSeed(payload: Payload) {
  payload.logger.info('--- Seeding Events Database ---')

  // 1. Clear existing data
  payload.logger.info('Clearing existing data...')
  const collectionsToClear = [
    'bookings',
    'schedules',
    'venues',
    'event-types',
    'testimonials',
    'announcements',
    'seasons',
    'artists',
    'media',
  ] as const

  for (const collection of collectionsToClear) {
    try {
      await payload.delete({
        collection,
        where: { id: { exists: true } },
        context: { skipReservationHooks: true },
      })
    } catch {
      // Collection may be empty or not exist yet
    }
  }

  // Delete non-admin users (customers)
  const nonAdminUsers = await payload.find({
    collection: 'users',
    where: { email: { not_equals: process.env.ADMIN_EMAIL || 'admin@eclat-paris.com' } },
    limit: 100,
  })
  for (const user of nonAdminUsers.docs) {
    await payload.delete({ collection: 'users', id: user.id })
  }

  // 2. Create test customers
  payload.logger.info('Creating test customers...')
  const customers = []
  const customerData = [
    { email: 'marie@example.com', password: 'test1234', firstName: 'Marie', lastName: 'Laurent', phone: '+33 6 12 34 56 78' },
    { email: 'julien@example.com', password: 'test1234', firstName: 'Julien', lastName: 'Moreau', phone: '+33 6 23 45 67 89' },
    { email: 'claire@example.com', password: 'test1234', firstName: 'Claire', lastName: 'Petit', phone: '+33 6 34 56 78 90' },
  ]

  for (const c of customerData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = await (payload.create as any)({
      collection: 'users',
      data: {
        email: c.email,
        password: c.password,
        firstName: c.firstName,
        lastName: c.lastName,
        phone: c.phone,
      },
    })
    customers.push(customer)
  }

  // 3. Upload images
  payload.logger.info('Uploading images...')
  const images: Partial<Record<ImageKey, string>> = {}
  const imageKeys: Array<{ key: ImageKey; alt: string }> = [
    { key: 'heroBackground', alt: 'Concert hall with dramatic lighting' },
    { key: 'aboutVenue', alt: 'Éclat Centre Culturel interior' },
    { key: 'venueGrandeSalle', alt: 'Grande Salle performance hall' },
    { key: 'venueSalonNoir', alt: 'Salon Noir black-box theater' },
    { key: 'venueGalerie', alt: 'Galerie Lumière exhibition space' },
    { key: 'venueStudio', alt: 'Studio Éclat workshop space' },
    { key: 'venueTerrasse', alt: 'La Terrasse outdoor venue' },
    { key: 'artistLucien', alt: 'Lucien Marais, pianist' },
    { key: 'artistCamille', alt: 'Camille Beaufort, actor and director' },
    { key: 'artistYuki', alt: 'Yuki Tanaka, visual artist' },
    { key: 'artistReda', alt: 'Reda Benali, filmmaker' },
    { key: 'artistEloise', alt: 'Éloise Dupont, dancer' },
    { key: 'artistMarc', alt: 'Marc-Antoine Lévy, cultural historian' },
    { key: 'announcementJazz', alt: 'Jazz performance' },
    { key: 'announcementNuit', alt: 'Night arts event' },
    { key: 'seasonSpring', alt: 'Spring season' },
    { key: 'seasonSummer', alt: 'Summer season' },
  ]

  for (const img of imageKeys) {
    try {
      const uploaded = await uploadImage(payload, img.key, img.alt)
      if (uploaded) images[img.key] = uploaded
    } catch (error) {
      payload.logger.warn(`Failed to upload image ${img.key}: ${error}`)
    }
  }

  // 4. Create event types (services)
  payload.logger.info('Creating event types...')
  const eventTypes: Array<{ id: string }> = []
  for (const et of eventTypesData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await (payload.create as any)({
      collection: 'event-types',
      data: {
        name: et.name.en,
        description: et.description.en,
        duration: et.duration,
        price: et.price,
        bufferTimeBefore: et.bufferTimeBefore,
        bufferTimeAfter: et.bufferTimeAfter,
        active: et.active,
      },
    })

    await payload.update({
      collection: 'event-types',
      id: created.id,
      locale: 'fr',
      data: {
        name: et.name.fr,
        description: et.description.fr,
      },
    })

    eventTypes.push(created)
  }

  // 5. Create venues (resources) with schedules
  payload.logger.info('Creating venues and schedules...')
  const venues: Array<{ id: string }> = []
  for (const venue of venuesData) {
    const serviceIds = venue.supportedEventTypes.map((idx) => eventTypes[idx]?.id).filter(Boolean)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await (payload.create as any)({
      collection: 'venues',
      data: {
        name: venue.name.en,
        description: venue.description.en,
        image: images[venue.imageKey] || undefined,
        services: serviceIds,
        quantity: venue.quantity,
        capacityMode: venue.capacityMode,
        seats: venue.seats,
        active: true,
      },
    })

    await payload.update({
      collection: 'venues',
      id: created.id,
      locale: 'fr',
      data: {
        name: venue.name.fr,
        description: venue.description.fr,
      },
    })

    venues.push(created)

    // Create schedule for this venue
    const recurringSlots = venue.schedule.days.flatMap((day) =>
      venue.schedule.slots.map((slot) => ({
        day,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    )

    await payload.create({
      collection: 'schedules',
      data: {
        name: `${venue.name.en} Schedule`,
        resource: created.id,
        scheduleType: 'recurring',
        recurringSlots,
        exceptions: [],
      },
    })
  }

  // 6. Create artists
  payload.logger.info('Creating artists...')
  for (const artist of artistsData) {
    const created = await payload.create({
      collection: 'artists',
      data: {
        name: artist.name,
        bio: artist.bio.en,
        specialty: artist.specialty,
        photo: images[artist.imageKey] || undefined,
        website: artist.website,
        featured: artist.featured,
      },
    })
    await payload.update({
      collection: 'artists',
      id: created.id,
      locale: 'fr',
      data: { bio: artist.bio.fr },
    })
  }

  // 7. Create seasons
  payload.logger.info('Creating seasons...')
  for (const season of seasonsData) {
    const created = await payload.create({
      collection: 'seasons',
      data: {
        name: season.name.en,
        description: season.description.en,
        startDate: season.startDate,
        endDate: season.endDate,
        featuredImage: season.imageKey ? images[season.imageKey] || undefined : undefined,
        active: season.active,
      },
    })
    await payload.update({
      collection: 'seasons',
      id: created.id,
      locale: 'fr',
      data: {
        name: season.name.fr,
        description: season.description.fr,
      },
    })
  }

  // 8. Create announcements
  payload.logger.info('Creating announcements...')
  for (const ann of announcementsData) {
    const created = await payload.create({
      collection: 'announcements',
      data: {
        title: ann.title.en,
        description: ann.description.en,
        type: ann.type,
        image: ann.imageKey ? images[ann.imageKey] || undefined : undefined,
        startDate: ann.startDate,
        endDate: ann.endDate ?? undefined,
        ctaText: ann.ctaText.en,
        ctaLink: ann.ctaLink,
        active: ann.active,
        featured: ann.featured,
      },
    })
    await payload.update({
      collection: 'announcements',
      id: created.id,
      locale: 'fr',
      data: {
        title: ann.title.fr,
        description: ann.description.fr,
        ctaText: ann.ctaText.fr,
      },
    })
  }

  // 9. Create testimonials
  payload.logger.info('Creating testimonials...')
  for (const t of testimonialsData) {
    const created = await payload.create({
      collection: 'testimonials',
      data: {
        quote: t.quote.en,
        author: t.author,
        rating: t.rating,
        eventType: eventTypes[t.eventTypeIndex]?.id as string,
        venue: venues[t.venueIndex]?.id as string,
        eventDate: t.eventDate,
        featured: t.featured,
      },
    })
    await payload.update({
      collection: 'testimonials',
      id: created.id,
      locale: 'fr',
      data: { quote: t.quote.fr },
    })
  }

  // 10. Create sample bookings
  payload.logger.info('Creating sample bookings...')
  const now = new Date()

  function getNextWeekday(date: Date): Date {
    const d = new Date(date)
    while (d.getDay() === 0) d.setDate(d.getDate() + 1)
    return d
  }

  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const threeDays = new Date(now)
  threeDays.setDate(threeDays.getDate() + 3)

  const bookingSamples = [
    {
      service: eventTypes[0]?.id, // Concert
      resource: venues[0]?.id, // Grande Salle
      customer: customers[0]?.id,
      startTime: (() => { const d = getNextWeekday(nextWeek); d.setHours(20, 0, 0, 0); return d.toISOString() })(),
      status: 'confirmed',
      ticketQuantity: 2,
    },
    {
      service: eventTypes[4]?.id, // Workshop
      resource: venues[3]?.id, // Studio Éclat
      customer: customers[1]?.id,
      startTime: (() => { const d = getNextWeekday(threeDays); d.setHours(10, 0, 0, 0); return d.toISOString() })(),
      status: 'confirmed',
      ticketQuantity: 1,
    },
    {
      service: eventTypes[3]?.id, // Film Screening
      resource: venues[4]?.id, // La Terrasse
      customer: customers[2]?.id,
      startTime: (() => { const d = new Date(now); d.setDate(d.getDate() - 7); d.setHours(21, 0, 0, 0); return d.toISOString() })(),
      status: 'completed',
      ticketQuantity: 4,
    },
    {
      service: eventTypes[1]?.id, // Theater
      resource: venues[1]?.id, // Salon Noir
      customer: customers[0]?.id,
      startTime: (() => { const d = new Date(now); d.setDate(d.getDate() - 14); d.setHours(20, 0, 0, 0); return d.toISOString() })(),
      status: 'cancelled',
      ticketQuantity: 2,
    },
    {
      service: eventTypes[2]?.id, // Exhibition
      resource: venues[2]?.id, // Galerie Lumière
      customer: customers[1]?.id,
      startTime: (() => { const d = new Date(now); d.setDate(d.getDate() - 30); d.setHours(14, 0, 0, 0); return d.toISOString() })(),
      status: 'completed',
      ticketQuantity: 3,
    },
  ]

  for (const res of bookingSamples) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (payload.create as any)({
        collection: 'bookings',
        data: res,
        context: { skipReservationHooks: true },
      })
    } catch (error) {
      payload.logger.warn(`Failed to create sample booking: ${error}`)
    }
  }

  // 11. Update Homepage global
  payload.logger.info('Updating Homepage global...')
  const enHome = homepageData.en
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      heroTitle: enHome.hero.title,
      heroSubtitle: enHome.hero.subtitle,
      heroBackgroundImage: images.heroBackground || undefined,
      heroCtaText: enHome.hero.ctaText,
      heroCtaLink: enHome.hero.ctaLink,
      aboutHeading: enHome.about.heading,
      aboutBody: enHome.about.body,
      aboutImage: images.aboutVenue || undefined,
      aboutEstablished: enHome.about.established,
      programmingHeading: enHome.programming.heading,
      programmingSubtitle: enHome.programming.subtitle,
      venuesHeading: enHome.venues.heading,
      venuesSubtitle: enHome.venues.subtitle,
      artistsHeading: enHome.artists.heading,
      artistsSubtitle: enHome.artists.subtitle,
      testimonialsHeading: enHome.testimonials.heading,
      testimonialsSubtitle: enHome.testimonials.subtitle,
      announcementsHeading: enHome.announcements.heading,
      announcementsSubtitle: enHome.announcements.subtitle,
      ctaHeading: enHome.cta.heading,
      ctaBody: enHome.cta.body,
      ctaButtonText: enHome.cta.buttonText,
      ctaButtonLink: enHome.cta.buttonLink,
    },
  })

  const frHome = homepageData.fr
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'fr',
    data: {
      heroTitle: frHome.hero.title,
      heroSubtitle: frHome.hero.subtitle,
      heroCtaText: frHome.hero.ctaText,
      heroCtaLink: frHome.hero.ctaLink,
      aboutHeading: frHome.about.heading,
      aboutBody: frHome.about.body,
      aboutEstablished: frHome.about.established,
      programmingHeading: frHome.programming.heading,
      programmingSubtitle: frHome.programming.subtitle,
      venuesHeading: frHome.venues.heading,
      venuesSubtitle: frHome.venues.subtitle,
      artistsHeading: frHome.artists.heading,
      artistsSubtitle: frHome.artists.subtitle,
      testimonialsHeading: frHome.testimonials.heading,
      testimonialsSubtitle: frHome.testimonials.subtitle,
      announcementsHeading: frHome.announcements.heading,
      announcementsSubtitle: frHome.announcements.subtitle,
      ctaHeading: frHome.cta.heading,
      ctaBody: frHome.cta.body,
      ctaButtonText: frHome.cta.buttonText,
      ctaButtonLink: frHome.cta.buttonLink,
    },
  })

  // 12. Update SiteSettings global
  payload.logger.info('Updating SiteSettings global...')
  const enSettings = siteSettingsData.en
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      venueName: enSettings.venueName,
      tagline: enSettings.tagline,
      address: enSettings.address,
      phone: enSettings.phone,
      email: enSettings.email,
      socialLinks: enSettings.socialLinks as { platform: 'instagram' | 'facebook' | 'tiktok' | 'x-twitter' | 'youtube'; url: string }[],
      boxOfficeHours: enSettings.boxOfficeHours as { day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'; open?: string; close?: string; closed: boolean }[],
      bookingPolicy: enSettings.bookingPolicy,
      cancellationPolicy: enSettings.cancellationPolicy,
      accessibilityInfo: enSettings.accessibilityInfo,
    },
  })

  const frSettings = siteSettingsData.fr
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'fr',
    data: {
      venueName: frSettings.venueName,
      tagline: frSettings.tagline,
      bookingPolicy: frSettings.bookingPolicy,
      cancellationPolicy: frSettings.cancellationPolicy,
      accessibilityInfo: frSettings.accessibilityInfo,
    },
  })

  payload.logger.info('--- Events seed complete! ---')
}
