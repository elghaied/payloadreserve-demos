import pRetry, { AbortError } from 'p-retry'
import type { CoolifyEnvVar, CoolifyProject, CoolifyServer, CoolifyService, CoolifyServiceStatus, CreateServiceOptions } from './types'

export class CoolifyApiError extends Error {
  readonly status: number
  readonly body: string

  constructor(method: string, path: string, status: number, body: string) {
    super(`Coolify API ${method} ${path} failed with ${status}`)
    this.name = 'CoolifyApiError'
    this.status = status
    this.body = body
  }
}

export class CoolifyClient {
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.apiKey = apiKey
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    return pRetry(
      () => this._doRequest<T>(method, path, body),
      { retries: 3, minTimeout: 1000, factor: 2, randomize: true },
    )
  }

  private async _doRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}/v1${path}`
    console.log(`[coolify-sdk] ${method} ${url}${body !== undefined ? ' ' + JSON.stringify(body).slice(0, 300) : ''}`)
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30_000),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`[coolify-sdk] ${method} ${path} → ${res.status}: ${text}`)
      const error = new CoolifyApiError(method, path, res.status, text)
      // 4xx means the request itself is wrong — retrying just multiplies the noise.
      if (res.status >= 400 && res.status < 500) throw new AbortError(error)
      throw error
    }

    const text = await res.text()
    console.log(`[coolify-sdk] ${method} ${path} → ${res.status} OK${text ? ' ' + text.slice(0, 200) : ''}`)
    return text ? (JSON.parse(text) as T) : (undefined as T)
  }

  async createService(opts: CreateServiceOptions): Promise<CoolifyService> {
    const data = await this.request<{ uuid: string }>('POST', '/applications/dockerimage', {
      project_uuid: opts.projectUuid,
      server_uuid: opts.serverUuid,
      destination_uuid: opts.destinationUuid,
      environment_name: opts.environmentName,
      docker_registry_image_name: opts.dockerImageName,
      docker_registry_image_tag: opts.dockerImageTag,
      ports_exposes: opts.ports,
      name: opts.name,
      domains: opts.fqdn,
      connect_to_docker_network: opts.connectToDockerNetwork ?? true,
      instant_deploy: opts.instantDeploy ?? false,
    })

    const uuid = data.uuid

    if (opts.envVars && opts.envVars.length > 0) {
      await this.setEnvironmentVariables(uuid, opts.envVars)
    }

    return { id: uuid, name: opts.name, status: 'stopped' }
  }

  async deleteService(serviceId: string): Promise<void> {
    try {
      await this.request<void>('DELETE', `/applications/${serviceId}`)
    } catch (err) {
      // Already gone is the outcome we wanted — don't fail the cleanup over it.
      if (err instanceof CoolifyApiError && err.status === 404) return
      throw err
    }
  }

  async getServiceStatus(serviceId: string): Promise<CoolifyServiceStatus> {
    const data = await this.request<{ status: string }>('GET', `/applications/${serviceId}`)
    // Coolify reports a compound `<container-state>:<health>` string, e.g.
    // "running:healthy", "running:unknown", "exited:unhealthy".
    const [state = ''] = (data.status ?? '').toLowerCase().split(':')
    if (state === 'running') return 'running'
    if (state === 'stopped' || state === 'exited') return 'stopped'
    if (state === 'starting') return 'starting'
    if (state === 'restarting') return 'starting'
    if (state === 'stopping') return 'stopping'
    if (state === 'degraded' || state === 'error') return 'error'
    return 'unknown'
  }

  async listServices(): Promise<CoolifyService[]> {
    const data = await this.request<Array<{ uuid: string; name: string; status: string }>>('GET', '/applications')
    return data.map((app) => ({
      id: app.uuid,
      name: app.name,
      status: 'unknown' as CoolifyServiceStatus,
    }))
  }

  async setEnvironmentVariables(serviceId: string, vars: CoolifyEnvVar[]): Promise<void> {
    await this.request<void>('PATCH', `/applications/${serviceId}/envs/bulk`, {
      data: vars.map((v) => ({ key: v.key, value: v.value, is_secret: v.is_secret ?? false })),
    })
  }

  // Coolify 4.3.9 changed start/stop/restart from GET to POST.
  async startService(serviceId: string): Promise<void> {
    await this.request<void>('POST', `/applications/${serviceId}/start`)
  }

  async stopService(serviceId: string): Promise<void> {
    await this.request<void>('POST', `/applications/${serviceId}/stop`)
  }

  async restartService(serviceId: string): Promise<void> {
    await this.request<void>('POST', `/applications/${serviceId}/restart`)
  }

  async listProjects(): Promise<CoolifyProject[]> {
    return this.request<CoolifyProject[]>('GET', '/projects')
  }

  async listServers(): Promise<CoolifyServer[]> {
    return this.request<CoolifyServer[]>('GET', '/servers')
  }
}
