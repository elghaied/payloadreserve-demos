import { getPayload } from 'payload'
import { headers } from 'next/headers'
import config from '@/payload.config'

export async function GET(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user || (user as { collection?: string }).collection !== 'customers') {
    return Response.json({ user: null })
  }

  return Response.json({ user })
}
