import type { Payload } from 'payload'

/**
 * Downloads an image from a URL and uploads it to the Payload media collection.
 * Falls back to a 1x1 GIF placeholder if the download fails.
 */
export async function uploadImage(
  payload: Payload,
  url: string,
  alt: string,
  filename?: string,
): Promise<string> {
  const inferredFilename = filename ?? url.split('/').pop()?.split('?')[0] ?? 'image.jpg'
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`)
    const buffer = Buffer.from(await response.arrayBuffer())
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    const media = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: buffer,
        name: inferredFilename,
        mimetype: contentType,
        size: buffer.length,
      },
    })
    console.log(`  Uploaded: ${alt}`)
    return media.id
  } catch {
    console.warn(`  Warning: Could not download image for "${alt}", using placeholder`)
    const media = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
        name: `${inferredFilename.replace(/\.[^.]+$/, '')}-placeholder.gif`,
        mimetype: 'image/gif',
        size: 43,
      },
    })
    return media.id
  }
}

/**
 * Creates an admin user in the Payload users collection if one doesn't already exist.
 */
export async function createAdminUser(
  payload: Payload,
  email: string,
  password: string,
): Promise<void> {
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: { email, password },
    })
    console.log(`  Created: ${email}`)
  } else {
    console.log(`  Admin already exists: ${email}`)
  }
}

/**
 * Extracts the demo subdomain from the app's site URL env var.
 * Used to populate Stripe metadata for Cloudflare Worker webhook routing.
 */
export function getDemoSubdomain(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL
  if (!siteUrl) return 'unknown'
  try {
    return new URL(siteUrl).hostname.split('.')[0]
  } catch {
    return 'unknown'
  }
}
