import { describe, it, expect, afterEach } from 'vitest'
import { getDemoSubdomain } from '../index'

describe('getDemoSubdomain', () => {
  const originalEnv = { ...process.env }

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('extracts subdomain from production NEXT_PUBLIC_SITE_URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://salon.payloadreserve.com'
    delete process.env.NEXT_PUBLIC_SERVER_URL
    expect(getDemoSubdomain()).toBe('salon')
  })

  it('extracts subdomain from NEXT_PUBLIC_SERVER_URL as fallback', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://hotel.payloadreserve.com'
    expect(getDemoSubdomain()).toBe('hotel')
  })

  it('prefers NEXT_PUBLIC_SITE_URL over NEXT_PUBLIC_SERVER_URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://salon.payloadreserve.com'
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://hotel.payloadreserve.com'
    expect(getDemoSubdomain()).toBe('salon')
  })

  it('returns localhost for local dev URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
    delete process.env.NEXT_PUBLIC_SERVER_URL
    expect(getDemoSubdomain()).toBe('localhost')
  })

  it('handles ephemeral demo subdomains', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://abc123.payloadreserve.com'
    delete process.env.NEXT_PUBLIC_SERVER_URL
    expect(getDemoSubdomain()).toBe('abc123')
  })

  it('returns unknown when neither env var is set', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    delete process.env.NEXT_PUBLIC_SERVER_URL
    expect(getDemoSubdomain()).toBe('unknown')
  })

  it('returns unknown for invalid URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'not-a-url'
    delete process.env.NEXT_PUBLIC_SERVER_URL
    expect(getDemoSubdomain()).toBe('unknown')
  })
})
