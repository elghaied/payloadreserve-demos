import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { getCoolify } from '@/lib/cleanup-utils'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: { resource?: string }
    try {
      body = await req.json()
    } catch {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    const { resource } = body

    if (!resource || !['projects', 'servers'].includes(resource)) {
      return Response.json({ error: 'Invalid resource' }, { status: 400 })
    }

    const coolify = getCoolify()
    if (!coolify) {
      return Response.json(
        { error: 'Coolify not configured. Set COOLIFY_API_URL and COOLIFY_API_KEY environment variables.' },
        { status: 422 },
      )
    }

    if (resource === 'projects') {
      const projects = await coolify.listProjects()
      return Response.json({
        options: projects.map((p) => ({ value: p.uuid, label: p.name })),
      })
    }

    const servers = await coolify.listServers()
    return Response.json({
      options: servers.map((s) => ({
        value: s.uuid,
        label: `${s.name} (${s.ip})`,
      })),
    })
  } catch (err) {
    console.error('[coolify-browse]', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}
