import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { MongoClient } from 'mongodb'
import { CoolifyClient } from '@payload-reserve-demos/coolify-sdk'

export function getS3(): S3Client {
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

export function getCoolify(): CoolifyClient | null {
  const url = process.env.COOLIFY_API_URL
  const key = process.env.COOLIFY_API_KEY
  if (!url || !key) return null
  return new CoolifyClient(url, key)
}

export async function deleteS3Prefix(s3: S3Client, prefix: string): Promise<void> {
  const bucket = process.env.S3_BUCKET!
  let continuationToken: string | undefined

  do {
    const list = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    )
    const objects = (list.Contents ?? []).map((o) => ({ Key: o.Key! }))
    if (objects.length > 0) {
      await s3.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: objects } }))
    }
    continuationToken = list.IsTruncated ? list.NextContinuationToken : undefined
  } while (continuationToken)
}

const SAFE_DB_NAME_RE = /^payloadreserve-demo-[a-z0-9]+$/

export async function dropDemoDatabase(dbUrl: string, dbName: string): Promise<void> {
  if (!SAFE_DB_NAME_RE.test(dbName)) {
    throw new Error(`Refusing to drop database with unexpected name: ${dbName}`)
  }
  const client = new MongoClient(dbUrl)
  try {
    await client.connect()
    await client.db(dbName).dropDatabase()
  } finally {
    await client.close()
  }
}
