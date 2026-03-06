import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getInfraSettings } from '@/lib/infra-settings'
import { getS3, getCoolify, deleteS3Prefix, dropDemoDatabase, buildMongoUrl } from '@/lib/cleanup-utils'
import { provisionAndDeploy } from '@/lib/provision-demo'
import type { DemoType } from '@payload-reserve-demos/types'

let lastCleanupAt = 0
const CLEANUP_COOLDOWN_MS = 60_000

export async function POST(req: NextRequest) {
  const now = Date.now()
  if (now - lastCleanupAt < CLEANUP_COOLDOWN_MS) {
    return NextResponse.json(
      { error: 'Cleanup already ran recently. Try again later.' },
      { status: 429 },
    )
  }
  lastCleanupAt = now

  const payload = await getPayload({ config })
  const settings = await getInfraSettings(payload)

  // Auth check — constant-time comparison
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const secret = settings.cleanupSecret || process.env.CLEANUP_SECRET || ''
  if (!token || !secret || token.length !== secret.length ||
      !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(secret))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const expired = await payload.find({
    collection: 'demo-instances',
    where: {
      expiresAt: { less_than: new Date().toISOString() },
      status: { not_equals: 'expired' },
    },
    limit: 100,
  })

  const s3 = getS3(settings)
  const coolify = getCoolify(settings)
  const mongoUrl = buildMongoUrl(settings)
  const s3Bucket = settings.s3Bucket || process.env.S3_BUCKET || ''

  let expiredCount = 0
  let failedCount = 0

  await Promise.allSettled(
    expired.docs.map(async (demo) => {
      const results = await Promise.allSettled([
        coolify
          ? coolify.deleteService(demo.coolifyServiceId)
          : Promise.resolve(),
        dropDemoDatabase(mongoUrl, demo.dbName),
        deleteS3Prefix(s3, s3Bucket, demo.s3Prefix),
      ])

      const anyFailed = results.some((r) => r.status === 'rejected')
      if (anyFailed) {
        results.forEach((r, i) => {
          if (r.status === 'rejected') {
            console.error(`[cleanup/${demo.demoId}] step ${i} failed:`, (r.reason as Error)?.message ?? r.reason)
          }
        })
        failedCount++
        // Do NOT mark as expired — leave for next cleanup run to retry
      } else {
        expiredCount++
        await payload.update({
          collection: 'demo-instances',
          id: demo.id,
          data: { status: 'expired' },
        })
      }
    }),
  )

  // --- Phase 2: Process pending queue ---
  const maxActive = settings.maxActiveDemos || Number(process.env.MAX_ACTIVE_DEMOS ?? 20)
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
        console.log(`[queue] Provisioning pending request ${request.id} (${request.email}, ${request.demoType})`)
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
        console.error(`[queue] Failed to provision request ${request.id}:`, (err as Error)?.message ?? err)
      }
    }
  }

  return NextResponse.json({ expired: expiredCount, failed: failedCount, queued: queuedCount })
}
