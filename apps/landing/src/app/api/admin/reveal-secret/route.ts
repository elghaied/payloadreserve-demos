import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { SECRET_FIELDS } from '@/globals/InfrastructureSettings'

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { fieldName } = body as { fieldName?: string }

  if (!fieldName || !SECRET_FIELDS.includes(fieldName)) {
    return Response.json({ error: 'Invalid field name' }, { status: 400 })
  }

  const settings = await payload.findGlobal({
    slug: 'infrastructure-settings',
    context: { includeSecrets: true },
  })

  const value = (settings as unknown as Record<string, unknown>)[fieldName]

  return Response.json({ value: value ?? null })
}
