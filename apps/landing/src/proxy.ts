import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const securityHeaders: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.pexels.com https://*.payloadreserve.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.payloadreserve.com https://*.ingest.de.sentry.io",
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
  ].join('; '),
}

function addSecurityHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }
  return response
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ─── API routes: pass through with security headers ─────────
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    return addSecurityHeaders(response)
  }

  // ─── i18n middleware for frontend routes ─────────────────────
  const response = intlMiddleware(request)

  const firstSegment = pathname.split('/')[1]
  const locale = (routing.locales as readonly string[]).includes(firstSegment)
    ? firstSegment
    : routing.defaultLocale
  response.headers.set('x-locale', locale)

  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    '/((?!docs|admin|_next|_vercel|media|favicon\\.ico|.*\\..*).*)',
  ],
}
