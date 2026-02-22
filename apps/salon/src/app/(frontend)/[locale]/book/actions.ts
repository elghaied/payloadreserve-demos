'use server'

import Stripe from 'stripe'
import { getPayload, createLocalReq } from 'payload'
import { getAvailableSlots as pluginGetAvailableSlots } from 'payload-reserve'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'

type Locale = 'en' | 'fr'

export async function getServices(locale: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'services',
    where: { active: { equals: true } },
    limit: 50,
    locale: locale as Locale,
    sort: 'name',
  })
  return result.docs
}

export async function getSpecialists(locale: string, serviceId?: string) {
  const payload = await getPayload({ config })
  const where: import('payload').Where = { active: { equals: true } }
  if (serviceId) {
    where.services = { contains: serviceId }
  }
  const result = await payload.find({
    collection: 'specialists',
    where,
    limit: 50,
    locale: locale as Locale,
  })
  return result.docs
}

export async function getAvailableSlots(
  serviceId: string,
  resourceId: string,
  date: string,
) {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)
  const dateObj = new Date(date)

  const slots = await pluginGetAvailableSlots({
    payload,
    req,
    date: dateObj,
    serviceId,
    resourceId,
    serviceSlug: 'services',
    resourceSlug: 'specialists',
    scheduleSlug: 'schedules',
    reservationSlug: 'reservations',
    blockingStatuses: ['pending', 'confirmed'],
  })

  return slots.map(
    (s) =>
      `${s.start.getUTCHours().toString().padStart(2, '0')}:${s.start.getUTCMinutes().toString().padStart(2, '0')}`,
  )
}

export async function createReservation(data: {
  serviceId: string
  resourceId: string
  date: string
  time: string
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

  let customerId = user?.id

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
          password: data.password || data.email,
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
      resource: data.resourceId,
      customer: customerId,
      startTime: startTime.toISOString(),
      status: 'pending',
      notes: data.notes || undefined,
    },
  })

  const service = await payload.findByID({ collection: 'services', id: data.serviceId })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (stripeKey && service?.price) {
    try {
      const stripeClient = new Stripe(stripeKey)

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'cad',
              product_data: { name: service.name },
              unit_amount: Math.round(service.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${data.locale}/book/success?session_id={CHECKOUT_SESSION_ID}&reservation=${reservation.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${data.locale}/book/cancel?reservation=${reservation.id}`,
        metadata: { reservationId: reservation.id },
      })

      return { reservationId: reservation.id, checkoutUrl: session.url }
    } catch {
      await payload.update({
        collection: 'reservations',
        id: reservation.id,
        data: { status: 'confirmed' },
      })
      return { reservationId: reservation.id, checkoutUrl: null }
    }
  }

  await payload.update({
    collection: 'reservations',
    id: reservation.id,
    data: { status: 'confirmed' },
  })
  return { reservationId: reservation.id, checkoutUrl: null }
}

export async function getBookingConfirmation(reservationId: string) {
  const payload = await getPayload({ config })
  const reservation = await payload.findByID({
    collection: 'reservations',
    id: reservationId,
    depth: 2,
  })
  return reservation
}

export async function confirmReservationViaStripe(
  reservationId: string,
  sessionId: string,
): Promise<boolean> {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return false

  try {
    const stripeClient = new Stripe(stripeKey)
    const session = await stripeClient.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') return false
    // Security: ensure this session was actually created for this reservation
    if (session.metadata?.reservationId !== reservationId) return false

    const payload = await getPayload({ config })
    const existing = await payload.findByID({
      collection: 'reservations',
      id: reservationId,
      depth: 0,
    })
    if (existing?.status === 'confirmed') return true // idempotent

    await payload.update({
      collection: 'reservations',
      id: reservationId,
      data: { status: 'confirmed' },
    })
    return true
  } catch {
    return false
  }
}

export async function cancelPendingReservation(reservationId: string) {
  const payload = await getPayload({ config })
  const reservation = await payload.findByID({
    collection: 'reservations',
    id: reservationId,
    depth: 0,
  })
  // Only cancel if still pending — payment never completed
  if (reservation?.status === 'pending') {
    await payload.update({
      collection: 'reservations',
      id: reservationId,
      data: { status: 'cancelled' },
      context: { skipReservationHooks: true }, // bypass 24h cancellation notice
    })
  }
}
