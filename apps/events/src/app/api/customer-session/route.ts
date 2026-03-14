import { getPayload } from 'payload'
import { headers } from 'next/headers'
import config from '@payload-config'
import { rateLimit } from '@/lib/rate-limit'

/**
 * GET /api/customer-session
 *
 * Returns the current customer user if authenticated via cookie,
 * or { user: null } otherwise. Checks user.collection to avoid
 * cross-collection issues when an admin is logged in.
 */
export async function GET() {
  const headersList = await headers()
  const sessionIp = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const { success } = rateLimit(`session:${sessionIp}`, 10, 60_000)
  if (!success) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: headersList })

  if (!user || (user as { collection?: string }).collection !== 'customers') {
    return Response.json({ user: null })
  }

  return Response.json({ user })
}
