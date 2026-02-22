'use server'

import type { Where } from 'payload'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import Stripe from 'stripe'
import config from '@/payload.config'
import type { Service } from '@/payload-types'

export async function getUser() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  return user
}

export async function getReservations(status: 'upcoming' | 'past') {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  if (!user) return []

  const now = new Date().toISOString()
  const where: Where = {
    customer: { equals: user.id },
  }

  if (status === 'upcoming') {
    where.startTime = { greater_than_equal: now }
    where.status = { in: ['pending', 'confirmed'] }
  } else {
    where.or = [
      { startTime: { less_than: now } },
      { status: { in: ['completed', 'cancelled', 'no-show'] } },
    ]
  }

  const result = await payload.find({
    collection: 'reservations',
    where,
    sort: status === 'upcoming' ? 'startTime' : '-startTime',
    depth: 2,
    limit: 50,
    overrideAccess: false,
    user,
  })
  return result.docs
}

export async function cancelReservation(id: string, reason: string) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  if (!user) throw new Error('Not authenticated')

  try {
    await payload.update({
      collection: 'reservations',
      id,
      data: {
        status: 'cancelled',
        cancellationReason: reason,
      },
      overrideAccess: false,
      user,
    })
  } catch (err) {
    if (err instanceof Error && err.message.toLowerCase().includes('cancellation')) {
      throw new Error('TOO_LATE')
    }
    throw err
  }
}

export async function createPaymentSession(
  reservationId: string,
  locale: string,
): Promise<{ checkoutUrl: string }> {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  if (!user) throw new Error('Not authenticated')

  const reservation = await payload.findByID({
    collection: 'reservations',
    id: reservationId,
    depth: 1,
    overrideAccess: false,
    user,
  })

  if (reservation.status !== 'pending') {
    throw new Error('Reservation is not pending payment')
  }

  const service = reservation.service as Service
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) throw new Error('Stripe is not configured')
  if (!service?.price) throw new Error('Service has no price')

  const stripeClient = new Stripe(stripeKey)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

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
    success_url: `${siteUrl}/${locale}/book/success?session_id={CHECKOUT_SESSION_ID}&reservation=${reservationId}`,
    cancel_url: `${siteUrl}/${locale}/account/reservations/${reservationId}`,
    metadata: { reservationId },
  })

  if (!session.url) throw new Error('Failed to create Stripe session')

  return { checkoutUrl: session.url }
}

export async function updateProfile(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
}) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  if (!user) throw new Error('Not authenticated')

  await payload.update({
    collection: 'customers',
    id: user.id,
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    },
    overrideAccess: false,
    user,
  })
}
