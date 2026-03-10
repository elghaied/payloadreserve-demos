import type { Payload } from 'payload'
import { uploadImage, type ImageKey } from './images.js'
import { diningExperiencesData } from './data/diningExperiences.js'
import { tablesData } from './data/tables.js'
import { menuCategoriesData } from './data/menuCategories.js'
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
    'gallery',
    'menu-categories',
    'media',
  ] as const

  for (const collection of collectionsToClear) {
    try {
      await payload.delete({
        collection: collection as string,
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
    const customer = await payload.create({
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
    { key: 'heroBackground', alt: 'Le Jardin Dore restaurant interior' },
    { key: 'aboutRestaurant', alt: 'Chef preparing a dish' },
    { key: 'intimateTable', alt: 'Intimate table for two' },
    { key: 'classicTable', alt: 'Classic dining table' },
    { key: 'familyTable', alt: 'Family dining table' },
    { key: 'privateRoom', alt: 'Private dining room' },
    { key: 'terrace', alt: 'Garden terrace' },
    { key: 'menuStarters', alt: 'Artful starter dish' },
    { key: 'menuMains', alt: 'Main course plating' },
    { key: 'menuDesserts', alt: 'Elegant dessert' },
    { key: 'gallery1', alt: 'Restaurant ambiance' },
    { key: 'gallery2', alt: 'Cuisine preparation' },
    { key: 'gallery3', alt: 'Wine selection' },
  ]

  for (const img of imageKeys) {
    try {
      const uploaded = await uploadImage(payload, img.key, img.alt)
      if (uploaded) images[img.key] = uploaded
    } catch (error) {
      payload.logger.warn(`Failed to upload image ${img.key}: ${error}`)
    }
  }

  // 4. Create menu categories
  payload.logger.info('Creating menu categories...')
  for (const cat of menuCategoriesData) {
    await payload.create({
      collection: 'menu-categories',
      data: {
        name: cat.name.en,
        description: cat.description.en,
        image: images[cat.imageKey] || undefined,
        dishes: cat.dishes.map((d) => ({
          name: d.name.en,
          description: d.description.en,
          price: d.price,
          dietary: d.dietary,
        })),
        order: cat.order,
      },
    })

    // Update French locale
    const created = await payload.find({
      collection: 'menu-categories',
      where: { name: { equals: cat.name.en } },
      limit: 1,
    })
    if (created.docs[0]) {
      await payload.update({
        collection: 'menu-categories',
        id: created.docs[0].id,
        locale: 'fr',
        data: {
          name: cat.name.fr,
          description: cat.description.fr,
          dishes: cat.dishes.map((d) => ({
            name: d.name.fr,
            description: d.description.fr,
            price: d.price,
            dietary: d.dietary,
          })),
        },
      })
    }
  }

  // 5. Create dining experiences (services)
  payload.logger.info('Creating dining experiences...')
  const experiences: Array<{ id: string | number }> = []
  for (const exp of diningExperiencesData) {
    const created = await payload.create({
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

  // 6. Create tables (resources) with schedules
  payload.logger.info('Creating tables and schedules...')
  const tables: Array<{ id: string | number }> = []
  for (const table of tablesData) {
    const serviceIds = table.supportedExperiences.map((idx) => experiences[idx]?.id).filter(Boolean)

    const created = await payload.create({
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

  // 7. Create sample reservations
  payload.logger.info('Creating sample reservations...')
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)

  // Ensure we pick weekdays for schedules to be valid
  function getNextWeekday(date: Date): Date {
    const d = new Date(date)
    while (d.getDay() === 0) d.setDate(d.getDate() + 1) // skip Sunday (except for terrace)
    return d
  }

  const reservationSamples = [
    {
      service: experiences[1]?.id, // Gourmet Dinner
      resource: tables[0]?.id, // Intimate Table
      customer: customers[0]?.id,
      startTime: (() => {
        const d = getNextWeekday(tomorrow)
        d.setHours(19, 30, 0, 0)
        return d.toISOString()
      })(),
      status: 'confirmed',
      partySize: 2,
    },
    {
      service: experiences[0]?.id, // Classic Lunch
      resource: tables[1]?.id, // Classic Table
      customer: customers[1]?.id,
      startTime: (() => {
        const d = getNextWeekday(tomorrow)
        d.setHours(12, 0, 0, 0)
        return d.toISOString()
      })(),
      status: 'confirmed',
      partySize: 3,
    },
    {
      service: experiences[3]?.id, // Tasting Menu
      resource: tables[3]?.id, // Private Salon
      customer: customers[2]?.id,
      startTime: (() => {
        const d = getNextWeekday(nextWeek)
        d.setHours(19, 0, 0, 0)
        return d.toISOString()
      })(),
      status: 'confirmed',
      partySize: 8,
    },
    {
      service: experiences[1]?.id, // Gourmet Dinner
      resource: tables[4]?.id, // Terrace
      customer: customers[0]?.id,
      startTime: (() => {
        const d = new Date(now)
        d.setDate(d.getDate() - 3)
        d.setHours(20, 0, 0, 0)
        return d.toISOString()
      })(),
      status: 'completed',
      partySize: 4,
    },
    {
      service: experiences[0]?.id, // Classic Lunch
      resource: tables[0]?.id, // Intimate Table
      customer: customers[1]?.id,
      startTime: (() => {
        const d = new Date(now)
        d.setDate(d.getDate() - 1)
        d.setHours(12, 30, 0, 0)
        return d.toISOString()
      })(),
      status: 'cancelled',
      partySize: 2,
    },
  ]

  for (const res of reservationSamples) {
    try {
      await payload.create({
        collection: 'reservations',
        data: res,
        context: { skipReservationHooks: true },
      })
    } catch (error) {
      payload.logger.warn(`Failed to create sample reservation: ${error}`)
    }
  }

  // 8. Create testimonials
  payload.logger.info('Creating testimonials...')
  const testimonialData = [
    {
      quote: { en: 'An unforgettable evening. The tasting menu was a masterpiece.', fr: 'Une soiree inoubliable. Le menu degustation etait un chef-d\'oeuvre.' },
      author: 'Marie-Claire Beaumont',
      rating: 5,
      experience: experiences[3]?.id,
      featured: true,
    },
    {
      quote: { en: 'The terrace is pure magic in summer. Impeccable service.', fr: 'La terrasse est magique en ete. Service impeccable.' },
      author: 'Philippe Durand',
      rating: 5,
      experience: experiences[1]?.id,
      featured: true,
    },
    {
      quote: { en: 'Best Sunday brunch in the city. The pastries are heavenly.', fr: 'Le meilleur brunch du dimanche en ville. Les patisseries sont celestes.' },
      author: 'Sophie Laurent',
      rating: 5,
      experience: experiences[2]?.id,
      featured: true,
    },
    {
      quote: { en: 'The private dining room was perfect for our anniversary.', fr: 'Le salon prive etait parfait pour notre anniversaire.' },
      author: 'Luc et Isabelle Martin',
      rating: 5,
      experience: experiences[4]?.id,
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
        diningExperience: t.experience,
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

  // 9. Create gallery items
  payload.logger.info('Creating gallery items...')
  const galleryItems = [
    { imageKey: 'gallery1' as ImageKey, caption: { en: 'The main dining room', fr: 'La salle principale' }, category: 'dining-room', featured: true },
    { imageKey: 'gallery2' as ImageKey, caption: { en: 'Chef at work', fr: 'Le chef au travail' }, category: 'cuisine', featured: true },
    { imageKey: 'gallery3' as ImageKey, caption: { en: 'Our wine cellar', fr: 'Notre cave a vin' }, category: 'bar', featured: false },
  ]

  for (const item of galleryItems) {
    const created = await payload.create({
      collection: 'gallery',
      data: {
        image: images[item.imageKey] || (images.heroBackground as string),
        caption: item.caption.en,
        category: item.category,
        featured: item.featured,
      },
    })
    await payload.update({
      collection: 'gallery',
      id: created.id,
      locale: 'fr',
      data: { caption: item.caption.fr },
    })
  }

  // 10. Update Homepage global
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
      aboutImage: images.aboutRestaurant || undefined,
      menuHeading: enHome.menuShowcase.heading,
      menuSubtitle: enHome.menuShowcase.subtitle,
      experiencesHeading: enHome.experiences.heading,
      experiencesSubtitle: enHome.experiences.subtitle,
      testimonials: enHome.testimonials.map((t) => ({
        quote: t.quote,
        author: t.author,
        rating: t.rating,
      })),
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
      menuHeading: frHome.menuShowcase.heading,
      menuSubtitle: frHome.menuShowcase.subtitle,
      experiencesHeading: frHome.experiences.heading,
      experiencesSubtitle: frHome.experiences.subtitle,
      testimonials: frHome.testimonials.map((t) => ({
        quote: t.quote,
        author: t.author,
        rating: t.rating,
      })),
      ctaHeading: frHome.cta.heading,
      ctaBody: frHome.cta.body,
      ctaButtonText: frHome.cta.buttonText,
      ctaButtonLink: frHome.cta.buttonLink,
    },
  })

  // 11. Update SiteSettings global
  payload.logger.info('Updating SiteSettings global...')
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      restaurantName: siteSettingsData.en.restaurantName,
      address: siteSettingsData.en.address,
      phone: siteSettingsData.en.phone,
      email: siteSettingsData.en.email,
      socialLinks: siteSettingsData.en.socialLinks,
      serviceHours: siteSettingsData.en.serviceHours,
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'fr',
    data: {
      restaurantName: siteSettingsData.fr.restaurantName,
    },
  })

  payload.logger.info('--- Restaurant seed complete! ---')
}
