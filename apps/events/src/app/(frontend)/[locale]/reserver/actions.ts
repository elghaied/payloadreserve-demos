'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function createBooking(data: {
  serviceId: string
  resourceId: string
  startTime: string
  ticketQuantity: number
  customer: { firstName: string; lastName: string; email: string; phone: string }
}) {
  const payload = await getPayload({ config })

  // Find or create customer
  const existing = await payload.find({
    collection: 'customers',
    where: { email: { equals: data.customer.email } },
    limit: 1,
  })

  let customerId: string
  if (existing.docs.length > 0) {
    customerId = existing.docs[0].id
  } else {
    const customer = await payload.create({
      collection: 'customers',
      data: {
        email: data.customer.email,
        password: 'temp-' + Date.now(),
        firstName: data.customer.firstName,
        lastName: data.customer.lastName,
        phone: data.customer.phone,
      },
    })
    customerId = customer.id
  }

  // Create booking
  try {
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        service: data.serviceId,
        resource: data.resourceId,
        customer: customerId,
        startTime: data.startTime,
        status: 'confirmed',
        ticketQuantity: data.ticketQuantity,
      },
      context: { skipReservationHooks: true },
    })
    return { success: true as const, bookingId: booking.id }
  } catch {
    return { success: false as const, error: 'Failed to create booking' }
  }
}
