import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { MongoClient } from 'mongodb'
import { CoolifyClient } from '@payload-reserve-demos/coolify-sdk'
import type { InfrastructureSetting } from '@/payload-types'

export function getS3(settings: InfrastructureSetting): S3Client {
  return new S3Client({
    endpoint: settings.s3Endpoint || undefined,
    region: settings.s3Region || 'us-east-1',
    credentials: {
      accessKeyId: settings.s3AccessKey || '',
      secretAccessKey: settings.s3SecretKey || '',
    },
    forcePathStyle: settings.s3ForcePathStyle ?? false,
  })
}

export function getCoolify(settings: InfrastructureSetting): CoolifyClient | null {
  const url = settings.coolifyApiUrl
  const key = settings.coolifyApiKey
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
  const user = encodeURIComponent(settings.mongoRootUsername || '')
  const pass = encodeURIComponent(settings.mongoRootPassword || '')
  const rawHost = settings.mongoHost || 'localhost'
  const host = rawHost.includes(':') ? rawHost : `${rawHost}:27017`
  return `mongodb://${user}:${pass}@${host}/?authSource=admin&directConnection=true`
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
