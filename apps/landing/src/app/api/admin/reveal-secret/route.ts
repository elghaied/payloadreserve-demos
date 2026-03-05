import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { SECRET_FIELDS } from '@/globals/InfrastructureSettings'
import { getInfraSettings } from '@/lib/infra-settings'

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { fieldName?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { fieldName } = body

  if (!fieldName || !SECRET_FIELDS.includes(fieldName)) {
    return Response.json({ error: 'Invalid field name' }, { status: 400 })
  }

  const settings = await getInfraSettings(payload)
  const value = (settings as unknown as Record<string, unknown>)[fieldName]

  return Response.json({ value: value ?? null })
}
