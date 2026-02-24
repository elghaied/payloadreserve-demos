import type { Demo, DemoStatus } from '@payload-reserve-demos/types'
import { getDb } from './mongo'

export async function createDemo(demo: Demo): Promise<void> {
  const db = await getDb()
  await db.collection<Demo>('demos').insertOne(demo)
}

export async function getDemo(demoId: string): Promise<Demo | null> {
  const db = await getDb()
  return db.collection<Demo>('demos').findOne({ demoId })
}

export async function updateDemoStatus(demoId: string, status: DemoStatus): Promise<void> {
  const db = await getDb()
  await db.collection<Demo>('demos').updateOne({ demoId }, { $set: { status } })
}

export async function countActiveDemos(): Promise<number> {
  const db = await getDb()
  return db.collection<Demo>('demos').countDocuments({ status: { $in: ['provisioning', 'ready'] } })
}

export async function findRecentDemosByIpOrEmail(requestIp: string, adminEmail: string): Promise<number> {
  const db = await getDb()
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
  return db.collection<Demo>('demos').countDocuments({
    createdAt: { $gte: since },
    $or: [{ requestIp }, { adminEmail }],
  })
}

export async function findExpiredDemos(): Promise<Demo[]> {
  const db = await getDb()
  return db.collection<Demo>('demos').find({
    expiresAt: { $lt: new Date() },
    status: { $ne: 'expired' },
  }).toArray()
}
