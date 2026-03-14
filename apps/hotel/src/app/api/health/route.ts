import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.find({ collection: 'users', limit: 1 })
    return NextResponse.json({
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      db: 'connected',
    })
  } catch {
    return NextResponse.json(
      { status: 'error', db: 'disconnected' },
      { status: 503 },
    )
  }
}
