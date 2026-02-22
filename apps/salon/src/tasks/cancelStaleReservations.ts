import type { TaskConfig } from 'payload'

type CancelStaleIO = {
  input: Record<string, never>
  output: { cancelled: number }
}

export const cancelStaleReservationsTask: TaskConfig<CancelStaleIO> = {
  slug: 'cancelStaleReservations',
  // Automatically queue this task every 15 minutes
  schedule: [{ cron: '*/15 * * * *', queue: 'default' }],
  handler: async ({ req }) => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)

    const { docs } = await req.payload.find({
      collection: 'reservations',
      where: {
        and: [
          { status: { equals: 'pending' } },
          { createdAt: { less_than: thirtyMinutesAgo.toISOString() } },
        ],
      },
      limit: 100,
    })

    for (const reservation of docs) {
      await req.payload.update({
        collection: 'reservations',
        id: reservation.id,
        data: { status: 'cancelled' },
        context: { skipReservationHooks: true },
        req,
      })
    }

    return { output: { cancelled: docs.length } }
  },
}
