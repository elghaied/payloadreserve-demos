import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { MongoClient } from 'mongodb'
import { CoolifyClient } from '@payload-reserve-demos/coolify-sdk'
import type { InfrastructureSetting } from '@/payload-types'

export function getS3(settings: InfrastructureSetting): S3Client {
  return new S3Client({
    endpoint: settings.s3Endpoint || process.env.S3_ENDPOINT,
    region: settings.s3Region || process.env.S3_REGION || 'us-east-1',
    credentials: {
      accessKeyId: settings.s3AccessKey || process.env.S3_ACCESS_KEY || '',
      secretAccessKey: settings.s3SecretKey || process.env.S3_SECRET_KEY || '',
    },
    forcePathStyle: settings.s3ForcePathStyle ?? (process.env.S3_FORCE_PATH_STYLE === 'true'),
  })
}

export function getCoolify(settings: InfrastructureSetting): CoolifyClient | null {
  const url = settings.coolifyApiUrl || process.env.COOLIFY_API_URL
  const key = settings.coolifyApiKey || process.env.COOLIFY_API_KEY
  if (!url || !key) return null
  return new CoolifyClient(url, key)
}

export async function deleteS3Prefix(s3: S3Client, bucket: string, prefix: string): Promise<void> {
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

export function buildMongoUrl(settings: InfrastructureSetting): string {
  const user = encodeURIComponent(settings.mongoRootUsername || process.env.MONGO_ROOT_USERNAME || '')
  const pass = encodeURIComponent(settings.mongoRootPassword || process.env.MONGO_ROOT_PASSWORD || '')
  const host = settings.mongoHost || process.env.MONGO_HOST || 'localhost:27017'
  return `mongodb://${user}:${pass}@${host}:27017/?authSource=admin&directConnection=true`
}

export async function dropDemoDatabase(mongoUrl: string, dbName: string): Promise<void> {
  if (!SAFE_DB_NAME_RE.test(dbName)) {
    throw new Error(`Refusing to drop database with unexpected name: ${dbName}`)
  }
  const client = new MongoClient(mongoUrl)
  try {
    await client.connect()
    await client.db(dbName).dropDatabase()
  } finally {
    await client.close()
  }
}
