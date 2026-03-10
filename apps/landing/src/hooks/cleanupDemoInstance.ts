import type { CollectionAfterDeleteHook } from 'payload'
import { getCoolify, getS3, deleteS3Prefix, dropDemoDatabase, buildMongoUrl } from '@/lib/cleanup-utils'
import { getInfraSettings } from '@/lib/infra-settings'

export const cleanupDemoInstance: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const { demoId, coolifyServiceId, dbName, s3Prefix } = doc

  // Fire-and-forget — errors are logged, not thrown
  void (async () => {
    const settings = await getInfraSettings(req.payload)
    const coolify = getCoolify()
    const s3 = getS3(settings)
    const mongoUrl = buildMongoUrl(settings)
    const s3Bucket = settings.s3Bucket || ''

    const results = await Promise.allSettled([
      coolify ? coolify.deleteService(coolifyServiceId) : Promise.resolve(),
      dropDemoDatabase(mongoUrl, dbName),
      deleteS3Prefix(s3, s3Bucket, s3Prefix),
    ])

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        const steps = ['Coolify delete', 'DB drop', 'S3 delete']
        console.error(`[cleanup/${demoId}] ${steps[i]} failed:`, r.reason)
      }
    })

    console.log(`[cleanup/${demoId}] afterDelete cleanup finished`)
  })()
}
