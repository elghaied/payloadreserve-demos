import type { Payload } from 'payload'
import type { SiteSetting, Space } from '@/payload-types'
import { uploadImage, type ImageKey } from './images.js'
import { diningExperiencesData } from './data/diningExperiences.js'
import { tablesData } from './data/tables.js'
import { menuData } from './data/menu.js'
import { teamData } from './data/team.js'
import { wineListData } from './data/wineList.js'
import { spacesData } from './data/spaces.js'
import { announcementsData } from './data/announcements.js'
import { homepageData, siteSettingsData } from './data/homepage.js'

export async function runSeed(payload: Payload) {
  payload.logger.info('--- Seeding Restaurant Database ---')

  // 1. Clear existing data
  payload.logger.info('Clearing existing data...')
  const collectionsToClear = [
    'reservations',
    'schedules',
    'tables',
    'dining-experiences',
    'testimonials',
    'announcements',
    'spaces',
    'wine-list',
    'team',
    'menu',
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
    where: { email: { not_equals: process.env.ADMIN_EMAIL || 'admin@lejardin.com' } },
    limit: 100,
  })
  for (const user of nonAdminUsers.docs) {
    await payload.delete({ collection: 'users', id: user.id })
  }

  // 2. Create test customers
  payload.logger.info('Creating test customers...')
  const customers = []
  const customerData = [
    { email: 'marie@example.com', password: 'test1234', firstName: 'Marie', lastName: 'Beaumont', phone: '+33 6 12 34 56 78' },
    { email: 'jean@example.com', password: 'test1234', firstName: 'Jean-Pierre', lastName: 'Moreau', phone: '+33 6 23 45 67 89' },
    { email: 'camille@example.com', password: 'test1234', firstName: 'Camille', lastName: 'Dupont', phone: '+33 6 34 56 78 90' },
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
    // Hero & Story
    { key: 'heroBackground', alt: 'Le Jardin Doré restaurant interior' },
    { key: 'storyRestaurant', alt: 'Chef preparing a dish' },
    // Tables
    { key: 'intimateTable', alt: 'Intimate table for two' },
    { key: 'classicTable', alt: 'Classic dining table' },
    { key: 'familyTable', alt: 'Family dining table' },
    { key: 'privateRoom', alt: 'Private dining room' },
    { key: 'terrace', alt: 'Garden terrace' },
    // Menu
    { key: 'menuStarters', alt: 'Artful starter dish' },
    { key: 'menuMains', alt: 'Main course plating' },
    { key: 'menuDesserts', alt: 'Elegant dessert' },
    // Team
    { key: 'chefHead', alt: 'Chef Laurent Beaumont' },
    { key: 'chefSous', alt: 'Sophie Marchand, Sous Chef' },
    { key: 'chefPastry', alt: 'Pierre Delacroix, Pastry Chef' },
    { key: 'sommelier', alt: 'Isabelle Rousseau, Sommelier' },
    { key: 'maitreD', alt: 'Antoine Lefevre, Maître d\'Hôtel' },
    // Spaces
    { key: 'spaceDining', alt: 'Main dining room' },
    { key: 'spaceTerrace', alt: 'Garden terrace' },
    { key: 'spaceSalon', alt: 'Private salon' },
    { key: 'spaceChefTable', alt: 'Chef\'s table' },
    { key: 'spaceCellar', alt: 'Wine cellar room' },
    // Wine
    { key: 'wineProgram', alt: 'Wine cellar' },
    // Announcements
    { key: 'announcementSpring', alt: 'Spring tasting menu' },
    { key: 'announcementJazz', alt: 'Jazz evening' },
    { key: 'announcementChef', alt: 'Guest chef collaboration' },
    { key: 'announcementWine', alt: 'Wine tasting event' },
  ]

  for (const img of imageKeys) {
    try {
      const uploaded = await uploadImage(payload, img.key, img.alt)
      if (uploaded) images[img.key] = uploaded
    } catch (error) {
      payload.logger.warn(`Failed to upload image ${img.key}: ${error}`)
    }
  }

  // 4. Create wine list (before menu, since dishes reference wines)
  payload.logger.info('Creating wine list...')
  const wines: Array<{ id: string; name: string }> = []
  for (const wine of wineListData) {
    const created = await payload.create({
      collection: 'wine-list',
      data: {
        name: wine.name,
        type: wine.type,
        region: wine.region,
        vintage: wine.vintage ?? undefined,
        grape: wine.grape,
        tastingNotes: wine.tastingNotes.en,
        pairingNotes: wine.pairingNotes.en,
        priceGlass: wine.priceGlass ?? undefined,
        priceBottle: wine.priceBottle,
        featured: wine.featured,
      },
    })
    await payload.update({
      collection: 'wine-list',
      id: created.id,
      locale: 'fr',
      data: {
        tastingNotes: wine.tastingNotes.fr,
        pairingNotes: wine.pairingNotes.fr,
      },
    })
    wines.push({ id: created.id, name: wine.name })
  }

  // 5. Create menu courses with dishes (wine pairings reference wine IDs by index)
  payload.logger.info('Creating menu...')
  for (const course of menuData) {
    const created = await payload.create({
      collection: 'menu',
      data: {
        name: course.name.en,
        description: course.description.en,
        image: images[course.imageKey] || undefined,
        dishes: course.dishes.map((d) => ({
          name: d.name.en,
          description: d.description.en,
          price: d.price,
          dietary: d.dietary as ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free')[],
          seasonal: d.seasonal,
          chefRecommendation: d.chefRecommendation,
          winePairing: d.winePairingIndex != null ? wines[d.winePairingIndex]?.id : undefined,
        })),
        order: course.order,
        active: true,
      },
    })

    await payload.update({
      collection: 'menu',
      id: created.id,
      locale: 'fr',
      data: {
        name: course.name.fr,
        description: course.description.fr,
        dishes: course.dishes.map((d) => ({
          name: d.name.fr,
          description: d.description.fr,
          price: d.price,
          dietary: d.dietary as ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free')[],
          seasonal: d.seasonal,
          chefRecommendation: d.chefRecommendation,
          winePairing: d.winePairingIndex != null ? wines[d.winePairingIndex]?.id : undefined,
        })),
      },
    })
  }

  // 6. Create team members
  payload.logger.info('Creating team...')
  for (const member of teamData) {
    const created = await payload.create({
      collection: 'team',
      data: {
        name: member.name,
        role: member.role,
        photo: images[member.imageKey] || undefined,
        bio: member.bio.en,
        specialty: member.specialty.en,
        signatureDish: member.signatureDish.en,
        awards: member.awards,
        order: member.order,
      },
    })
    await payload.update({
      collection: 'team',
      id: created.id,
      locale: 'fr',
      data: {
        bio: member.bio.fr,
        specialty: member.specialty.fr,
        signatureDish: member.signatureDish.fr,
      },
    })
  }

  // 7. Create spaces
  payload.logger.info('Creating spaces...')
  const spaces: Array<{ id: string }> = []
  for (const space of spacesData) {
    const created = await payload.create({
      collection: 'spaces',
      data: {
        name: space.name.en,
        description: space.description.en,
        featuredImage: images[space.imageKey] || (images.heroBackground as string),
        capacity: space.capacity,
        features: [...space.features] as Space['features'],
        privateEventAvailable: space.privateEventAvailable,
        minimumSpend: space.minimumSpend ?? undefined,
        order: space.order,
      },
    })
    await payload.update({
      collection: 'spaces',
      id: created.id,
      locale: 'fr',
      data: {
        name: space.name.fr,
        description: space.description.fr,
      },
    })
    spaces.push(created)
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
        image: images[ann.imageKey] || undefined,
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

  // 9. Create dining experiences (services)
  payload.logger.info('Creating dining experiences...')
  const experiences: Array<{ id: string }> = []
  for (const exp of diningExperiencesData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await (payload.create as any)({
      collection: 'dining-experiences',
      data: {
        name: exp.name.en,
        description: exp.description.en,
        duration: exp.duration,
        price: exp.price,
        bufferTimeBefore: exp.bufferTimeBefore,
        bufferTimeAfter: exp.bufferTimeAfter,
        active: exp.active,
      },
    })

    await payload.update({
      collection: 'dining-experiences',
      id: created.id,
      locale: 'fr',
      data: {
        name: exp.name.fr,
        description: exp.description.fr,
      },
    })

    experiences.push(created)
  }

  // 10. Create tables (resources) with schedules
  payload.logger.info('Creating tables and schedules...')
  const tables: Array<{ id: string }> = []
  for (const table of tablesData) {
    const serviceIds = table.supportedExperiences.map((idx) => experiences[idx]?.id).filter(Boolean)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await (payload.create as any)({
      collection: 'tables',
      data: {
        name: table.name.en,
        description: table.description.en,
        image: images[table.imageKey] || undefined,
        services: serviceIds,
        quantity: table.quantity,
        capacityMode: table.capacityMode,
        seats: table.seats,
        active: true,
      },
    })

    await payload.update({
      collection: 'tables',
      id: created.id,
      locale: 'fr',
      data: {
        name: table.name.fr,
        description: table.description.fr,
      },
    })

    tables.push(created)

    // Create schedule for this table
    const recurringSlots = table.schedule.days.flatMap((day) =>
      table.schedule.slots.map((slot) => ({
        day,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    )

    await payload.create({
      collection: 'schedules',
      data: {
        name: `${table.name.en} Schedule`,
        resource: created.id,
        scheduleType: 'recurring',
        recurringSlots,
        exceptions: [],
      },
    })
  }

  // 11. Create sample reservations
  payload.logger.info('Creating sample reservations...')
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)

  function getNextWeekday(date: Date): Date {
    const d = new Date(date)
    while (d.getDay() === 0) d.setDate(d.getDate() + 1)
    return d
  }

  const reservationSamples = [
    {
      service: experiences[1]?.id,
      resource: tables[0]?.id,
      customer: customers[0]?.id,
      startTime: (() => { const d = getNextWeekday(tomorrow); d.setHours(19, 30, 0, 0); return d.toISOString() })(),
      status: 'confirmed',
      partySize: 2,
    },
    {
      service: experiences[0]?.id,
      resource: tables[1]?.id,
      customer: customers[1]?.id,
      startTime: (() => { const d = getNextWeekday(tomorrow); d.setHours(12, 0, 0, 0); return d.toISOString() })(),
      status: 'confirmed',
      partySize: 3,
    },
    {
      service: experiences[3]?.id,
      resource: tables[3]?.id,
      customer: customers[2]?.id,
      startTime: (() => { const d = getNextWeekday(nextWeek); d.setHours(19, 0, 0, 0); return d.toISOString() })(),
      status: 'confirmed',
      partySize: 8,
    },
    {
      service: experiences[1]?.id,
      resource: tables[4]?.id,
      customer: customers[0]?.id,
      startTime: (() => { const d = new Date(now); d.setDate(d.getDate() - 3); d.setHours(20, 0, 0, 0); return d.toISOString() })(),
      status: 'completed',
      partySize: 4,
    },
    {
      service: experiences[0]?.id,
      resource: tables[0]?.id,
      customer: customers[1]?.id,
      startTime: (() => { const d = new Date(now); d.setDate(d.getDate() - 1); d.setHours(12, 30, 0, 0); return d.toISOString() })(),
      status: 'cancelled',
      partySize: 2,
    },
  ]

  for (const res of reservationSamples) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (payload.create as any)({
        collection: 'reservations',
        data: res,
        context: { skipReservationHooks: true },
      })
    } catch (error) {
      payload.logger.warn(`Failed to create sample reservation: ${error}`)
    }
  }

  // 12. Create testimonials (with space references)
  payload.logger.info('Creating testimonials...')
  const testimonialData = [
    {
      quote: { en: 'An unforgettable evening. The tasting menu was a masterpiece — seven courses of pure artistry.', fr: 'Une soirée inoubliable. Le menu dégustation était un chef-d\'œuvre — sept plats d\'art pur.' },
      author: 'Marie-Claire Beaumont',
      rating: 5,
      experience: experiences[3]?.id,
      space: spaces[0]?.id,
      visitDate: '2026-02-14',
      featured: true,
    },
    {
      quote: { en: 'The terrace is pure magic in summer. The wisteria, the live jazz, impeccable wine pairings. Perfection.', fr: 'La terrasse est magique en été. La glycine, le jazz live, les accords mets-vins impeccables. La perfection.' },
      author: 'Philippe Durand',
      rating: 5,
      experience: experiences[1]?.id,
      space: spaces[1]?.id,
      visitDate: '2025-07-22',
      featured: true,
    },
    {
      quote: { en: 'Best Sunday brunch in Paris. Pierre\'s pastries alone are worth the visit. The garden setting is enchanting.', fr: 'Le meilleur brunch du dimanche à Paris. Les pâtisseries de Pierre valent le déplacement à elles seules. Le cadre du jardin est enchanteur.' },
      author: 'Sophie Laurent',
      rating: 5,
      experience: experiences[2]?.id,
      space: spaces[1]?.id,
      visitDate: '2026-01-19',
      featured: true,
    },
    {
      quote: { en: 'We celebrated our anniversary at the Chef\'s Table. Watching Chef Beaumont work up close while he explained each course was extraordinary.', fr: 'Nous avons célébré notre anniversaire à la Table du Chef. Regarder le Chef Beaumont travailler de près tout en expliquant chaque plat était extraordinaire.' },
      author: 'Luc et Isabelle Martin',
      rating: 5,
      experience: experiences[3]?.id,
      space: spaces[3]?.id,
      visitDate: '2026-02-28',
      featured: true,
    },
    {
      quote: { en: 'The wine cellar dinner was one of the most memorable evenings of my life. Isabelle\'s knowledge of Burgundy is encyclopedic.', fr: 'Le dîner dans la cave à vin fut l\'une des soirées les plus mémorables de ma vie. La connaissance d\'Isabelle en Bourgogne est encyclopédique.' },
      author: 'Richard Fontaine',
      rating: 5,
      experience: experiences[4]?.id,
      space: spaces[4]?.id,
      visitDate: '2025-11-15',
      featured: false,
    },
    {
      quote: { en: 'A perfectly executed classic lunch. The mushroom risotto with truffle oil was the best I\'ve ever had. Will return every week.', fr: 'Un déjeuner classique parfaitement exécuté. Le risotto aux champignons à l\'huile de truffe était le meilleur que j\'aie jamais goûté. J\'y retournerai chaque semaine.' },
      author: 'Nathalie Girard',
      rating: 4,
      experience: experiences[0]?.id,
      space: spaces[0]?.id,
      visitDate: '2026-03-01',
      featured: false,
    },
  ]

  for (const t of testimonialData) {
    const created = await payload.create({
      collection: 'testimonials',
      data: {
        quote: t.quote.en,
        author: t.author,
        rating: t.rating,
        diningExperience: t.experience as string,
        space: t.space as string,
        visitDate: t.visitDate,
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

  // 13. Update Homepage global
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
      storyHeading: enHome.story.heading,
      storyBody: enHome.story.body,
      storyImage: images.storyRestaurant || undefined,
      storyEstablished: enHome.story.established,
      menuHeading: enHome.menu.heading,
      menuSubtitle: enHome.menu.subtitle,
      menuCtaText: enHome.menu.ctaText,
      menuCtaLink: enHome.menu.ctaLink,
      teamHeading: enHome.team.heading,
      teamSubtitle: enHome.team.subtitle,
      spacesHeading: enHome.spaces.heading,
      spacesSubtitle: enHome.spaces.subtitle,
      wineHeading: enHome.wine.heading,
      wineSubtitle: enHome.wine.subtitle,
      wineImage: images.wineProgram || undefined,
      experiencesHeading: enHome.experiences.heading,
      experiencesSubtitle: enHome.experiences.subtitle,
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
      storyHeading: frHome.story.heading,
      storyBody: frHome.story.body,
      storyEstablished: frHome.story.established,
      menuHeading: frHome.menu.heading,
      menuSubtitle: frHome.menu.subtitle,
      menuCtaText: frHome.menu.ctaText,
      menuCtaLink: frHome.menu.ctaLink,
      teamHeading: frHome.team.heading,
      teamSubtitle: frHome.team.subtitle,
      spacesHeading: frHome.spaces.heading,
      spacesSubtitle: frHome.spaces.subtitle,
      wineHeading: frHome.wine.heading,
      wineSubtitle: frHome.wine.subtitle,
      experiencesHeading: frHome.experiences.heading,
      experiencesSubtitle: frHome.experiences.subtitle,
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

  // 14. Update SiteSettings global
  payload.logger.info('Updating SiteSettings global...')
  const enSettings = siteSettingsData.en
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      restaurantName: enSettings.restaurantName,
      cuisineType: enSettings.cuisineType,
      michelinStars: enSettings.michelinStars as SiteSetting['michelinStars'],
      tagline: enSettings.tagline,
      address: enSettings.address,
      phone: enSettings.phone,
      email: enSettings.email,
      socialLinks: enSettings.socialLinks as { platform: 'instagram' | 'facebook' | 'tripadvisor' | 'twitter' | 'google-maps'; url: string }[],
      serviceHours: enSettings.serviceHours as { service: 'lunch' | 'dinner' | 'brunch' | 'bar'; days: string; startTime: string; endTime: string }[],
      dressCode: enSettings.dressCode as SiteSetting['dressCode'],
      parkingInfo: enSettings.parkingInfo,
      accessibilityInfo: enSettings.accessibilityInfo,
      reservationPolicy: enSettings.reservationPolicy,
      cancellationPolicy: enSettings.cancellationPolicy,
    },
  })

  const frSettings = siteSettingsData.fr
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'fr',
    data: {
      restaurantName: frSettings.restaurantName,
      cuisineType: frSettings.cuisineType,
      tagline: frSettings.tagline,
      parkingInfo: frSettings.parkingInfo,
      accessibilityInfo: frSettings.accessibilityInfo,
      reservationPolicy: frSettings.reservationPolicy,
      cancellationPolicy: frSettings.cancellationPolicy,
    },
  })

  payload.logger.info('--- Restaurant seed complete! ---')
}
