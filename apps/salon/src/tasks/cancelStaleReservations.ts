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
      depth: 0,
      limit: 100,
    })

    for (const reservation of docs) {
      // No skipReservationHooks — the afterBookingCancel plugin hook fires
      // and notifyAfterCancel handles the email automatically.
      await req.payload.update({
        collection: 'reservations',
        id: reservation.id,
        data: { status: 'cancelled' },
        req,
      })

      req.payload.logger.info(
        `cancelStaleReservations: cancelled stale reservation ${reservation.id}`,
      )
    }

    return { output: { cancelled: docs.length } }
  },
}
