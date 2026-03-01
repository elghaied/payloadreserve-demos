export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    // Intentional dev bypass: skip Turnstile when no secret key is configured in development.
    // In production TURNSTILE_SECRET_KEY must always be set — without it, verification fails closed.
    if (process.env.NODE_ENV === 'development') return true
    return false
  }

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token }),
  })

  const data = (await res.json()) as { success: boolean }
  return data.success === true
}
