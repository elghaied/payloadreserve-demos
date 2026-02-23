import type { Endpoint } from 'payload'
import { runSeed } from '../seed/index.js'

export const seedEndpoint: Omit<Endpoint, 'root'> = {
  path: '/seed',
  method: 'post',
  handler: async (req) => {
    const isAdmin = req.user?.collection === 'users'
    const secret = req.headers.get('x-seed-secret')
    const validSecret = process.env.SEED_SECRET && secret === process.env.SEED_SECRET

    if (!isAdmin && !validSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      await runSeed(req.payload)
      return Response.json({ success: true, message: 'Database seeded successfully' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return Response.json({ error: message }, { status: 500 })
    }
  },
}
