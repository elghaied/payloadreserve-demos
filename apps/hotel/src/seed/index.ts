import type { Payload } from 'payload'
import { uploadImage } from './images.js'
import { roomTypesData } from './data/roomTypes.js'
import { amenitiesData } from './data/amenities.js'
import { homepageData, siteSettingsData } from './data/homepage.js'

export async function runSeed(payload: Payload): Promise<void> {
  console.log('\n🏨 Starting Grand Hotel seed...\n')

  // Clear existing data
  console.log('Clearing existing data...')
  const collections = ['reservations', 'schedules', 'rooms', 'room-types', 'testimonials', 'gallery', 'amenities'] as const
  for (const slug of collections) {
    try {
      await payload.delete({ collection: slug, where: { id: { exists: true } } })
    } catch {
      // Collection might not exist yet
    }
  }

  try {
    await payload.delete({ collection: 'customers', where: { id: { exists: true } } })
  } catch { /* ignore */ }

  try {
    await payload.delete({ collection: 'media', where: { id: { exists: true } } })
  } catch { /* ignore */ }

  // ---- GUEST USERS ----
  console.log('\n👤 Creating guest users...')
  const guestsData = [
    { email: 'richard@example.com', firstName: 'Richard', lastName: 'Morrison', phone: '+33 6 12 34 56 78' },
    { email: 'elena@example.com', firstName: 'Elena', lastName: 'Rossi', phone: '+39 333 456 7890' },
    { email: 'james@example.com', firstName: 'James', lastName: 'Whitfield', phone: '+44 20 7123 4567' },
  ]
  const guests: string[] = []
  for (const g of guestsData) {
    const guest = await payload.create({
      collection: 'customers',
      data: { ...g, password: 'password123' },
    })
    guests.push(guest.id)
    console.log(`  Created: ${g.email}`)
  }

  // ---- IMAGES ----
  console.log('\n🖼️  Uploading images...')
  const heroImageId = await uploadImage(payload, 'heroBackground', 'Hotel exterior')
  const aboutImageId = await uploadImage(payload, 'aboutHotel', 'Hotel lobby')
  const roomImages: Record<string, string> = {}
  for (const rt of roomTypesData) {
    roomImages[rt.imageKey] = await uploadImage(payload, rt.imageKey, rt.name)
  }
  const amenityImages: Record<string, string> = {}
  for (const key of ['pool', 'spa', 'restaurant'] as const) {
    amenityImages[key] = await uploadImage(payload, key, key)
  }
  const galleryImageIds: string[] = []
  for (const key of ['gallery1', 'gallery2', 'gallery3', 'lobby'] as const) {
    galleryImageIds.push(await uploadImage(payload, key, 'Gallery image'))
  }

  // ---- AMENITIES ----
  console.log('\n🏊 Creating amenities...')
  for (let i = 0; i < amenitiesData.length; i++) {
    const a = amenitiesData[i]
    const imageId = a.icon === 'pool' ? amenityImages.pool
      : a.icon === 'spa' ? amenityImages.spa
      : a.icon === 'restaurant' ? amenityImages.restaurant
      : undefined
    await payload.create({
      collection: 'amenities',
      data: {
        name: a.name,
        description: a.description,
        icon: a.icon,
        featured: a.featured,
        order: i + 1,
        ...(imageId ? { image: imageId } : {}),
      },
    })
    console.log(`  Created: ${a.name}`)
  }

  // ---- ROOM TYPES (services) ----
  console.log('\n🛏️  Creating room types...')
  const roomTypeMap: Record<string, string> = {}
  for (const rt of roomTypesData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roomType = await (payload.create as any)({
      collection: 'room-types',
      data: {
        name: rt.name,
        description: rt.description,
        duration: rt.duration,
        durationType: rt.durationType,
        price: rt.price,
        bufferTimeBefore: rt.bufferTimeBefore,
        bufferTimeAfter: rt.bufferTimeAfter,
        active: rt.active,
        image: roomImages[rt.imageKey],
      },
    })
    roomTypeMap[rt.name] = roomType.id
    console.log(`  Created: ${rt.name} ($${rt.price}/night)`)
  }

  // ---- ROOMS (resources with quantity) ----
  console.log('\n🚪 Creating room pools...')
  const roomIds: string[] = []
  for (const rt of roomTypesData) {
    const roomTypeName = rt.name.replace(' Room', ' Rooms').replace(' Suite', ' Suites')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const room = await (payload.create as any)({
      collection: 'rooms',
      data: {
        name: roomTypeName,
        services: [roomTypeMap[rt.name]],
        quantity: rt.quantity,
        capacityMode: 'per-reservation',
        active: true,
        image: roomImages[rt.imageKey],
        description: `${rt.quantity} ${roomTypeName.toLowerCase()} available`,
      },
    })
    roomIds.push(room.id)
    console.log(`  Created: ${roomTypeName} (qty: ${rt.quantity})`)
  }

  // ---- SCHEDULES ----
  console.log('\n📅 Creating schedules...')
  for (let i = 0; i < roomIds.length; i++) {
    const roomTypeName = roomTypesData[i].name.replace(' Room', ' Rooms').replace(' Suite', ' Suites')
    await payload.create({
      collection: 'schedules',
      data: {
        name: `${roomTypeName} — Availability`,
        resource: roomIds[i],
        scheduleType: 'recurring',
        recurringSlots: [
          { day: 'mon', startTime: '00:00', endTime: '23:59' },
          { day: 'tue', startTime: '00:00', endTime: '23:59' },
          { day: 'wed', startTime: '00:00', endTime: '23:59' },
          { day: 'thu', startTime: '00:00', endTime: '23:59' },
          { day: 'fri', startTime: '00:00', endTime: '23:59' },
          { day: 'sat', startTime: '00:00', endTime: '23:59' },
          { day: 'sun', startTime: '00:00', endTime: '23:59' },
        ],
        exceptions: [],
      },
    })
    console.log(`  Created: ${roomTypeName} schedule`)
  }

  // ---- SAMPLE RESERVATIONS ----
  console.log('\n📋 Creating sample reservations...')
  const now = new Date()

  const reservationsToCreate = [
    {
      service: roomTypeMap['Classic Room'],
      resource: roomIds[0],
      customer: guests[0],
      startTime: addDays(now, 5, 15, 0),  // check-in 3pm
      endTime: addDays(now, 8, 11, 0),    // check-out 11am, 3 nights
      status: 'confirmed' as const,
      guestCount: 2,
    },
    {
      service: roomTypeMap['Deluxe Suite'],
      resource: roomIds[2],
      customer: guests[1],
      startTime: addDays(now, 10, 15, 0),
      endTime: addDays(now, 14, 11, 0),   // 4 nights
      status: 'confirmed' as const,
      guestCount: 2,
    },
    {
      service: roomTypeMap['Superior Room'],
      resource: roomIds[1],
      customer: guests[2],
      startTime: addDays(now, 3, 15, 0),
      endTime: addDays(now, 5, 11, 0),    // 2 nights
      status: 'confirmed' as const,
      guestCount: 1,
    },
    {
      service: roomTypeMap['Executive Suite'],
      resource: roomIds[3],
      customer: guests[0],
      startTime: addDays(now, -7, 15, 0),
      endTime: addDays(now, -4, 11, 0),   // past, 3 nights
      status: 'completed' as const,
      guestCount: 2,
    },
    {
      service: roomTypeMap['Classic Room'],
      resource: roomIds[0],
      customer: guests[1],
      startTime: addDays(now, -14, 15, 0),
      endTime: addDays(now, -12, 11, 0),
      status: 'cancelled' as const,
      guestCount: 1,
      cancellationReason: 'Travel plans changed',
    },
  ]

  for (const res of reservationsToCreate) {
    await payload.create({
      collection: 'reservations',
      data: {
        service: res.service,
        resource: res.resource,
        customer: res.customer,
        startTime: res.startTime.toISOString(),
        endTime: res.endTime.toISOString(),
        status: res.status,
        guestCount: res.guestCount,
        cancellationReason: 'cancellationReason' in res ? res.cancellationReason : undefined,
      },
      context: { skipReservationHooks: true },
    })
    console.log(`  Created: ${res.status} reservation (${res.guestCount} guests)`)
  }

  // ---- TESTIMONIALS ----
  console.log('\n⭐ Creating testimonials...')
  const testimonialsData = [
    { quote: 'An extraordinary stay. The Deluxe Suite was impeccable, and the staff anticipated our every need.', author: 'Richard & Catherine M.', rating: 5, roomType: roomTypeMap['Deluxe Suite'], featured: true },
    { quote: 'The rooftop pool at sunset is worth the trip alone. Combined with the incredible restaurant, this is the finest hotel we\'ve visited.', author: 'James W.', rating: 5, roomType: roomTypeMap['Superior Room'], featured: true },
    { quote: 'We celebrated our anniversary in the Executive Suite. The private terrace and champagne upon arrival — simply perfect.', author: 'Elena & Marco R.', rating: 5, roomType: roomTypeMap['Executive Suite'], featured: true },
    { quote: 'Even the Classic Room exceeded our expectations. Beautiful furnishings, impeccable service, and a view that made us never want to leave.', author: 'Sophie L.', rating: 5, roomType: roomTypeMap['Classic Room'], featured: false },
  ]
  for (const t of testimonialsData) {
    await payload.create({ collection: 'testimonials', data: t })
    console.log(`  Created: "${t.quote.substring(0, 40)}..."`)
  }

  // ---- GALLERY ----
  console.log('\n🎨 Creating gallery items...')
  const galleryItems = [
    { image: galleryImageIds[0], caption: 'Our magnificent lobby', category: 'lobby' as const, featured: true },
    { image: galleryImageIds[1], caption: 'Deluxe Suite bedroom', category: 'rooms' as const, featured: true },
    { image: galleryImageIds[2], caption: 'Rooftop dining terrace', category: 'dining' as const, featured: false },
    { image: galleryImageIds[3], caption: 'Grand entrance', category: 'exterior' as const, featured: false },
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
      about: { heading: en.about.heading, image: aboutImageId },
      roomsShowcase: en.roomsShowcase,
      amenitiesSection: en.amenitiesSection,
      testimonials: en.testimonials,
      cta: en.cta,
    },
  })

  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'fr',
    data: {
      hero: { ...fr.hero, backgroundImage: heroImageId },
      about: { heading: fr.about.heading, image: aboutImageId },
      roomsShowcase: fr.roomsShowcase,
      amenitiesSection: fr.amenitiesSection,
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
      hotelName: siteSettingsData.hotelName.en,
      address: siteSettingsData.address,
      phone: siteSettingsData.phone,
      email: siteSettingsData.email,
      checkInTime: siteSettingsData.checkInTime,
      checkOutTime: siteSettingsData.checkOutTime,
      socialLinks: siteSettingsData.socialLinks,
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'fr',
    data: {
      hotelName: siteSettingsData.hotelName.fr,
    },
  })
  console.log('  Site settings configured')

  console.log('\n✅ Grand Hotel seed complete!\n')
  console.log('  Guests: richard@example.com, elena@example.com, james@example.com (password123)')
  console.log('')
}

function addDays(date: Date, days: number, hours: number, minutes: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  d.setUTCHours(hours, minutes, 0, 0)
  return d
}
