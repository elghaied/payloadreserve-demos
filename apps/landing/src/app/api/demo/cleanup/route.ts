import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getS3, getCoolify, deleteS3Prefix, dropDemoDatabase } from '@/lib/cleanup-utils'

export async function POST(req: NextRequest) {
  // Auth check — constant-time comparison to prevent timing attacks
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const secret = process.env.CLEANUP_SECRET ?? ''
  if (!token || !secret || token.length !== secret.length ||
      !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(secret))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })

  const expired = await payload.find({
    collection: 'demo-instances',
    where: {
      expiresAt: { less_than: new Date().toISOString() },
      status: { not_equals: 'expired' },
    },
    limit: 100,
  })

  const s3 = getS3()
  const coolify = getCoolify()
  const dbUrl = process.env.DATABASE_URL!

  let expiredCount = 0
  let failedCount = 0

  await Promise.allSettled(
    expired.docs.map(async (demo) => {
      const results = await Promise.allSettled([
        coolify
          ? coolify.deleteService(demo.coolifyServiceId)
          : Promise.resolve(),
        dropDemoDatabase(dbUrl, demo.dbName),
        deleteS3Prefix(s3, demo.s3Prefix),
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

      // Always mark expired to avoid re-processing
      await payload.update({
        collection: 'demo-instances',
        id: demo.id,
        data: { status: 'expired' },
      })
    }),
  )

  return NextResponse.json({ expired: expiredCount, failed: failedCount })
}
