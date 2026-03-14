import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  const checks: Record<string, string> = {}

  try {
    const payload = await getPayload({ config })
    await payload.find({ collection: 'demo-instances', limit: 1 })
    checks.db = 'connected'
  } catch {
    checks.db = 'disconnected'
  }

  const coolifyUrl = process.env.COOLIFY_API_URL
  if (coolifyUrl) {
    try {
      const res = await fetch(`${coolifyUrl}/api/v1/healthcheck`, {
        signal: AbortSignal.timeout(5000),
      })
      checks.coolify = res.ok ? 'reachable' : 'unreachable'
    } catch {
      checks.coolify = 'unreachable'
    }
  }

  const healthy = checks.db === 'connected'
  return NextResponse.json(
    { status: healthy ? 'ok' : 'error', uptime: Math.floor(process.uptime()), ...checks },
    { status: healthy ? 200 : 503 },
  )
}
