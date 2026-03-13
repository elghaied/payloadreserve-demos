'use server'

import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import config from '@payload-config'

export async function fetchBookings(customerId: string) {
  const payload = await getPayload({ config })
  try {
    const bookings = await payload.find({
      collection: 'bookings',
      depth: 1,
      where: { customer: { equals: customerId } },
      sort: '-startTime',
      limit: 50,
    })
    return { success: true as const, bookings: bookings.docs }
  } catch {
    return { success: false as const, bookings: [] }
  }
}

export async function cancelBooking(bookingId: string) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user || (user as { collection?: string }).collection !== 'customers') {
    return { success: false as const, error: 'Not authenticated' }
  }

  try {
    await payload.update({
      collection: 'bookings',
      id: bookingId,
      data: { status: 'cancelled' },
      overrideAccess: false,
      user,
    })
    return { success: true as const }
  } catch {
    return { success: false as const, error: 'Cancellation failed' }
  }
}
