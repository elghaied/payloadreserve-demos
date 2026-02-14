'use server'

import type { Where } from 'payload'
import { getPayload } from 'payload'
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
  const where: Where = { active: { equals: true } }
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

  const service = await payload.findByID({ collection: 'services', id: serviceId })
  if (!service) return []

  const schedules = await payload.find({
    collection: 'schedules',
    where: { resource: { equals: resourceId } },
    limit: 1,
  })

  if (schedules.docs.length === 0) return []
  const schedule = schedules.docs[0]

  const dateObj = new Date(date)
  const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][dateObj.getUTCDay()]

  if (schedule.exceptions?.some((ex) => ex.date === date)) return []

  const daySlots = schedule.recurringSlots?.filter((s) => s.day === dayOfWeek) || []
  if (daySlots.length === 0) return []

  const dayStart = `${date}T00:00:00.000Z`
  const dayEnd = `${date}T23:59:59.999Z`
  const existingReservations = await payload.find({
    collection: 'reservations',
    where: {
      resource: { equals: resourceId },
      startTime: { greater_than_equal: dayStart, less_than_equal: dayEnd },
      status: { in: ['pending', 'confirmed'] },
    },
    limit: 100,
  })

  const duration = service.duration || 60
  const bufferBefore = service.bufferTimeBefore || 5
  const bufferAfter = service.bufferTimeAfter || 5
  const slotInterval = 15

  const slots: string[] = []

  for (const daySlot of daySlots) {
    const [startH, startM] = daySlot.startTime.split(':').map(Number)
    const [endH, endM] = daySlot.endTime.split(':').map(Number)
    const scheduleStart = startH * 60 + startM
    const scheduleEnd = endH * 60 + endM

    for (let time = scheduleStart; time + duration <= scheduleEnd; time += slotInterval) {
      const slotStart = time - bufferBefore
      const slotEnd = time + duration + bufferAfter

      const hasConflict = existingReservations.docs.some((res) => {
        const resStartDate = new Date(res.startTime)
        const resEndDate = new Date(res.endTime || res.startTime)
        const resStart = resStartDate.getUTCHours() * 60 + resStartDate.getUTCMinutes()
        const resEnd = resEndDate.getUTCHours() * 60 + resEndDate.getUTCMinutes()
        const resBufferBefore = (typeof res.service === 'object' ? res.service.bufferTimeBefore : 0) || 0
        const resBufferAfter = (typeof res.service === 'object' ? res.service.bufferTimeAfter : 0) || 0

        return slotEnd > (resStart - resBufferBefore) && slotStart < (resEnd + resBufferAfter)
      })

      if (!hasConflict) {
        const hours = Math.floor(time / 60).toString().padStart(2, '0')
        const minutes = (time % 60).toString().padStart(2, '0')
        slots.push(`${hours}:${minutes}`)
      }
    }
  }

  return slots
}

export async function createReservation(data: {
  serviceId: string
  resourceId: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  notes: string
  locale: string
}) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  const service = await payload.findByID({ collection: 'services', id: data.serviceId })
  if (!service) throw new Error('Service not found')

  const duration = service.duration || 60
  const startTime = new Date(`${data.date}T${data.time}:00.000Z`)
  const endTime = new Date(startTime.getTime() + duration * 60000)

  let customerId = user?.id

  if (!customerId) {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: data.email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      customerId = existing.docs[0].id
    } else {
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: data.email,
          password: data.email,
          name: data.name,
          phone: data.phone,
          role: 'customer',
        },
      })
      customerId = newUser.id
    }
  }

  const reservation = await payload.create({
    collection: 'reservations',
    data: {
      service: data.serviceId,
      resource: data.resourceId,
      customer: customerId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: 'pending',
      notes: data.notes || undefined,
    },
  })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (stripeKey && service.price) {
    try {
      const Stripe = (await import('stripe')).default
      const stripeClient = new Stripe(stripeKey, { apiVersion: '2022-08-01' })

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
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${data.locale}/book/success?reservation=${reservation.id}`,
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
