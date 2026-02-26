import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import type { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request)

  // Expose the resolved locale via a header so the root layout can set <html lang>
  const pathname = request.nextUrl.pathname
  const firstSegment = pathname.split('/')[1]
  const locale = (routing.locales as readonly string[]).includes(firstSegment)
    ? firstSegment
    : routing.defaultLocale

  response.headers.set('x-locale', locale)
  return response
}

export const config = {
  // Match all routes except: /docs, /api, /_next, /_vercel, static files
  matcher: ['/((?!docs|api|admin|_next|_vercel|favicon|.*\\..*).*)'],
}
