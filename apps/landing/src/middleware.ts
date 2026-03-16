import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { isCfAccessEnabled, isPublicApiRoute, verifyCfAccessToken } from './lib/cf-access'

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
    "connect-src 'self' https://*.payloadreserve.com",
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
  ].join('; '),
}

let cfAccessWarned = false

function addSecurityHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }
  return response
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (process.env.NODE_ENV === 'production' && !isCfAccessEnabled() && !cfAccessWarned) {
    console.warn('[security] CF Access is not configured — API routes are unprotected')
    cfAccessWarned = true
  }

  // ─── CF Access gate for /api routes ───────────────────────────
  // Public routes pass through; all others require a valid CF Access JWT.
  // When CF_ACCESS_TEAM_DOMAIN is not set, protection is disabled (dev mode).
  if (pathname.startsWith('/api/')) {
    if (isCfAccessEnabled()) {
      const method = request.method
      if (!isPublicApiRoute(method, pathname)) {
        const cfToken = request.headers.get('Cf-Access-Jwt-Assertion')
        if (!cfToken || !(await verifyCfAccessToken(cfToken))) {
          return addSecurityHeaders(
            NextResponse.json({ error: 'Unauthorized' }, { status: 403 }),
          )
        }
      }
    }
    // API routes don't need i18n — pass through with security headers
    const response = NextResponse.next()
    return addSecurityHeaders(response)
  }

  // ─── i18n middleware for frontend routes ───────────────────────
  const response = intlMiddleware(request)

  const firstSegment = pathname.split('/')[1]
  const locale = (routing.locales as readonly string[]).includes(firstSegment)
    ? firstSegment
    : routing.defaultLocale
  response.headers.set('x-locale', locale)

  return addSecurityHeaders(response)
}

export const config = {
  // Expanded matcher: now includes /api paths for CF Access checking.
  // /admin is still excluded — protected entirely at the Cloudflare proxy level.
  matcher: [
    '/((?!docs|admin|_next|_vercel|media|favicon\\.ico|.*\\..*).*)',
  ],
}
