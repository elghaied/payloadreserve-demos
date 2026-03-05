import type { InfrastructureSetting } from '@/payload-types'

export async function verifyTurnstile(
  token: string,
  settings?: InfrastructureSetting | null,
): Promise<boolean> {
  const secret = settings?.turnstileSecretKey || process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV === 'development') return true
    return false
  }

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(10_000),
    })

    const data = (await res.json()) as { success: boolean }
    return data.success === true
  } catch {
    return false
  }
}
