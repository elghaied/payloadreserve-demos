'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function login(email: string, password: string) {
  const payload = await getPayload({ config })
  try {
    const result = await payload.login({
      collection: 'customers',
      data: { email, password },
    })
    return { success: true as const, customer: result.user, token: result.token }
  } catch {
    return { success: false as const, error: 'Invalid credentials' }
  }
}

export async function register(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
}) {
  const payload = await getPayload({ config })
  try {
    await payload.create({
      collection: 'customers',
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    })
    // Auto-login after registration
    const loginResult = await payload.login({
      collection: 'customers',
      data: { email: data.email, password: data.password },
    })
    return { success: true as const, customer: loginResult.user, token: loginResult.token }
  } catch {
    return { success: false as const, error: 'Registration failed' }
  }
}

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
  try {
    await payload.update({
      collection: 'bookings',
      id: bookingId,
      data: { status: 'cancelled' },
      context: { skipReservationHooks: true },
    })
    return { success: true as const }
  } catch {
    return { success: false as const, error: 'Cancellation failed' }
  }
}
