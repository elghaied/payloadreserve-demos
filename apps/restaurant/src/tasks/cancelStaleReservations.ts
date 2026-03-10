import type { TaskConfig } from 'payload'

type CancelStaleIO = {
  input: Record<string, never>
  output: { cancelled: number }
}

export const cancelStaleReservationsTask: TaskConfig<CancelStaleIO> = {
  slug: 'cancelStaleReservations',
  schedule: [{ cron: '*/15 * * * *', queue: 'default' }],
  handler: async ({ req }) => {
    const payload = req.payload
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()

    const stale = await payload.find({
      collection: 'reservations',
      where: {
        status: { equals: 'pending' },
        createdAt: { less_than: thirtyMinutesAgo },
      },
      limit: 50,
      req,
    })

    let cancelled = 0
    for (const reservation of stale.docs) {
      try {
        await payload.update({
          collection: 'reservations',
          id: reservation.id,
          data: { status: 'cancelled' },
          req,
        })
        cancelled++
        payload.logger.info(`Cancelled stale reservation ${reservation.id}`)
      } catch (error) {
        payload.logger.error(`Failed to cancel reservation ${reservation.id}: ${error}`)
      }
    }

    return { output: { cancelled } }
  },
}
