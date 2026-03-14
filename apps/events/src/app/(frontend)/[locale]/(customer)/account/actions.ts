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

export async function updateProfile(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
}) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user || (user as { collection?: string }).collection !== 'customers') {
    return { success: false as const, error: 'Not authenticated' }
  }

  try {
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
    return { success: true as const }
  } catch {
    return { success: false as const, error: 'Update failed' }
  }
}

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user || (user as { collection?: string }).collection !== 'customers') {
    return { success: false as const, error: 'Not authenticated' }
  }

  // Verify current password (verification-only — response discarded)
  try {
    await payload.login({
      collection: 'customers',
      data: {
        email: user.email,
        password: data.currentPassword,
      },
    })
  } catch {
    return { success: false as const, error: 'Invalid current password' }
  }

  // Update to new password
  try {
    await payload.update({
      collection: 'customers',
      id: user.id,
      data: {
        password: data.newPassword,
      },
      overrideAccess: false,
      user,
    })
    return { success: true as const }
  } catch {
    return { success: false as const, error: 'Password update failed' }
  }
}
