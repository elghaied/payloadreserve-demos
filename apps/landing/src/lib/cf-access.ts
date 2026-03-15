import { createRemoteJWKSet, jwtVerify } from 'jose'

// ─── Configuration ──────────────────────────────────────────────
const CF_TEAM_DOMAIN = process.env.CF_ACCESS_TEAM_DOMAIN || ''
const CF_POLICY_AUD = process.env.CF_ACCESS_POLICY_AUD || ''

// ─── Public routes that bypass CF Access verification ───────────
// These routes are called from the unauthenticated frontend.
const PUBLIC_API_ROUTES = [
  { method: 'POST', pattern: /^\/api\/demo\/create$/ },
  { method: 'GET', pattern: /^\/api\/demo\/status\/[^/]+$/ },
  { method: 'GET', pattern: /^\/api\/health$/ },
]

/**
 * Check if a request matches a public API route (bypasses CF Access).
 */
export function isPublicApiRoute(method: string, pathname: string): boolean {
  return PUBLIC_API_ROUTES.some(
    (route) => route.method === method && route.pattern.test(pathname),
  )
}

/**
 * Check if CF Access protection is configured.
 * Returns false if env vars are missing (protection disabled).
 */
export function isCfAccessEnabled(): boolean {
  return Boolean(CF_TEAM_DOMAIN && CF_POLICY_AUD)
}

// ─── JWKS Key Set (cached by jose internally) ──────────────────
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null

function getJWKS() {
  if (!jwks && CF_TEAM_DOMAIN) {
    jwks = createRemoteJWKSet(
      new URL(`https://${CF_TEAM_DOMAIN}.cloudflareaccess.com/cdn-cgi/access/certs`),
    )
  }
  return jwks
}

/**
 * Verify a Cloudflare Access JWT token.
 * Returns true if the token is valid, false otherwise.
 */
export async function verifyCfAccessToken(token: string): Promise<boolean> {
  const keySet = getJWKS()
  if (!keySet) return false

  try {
    await jwtVerify(token, keySet, {
      audience: CF_POLICY_AUD,
      issuer: `https://${CF_TEAM_DOMAIN}.cloudflareaccess.com`,
    })
    return true
  } catch {
    return false
  }
}
