import { NextRequest, NextResponse } from 'next/server'
import { getDemo } from '@/lib/demos'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const demo = await getDemo(id)

  if (!demo) {
    return NextResponse.json({ error: 'Demo not found' }, { status: 404 })
  }

  const demoUrl = demo.status === 'ready' ? `https://${demo.subdomain}` : undefined

  return NextResponse.json({
    status: demo.status,
    demoUrl,
    expiresAt: demo.expiresAt,
  })
}
