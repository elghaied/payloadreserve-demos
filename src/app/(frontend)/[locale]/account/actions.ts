'use server'

import type { Where } from 'payload'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import config from '@/payload.config'

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

  const reservation = await payload.findByID({
    collection: 'reservations',
    id,
    overrideAccess: false,
    user,
  })

  // Check 24h cancellation policy
  const startTime = new Date(reservation.startTime)
  const now = new Date()
  const hoursUntil = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  if (hoursUntil < 24) {
    throw new Error('TOO_LATE')
  }

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
}

export async function updateProfile(data: { name: string; email: string; phone: string }) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  if (!user) throw new Error('Not authenticated')

  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
    },
    overrideAccess: false,
    user,
  })
}
