import { getPayload } from 'payload'
import { headers } from 'next/headers'
import config from '@/payload.config'

/**
 * GET /api/customer-session
 *
 * Safe replacement for GET /api/customers/me.
 *
 * Payload's built-in /api/customers/me has a design limitation: it calls
 * findByID(req.user.id, collection: 'customers') BEFORE checking whether the
 * JWT token belongs to the customers collection. When an admin user (users
 * collection) is logged in and the frontend calls /api/customers/me, Payload
 * tries to look up the admin's ID in the customers collection, finds nothing,
 * and throws NotFound (404) — causing noisy server errors and broken auth
 * detection on the frontend.
 *
 * This endpoint uses payload.auth() directly and checks req.user.collection
 * before doing anything, returning { user: null } (200) instead of 404 when
 * the logged-in user is not a customer.
 */
export async function GET(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user || (user as { collection?: string }).collection !== 'customers') {
    return Response.json({ user: null })
  }

  return Response.json({ user })
}
