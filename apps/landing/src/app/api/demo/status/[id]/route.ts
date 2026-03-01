import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const demoProtocol = process.env.DEMO_PROTOCOL ?? 'https'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const statusToken = req.nextUrl.searchParams.get('token')

  if (!statusToken) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'demo-instances',
    where: { demoId: { equals: id } },
    limit: 1,
  })

  const demo = result.docs[0]
  if (!demo || !demo.statusTokenHash) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Constant-time comparison of hashed status token
  const providedHash = crypto.createHash('sha256').update(statusToken).digest('hex')
  if (
    providedHash.length !== demo.statusTokenHash.length ||
    !crypto.timingSafeEqual(Buffer.from(providedHash), Buffer.from(demo.statusTokenHash))
  ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const demoUrl = demo.status === 'ready' ? `${demoProtocol}://${demo.subdomain}` : undefined

  return NextResponse.json({
    status: demo.status,
    demoUrl,
    expiresAt: demo.expiresAt,
  })
}
