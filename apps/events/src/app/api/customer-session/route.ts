import { getPayload } from 'payload'
import { headers } from 'next/headers'
import config from '@payload-config'

/**
 * GET /api/customer-session
 *
 * Returns the current customer user if authenticated via cookie,
 * or { user: null } otherwise. Checks user.collection to avoid
 * cross-collection issues when an admin is logged in.
 */
export async function GET() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user || (user as { collection?: string }).collection !== 'customers') {
    return Response.json({ user: null })
  }

  return Response.json({ user })
}
