import type { Endpoint } from 'payload'

export const seedEndpoint: Omit<Endpoint, 'root'> = {
  path: '/seed',
  method: 'post',
  handler: async (req) => {
    const payload = req.payload

    const isAdmin = req.user?.collection === 'users'
    const seedSecret = process.env.SEED_SECRET
    const headerSecret =
      req.headers.get('x-seed-secret') ||
      req.headers.get('authorization')?.replace('Bearer ', '')

    if (!isAdmin && !(seedSecret && headerSecret === seedSecret)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const { runSeed } = await import('../seed/index.js')
      await runSeed(payload)
      return Response.json({ success: true, message: 'Database seeded successfully' })
    } catch (error) {
      payload.logger.error(`Seed failed: ${error}`)
      return Response.json(
        { error: `Seed failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 },
      )
    }
  },
}
