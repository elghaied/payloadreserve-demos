import type { PayloadRequest } from 'payload'
import { getInfraSettings } from '@/lib/infra-settings'
import { getS3, getCoolify, deleteS3Prefix, dropDemoDatabase, buildMongoUrl } from '@/lib/cleanup-utils'
import { provisionAndDeploy } from '@/lib/provision-demo'
import type { DemoType } from '@payload-reserve-demos/types'

export const cleanupExpiredDemosHandler = async ({ req }: { req: PayloadRequest }) => {
  const { payload } = req
  const settings = await getInfraSettings(payload)

  // Phase 1: Clean expired demos
  const expired = await payload.find({
    collection: 'demo-instances',
    where: {
      expiresAt: { less_than: new Date().toISOString() },
      status: { not_equals: 'expired' },
    },
    limit: 100,
  })

  let expiredCount = 0
  let failedCount = 0

  if (expired.docs.length > 0) {
    console.log(`[cleanup-job] Found ${expired.docs.length} expired demo(s)`)

    const s3 = getS3(settings)
    const coolify = getCoolify(settings)
    const mongoUrl = buildMongoUrl(settings)
    const s3Bucket = settings.s3Bucket || ''

    await Promise.allSettled(
      expired.docs.map(async (demo) => {
        const results = await Promise.allSettled([
          coolify ? coolify.deleteService(demo.coolifyServiceId) : Promise.resolve(),
          dropDemoDatabase(mongoUrl, demo.dbName),
          deleteS3Prefix(s3, s3Bucket, demo.s3Prefix),
        ])

        const anyFailed = results.some((r) => r.status === 'rejected')
        if (anyFailed) {
          results.forEach((r, i) => {
            if (r.status === 'rejected') {
              const steps = ['Coolify delete', 'DB drop', 'S3 delete']
              console.error(
                `[cleanup-job/${demo.demoId}] ${steps[i]} failed:`,
                (r.reason as Error)?.message ?? r.reason,
              )
            }
          })
          failedCount++
        } else {
          await payload.update({
            collection: 'demo-instances',
            id: demo.id,
            data: { status: 'expired' },
          })
          expiredCount++
          console.log(`[cleanup-job/${demo.demoId}] Marked as expired`)
        }
      }),
    )
  }

  // Phase 2: Process pending queue
  const maxActive = settings.maxActiveDemos || 20
  const currentActive = await payload.count({
    collection: 'demo-instances',
    where: { status: { in: ['provisioning', 'ready'] } },
  })

  const availableSlots = maxActive - currentActive.totalDocs
  let queuedCount = 0

  if (availableSlots > 0) {
    const pendingRequests = await payload.find({
      collection: 'demo-requests',
      where: { status: { equals: 'pending' } },
      sort: 'createdAt',
      limit: availableSlots,
    })

    for (const request of pendingRequests.docs) {
      try {
        console.log(`[cleanup-job/queue] Provisioning pending request ${request.id} (${request.email}, ${request.demoType})`)
        await provisionAndDeploy({
          email: request.email,
          demoType: request.demoType as DemoType,
          requestIp: request.requestIp || 'unknown',
          demoRequestId: request.id,
          payload,
          settings,
        })
        queuedCount++
      } catch (err) {
        console.error(`[cleanup-job/queue] Failed to provision request ${request.id}:`, (err as Error)?.message ?? err)
      }
    }
  }

  return {
    output: {
      expired: expiredCount,
      failed: failedCount,
      queued: queuedCount,
    },
  }
}
