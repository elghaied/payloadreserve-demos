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
  projectUuid: string
  serverUuid: string
  destinationUuid: string
  environmentName: string
  dockerImageName: string
  dockerImageTag: string
  ports: string
  fqdn: string
  envVars?: CoolifyEnvVar[]
  connectToDockerNetwork?: boolean
  instantDeploy?: boolean
}
