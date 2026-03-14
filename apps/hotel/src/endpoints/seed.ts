import type { Endpoint } from 'payload'
import { rateLimit } from '@/lib/rate-limit'

export const seedEndpoint: Omit<Endpoint, 'root'> = {
  path: '/seed',
  method: 'post',
  handler: async (req) => {
    const isAdmin = req.user?.collection === 'users'
    const secret = req.headers.get('x-seed-secret')
    const authHeader = req.headers.get('authorization') ?? ''
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    const validSecret =
      process.env.SEED_SECRET &&
      (secret === process.env.SEED_SECRET || bearerToken === process.env.SEED_SECRET)

    if (!isAdmin && !validSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { success } = rateLimit(`seed:${ip}`, 1, 60_000)
    if (!success) {
      return Response.json({ error: 'Rate limited' }, { status: 429 })
    }

    try {
      const { runSeed } = await import('../seed/index.js')
      await runSeed(req.payload)
      return Response.json({ success: true, message: 'Database seeded successfully' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return Response.json({ error: message }, { status: 500 })
    }
  },
}
