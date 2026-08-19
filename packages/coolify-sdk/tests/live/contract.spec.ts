import { describe, expect, it } from 'vitest'
import { CoolifyApiError, CoolifyClient } from '../../src/index'

/**
 * Live contract tests against a real Coolify instance.
 *
 * These exist because of the 4.3.9 upgrade: Coolify moved start/stop/restart
 * from GET to POST, and no unit test can notice an upstream API change. The
 * demo pipeline broke silently — the app record was still created, so the only
 * symptom was demos sitting on "provisioning" for ten minutes.
 *
 * Rather than hardcoding the expected verb, these drive the real CoolifyClient
 * and assert the request it sends is one Coolify still accepts. That catches
 * drift from either side: a changed endpoint, or a changed SDK.
 *
 * Opt-in. Run with:
 *   COOLIFY_API_URL=https://coolify.example.com/api COOLIFY_API_KEY=... pnpm test:live
 *
 * Side-effect free: every request targets a UUID that does not exist, so a
 * correctly-routed call answers 404 and nothing is deployed, stopped or deleted.
 */

const BASE = process.env.COOLIFY_API_URL
const KEY = process.env.COOLIFY_API_KEY
const MISSING_UUID = 'contracttestnonexistent'

const live = BASE && KEY ? describe : describe.skip

live('Coolify API contract', () => {
  const client = new CoolifyClient(BASE!, KEY!)

  /**
   * 404 → the route matched and only the resource was missing, so the method
   * the SDK used is correct. 405 → Coolify changed the method out from under us.
   */
  async function statusFor(call: Promise<unknown>): Promise<number> {
    const err = await call.then(() => null).catch((e: unknown) => e)
    if (!(err instanceof CoolifyApiError)) {
      throw new Error(`expected a CoolifyApiError for a missing uuid, got: ${String(err)}`)
    }
    return err.status
  }

  it.each([
    ['startService', (c: CoolifyClient) => c.startService(MISSING_UUID)],
    ['stopService', (c: CoolifyClient) => c.stopService(MISSING_UUID)],
    ['restartService', (c: CoolifyClient) => c.restartService(MISSING_UUID)],
  ] as const)('%s sends a request Coolify still accepts', async (_name, call) => {
    const status = await statusFor(call(client))

    expect(status, 'got 405 — Coolify changed the HTTP method for this endpoint').not.toBe(405)
    expect(status).toBe(404)
  })

  it('getServiceStatus reaches the route', async () => {
    const status = await statusFor(client.getServiceStatus(MISSING_UUID))

    expect(status).toBe(404)
  })

  it('deleteService still swallows a real 404 from Coolify', async () => {
    // Exercises the 404-is-success path against the live API, not a mock.
    await expect(client.deleteService(MISSING_UUID)).resolves.toBeUndefined()
  })

  it('listServices is reachable and authorised', async () => {
    await expect(client.listServices()).resolves.toBeInstanceOf(Array)
  })

  it('reports status as a compound "<state>:<health>" string', async () => {
    const res = await fetch(`${BASE!.replace(/\/$/, '')}/v1/applications`, {
      headers: { Authorization: `Bearer ${KEY}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(30_000),
    })
    const apps = (await res.json()) as Array<{ status?: string }>
    const statuses = apps.map((a) => a.status).filter(Boolean) as string[]

    expect(statuses.length).toBeGreaterThan(0)
    // If Coolify flattens this back to a bare word, our parser silently returns
    // 'unknown' for everything again — catch it here instead of in production.
    expect(statuses.every((s) => s.includes(':'))).toBe(true)
  })
})
