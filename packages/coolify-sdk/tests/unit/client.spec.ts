import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CoolifyApiError, CoolifyClient } from '../../src/index'

const BASE = 'https://coolify.example.com/api'
const UUID = 'abc123'

let fetchMock: ReturnType<typeof vi.fn>

/** Build a client whose fetch returns a canned response. */
function clientReturning(status: number, body = '{}') {
  fetchMock = vi.fn(async () => new Response(body, { status }))
  vi.stubGlobal('fetch', fetchMock)
  return new CoolifyClient(BASE, 'token')
}

/** The (url, init) pair of the Nth fetch call. */
function callN(n = 0): [string, RequestInit] {
  return fetchMock.mock.calls[n] as [string, RequestInit]
}

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('lifecycle endpoints use POST', () => {
  // Coolify 4.3.9 moved these from GET to POST. Sending GET returns
  // 405 "This endpoint has changed to a POST request." and the container
  // is never deployed — which is silent, because the app record exists.
  it.each([
    ['startService', 'start'],
    ['stopService', 'stop'],
    ['restartService', 'restart'],
  ] as const)('%s → POST /applications/{uuid}/%s', async (method, path) => {
    const client = clientReturning(200)

    await client[method](UUID)

    const [url, init] = callN()
    expect(init.method).toBe('POST')
    expect(url).toBe(`${BASE}/v1/applications/${UUID}/${path}`)
  })
})

describe('getServiceStatus parses compound status', () => {
  // Coolify reports "<container-state>:<health>", never a bare word.
  it.each([
    ['running:healthy', 'running'],
    ['running:unhealthy', 'running'],
    ['running:unknown', 'running'],
    ['exited:unhealthy', 'stopped'],
    ['restarting:unhealthy', 'starting'],
    ['degraded:unhealthy', 'error'],
    ['running', 'running'],
    ['', 'unknown'],
  ])('%s → %s', async (raw, expected) => {
    const client = clientReturning(200, JSON.stringify({ status: raw }))

    await expect(client.getServiceStatus(UUID)).resolves.toBe(expected)
  })

  it('maps a running-but-unhealthy container to running, not error', async () => {
    // A booting Payload container is running:unhealthy until its healthcheck
    // passes. Calling that an error would abort provisioning polls early.
    const client = clientReturning(200, JSON.stringify({ status: 'running:unhealthy' }))

    await expect(client.getServiceStatus(UUID)).resolves.not.toBe('error')
  })
})

describe('deleteService', () => {
  it('treats 404 as success — already gone is the desired outcome', async () => {
    const client = clientReturning(404, '{"message":"Application not found"}')

    await expect(client.deleteService(UUID)).resolves.toBeUndefined()
  })

  it('still throws on other client errors', async () => {
    const client = clientReturning(403, '{"message":"Forbidden"}')

    await expect(client.deleteService(UUID)).rejects.toThrow(CoolifyApiError)
  })
})

describe('4xx responses are not retried', () => {
  it('issues exactly one request for a client error', async () => {
    const client = clientReturning(404, '{"message":"Application not found"}')

    await client.deleteService(UUID)

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('surfaces status and body on CoolifyApiError', async () => {
    const client = clientReturning(422, '{"message":"Invalid destination"}')

    const err = await client.startService(UUID).catch((e: unknown) => e)

    expect(err).toBeInstanceOf(CoolifyApiError)
    expect((err as CoolifyApiError).status).toBe(422)
    expect((err as CoolifyApiError).body).toContain('Invalid destination')
  })
})
