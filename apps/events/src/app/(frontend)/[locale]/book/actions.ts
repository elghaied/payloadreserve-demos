'use server'

import Stripe from 'stripe'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import config from '@payload-config'

export async function createBooking(data: {
  serviceId: string
  resourceId: string
  startTime: string
  ticketQuantity: number
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
  }
  locale: string
}) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  // Only treat the session user as a customer if they authenticated via the customers collection.
  let customerId =
    (user as { collection?: string } | null)?.collection === 'customers'
      ? user!.id
      : undefined

  if (!customerId) {
    const existing = await payload.find({
      collection: 'customers',
      where: { email: { equals: data.customer.email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      customerId = existing.docs[0].id
    } else {
      const newCustomer = await payload.create({
        collection: 'customers',
        data: {
          firstName: data.customer.firstName,
          lastName: data.customer.lastName,
          email: data.customer.email,
          password: data.customer.password || data.customer.email,
          phone: data.customer.phone,
        },
      })
      customerId = newCustomer.id
    }
  }

  try {
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        service: data.serviceId,
        resource: data.resourceId,
        customer: customerId,
        startTime: data.startTime,
        status: 'pending',
        ticketQuantity: data.ticketQuantity,
      },
    })

    const eventType = await payload.findByID({
      collection: 'event-types',
      id: data.serviceId,
    })

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (stripeKey && eventType?.price) {
      try {
        const stripeClient = new Stripe(stripeKey)
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

        const session = await stripeClient.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'eur',
                product_data: { name: eventType.name },
                unit_amount: Math.round(eventType.price * 100),
              },
              quantity: data.ticketQuantity,
            },
          ],
          mode: 'payment',
          success_url: `${siteUrl}/${data.locale}/book/success?session_id={CHECKOUT_SESSION_ID}&reservation=${booking.id}`,
          cancel_url: `${siteUrl}/${data.locale}/book/cancel?reservation=${booking.id}`,
          metadata: { reservationId: booking.id },
        })

        return {
          success: true as const,
          bookingId: booking.id,
          checkoutUrl: session.url,
        }
      } catch {
        // Stripe error — confirm directly as fallback
        await payload.update({
          collection: 'bookings',
          id: booking.id,
          data: { status: 'confirmed' },
        })
        return {
          success: true as const,
          bookingId: booking.id,
          checkoutUrl: null,
        }
      }
    }

    // No Stripe or free event — confirm directly
    await payload.update({
      collection: 'bookings',
      id: booking.id,
      data: { status: 'confirmed' },
    })
    return {
      success: true as const,
      bookingId: booking.id,
      checkoutUrl: null,
    }
  } catch {
    return { success: false as const, error: 'Failed to create booking' }
  }
}

export async function getBookingConfirmation(bookingId: string) {
  const payload = await getPayload({ config })
  const booking = await payload.findByID({
    collection: 'bookings',
    id: bookingId,
    depth: 2,
  })
  return booking
}

export async function confirmBookingViaStripe(
  bookingId: string,
  sessionId: string,
): Promise<boolean> {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return false

  try {
    const stripeClient = new Stripe(stripeKey)
    const session = await stripeClient.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') return false
    if (session.metadata?.reservationId !== bookingId) return false

    const payload = await getPayload({ config })
    const existing = await payload.findByID({
      collection: 'bookings',
      id: bookingId,
      depth: 0,
    })
    if (existing?.status === 'confirmed') return true // idempotent

    await payload.update({
      collection: 'bookings',
      id: bookingId,
      data: { status: 'confirmed' },
    })
    return true
  } catch {
    return false
  }
}

export async function cancelPendingBooking(bookingId: string) {
  const payload = await getPayload({ config })
  const booking = await payload.findByID({
    collection: 'bookings',
    id: bookingId,
    depth: 0,
  })
  // Only cancel if still pending — payment never completed
  if (booking?.status === 'pending') {
    await payload.update({
      collection: 'bookings',
      id: bookingId,
      data: { status: 'cancelled' },
      context: { skipReservationHooks: true }, // bypass cancellation policy for abandoned payment
    })
  }
}
