import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getInfraSettings } from '@/lib/infra-settings'
import { getS3, getCoolify, deleteS3Prefix, dropDemoDatabase, buildMongoUrl } from '@/lib/cleanup-utils'

export async function POST(req: NextRequest) {
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
            console.error(`[cleanup/${demo.demoId}] step ${i} failed:`, r.reason)
          }
        })
        failedCount++
      } else {
        expiredCount++
      }

      await payload.update({
        collection: 'demo-instances',
        id: demo.id,
        data: { status: 'expired' },
      })
    }),
  )

  return NextResponse.json({ expired: expiredCount, failed: failedCount })
}
