import type { CollectionAfterDeleteHook } from 'payload'
import { getCoolify, getS3, deleteS3Prefix, dropDemoDatabase } from '@/lib/cleanup-utils'

export const cleanupDemoInstance: CollectionAfterDeleteHook = async ({ doc }) => {
  const { demoId, coolifyServiceId, dbName, s3Prefix } = doc

  // Fire-and-forget — errors are logged, not thrown
  void (async () => {
    const coolify = getCoolify()
    const s3 = getS3()
    const dbUrl = process.env.DATABASE_URL!

    const results = await Promise.allSettled([
      coolify ? coolify.deleteService(coolifyServiceId) : Promise.resolve(),
      dropDemoDatabase(dbUrl, dbName),
      deleteS3Prefix(s3, s3Prefix),
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
