import type { CoolifyEnvVar, CoolifyService, CoolifyServiceStatus, CreateServiceOptions } from './types'

export class CoolifyClient {
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  async createService(_opts: CreateServiceOptions): Promise<CoolifyService> {
    throw new Error('Not implemented — fill in Coolify API URL and key')
  }

  async deleteService(_serviceId: string): Promise<void> {
    throw new Error('Not implemented — fill in Coolify API URL and key')
  }

  async getServiceStatus(_serviceId: string): Promise<CoolifyServiceStatus> {
    throw new Error('Not implemented — fill in Coolify API URL and key')
  }

  async listServices(): Promise<CoolifyService[]> {
    throw new Error('Not implemented — fill in Coolify API URL and key')
  }

  async setEnvironmentVariables(_serviceId: string, _vars: CoolifyEnvVar[]): Promise<void> {
    throw new Error('Not implemented — fill in Coolify API URL and key')
  }

  async startService(_serviceId: string): Promise<void> {
    throw new Error('Not implemented — fill in Coolify API URL and key')
  }
}
