import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

import { seed } from '@/seed/index'

export async function POST() {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await seed(payload)
    return Response.json({ success: true, message: 'Website content seeded successfully.' })
  } catch (err) {
    payload.logger.error({ msg: 'Seed failed', err })
    return Response.json(
      { error: 'Seed failed. Check server logs for details.' },
      { status: 500 },
    )
  }
}
