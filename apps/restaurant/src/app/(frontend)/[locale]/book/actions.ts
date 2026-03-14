'use server'

import crypto from 'crypto'
import Stripe from 'stripe'
import { getPayload, createLocalReq } from 'payload'
import { getAvailableSlots as pluginGetAvailableSlots } from 'payload-reserve'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'

function requireSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
  if (!url) throw new Error('Missing NEXT_PUBLIC_SITE_URL environment variable')
  return url
}

type Locale = 'en' | 'fr'

export async function getDiningExperiences(locale: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'dining-experiences',
    where: { active: { equals: true } },
    limit: 50,
    locale: locale as Locale,
    sort: 'name',
  })
  return result.docs
}

export async function getAvailableSlots(serviceId: string, date: string) {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)
  const dateObj = new Date(date)

  // Get all tables
  const tables = await payload.find({
    collection: 'tables',
    limit: 100,
  })

  // For each table, get available slots and track which tables are available per time
  const slotMap = new Map<string, string[]>() // time → tableIds

  for (const table of tables.docs) {
    const slots = await pluginGetAvailableSlots({
      payload,
      req,
      date: dateObj,
      serviceId,
      resourceId: table.id as string,
      serviceSlug: 'dining-experiences',
      resourceSlug: 'tables',
      scheduleSlug: 'schedules',
      reservationSlug: 'reservations',
      blockingStatuses: ['pending', 'confirmed'],
    })

    for (const s of slots) {
      const time = `${s.start.getUTCHours().toString().padStart(2, '0')}:${s.start.getUTCMinutes().toString().padStart(2, '0')}`
      if (!slotMap.has(time)) slotMap.set(time, [])
      slotMap.get(time)!.push(table.id as string)
    }
  }

  // Return sorted unique times with their available tables
  return Array.from(slotMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, tableIds]) => ({ time, tableIds }))
}

export async function createReservation(data: {
  serviceId: string
  tableId: string
  date: string
  time: string
  partySize: number
  firstName: string
  lastName: string
  email: string
  phone: string
  password?: string
  notes: string
  locale: string
}) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  const startTime = new Date(`${data.date}T${data.time}:00.000Z`)

  let customerId = (user as { collection?: string } | null)?.collection === 'customers' ? user!.id : undefined

  if (!customerId) {
    const existing = await payload.find({
      collection: 'customers',
      where: { email: { equals: data.email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      customerId = existing.docs[0].id
    } else {
      const newCustomer = await payload.create({
        collection: 'customers',
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password || crypto.randomBytes(16).toString('hex'),
          phone: data.phone,
        },
      })
      customerId = newCustomer.id
    }
  }

  const reservation = await payload.create({
    collection: 'reservations',
    data: {
      service: data.serviceId,
      resource: data.tableId,
      customer: customerId,
      startTime: startTime.toISOString(),
      status: 'pending',
      notes: data.notes || undefined,
      partySize: data.partySize,
    },
  })

  const service = await payload.findByID({ collection: 'dining-experiences', id: data.serviceId })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (stripeKey && service?.price) {
    try {
      const stripeClient = new Stripe(stripeKey)

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: { name: service.name },
              unit_amount: Math.round(service.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${requireSiteUrl()}/${data.locale}/book/success?session_id={CHECKOUT_SESSION_ID}&reservation=${reservation.id}`,
        cancel_url: `${requireSiteUrl()}/${data.locale}/book/cancel?reservation=${reservation.id}`,
        metadata: { reservationId: reservation.id },
      })

      return { reservationId: reservation.id, checkoutUrl: session.url }
    } catch {
      await payload.update({ collection: 'reservations', id: reservation.id, data: { status: 'confirmed' } })
      return { reservationId: reservation.id, checkoutUrl: null }
    }
  }

  await payload.update({ collection: 'reservations', id: reservation.id, data: { status: 'confirmed' } })
  return { reservationId: reservation.id, checkoutUrl: null }
}

export async function getBookingConfirmation(reservationId: string) {
  const payload = await getPayload({ config })
  return await payload.findByID({ collection: 'reservations', id: reservationId, depth: 2 })
}

export async function confirmReservationViaStripe(reservationId: string, sessionId: string): Promise<boolean> {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return false
  try {
    const stripeClient = new Stripe(stripeKey)
    const session = await stripeClient.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') return false
    if (session.metadata?.reservationId !== reservationId) return false
    const payload = await getPayload({ config })
    const existing = await payload.findByID({ collection: 'reservations', id: reservationId, depth: 0 })
    if (existing?.status === 'confirmed') return true
    await payload.update({ collection: 'reservations', id: reservationId, data: { status: 'confirmed' } })
    return true
  } catch {
    return false
  }
}

export async function cancelPendingReservation(reservationId: string) {
  const payload = await getPayload({ config })
  const reservation = await payload.findByID({ collection: 'reservations', id: reservationId, depth: 0 })
  if (reservation?.status === 'pending') {
    await payload.update({
      collection: 'reservations',
      id: reservationId,
      data: { status: 'cancelled' },
      context: { skipReservationHooks: true },
    })
  }
}
