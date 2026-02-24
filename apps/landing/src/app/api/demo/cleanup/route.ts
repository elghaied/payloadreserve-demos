import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { MongoClient } from 'mongodb'
import { CoolifyClient } from '@payload-reserve-demos/coolify-sdk'
import { findExpiredDemos, updateDemoStatus } from '@/lib/demos'

function getS3() {
  return new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION ?? 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  })
}

function getCoolify() {
  const url = process.env.COOLIFY_API_URL
  const key = process.env.COOLIFY_API_KEY
  if (!url || !key) return null
  return new CoolifyClient(url, key)
}

async function deleteS3Prefix(s3: S3Client, prefix: string): Promise<void> {
  const bucket = process.env.S3_BUCKET!
  const list = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix }))
  const objects = (list.Contents ?? []).map((o) => ({ Key: o.Key! }))
  if (objects.length === 0) return
  await s3.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: objects } }))
}

async function dropDemoDatabase(dbUrl: string, dbName: string): Promise<void> {
  const client = new MongoClient(dbUrl)
  try {
    await client.connect()
    await client.db(dbName).dropDatabase()
  } finally {
    await client.close()
  }
}

export async function POST(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token || token !== process.env.CLEANUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const expired = await findExpiredDemos()
  const s3 = getS3()
  const coolify = getCoolify()
  const dbUrl = process.env.DATABASE_URL!

  let expiredCount = 0
  let failedCount = 0

  await Promise.allSettled(
    expired.map(async (demo) => {
      const results = await Promise.allSettled([
        // Delete Coolify service
        coolify
          ? coolify.deleteService(demo.coolifyServiceId)
          : Promise.resolve(),

        // Drop demo MongoDB database
        dropDemoDatabase(dbUrl, demo.dbName),

        // Delete S3 prefix
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
      await updateDemoStatus(demo.demoId, 'expired')
    }),
  )

  return NextResponse.json({ expired: expiredCount, failed: failedCount })
}
