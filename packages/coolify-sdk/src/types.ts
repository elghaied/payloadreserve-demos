export interface CoolifyService {
  id: string
  name: string
  status: CoolifyServiceStatus
  fqdn?: string
}

export type CoolifyServiceStatus = 'running' | 'stopped' | 'starting' | 'stopping' | 'error' | 'unknown'

export interface CoolifyEnvVar {
  key: string
  value: string
  is_secret?: boolean
}

export interface CreateServiceOptions {
  name: string
  type: string
  projectUuid: string
  serverUuid: string
  environmentName: string
  envVars?: CoolifyEnvVar[]
  dockerImage?: string
}
