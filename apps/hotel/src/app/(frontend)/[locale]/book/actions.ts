'use server'

import Stripe from 'stripe'
import { getPayload, createLocalReq } from 'payload'
import { checkAvailability } from 'payload-reserve'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'

type Locale = 'en' | 'fr'

export async function getRoomTypes(locale: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'room-types',
    where: { active: { equals: true } },
    limit: 50,
    locale: locale as Locale,
    sort: 'price',
  })
  return result.docs
}

export async function getAvailableRooms(
  checkInDate: string,
  checkOutDate: string,
  locale: string,
  guestCount: number = 1,
) {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)

  const roomTypes = await payload.find({
    collection: 'room-types',
    where: { active: { equals: true } },
    limit: 50,
    locale: locale as Locale,
    sort: 'price',
  })

  const rooms = await payload.find({
    collection: 'rooms',
    where: { active: { equals: true } },
    limit: 50,
    depth: 1,
  })

  const checkIn = new Date(`${checkInDate}T15:00:00.000Z`)
  const checkOut = new Date(`${checkOutDate}T11:00:00.000Z`)

  const availableRoomTypes: Array<{
    roomTypeId: string
    roomId: string
    name: string
    description: string | null | undefined
    price: number
    imageUrl: string | null
    available: boolean
  }> = []

  for (const roomType of roomTypes.docs) {
    const room = rooms.docs.find((r) => {
      const services = r.services as Array<{ id?: string } | string>
      return services?.some((s) => {
        const sId = typeof s === 'object' ? s.id : s
        return sId === roomType.id
      })
    })

    if (!room) continue

    try {
      const result = await checkAvailability({
        payload,
        req,
        startTime: checkIn,
        endTime: checkOut,
        resourceId: room.id,
        resourceSlug: 'rooms',
        reservationSlug: 'reservations',
        blockingStatuses: ['pending', 'confirmed'],
        bufferAfter: roomType.bufferTimeAfter ?? 0,
        bufferBefore: 0,
        guestCount,
      })

      const image = roomType.image && typeof roomType.image === 'object' ? (roomType.image.url ?? null) : null

      availableRoomTypes.push({
        roomTypeId: roomType.id,
        roomId: room.id,
        name: roomType.name,
        description: roomType.description ?? null,
        price: roomType.price ?? 0,
        imageUrl: image,
        available: result.available,
      })
    } catch {
      availableRoomTypes.push({
        roomTypeId: roomType.id,
        roomId: room.id,
        name: roomType.name,
        description: roomType.description ?? null,
        price: roomType.price ?? 0,
        imageUrl: null,
        available: false,
      })
    }
  }

  return availableRoomTypes
}

export async function createReservation(data: {
  roomTypeId: string
  roomId: string
  checkInDate: string
  checkOutDate: string
  guestCount: number
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

  const startTime = new Date(`${data.checkInDate}T15:00:00.000Z`)
  const endTime = new Date(`${data.checkOutDate}T11:00:00.000Z`)

  let customerId = (user as { collection?: string } | null)?.collection === 'customers'
    ? user!.id
    : undefined

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
      service: data.roomTypeId,
      resource: data.roomId,
      customer: customerId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      guestCount: data.guestCount,
      status: 'pending',
      notes: data.notes || undefined,
    },
  })

  const roomType = await payload.findByID({ collection: 'room-types', id: data.roomTypeId })

  const nights = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24))
  const totalPrice = (roomType?.price || 0) * nights

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (stripeKey && totalPrice > 0) {
    try {
      const stripeClient = new Stripe(stripeKey)

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `${roomType.name} — ${nights} ${nights === 1 ? 'night' : 'nights'}`,
              },
              unit_amount: Math.round((roomType.price ?? 0) * 100),
            },
            quantity: nights,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002'}/${data.locale}/book/success?session_id={CHECKOUT_SESSION_ID}&reservation=${reservation.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002'}/${data.locale}/book/cancel?reservation=${reservation.id}`,
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
  return payload.findByID({
    collection: 'reservations',
    id: reservationId,
    depth: 2,
  })
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
    if (session.metadata?.reservationId !== reservationId) return false

    const payload = await getPayload({ config })
    const existing = await payload.findByID({
      collection: 'reservations',
      id: reservationId,
      depth: 0,
    })
    if (existing?.status === 'confirmed') return true

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
  if (reservation?.status === 'pending') {
    await payload.update({
      collection: 'reservations',
      id: reservationId,
      data: { status: 'cancelled' },
      context: { skipReservationHooks: true },
    })
  }
}
