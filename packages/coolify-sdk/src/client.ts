import type { CoolifyEnvVar, CoolifyService, CoolifyServiceStatus, CreateServiceOptions } from './types'

export class CoolifyClient {
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.apiKey = apiKey
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
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
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`[coolify-sdk] ${method} ${path} → ${res.status}: ${text}`)
      throw new Error(`Coolify API ${method} ${path} failed with ${res.status}: ${text}`)
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
    await this.request<void>('DELETE', `/applications/${serviceId}`)
  }

  async getServiceStatus(serviceId: string): Promise<CoolifyServiceStatus> {
    const data = await this.request<{ status: string }>('GET', `/applications/${serviceId}`)
    const s = data.status?.toLowerCase() ?? ''
    if (s === 'running') return 'running'
    if (s === 'stopped' || s === 'exited') return 'stopped'
    if (s === 'starting') return 'starting'
    if (s === 'stopping') return 'stopping'
    if (s === 'error' || s === 'unhealthy') return 'error'
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

  async startService(serviceId: string): Promise<void> {
    await this.request<void>('GET', `/applications/${serviceId}/start`)
  }
}
