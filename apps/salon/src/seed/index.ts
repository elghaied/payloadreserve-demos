import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { uploadImage } from './images.js'
import { servicesData } from './data/services.js'
import { specialistsData } from './data/specialists.js'
import { homepageData, siteSettingsData } from './data/homepage.js'

async function seed() {
  console.log('\n🌱 Starting seed...\n')

  const payload = await getPayload({ config })

  // Clear existing data
  console.log('Clearing existing data...')
  const collections = ['reservations', 'schedules', 'specialists', 'services', 'testimonials', 'gallery', 'service-categories'] as const
  for (const slug of collections) {
    try {
      await payload.delete({ collection: slug, where: { id: { exists: true } } })
    } catch {
      // Collection might not exist yet
    }
  }

  // Delete existing customers
  try {
    await payload.delete({ collection: 'customers', where: { id: { exists: true } } })
  } catch {
    // ignore
  }

  // Delete media
  try {
    await payload.delete({ collection: 'media', where: { id: { exists: true } } })
  } catch {
    // ignore
  }

  // ---- ADMIN USER ----
  console.log('\n📧 Creating admin user...')
  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@lumiere-salon.com' } },
    limit: 1,
  })
  if (existingAdmin.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@lumiere-salon.com',
        password: 'admin123',
      },
    })
    console.log('  Created: admin@lumiere-salon.com / admin123')
  } else {
    console.log('  Admin already exists')
  }

  // ---- CUSTOMER USERS ----
  console.log('\n👤 Creating customer users...')
  const customersData = [
    { email: 'sophie@example.com', firstName: 'Sophie', lastName: 'Martin', phone: '(514) 555-1001' },
    { email: 'emma@example.com', firstName: 'Emma', lastName: 'Wilson', phone: '(514) 555-1002' },
    { email: 'lucas@example.com', firstName: 'Lucas', lastName: 'Bernard', phone: '(514) 555-1003' },
  ]
  const customers: string[] = []
  for (const c of customersData) {
    const customer = await payload.create({
      collection: 'customers',
      data: { ...c, password: 'password123' },
    })
    customers.push(customer.id)
    console.log(`  Created: ${c.email}`)
  }

  // ---- IMAGES ----
  console.log('\n🖼️  Uploading images...')
  const heroImageId = await uploadImage(payload, 'heroBackground', 'Salon interior')
  const aboutImageId = await uploadImage(payload, 'aboutSalon', 'About our salon')
  const specialistImages: string[] = []
  for (const spec of specialistsData) {
    const imgId = await uploadImage(payload, spec.imageKey, spec.name)
    specialistImages.push(imgId)
  }
  const galleryImageIds: string[] = []
  for (const key of ['gallery1', 'gallery2', 'gallery3'] as const) {
    const imgId = await uploadImage(payload, key, 'Gallery image')
    galleryImageIds.push(imgId)
  }

  // ---- SERVICE CATEGORIES ----
  console.log('\n📂 Creating service categories...')
  const categoryNames = ['Facials', 'Waxing', 'Lash & Brow', 'Massage', 'Nails']
  const categoryMap: Record<string, string> = {}
  for (let i = 0; i < categoryNames.length; i++) {
    const cat = await payload.create({
      collection: 'service-categories',
      data: { name: categoryNames[i], order: i + 1 },
    })
    categoryMap[categoryNames[i]] = cat.id
    console.log(`  Created: ${categoryNames[i]}`)
  }

  // ---- SERVICES ----
  console.log('\n💅 Creating services...')
  const serviceMap: Record<string, string> = {} // name -> id
  const categoryServiceMap: Record<string, string[]> = {} // category -> service ids
  for (const s of servicesData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const service = await (payload.create as any)({
      collection: 'services',
      data: {
        name: s.name,
        description: s.description,
        duration: s.duration,
        price: s.price,
        bufferTimeBefore: s.bufferTimeBefore,
        bufferTimeAfter: s.bufferTimeAfter,
        active: s.active,
      },
    })
    serviceMap[s.name] = service.id
    if (!categoryServiceMap[s.category]) categoryServiceMap[s.category] = []
    categoryServiceMap[s.category].push(service.id)
    console.log(`  Created: ${s.name} ($${s.price})`)
  }

  // ---- SPECIALISTS ----
  console.log('\n👩‍⚕️ Creating specialists...')
  const specialistIds: string[] = []
  for (let i = 0; i < specialistsData.length; i++) {
    const spec = specialistsData[i]
    // Get service IDs for this specialist's categories
    const serviceIds: string[] = []
    for (const cat of spec.serviceCategories) {
      const ids = categoryServiceMap[cat] || []
      serviceIds.push(...ids)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const specialist = await (payload.create as any)({
      collection: 'specialists',
      data: {
        name: spec.name,
        description: spec.description,
        image: specialistImages[i],
        services: serviceIds,
        active: true,
      },
    })
    specialistIds.push(specialist.id)
    console.log(`  Created: ${spec.name}`)
  }

  // ---- SCHEDULES ----
  console.log('\n📅 Creating schedules...')
  for (let i = 0; i < specialistsData.length; i++) {
    const spec = specialistsData[i]
    const recurringSlots = spec.schedule.days.map((day) => ({
      day,
      startTime: spec.schedule.startTime,
      endTime: spec.schedule.endTime,
    }))

    // Add Saturday for Nadia
    if (spec.schedule.saturdayHours) {
      recurringSlots.push({
        day: 'sat' as typeof spec.schedule.days[number],
        startTime: spec.schedule.saturdayHours.startTime,
        endTime: spec.schedule.saturdayHours.endTime,
      })
    }

    await payload.create({
      collection: 'schedules',
      data: {
        name: spec.schedule.name,
        resource: specialistIds[i],
        scheduleType: 'recurring',
        recurringSlots,
        exceptions: [],
      },
    })
    console.log(`  Created: ${spec.schedule.name}`)
  }

  // ---- RESERVATIONS ----
  console.log('\n📋 Creating sample reservations...')
  const now = new Date()

  const reservationsToCreate = [
    {
      service: serviceMap['Classic Facial'],
      resource: specialistIds[0], // Amélie
      customer: customers[0], // Sophie
      startTime: addDays(now, 3, 10, 0),
      duration: 60,
      status: 'confirmed' as const,
    },
    {
      service: serviceMap['Swedish Massage'],
      resource: specialistIds[2], // Nadia
      customer: customers[1], // Emma
      startTime: addDays(now, 5, 14, 0),
      duration: 60,
      status: 'confirmed' as const,
    },
    {
      service: serviceMap['Gel Manicure'],
      resource: specialistIds[3], // Isabelle
      customer: customers[0], // Sophie
      startTime: addDays(now, 7, 11, 0),
      duration: 45,
      status: 'pending' as const,
    },
    {
      service: serviceMap['Lash Lift & Tint'],
      resource: specialistIds[0], // Amélie
      customer: customers[2], // Lucas
      startTime: addDays(now, 10, 15, 0),
      duration: 60,
      status: 'pending' as const,
    },
    {
      service: serviceMap['Brazilian Wax'],
      resource: specialistIds[1], // Claire
      customer: customers[1], // Emma
      startTime: addDays(now, -7, 10, 0),
      duration: 30,
      status: 'completed' as const,
    },
    {
      service: serviceMap['Brow Shaping'],
      resource: specialistIds[1], // Claire
      customer: customers[2], // Lucas
      startTime: addDays(now, -3, 16, 0),
      duration: 20,
      status: 'cancelled' as const,
      cancellationReason: 'Schedule conflict',
    },
  ]

  for (const res of reservationsToCreate) {
    const endTime = new Date(res.startTime.getTime() + res.duration * 60000)
    await payload.create({
      collection: 'reservations',
      data: {
        service: res.service,
        resource: res.resource,
        customer: res.customer,
        startTime: res.startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: res.status,
        cancellationReason: 'cancellationReason' in res ? res.cancellationReason : undefined,
      },
      context: { skipReservationHooks: true },
    })
    console.log(`  Created: ${res.status} reservation`)
  }

  // ---- TESTIMONIALS ----
  console.log('\n⭐ Creating testimonials...')
  const testimonialsData = [
    { quote: 'Lumière transformed my skin! The deep cleansing facial was exactly what I needed.', author: 'Marie-Claire L.', rating: 5, service: serviceMap['Deep Cleansing Facial'], featured: true },
    { quote: 'The best lash lift I\'ve ever had. Amélie is incredibly talented!', author: 'Jessica T.', rating: 5, service: serviceMap['Lash Lift & Tint'], featured: true },
    { quote: 'The Swedish massage with Nadia is pure bliss. I come here every month.', author: 'Dominique B.', rating: 5, service: serviceMap['Swedish Massage'], featured: true },
    { quote: 'My gel manicure lasted three weeks! Great quality and beautiful atmosphere.', author: 'Camille R.', rating: 4, service: serviceMap['Gel Manicure'], featured: false },
  ]
  for (const t of testimonialsData) {
    await payload.create({ collection: 'testimonials', data: t })
    console.log(`  Created: "${t.quote.substring(0, 40)}..."`)
  }

  // ---- GALLERY ----
  console.log('\n🎨 Creating gallery items...')
  const galleryItems = [
    { image: galleryImageIds[0], caption: 'Our serene treatment room', category: 'salon' as const, featured: true },
    { image: galleryImageIds[1], caption: 'Skincare treatment in progress', category: 'treatments' as const, featured: true },
    { image: galleryImageIds[2], caption: 'Beautiful lash lift results', category: 'results' as const, featured: false },
  ]
  for (const item of galleryItems) {
    await payload.create({ collection: 'gallery', data: item })
    console.log(`  Created: ${item.caption}`)
  }

  // ---- HOMEPAGE GLOBAL ----
  console.log('\n🏠 Setting up homepage...')
  const en = homepageData.en
  const fr = homepageData.fr

  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      hero: { ...en.hero, backgroundImage: heroImageId },
      about: {
        heading: en.about.heading,
        image: aboutImageId,
      },
      servicesShowcase: en.servicesShowcase,
      specialistsSection: en.specialistsSection,
      testimonials: en.testimonials,
      cta: en.cta,
    },
  })

  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'fr',
    data: {
      hero: { ...fr.hero, backgroundImage: heroImageId },
      about: {
        heading: fr.about.heading,
        image: aboutImageId,
      },
      servicesShowcase: fr.servicesShowcase,
      specialistsSection: fr.specialistsSection,
      testimonials: fr.testimonials,
      cta: fr.cta,
    },
  })
  console.log('  Homepage configured (EN + FR)')

  // ---- SITE SETTINGS GLOBAL ----
  console.log('\n⚙️  Setting up site settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      salonName: siteSettingsData.salonName.en,
      address: siteSettingsData.address,
      phone: siteSettingsData.phone,
      email: siteSettingsData.email,
      socialLinks: siteSettingsData.socialLinks,
      openingHours: siteSettingsData.openingHours,
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'fr',
    data: {
      salonName: siteSettingsData.salonName.fr,
    },
  })
  console.log('  Site settings configured')

  console.log('\n✅ Seed complete!\n')
  console.log('  Admin: admin@lumiere-salon.com / admin123')
  console.log('  Customers: sophie@example.com, emma@example.com, lucas@example.com (password123)')
  console.log('')

  process.exit(0)
}

function addDays(date: Date, days: number, hours: number, minutes: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  d.setUTCHours(hours, minutes, 0, 0)
  return d
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
