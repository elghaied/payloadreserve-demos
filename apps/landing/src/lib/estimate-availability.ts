import type { Payload } from 'payload'
import type { InfrastructureSetting } from '@/payload-types'

/**
 * Estimate when the next queued demo will become available.
 *
 * 1. Get all active demos sorted by expiresAt ASC
 * 2. Count pending requests in queue (includes the just-created one)
 * 3. Queue position = pendingCount (new request is last)
 * 4. Return expiresAt of the Nth active demo (N = queue position)
 * 5. If queue > active demos, extrapolate using TTL cycles
 */
export async function estimateAvailability(
  payload: Payload,
  settings: InfrastructureSetting,
): Promise<Date> {
  const pendingCount = await payload.count({
    collection: 'demo-requests',
    where: { status: { equals: 'pending' } },
  })

  const queuePosition = pendingCount.totalDocs

  const activeDemos = await payload.find({
    collection: 'demo-instances',
    where: { status: { in: ['provisioning', 'ready'] } },
    sort: 'expiresAt',
    limit: queuePosition,
  })

  if (queuePosition <= activeDemos.docs.length && activeDemos.docs.length > 0) {
    const targetDemo = activeDemos.docs[queuePosition - 1]
    return new Date(targetDemo.expiresAt)
  }

  // Fallback: extrapolate based on TTL cycles
  const ttlMs = (settings.demoTtlHours || 24) * 60 * 60 * 1000
  const maxActive = settings.maxActiveDemos || 20
  const cyclesNeeded = Math.ceil(queuePosition / maxActive)
  const earliestExpiry = activeDemos.docs[0]
    ? new Date(activeDemos.docs[0].expiresAt).getTime()
    : Date.now() + ttlMs
  return new Date(earliestExpiry + (cyclesNeeded - 1) * ttlMs)
}
