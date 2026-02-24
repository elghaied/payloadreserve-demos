export type DemoType = 'salon' | 'hotel' | 'restaurant' | 'events'
export type DemoStatus = 'provisioning' | 'ready' | 'expired' | 'failed'

export interface Demo {
  demoId: string
  type: DemoType
  subdomain: string
  dbName: string
  s3Prefix: string
  adminEmail: string
  adminPasswordHash: string
  coolifyServiceId: string
  status: DemoStatus
  createdAt: Date
  expiresAt: Date
  requestIp?: string
}
